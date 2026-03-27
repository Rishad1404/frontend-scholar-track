"use server";


import { httpClient } from "@/lib/axios/httpClient"

export const getPublicScholarships = async () => {
    const scholarships=await httpClient.get("/scholarships/public")
    return scholarships
}