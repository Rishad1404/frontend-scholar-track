export interface IAcademicTerm {
  id: string;
  name: string;
  universityId: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface IAcademicTermListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAcademicTerm[];
}

export interface IAcademicTermSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAcademicTerm;
}