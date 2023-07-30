import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};
export type AppInitialStateType = typeof initialState;

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith("/pending");
        },
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/fulfilled");
        },
        (state) => {
          state.status = "succeeded";
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/rejected");
        },
        (state, action) => {
          state.status = "failed";
          const { payload, error } = action;
          if (payload) {
            if (payload.showGlobalError) {
              state.error = payload.data.messages.length ? payload.data.messages[0] : "Some error";
            }
          } else {
            state.error = error.message ? error.message : "some error";
          }
        }
      );
  },
});

export const appReducer = slice.reducer;

export const appActions = slice.actions;

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
