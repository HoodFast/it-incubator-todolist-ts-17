import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunks } from "features/TodolistsList/todolists-reducer";
import { Dispatch } from "redux";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { handleServerAppError } from "common/utils/handle-server-app-error";

import { TaskPriorities, TaskStatuses } from "common/enums";
import { AddTaskArgType, TaskType, TodolistType, UpdateTaskModelType } from "features/TodolistsList/todolists.types";
import { todolistsAPI } from "features/TodolistsList/todolists.api";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        let tasks = state[action.payload.todolistId];

        let index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(todolistsThunks.addTodoList.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(todolistsActions.removeAll, () => {
        return {};
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const task = state[action.payload.todolistId];
        const index = task.findIndex((ts) => ts.id === action.payload.taskId);
        if (index !== -1) task.splice(index, 1);
      })
      .addCase(todolistsThunks.fetchTodoLists.fulfilled, (state, action) => {
        action.payload.todoLists.forEach((td: TodolistType) => {
          state[td.id] = [];
        });
      });
  },
});

// thunks
export const ResultCode = {
  success: 0,
  error: 1,
  captcha: 10,
} as const;

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasksTC",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>("tasks/removeTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.deleteTask({ todolistId: arg.todolistId, taskId: arg.taskId });
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

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTask(arg);
      if (res.data.resultCode === ResultCode.success) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task };
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

const updateTask = createAppAsyncThunk<ArgUpdateThunkType, ArgUpdateThunkType>(
  "tasks/updateTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;

    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        dispatch(appActions.setAppError({ error: "task not found in the state" }));
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.updateTask({
        taskId: arg.taskId,
        todolistId: arg.todolistId,
        domainModel: apiModel,
      });
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
  }
);

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export type ArgUpdateThunkType = {
  todolistId: string;
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
};

type AsyncThunkConfig = {
  state?: unknown;
  dispatch?: Dispatch;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
};

export const taskActions = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };
