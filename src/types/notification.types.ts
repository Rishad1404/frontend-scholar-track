export type NotificationType =
  | "APPLICATION_SUBMITTED"
  | "APPLICATION_SCREENING_PASSED"
  | "APPLICATION_SCREENING_REJECTED"
  | "APPLICATION_UNDER_REVIEW"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "DISBURSEMENT_PROCESSED"
  | "SCHOLARSHIP_PUBLISHED"
  | "INVITE_RECEIVED"
  | "UNIVERSITY_APPROVED"
  | "UNIVERSITY_SUSPENDED"
  | "SYSTEM_ANNOUNCEMENT";

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: INotification[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IUnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}