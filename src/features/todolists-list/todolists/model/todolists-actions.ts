import { createAppAsyncThunk } from "common/utils";
import { todolistsAPI } from "features/todolists-list/todolists/api/todolists.api";
import { ResultCode } from "common/api/resultCodes";
import { TodolistType } from "features/todolists-list/todolists/api/todolists.types";
import { TodolistDomainType } from "features/todolists-list/todolists/model/todolists-reducer";

export const fetchTodoLists = createAppAsyncThunk<{ todoLists: TodolistDomainType[] }>("todoLists/fetch", async () => {
  const res = await todolistsAPI.getTodolists();
  return { todoLists: res.data.map((td: TodolistType) => ({ ...td, filter: "all", entityStatus: "idle" })) };
});
export const removeTodolist = createAppAsyncThunk<string, string>("todoList/removeTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const res = await todolistsAPI.deleteTodolist(arg);
  if (res.data.resultCode === ResultCode.success) {
    return arg;
  } else {
    // handleServerAppError(res.data, dispatch);
    return rejectWithValue(null);
  }
});
export const addTodoList = createAppAsyncThunk<TodolistType, string>(
  "todoLists/addTodo",
  async (title, { rejectWithValue }) => {
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.resultCode === ResultCode.success) {
      return res.data.data.item;
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  }
);
export const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  "todoLists/changeTitle",
  async (arg, thunkAPI) => {
    const { rejectWithValue, dispatch } = thunkAPI;
    const res = await todolistsAPI.updateTodolist(arg);
    if (res.data.resultCode === ResultCode.success) {
      return { id: arg.id, title: arg.title };
    } else {
      return rejectWithValue(null);
    }
  }
);
