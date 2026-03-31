
export type ReviewerUserStatus = "ACTIVE" | "DELETED" | "BANNED";

export interface IReviewerUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  status: ReviewerUserStatus;
  emailVerified: boolean;
}

export interface IReviewerUniversity {
  id: string;
  name: string;
}

export interface IReviewer {
  id: string;
  userId: string;
  universityId: string;
  expertise: string | null;
  designation: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;

  user: IReviewerUser;
  university: IReviewerUniversity;
}

export interface IReviewerMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IReviewerListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IReviewer[];
  meta: IReviewerMeta;
}

export interface IReviewerSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IReviewer;
}