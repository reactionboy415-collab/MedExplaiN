
import requests
import time
import random
import uuid
import sys
import json
import cloudscraper
import os
import re
import base64
import hashlib
import webbrowser
import http.server
import socketserver

from pathlib import Path
from datetime import datetime
from urllib.parse import urlencode, urlparse, parse_qs


# ============================================================
# CONFIGURATION
# ============================================================

AI_ENDPOINT = (
    "https://lyria-studio-15cf4a45-853813963450.us-west1.run.app"
    "/api/generate-content"
)

AI_MODEL = "gemini-3-flash-preview"

CLIENT_FILE = Path(
    "/storage/emulated/0/Android/media/com.whatsapp/"
    "WhatsApp/Media/WhatsApp Documents/Sent/client_secrets.json"
)

OUTPUT_DIR = Path(__file__).resolve().parent / "AutoEduTube_Output"
TOKEN_FILE = OUTPUT_DIR / "youtube_token.json"

GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN = "https://oauth2.googleapis.com/token"

YOUTUBE_UPLOAD = (
    "https://www.googleapis.com/upload/youtube/v3/videos"
)

YOUTUBE_SCOPE = (
    "https://www.googleapis.com/auth/youtube.upload"
)

CALLBACK_HOST = "127.0.0.1"
CALLBACK_PORT = 8765
REDIRECT_URI = f"http://{CALLBACK_HOST}:{CALLBACK_PORT}/"

CHUNK_SIZE = 8 * 1024 * 1024
MAX_RETRIES = 5


# ============================================================
# GOOGLE NETWORK RETRY ENGINE
# ============================================================

def google_post(url, data, timeout=30, retries=5):

    last_error = None

    for attempt in range(1, retries + 1):

        try:

            response = requests.post(
                url,
                data=data,
                timeout=timeout
            )

            return response

        except requests.exceptions.RequestException as e:

            last_error = e

            print(
                f"\n⚠️ Google connection "
                f"attempt {attempt}/{retries}: {e}"
            )

            if attempt < retries:

                delay = min(2 ** attempt, 20)

                print(
                    f"🔄 Retrying in {delay} seconds..."
                )

                time.sleep(delay)

    raise RuntimeError(
        f"Google connection failed after {retries} attempts: "
        f"{last_error}"
    )


def google_request(method, url, retries=5, **kwargs):

    last_error = None

    for attempt in range(1, retries + 1):

        try:

            response = requests.request(
                method,
                url,
                **kwargs
            )

            return response

        except requests.exceptions.RequestException as e:

            last_error = e

            print(
                f"\n⚠️ Network attempt "
                f"{attempt}/{retries}: {e}"
            )

            if attempt < retries:

                delay = min(2 ** attempt, 20)

                print(
                    f"🔄 Retrying in {delay} seconds..."
                )

                time.sleep(delay)

    raise RuntimeError(
        f"Network request failed after {retries} attempts: "
        f"{last_error}"
    )


# ============================================================
# GENERAL HELPERS
# ============================================================

def save_json(path, data):

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    path.write_text(
        json.dumps(
            data,
            indent=2,
            ensure_ascii=False
        ),
        encoding="utf-8"
    )


def load_json(path, default):

    try:

        return json.loads(
            path.read_text(encoding="utf-8")
        )

    except Exception:

        return default


def parse_ai_json(raw):

    raw = re.sub(
        r"^```(?:json)?\s*|\s*```$",
        "",
        str(raw).strip(),
        flags=re.I
    )

    decoder = json.JSONDecoder()

    for i, char in enumerate(raw):

        if char == "{":

            try:

                obj, _ = decoder.raw_decode(raw[i:])

                if isinstance(obj, dict):
                    return obj

            except json.JSONDecodeError:
                pass

    raise ValueError(
        "AI did not return valid JSON."
    )


def show_google_error(response):

    print("\n❌ GOOGLE API ERROR")

    print("HTTP:", response.status_code)

    try:

        data = response.json()

        error = data.get("error", {})

        print(
            "Message:",
            error.get("message", "Unknown error")
        )

        for item in error.get("errors", []):

            print(
                "Reason:",
                item.get("reason", "Unknown")
            )

            print(
                "Domain:",
                item.get("domain", "Unknown")
            )

        print("\nComplete error:")

        print(
            json.dumps(
                data,
                indent=2
            )
        )

    except Exception:

        print(response.text[:1500])


