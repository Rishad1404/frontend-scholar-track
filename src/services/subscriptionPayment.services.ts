
import { httpClient } from "@/lib/axios/httpClient";
import type { ISubscriptionPaymentsListResponse } from "@/types/subscription";

const BASE = "/subscriptions";

export const getAllSubscriptionPayments = async (
  queryString: string
): Promise<ISubscriptionPaymentsListResponse> => {
  const res = await httpClient.get(`${BASE}/payments?${queryString}`);
  return res as unknown as ISubscriptionPaymentsListResponse;
};