// src/types/publicScholarship.ts

export interface IPublicScholarship {
  id: string;
  title: string;
  description: string | null;
  deadline: string;
  document: string | null;
  totalAmount: number;
  amountPerStudent: number;
  quota: number;
  status: string;
  minGpa: number | null;
  minCgpa: number | null;
  financialNeedRequired: boolean;
  requiredDocTypes: string[];
  createdAt: string;
  updatedAt: string;
  university: {
    id: string;
    name: string;
    logoUrl: string | null;
    website: string | null;
  };
  department: {
    id: string;
    name: string;
  } | null;
  level: {
    id: string;
    name: string;
  } | null;
}

export interface IPublicScholarshipsResponse {
  success: boolean;
  message: string;
  data: IPublicScholarship[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  TRANSCRIPT: "Academic Transcript",
  INCOME_CERTIFICATE: "Income Certificate",
  NATIONAL_ID: "National ID",
  PERSONAL_ESSAY: "Personal Essay",
  RECOMMENDATION_LETTER: "Recommendation Letter",
  OTHER: "Other",
};