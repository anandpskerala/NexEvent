import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";

export const verifyUser = createAsyncThunk(
    "auth/verifyUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/verify");
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