# ============================================================
# AI ENGINE
# ============================================================

class AutoEduAI:

    def __init__(self):

        self.session = requests.Session()

    def generate(self, prompt, retries=3):

        for attempt in range(1, retries + 1):

            try:

                response = self.session.post(
                    AI_ENDPOINT,
                    json={
                        "model": AI_MODEL,
                        "contents": prompt
                    },
                    timeout=199
                )

                response.raise_for_status()

                data = response.json()

                text = data.get("text")

                if not text:

                    candidates = data.get(
                        "candidates", []
                    )

                    if candidates:

                        parts = candidates[0].get(
                            "content", {}
                        ).get("parts", [])

                        text = "\n".join(
                            p.get("text", "")
                            for p in parts
                            if isinstance(p, dict)
                        )

                if not text:

                    for key in (
                        "output",
                        "response",
                        "generated_text",
                        "content"
                    ):

                        if isinstance(data.get(key), str):

                            text = data[key]
                            break

                if not text:

                    raise ValueError(
                        "Empty AI response."
                    )

                return parse_ai_json(text)

            except Exception as e:

                print(
                    f"\n⚠️ AI attempt {attempt}/{retries}: {e}"
                )

                if attempt < retries:

                    time.sleep(attempt * 3)

        raise RuntimeError(
            "AI generation failed."
        )

    # --------------------------------------------------------
    # AI TOPIC + NOTEGPT PROMPT
    # --------------------------------------------------------

    def choose_topic(self):

        history = load_json(
            OUTPUT_DIR / "topic_history.json",
            []
        )

        previous = [
            x.get("topic", "")
            for x in history[-25:]
            if isinstance(x, dict)
        ]

        prompt = f"""
You are the AI content strategist of an educational
YouTube channel.

Choose ONE interesting educational topic.

Available niches:
- Science
- Physics
- Chemistry
- Space
- Nature
- Human body
- History
- Geography
- Technology
- Artificial Intelligence
- Mathematics
- Engineering
- Environment
- Inventions
- General Knowledge

Avoid recently used topics:
{json.dumps(previous)}

Choose a focused, curiosity-driven topic, that will definitly goo viral on youtube shorts. 

The video must be beginner-friendly, factual,
interesting and suitable for an animated explainer.

Also create a complete NoteGPT prompt.

The NoteGPT prompt should request:
- Animated educational video
- Clear English narration
- Interesting introduction
- Simple explanations
- Real-world examples
- Logical scene progression
- Accurate facts
- Memorable conclusion
- In the prompt strictly Add That to generate short video under 50 seconds
- A Short under 50 seconds
- the audio speed should be normal not too fast not to slow.

Return ONLY JSON:

{{
 "topic": "Topic name",
 "angle": "Interesting angle",
 "learning_objective": "What viewers will learn",
 "notegpt_prompt": "Complete video generation prompt",
 "fact_check_notes": ["Important facts to verify"]
}}
"""

        result = self.generate(prompt)

        for key in ("topic", "notegpt_prompt"):

            if not str(result.get(key, "")).strip():

                raise ValueError(
                    f"Missing AI field: {key}"
                )

        return result

    # --------------------------------------------------------
    # YOUTUBE SEO
    # --------------------------------------------------------

    def generate_metadata(self, topic, script_data):

        scenes = script_data.get("scenes", [])

        scene_summary = []

        for i, scene in enumerate(scenes[:30], 1):

            scene_summary.append({

                "scene": i,

                "title": str(
                    scene.get("scene_title", "")
                )[:200],

                "text": str(
                    scene.get("scene_text", "")
                )[:700]
            })

        prompt = f"""
You are a professional YouTube SEO strategist.

Create metadata for this actual educational video.

TOPIC:
{topic.get('topic')}

ANGLE:
{topic.get('angle')}

LEARNING OBJECTIVE:
{topic.get('learning_objective')}

FACT CHECK NOTES:
{json.dumps(topic.get('fact_check_notes', []))}

ACTUAL GENERATED SCENES:
{json.dumps(scene_summary, ensure_ascii=False)}

Rules:
- One attractive truthful title.
- Maximum title length 100 characters.
- Useful detailed description.
- Maximum description 4500 characters.
- Relevant keywords.
- Natural call to action.
- Maximum 30 relevant tags under 500 characters limit.
- 3 to 5 relevant hashtags.
- No unrelated trending keywords.
- Do not claim anything absent from the actual scenes.
- Education category ID 27.
- English language.
- YouTube channel name: SnapStudy With Ai.
- in description also include an explicit disclaimer noting that no endorsement from real-world artists or brands is intended and that the content was created using AI generation tools.
- in the description include an disclaimer as this short uses generative ai tools for creativity
- In the tags add tags that boosts reach, tags like shorts.
- the description should be full 5000/5000 with keywords, etc.

Return ONLY JSON:

{{
 "title": "YouTube title",
 "description": "Full YouTube description",
 "tags": ["tag1", "tag2"],
 "hashtags": ["#Education"],
 "category_id": "27",
 "language": "en"
}}
"""

        result = self.generate(prompt)

        title = str(
            result.get("title", "")
        ).strip()[:100]

        description = str(
            result.get("description", "")
        ).strip()[:4500]

        if not title or not description:

            raise ValueError(
                "Incomplete YouTube metadata."
            )

        raw_tags = result.get("tags", [])

        if not isinstance(raw_tags, list):
            raw_tags = []

        tags = []
        total = 0

        for item in raw_tags:

            tag = re.sub(
                r"\s+", " ", str(item)
            ).strip()

            if not tag:
                continue

            extra = len(tag) + (1 if tags else 0)

            if total + extra > 480:
                continue

            tags.append(tag)

            total += extra

            if len(tags) >= 30:
                break

        raw_hashtags = result.get("hashtags", [])

        if not isinstance(raw_hashtags, list):
            raw_hashtags = []

        hashtags = []

        for item in raw_hashtags:

            tag = str(item).strip()

            if not tag:
                continue

            if not tag.startswith("#"):

                tag = "#" + tag.replace(" ", "")

            if (
                tag not in hashtags
                and len(hashtags) < 5
            ):

                hashtags.append(tag)

        if hashtags:

            description += (
                "\n\n" + " ".join(hashtags)
            )

        return {

            "title": title,

            "description": description[:5000],

            "tags": tags,

            "hashtags": hashtags,

            "category_id": "27",

            "language": "en"
        }


