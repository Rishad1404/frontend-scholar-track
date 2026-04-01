export interface IScreeningApplication {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  scholarship: {
    id: string;
    title: string;
    departmentId?: string;
    department?: { id: string; name: string };
    university?: { id: string; name: string };
  };
  student: {
    id: string;
    userId: string;
    user: { id: string; name: string; email: string };
  };
}

export interface IScreeningApplicationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IScreeningApplication[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IScreeningResult {
  id: string;
  applicationId: string;
  reviewerId: string;
  passed: boolean;
  comment: string | null;
  createdAt: string;
  departmentHead: {
    id: string;
    user: { id: string; name: string; email: string };
  };
  application: {
    id: string;
    status: string;
    scholarship: {
      id: string;
      title: string;
      department: { id: string; name: string };
    };
    student: {
      id: string;
      user: { id: string; name: string; email: string };
    };
  };
}

export interface IScreeningResultResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IScreeningResult;
}