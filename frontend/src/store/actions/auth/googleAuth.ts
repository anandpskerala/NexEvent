import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../../utils/firebase";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";


export const googleAuth = createAsyncThunk(
    "auth/googleAuth",
    async (_, { rejectWithValue }) => {
        try {
            const auth = getAuth(app)
            const provider = new GoogleAuthProvider();
            const res = await signInWithPopup(auth, provider);
            const firstName = res.user.displayName?.split(" ", 1)[0];
            const lastName = res.user.displayName?.split(" ", 1)[1];
            const googleId = res.user.providerData[0].uid;
            const data = {firstName, lastName, email: res.user.email, googleId}
            const response = await axiosInstance.post("/user/auth/google", data);
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