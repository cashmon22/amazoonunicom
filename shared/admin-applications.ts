export type AdminApplicationStatus = "Under Review" | "Approved" | "Rejected";

export interface AdminApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: AdminApplicationStatus;
  details: Record<string, unknown>;
}

export interface AdminApplicationsResponse {
  applications: AdminApplication[];
  total: number;
}
