import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todolistsAPI } from "features/TodolistsList/todolists.api";
import { TodolistType } from "features/TodolistsList/todolists.types";
import { ResultCode } from "common/api/resultCodes";
import { thunkTryCatch } from "common/utils/thunk-try-catch";

const slice = createSlice({
  name: "todoLists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ todoId: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todoId);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todoId);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    removeAll: (state) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodoList.fulfilled, (state, action) => {
        const newTodo = { ...action.payload, filter: "all", entityStatus: "idle" } as TodolistDomainType;
        state.unshift(newTodo);
      })
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        return [...action.payload.todoLists];
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((td) => td.id === action.payload.id);
        if (index !== -1) state[index].title = action.payload.title;
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((t) => t.id === action.payload);
        if (index != -1) state.splice(index, 1);
      });
  },
});

// thunks

export const fetchTodoLists = createAppAsyncThunk<{ todoLists: TodolistDomainType[] }>(
  "todoLists/fetch",
  async (arg, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todoLists: res.data.map((td: TodolistType) => ({ ...td, filter: "all", entityStatus: "idle" })) };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTodolist = createAppAsyncThunk<string, string>("todoList/removeTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  dispatch(appActions.setAppStatus({ status: "loading" }));

  try {
    const res = await todolistsAPI.deleteTodolist(arg);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const addTodoList = createAppAsyncThunk<TodolistType, string>("todoLists/addTodo", async (title, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.resultCode === ResultCode.success) {
      return res.data.data.item;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  });
});

export const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  "todoLists/changeTitle",
  async (arg, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    dispatch(appActions.setAppStatus({ status: "loading" }));
    try {
      const res = await todolistsAPI.updateTodolist(arg);

      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { id: arg.id, title: arg.title };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodoLists, changeTodolistTitle, removeTodolist, addTodoList };
