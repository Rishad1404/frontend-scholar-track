import { httpClient } from "@/lib/axios/httpClient";
import type {
  IScreeningApplicationsResponse,
  IScreeningResultResponse,
} from "@/types/screening";

const BASE = "/applications";

export const getApplicationsForScreening = async (
  queryString?: string
): Promise<IScreeningApplicationsResponse> => {
  const params = queryString
    ? `?status=SCREENING&${queryString}`
    : "?status=SCREENING";
  const res = await httpClient.get(`${BASE}${params}`);
  console.log("Screening Applications Response:", res);
  return res.data as unknown as IScreeningApplicationsResponse;
};

export const screenApplication = async (
  applicationId: string,
  payload: { passed: boolean; comment?: string }
): Promise<IScreeningResultResponse> => {
  const res = await httpClient.post(
    `${BASE}/${applicationId}/screening`,
    payload
  );
  return res.data as unknown as IScreeningResultResponse;
};

export const getScreeningResult = async (
  applicationId: string
): Promise<IScreeningResultResponse> => {
  const res = await httpClient.get(`${BASE}/${applicationId}/screening`);
  return res.data as unknown as IScreeningResultResponse;
};