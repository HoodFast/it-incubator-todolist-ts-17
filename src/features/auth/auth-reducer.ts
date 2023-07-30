import { createSlice } from "@reduxjs/toolkit";

import { appActions } from "app/app-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { ResultCode } from "common/api/resultCodes";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  const res = await authAPI.login(arg);
  if (res.data.resultCode === ResultCode.success) {
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { isLoggedIn: true };
  } else {
    const isShowAppError = !res.data.fieldsErrors.length;
    // handleServerAppError(res.data, dispatch, isShowAppError);
    return rejectWithValue({ data: res.data, showGlobalError: isShowAppError });
  }
});

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  const res = await authAPI.logout();
  if (res.data.resultCode === ResultCode.success) {
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { isLoggedIn: false };
  } else {
    // handleServerAppError(res.data, dispatch);
    return rejectWithValue(null);
  }
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("app/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode == ResultCode.success) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  }
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
