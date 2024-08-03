export interface AuditLog {
  id: number;
  createTime: string;
  type: string;
  action: string;
  message: string;
  username: string;
  userGroup: string;
  ip: string;
}
