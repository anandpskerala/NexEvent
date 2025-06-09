import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";
import type { SignupDataPayload } from "../../../interfaces/entities/Payload";


export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (userData: SignupDataPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/auth/register", userData);
            if (!response.data?.user) {
                return rejectWithValue("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data.message);
              }
              return rejectWithValue("Something went wrong");
        }
    }
)