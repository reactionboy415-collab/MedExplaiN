export interface Biomarker {
  name: string;
  value: number | string;
  unit: string;
  reference_low: string | number | null;
  reference_high: string | number | null;
  flag: string | null;
}

export interface LabReport {
  report_date: string | null;
  lab_name: string | null;
  report_type: string | null;
  biomarkers: Biomarker[];
}

export interface UploadLabResponse {
  success: boolean;
  report: LabReport;
  provider: string;
  metadata: {
    model: string;
    tokensUsed: number;
    cost: number;
  };
}

export interface AnalyzeRequest {
  report: LabReport;
  language?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: string;
}
