export interface IAcademicLevel {
  id: string;
  name: string;
  universityId: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface IAcademicLevelListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAcademicLevel[];
}

export interface IAcademicLevelSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAcademicLevel;
}