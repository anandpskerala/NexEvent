import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";
import type { ImageDataPayload } from "../../../interfaces/entities/Payload";

export const updateProfileImage = createAsyncThunk(
    "auth/updateProfileImage",
    async (userData: ImageDataPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch("/user/me/profile-image", userData);
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