export type AdminUserStatus = "Active" | "Suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: AdminUserStatus;
  lastSignInAt: string | null;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
}