# ============================================================
# YOUR TESTED NOTEGPT ENGINE
# PRESERVED AS PROVIDED
# ============================================================

class AnimationFireEngine:

    def __init__(self):

        self.scraper = cloudscraper.create_scraper()

        self.base_url = (
            "https://notegpt.io/api/v2/pdf-to-video"
        )

    def get_ghost_headers(self):

        fake_ip = (
            f"{random.randint(1,254)}."
            f"{random.randint(1,254)}."
            f"{random.randint(1,254)}."
            f"{random.randint(1,254)}"
        )

        return {

            'User-Agent': (
                "Mozilla/5.0 (Linux; Android 13; SM-S918B) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Mobile Safari/537.36"
            ),

            'Accept': 'application/json, text/plain, */*',

            'X-Forwarded-For': fake_ip,

            'Origin': 'https://notegpt.io',

            'Referer': 'https://notegpt.io/ai-animation-maker',

            'X-Requested-With': 'mark.via.gp'
        }

    def generate_animation(self, topic):

        print(
            f"🔥 Step 1: Igniting Engine for '{topic}'..."
        )

        anon_id = uuid.uuid4().hex

        headers = self.get_ghost_headers()

        cookies = {
            'anonymous_user_id': anon_id
        }

        payload = {

            "source_url": "",

            "source_type": "text",

            "input_prompt": topic,

            "setting": {

                "frame_size": "9:16",

                "duration": 1,

                "voice_key": "9e12f68d85f347808f76637a",

                "no_watermark": True,

                "lang": "en",

                "gen_flow": "edit_script"
            }
        }

        try:

            res = self.scraper.post(
                self.base_url,
                headers=headers,
                cookies=cookies,
                json=payload,
                timeout=30
            )

            data = res.json()

            if data.get("code") == 100000:

                cid = data["data"]["conversation_id"]

                print(f"🚀 CID Secured: {cid}")

                return cid, headers, cookies

            else:

                print(
                    f"\n❌ NoteGPT Error: "
                    f"{data.get('message')}"
                )

        except Exception as e:

            print(f"\n❌ Init Error: {e}")

        return None, None, None

    def wait_for_script(self, cid, headers, cookies):

        print(
            "\n🔥 Step 2: Generating Text & Images (Phase 1)..."
        )

        start_time = time.time()

        while True:

            try:

                res = self.scraper.get(
                    f"{self.base_url}/status?conversation_id={cid}",
                    headers=headers,
                    cookies=cookies
                )

                data = res.json().get("data", {})

                step = data.get("step")

                sys.stdout.write(
                    f"\r⏳ Processing Script... Step: {step}   "
                )

                sys.stdout.flush()

                # ORIGINAL TESTED LOGIC PRESERVED
                if (
                    step in ["edit_script", "pause"]
                    or (time.time() - start_time > 15)
                ):

                    print(
                        "\n✅ Script & Images Ready!"
                    )

                    return True

                time.sleep(3)

            except:

                return False

    def fetch_and_show_assets(self, cid, headers, cookies):

        try:

            res = self.scraper.get(
                f"{self.base_url}/script/get?conversation_id={cid}",
                headers=headers,
                cookies=cookies
            )

            script_data = res.json().get("data", {})

            scenes = script_data.get("scenes", [])

            print("\n" + "═" * 60)

            print(
                f"🎬 PREVIEW: "
                f"{script_data.get('cover', {}).get('video_title')}"
            )

            print("═" * 60)

            for i, scene in enumerate(scenes[:3], 1):

                print(
                    f"\n[Scene {i}] "
                    f"{scene.get('scene_title')}"
                )

                print(
                    f"🖼️ Image: "
                    f"{scene.get('scene_image', [''])[0]}"
                )

                print(
                    f"📝 Text: "
                    f"{scene.get('scene_text')[:80]}..."
                )

            print(
                "\n... (Remaining scenes hidden) ..."
            )

            print("═" * 60 + "\n")

            return script_data

        except Exception as e:

            print(
                f"❌ Failed to fetch assets: {e}"
            )

            return None

    def trigger_video_rendering(
        self, cid, script_data, headers, cookies
    ):

        print(
            "🔥 Step 3: Triggering FINAL VIDEO Render..."
        )

        for scene in script_data.get('scenes', []):

            scene['scene_text'] += " "

        payload = {

            "conversation_id": cid,

            "script_data": json.dumps(script_data),

            "is_force_save": True
        }

        try:

            self.scraper.post(
                f"{self.base_url}/script/edit",
                headers=headers,
                cookies=cookies,
                json=payload
            )

            print(
                "✅ Render Signal Sent! Video processing started."
            )

        except Exception as e:

            print(
                f"❌ Trigger Failed: {e}"
            )

    def poll_final_video(self, cid, headers, cookies):

        print(
            "\n🔥 Step 4: Waiting for Video URL..."
        )

        while True:

            try:

                res = self.scraper.get(
                    f"{self.base_url}/status?conversation_id={cid}",
                    headers=headers,
                    cookies=cookies
                )

                data = res.json().get("data", {})

                status = data.get("status")

                sys.stdout.write(
                    f"\r🎥 Rendering Status: "
                    f"{str(status).upper()} "
                    f"| Step: {data.get('step')}   "
                )

                sys.stdout.flush()

                if status == "success":

                    video_url = (
                        data.get("cdn_video_url")
                        or data.get("video_url")
                    )

                    print(
                        "\n\n🎉 VIDEO GENERATED SUCCESSFULLY!"
                    )

                    print(
                        f"🔗 URL: {video_url}"
                    )

                    return video_url

                if status == "failed":

                    print(
                        "\n❌ Rendering Failed on Server."
                    )

                    return None

                time.sleep(5)

            except:

                time.sleep(5)


