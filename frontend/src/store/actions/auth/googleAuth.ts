import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../../utils/firebase";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";
import { AxiosError } from "axios";

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      const displayName = res.user.displayName || "";
      const [firstName = "", lastName = ""] = displayName.split(" ");
      const googleId = res.user.uid;
      const email = res.user.email;

      if (!email) {
        return rejectWithValue("Email not found in Google account.");
      }

      const data = {
        firstName,
        lastName,
        email,
        googleId,
      };

      const response = await axiosInstance.post("/user/auth/google", data);

      if (!response.data?.user) {
        return rejectWithValue("Invalid response from server");
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Something went wrong during Google login");
    }
  }
);
