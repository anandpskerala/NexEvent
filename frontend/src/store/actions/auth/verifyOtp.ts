import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";
import type { OtpDataPayload } from "../../../interfaces/entities/Payload";


export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (otpData: OtpDataPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/otp", otpData);
            if (!response.data?.user) {
                return rejectWithValue("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.log(error)
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data.message);
              }
              return rejectWithValue("Something went wrong");
        }
    }
)