# ============================================================
# VIDEO DOWNLOADER
# ============================================================

def download_video(url, destination):

    print("\n⬇️ Downloading video...")

    destination.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with requests.get(
        url,
        stream=True,
        timeout=(20, 120)
    ) as response:

        response.raise_for_status()

        if "text/html" in response.headers.get(
            "Content-Type", ""
        ).lower():

            raise RuntimeError(
                "Video URL returned HTML instead of a video."
            )

        total = int(
            response.headers.get("Content-Length", 0)
        )

        received = 0

        with destination.open("wb") as file:

            for chunk in response.iter_content(
                1024 * 1024
            ):

                if not chunk:
                    continue

                file.write(chunk)

                received += len(chunk)

                if total:

                    print(
                        f"\rDownload: "
                        f"{received * 100 / total:.1f}%",
                        end="",
                        flush=True
                    )

    if (
        not destination.exists()
        or destination.stat().st_size < 1024
    ):

        raise RuntimeError(
            "Video download incomplete."
        )

    print("\n✅ Video saved:", destination)


# ============================================================
# GOOGLE OAUTH CALLBACK
# ============================================================

class OAuthHandler(http.server.BaseHTTPRequestHandler):

    params = None

    def do_GET(self):

        OAuthHandler.params = parse_qs(
            urlparse(self.path).query
        )

        body = (
            b"<html><body style='font-family:Arial;"
            b"text-align:center;padding:40px'>"
            b"<h2>Google authorization received!</h2>"
            b"<p>Return to AutoEduTube.</p>"
            b"</body></html>"
        )

        self.send_response(200)

        self.send_header(
            "Content-Type",
            "text/html; charset=utf-8"
        )

        self.send_header(
            "Content-Length",
            str(len(body))
        )

        self.end_headers()

        self.wfile.write(body)

    def log_message(self, *args):
        pass


