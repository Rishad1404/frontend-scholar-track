/* eslint-disable @typescript-eslint/no-explicit-any */
 "use server"

import { httpClient } from "@/lib/axios/httpClient"
import { AdminDashboardData, SuperAdminDashboardData } from "@/types/dashboard.types";

 export async function getAdminDashboardData() {
    try {
        const response=await httpClient.get<AdminDashboardData>("/stats")
        return response
    } catch (error:any) {
        console.log(error,"error from getAdminDashboardData");
        return {
            success:false,
            message:error.message || "Something went wrong",
            data:null,
            meta:null
        }
    }
 }

 export async function getDashboardData() {
    try {
        const response=await httpClient.get("/stats")
        return response
    } catch (error:any) {
        console.log(error,"error from getAdminDashboardData");
        return {
            success:false,
            message:error.message || "Something went wrong",
            data:null,
            meta:null
        }
    }
 }


  export async function getSuperAdminDashboardData() {
    try {
        const response=await httpClient.get<SuperAdminDashboardData>("/stats")
        return response
    } catch (error:any) {
        console.log(error,"error from getSuperAdminDashboardData");
        return {
            success:false,
            message:error.message || "Something went wrong",
            data:null,
            meta:null
        }
    }
 }