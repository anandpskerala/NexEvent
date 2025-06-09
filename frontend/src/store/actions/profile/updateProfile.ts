import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";
import type { ProfilePayload } from "../../../interfaces/entities/Payload";


export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (userData: ProfilePayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch("/user/me/profile", userData);
            if (!response.data?.user) {
                return rejectWithValue("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                return rejectWithValue(error.response.data.message);
              }
              return rejectWithValue("Something went wrong"+error);
        }
    }
)