# ============================================================
# YOUTUBE UPLOADER
# ============================================================

class YouTubeUploader:

    def __init__(self):

        if not CLIENT_FILE.exists():

            raise FileNotFoundError(
                f"OAuth file not found:\n{CLIENT_FILE}\n"
                "Update CLIENT_FILE in the script."
            )

        raw = json.loads(
            CLIENT_FILE.read_text(
                encoding="utf-8"
            )
        )

        client = (
            raw.get("installed")
            or raw.get("web")
        )

        if not client:

            raise ValueError(
                "Invalid Google OAuth JSON."
            )

        self.client_id = client.get("client_id")

        self.client_secret = client.get("client_secret")

        if not self.client_id or not self.client_secret:

            raise ValueError(
                "OAuth client ID or secret missing."
            )

        self.token = load_json(
            TOKEN_FILE,
            {}
        )

    def save_token(self):

        save_json(
            TOKEN_FILE,
            self.token
        )

        try:

            os.chmod(
                TOKEN_FILE,
                0o600
            )

        except OSError:
            pass

    # --------------------------------------------------------
    # GOOGLE AUTHORIZATION
    # --------------------------------------------------------

    def authorize(self):

        print("\n🔐 Google authorization...")

        OAuthHandler.params = None

        verifier = (
            uuid.uuid4().hex
            + uuid.uuid4().hex
        )

        challenge = base64.urlsafe_b64encode(
            hashlib.sha256(
                verifier.encode("ascii")
            ).digest()
        ).decode("ascii").rstrip("=")

        state = uuid.uuid4().hex

        try:

            server = socketserver.TCPServer(
                (CALLBACK_HOST, CALLBACK_PORT),
                OAuthHandler
            )

        except OSError as e:

            raise RuntimeError(
                f"Could not start localhost callback: {e}"
            )

        params = {

            "client_id": self.client_id,

            "redirect_uri": REDIRECT_URI,

            "response_type": "code",

            "scope": YOUTUBE_SCOPE,

            "access_type": "offline",

            "prompt": "consent",

            "state": state,

            "code_challenge": challenge,

            "code_challenge_method": "S256"
        }

        url = GOOGLE_AUTH + "?" + urlencode(params)

        opened = webbrowser.open(url)

        if not opened:

            print(
                "\nOpen this URL manually:\n",
                url
            )

        print(
            "\nWaiting for Google authorization..."
        )

        deadline = time.time() + 240

        try:

            while time.time() < deadline:

                server.timeout = 2

                server.handle_request()

                callback = OAuthHandler.params or {}

                if (
                    callback.get("code")
                    or callback.get("error")
                ):

                    break

        finally:

            server.server_close()

        callback = OAuthHandler.params or {}

        if callback.get("error"):

            raise RuntimeError(
                callback["error"][0]
            )

        if callback.get("state", [None])[0] != state:

            raise RuntimeError(
                "OAuth state verification failed."
            )

        code = callback.get(
            "code", [None]
        )[0]

        if not code:

            raise RuntimeError(
                "No OAuth code received."
            )

        print(
            "\n🔄 Exchanging authorization code..."
        )

        # UPDATED: GOOGLE NETWORK RETRY

        response = google_post(
            GOOGLE_TOKEN,
            data={

                "code": code,

                "client_id": self.client_id,

                "client_secret": self.client_secret,

                "redirect_uri": REDIRECT_URI,

                "grant_type": "authorization_code",

                "code_verifier": verifier
            },
            timeout=30,
            retries=MAX_RETRIES
        )

        if not response.ok:

            show_google_error(response)

            raise RuntimeError(
                "Google OAuth exchange failed."
            )

        self.token = response.json()

        self.token["created_at"] = time.time()

        self.save_token()

        print(
            "✅ Google authorization successful."
        )

    # --------------------------------------------------------
    # REFRESH TOKEN
    # --------------------------------------------------------

    def refresh(self):

        refresh_token = self.token.get(
            "refresh_token"
        )

        if not refresh_token:

            self.authorize()

            return

        print(
            "\n🔄 Refreshing Google access token..."
        )

        # UPDATED: GOOGLE NETWORK RETRY

        response = google_post(
            GOOGLE_TOKEN,
            data={

                "client_id": self.client_id,

                "client_secret": self.client_secret,

                "refresh_token": refresh_token,

                "grant_type": "refresh_token"
            },
            timeout=30,
            retries=MAX_RETRIES
        )

        if not response.ok:

            show_google_error(response)

            try:
                error = response.json().get("error")
            except Exception:
                error = None

            # Only reauthorize if refresh token is invalid/revoked.
            if error in (
                "invalid_grant",
                "invalid_client"
            ):

                print(
                    "⚠️ Refresh token is invalid. "
                    "Starting authorization again."
                )

                self.token = {}

                self.authorize()

                return

            raise RuntimeError(
                "Google token refresh failed."
            )

        new_token = response.json()

        self.token.update(new_token)

        self.token["refresh_token"] = refresh_token

        self.token["created_at"] = time.time()

        self.save_token()

        print(
            "✅ Access token refreshed."
        )

    # --------------------------------------------------------
    # ACCESS TOKEN
    # --------------------------------------------------------

    def get_access_token(self):

        created = float(
            self.token.get("created_at", 0)
        )

        expires = int(
            self.token.get("expires_in", 0)
        )

        if (
            not self.token.get("access_token")
            or time.time() >= created + expires - 90
        ):

            if self.token.get("refresh_token"):

                self.refresh()

            else:

                self.authorize()

        token = self.token.get("access_token")

        if not token:

            raise RuntimeError(
                "No YouTube access token."
            )

        return token

    # --------------------------------------------------------
    # PUBLIC YOUTUBE UPLOAD
    # --------------------------------------------------------

    def upload_public(self, video_path, metadata):

        if not video_path.exists():

            raise FileNotFoundError(
                video_path
            )

        size = video_path.stat().st_size

        if size <= 0:

            raise ValueError(
                "Video file is empty."
            )

        token = self.get_access_token()

        body = {

            "snippet": {

                "title": metadata["title"][:100],

                "description": metadata["description"][:5000],

                "tags": metadata["tags"],

                "categoryId": metadata["category_id"],

                "defaultLanguage": metadata["language"]
            },

            "status": {

                "privacyStatus": "public"
            }
        }

        print(
            "\n🚀 Initializing YouTube PUBLIC upload..."
        )

        # UPDATED: RETRY INITIALIZATION NETWORK FAILURES

        response = google_request(
            "POST",
            YOUTUBE_UPLOAD,
            params={

                "uploadType": "resumable",

                "part": "snippet,status"
            },
            headers={

                "Authorization": f"Bearer {token}",

                "Content-Type": (
                    "application/json; charset=UTF-8"
                ),

                "X-Upload-Content-Length": str(size),

                "X-Upload-Content-Type": "video/mp4"
            },
            json=body,
            timeout=60,
            retries=MAX_RETRIES
        )

        if not response.ok:

            show_google_error(response)

            raise RuntimeError(
                "YouTube upload initialization failed."
            )

        session_url = response.headers.get(
            "Location"
        )

        if not session_url:

            raise RuntimeError(
                "YouTube did not return upload session URL."
            )

        print(
            f"📦 File size: "
            f"{size / (1024 * 1024):.2f} MB"
        )

        sent = 0
        retries = 0

        with video_path.open("rb") as file:

            while sent < size:

                file.seek(sent)

                chunk = file.read(
                    min(
                        CHUNK_SIZE,
                        size - sent
                    )
                )

                if not chunk:

                    raise RuntimeError(
                        "Cannot read video chunk."
                    )

                end = sent + len(chunk) - 1

                try:

                    upload = requests.put(
                        session_url,
                        headers={

                            "Content-Length": str(len(chunk)),

                            "Content-Type": "video/mp4",

                            "Content-Range": (
                                f"bytes {sent}-{end}/{size}"
                            )
                        },
                        data=chunk,
                        timeout=(30, 180)
                    )

                except requests.RequestException as e:

                    retries += 1

                    if retries > MAX_RETRIES:

                        raise RuntimeError(
                            f"Upload retries exhausted: {e}"
                        )

                    time.sleep(
                        min(2 ** retries, 30)
                    )

                    check = google_request(
                        "PUT",
                        session_url,
                        headers={

                            "Content-Length": "0",

                            "Content-Range": f"bytes */{size}"
                        },
                        data=b"",
                        timeout=(20, 60),
                        retries=MAX_RETRIES
                    )

                    if check.status_code in (200, 201):

                        return check.json()

                    if check.status_code == 308:

                        value = check.headers.get(
                            "Range", ""
                        )

                        sent = (

                            int(value.split("-")[-1]) + 1

                            if value.startswith("bytes=")

                            else 0
                        )

                        continue

                    raise RuntimeError(
                        "Could not recover upload session."
                    )

                if upload.status_code in (200, 201):

                    result = upload.json()

                    video_id = result.get("id")

                    if not video_id:

                        raise RuntimeError(
                            "Missing YouTube video ID."
                        )

                    print(
                        "\n\n🎉 PUBLIC VIDEO UPLOADED!"
                    )

                    print(
                        "🔗 https://www.youtube.com/watch?v="
                        + video_id
                    )

                    return result

                if upload.status_code == 308:

                    value = upload.headers.get(
                        "Range", ""
                    )

                    sent = (

                        int(value.split("-")[-1]) + 1

                        if value.startswith("bytes=")

                        else end + 1
                    )

                    retries = 0

                    print(
                        f"\r📤 Upload: "
                        f"{sent * 100 / size:.1f}%",
                        end="",
                        flush=True
                    )

                    continue

                if upload.status_code in (
                    500, 502, 503, 504
                ):

                    retries += 1

                    if retries <= MAX_RETRIES:

                        time.sleep(
                            min(2 ** retries, 30)
                        )

                        check = google_request(
                            "PUT",
                            session_url,
                            headers={

                                "Content-Length": "0",

                                "Content-Range": f"bytes */{size}"
                            },
                            data=b"",
                            timeout=(20, 60),
                            retries=MAX_RETRIES
                        )

                        if check.status_code in (200, 201):

                            return check.json()

                        if check.status_code == 308:

                            value = check.headers.get(
                                "Range", ""
                            )

                            sent = (

                                int(value.split("-")[-1]) + 1

                                if value.startswith("bytes=")

                                else 0
                            )

                            continue

                show_google_error(upload)

                raise RuntimeError(
                    "YouTube video upload failed."
                )

        raise RuntimeError(
            "Upload did not complete."
        )


