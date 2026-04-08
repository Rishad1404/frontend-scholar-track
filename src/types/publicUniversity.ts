// src/types/publicUniversity.ts

export interface IPublicUniversity {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  status: string;
  createdAt: string;
  _count: {
    students: number;
    scholarships: number;
    departments: number;
  };
}

export interface IPublicUniversityDetail extends IPublicUniversity {
  departments: { id: string; name: string }[];
  academicLevels: { id: string; name: string }[];
  activeScholarshipsCount: number;
  _count: {
    students: number;
    scholarships: number;
    departments: number;
    admins: number;
    reviewers: number;
    departmentHeads: number;
  };
}

export interface IPublicUniversitiesResponse {
  success: boolean;
  message: string;
  data: IPublicUniversity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IPublicUniversityDetailResponse {
  success: boolean;
  message: string;
  data: IPublicUniversityDetail;
}