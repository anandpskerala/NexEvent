import { type ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/entities/User";
import { loginUser } from "../actions/auth/loginUser";
import { toast } from "sonner";
import { googleAuth } from "../actions/auth/googleAuth";
import { logout } from "../actions/auth/logout";
import { verifyOtp } from "../actions/auth/verifyOtp";
import { verifyUser } from "../actions/auth/verifyUser";
import { updateProfileImage } from "../actions/profile/updateImage";
import { updateProfile } from "../actions/profile/updateProfile";

interface AuthState {
    user: undefined | null | User,
    isLoading: boolean
}

const initialState: AuthState = {
    user: undefined,
    isLoading: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.user = undefined;
        })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                toast.error(action.payload as string);
            })
            .addCase(googleAuth.pending, (state) => {
                state.isLoading = true;
                state.user = undefined;
            })
            .addCase(googleAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(googleAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                toast.error(action.payload as string);
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                toast.success(action.payload.message);
            })
            .addCase(logout.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(verifyOtp.pending, (state) => {
                state.isLoading = true;
                state.user = undefined;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                toast.error(action.payload as string);
            })
            .addCase(verifyUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
            })
            .addCase(verifyUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
            })
            .addCase(updateProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(updateProfileImage.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload as string);
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                toast.error(action.payload as string);
            })
    }
})

export default authSlice.reducer;