# ============================================================
# MAIN AUTOMATION
# ============================================================

def main():

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    print("\n" + "=" * 65)

    print(
        "             AUTOEDUTUBE AI ULTIMATE"
    )

    print(
        "    AI TOPIC -> NOTEGPT -> AI SEO -> YOUTUBE"
    )

    print("=" * 65)

    print(
        "\nOne video per run."
    )

    print(
        "Public upload requires PUBLISH approval."
    )

    # STEP 1

    ai = AutoEduAI()

    print(
        "\n[1/7] 🧠 AI selecting educational topic..."
    )

    topic = ai.choose_topic()

    print(
        "\n🎯 Topic:",
        topic["topic"]
    )

    print(
        "💡 Angle:",
        topic.get("angle")
    )

    print(
        "📚 Learning objective:",
        topic.get("learning_objective")
    )

    # STEP 2

    print(
        "\n[2/7] 🎬 Starting your tested NoteGPT engine..."
    )

    engine = AnimationFireEngine()

    cid, headers, cookies = engine.generate_animation(
        topic["notegpt_prompt"]
    )

    if not cid:

        raise RuntimeError(
            "NoteGPT initialization failed."
        )

    # STEP 3

    print(
        "\n[3/7] 🧩 Waiting for generated scenes..."
    )

    if not engine.wait_for_script(
        cid,
        headers,
        cookies
    ):

        raise RuntimeError(
            "NoteGPT scene generation failed."
        )

    script_data = engine.fetch_and_show_assets(
        cid,
        headers,
        cookies
    )

    if not script_data:

        raise RuntimeError(
            "Could not fetch NoteGPT scenes."
        )

    if not script_data.get("scenes"):

        raise RuntimeError(
            "NoteGPT returned an empty scene list."
        )

    # STEP 4

    print(
        "\n[4/7] 🧠 AI generating YouTube SEO..."
    )

    metadata = ai.generate_metadata(
        topic,
        script_data
    )

    # STEP 5

    print(
        "\n[5/7] 🎞️ Generating final video..."
    )

    engine.trigger_video_rendering(
        cid,
        script_data,
        headers,
        cookies
    )

    video_url = engine.poll_final_video(
        cid,
        headers,
        cookies
    )

    if not video_url:

        raise RuntimeError(
            "NoteGPT did not return a video URL."
        )

    # STEP 6

    stamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    safe_topic = re.sub(
        r"[^A-Za-z0-9_-]+",
        "_",
        topic["topic"]
    ).strip("_")[:70]

    video_path = OUTPUT_DIR / (
        f"{safe_topic}_{stamp}.mp4"
    )

    download_video(
        video_url,
        video_path
    )

    review = {

        "topic": topic,

        "metadata": metadata,

        "video_file": str(video_path),

        "upload_status": "awaiting_approval",

        "created_at": datetime.now().isoformat()
    }

    review_path = video_path.with_suffix(
        ".review.json"
    )

    save_json(
        review_path,
        review
    )

    history_path = (
        OUTPUT_DIR / "topic_history.json"
    )

    history = load_json(
        history_path,
        []
    )

    history.append({

        "topic": topic["topic"],

        "created_at": datetime.now().isoformat()
    })

    save_json(
        history_path,
        history[-100:]
    )

    print("\n" + "=" * 65)

    print(
        "🎉 VIDEO READY FOR REVIEW"
    )

    print("=" * 65)

    print(
        "\n🎥 Video:",
        video_path
    )

    print(
        "\n📌 YOUTUBE TITLE:"
    )

    print(
        metadata["title"]
    )

    print(
        "\n📝 DESCRIPTION:"
    )

    print(
        metadata["description"]
    )

    print(
        "\n🏷️ TAGS:"
    )

    print(
        ", ".join(metadata["tags"])
    )

    print(
        "\n#️⃣ HASHTAGS:"
    )

    print(
        " ".join(metadata["hashtags"])
    )

    print(
        "\n📄 Review package:",
        review_path
    )

    print("\n" + "=" * 65)

    print(
        "WATCH THE VIDEO BEFORE PUBLISHING."
    )

    print("=" * 65)

    approval = input(
        "\nType PUBLISH to upload PUBLICLY: "
    ).strip()

    if approval != "PUBLISH":

        print(
            "\n✅ Publishing cancelled."
        )

        print(
            "Your video is saved locally."
        )

        return

    # STEP 7

    print(
        "\n[7/7] 🚀 Connecting to YouTube..."
    )

    uploader = YouTubeUploader()

    result = uploader.upload_public(
        video_path,
        metadata
    )

    video_id = result.get("id")

    review["upload_status"] = "uploaded_public"

    review["youtube_video_id"] = video_id

    review["youtube_url"] = (
        f"https://www.youtube.com/watch?v={video_id}"
        if video_id
        else None
    )

    save_json(
        review_path,
        review
    )

    print("\n" + "=" * 65)

    print(
        "🔥 AUTOEDUTUBE AI COMPLETED"
    )

    print(
        "🌍 YouTube:",
        review["youtube_url"]
    )

    print("=" * 65)


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    try:

        main()

    except KeyboardInterrupt:

        print(
            "\n\n🛑 Stopped by user."
        )

    except Exception as e:

        print(
            "\n❌ ERROR:",
            e
        )

        print(
            "\nAny completed local files "
            "have been preserved."
        )

        sys.exit(1)