import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";

import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((ts) => ts.id === action.payload.taskId);

      if (index !== -1) tasks.splice(index, 1);
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTask: (
      state,
      action: PayloadAction<{ todoId: string; taskId: string; model: UpdateDomainTaskModelType }>
    ) => {
      let tasks = state[action.payload.todoId];
      let index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
    },
    setTasks: (state, action: PayloadAction<{ todolistId: string; tasks: Array<TaskType> }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todo.id] = [];
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.todoId];
      })
      .addCase(todolistsActions.setTodoLists, (state, action) => {
        action.payload.todoLists.forEach((td) => {
          state[td.id] = [];
        });
      });
  },
});

export const taskActions = slice.actions;
export const tasksReducer = slice.reducer;
// thunks
export const fetchTasksTC =
  (todolistId: string): AppThunk =>
  (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(taskActions.setTasks({ tasks, todolistId }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string): AppThunk =>
  (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
      const action = taskActions.removeTask({ taskId, todolistId });
      dispatch(action);
    });
  };

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
