import { createSlice } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunks } from "features/todolists-list/todolists/model/todolists-reducer";
import { TodolistType } from "features/todolists-list/todolists/api/todolists.types";
import { TaskType, UpdateDomainTaskModelType } from "features/todolists-list/tasks/api/task.types";
import { addTask, fetchTasks, removeTask, updateTask } from "features/todolists-list/tasks/model/task-actions";

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

      .addCase(todolistsActions.removeAll, () => {
        return {};
      })
      .addCase(todolistsThunks.addTodoList.fulfilled, (state, action) => {
        state[action.payload.id] = [];
      })
      .addCase(todolistsThunks.fetchTodoLists.fulfilled, (state, action) => {
        action.payload.todoLists.forEach((td: TodolistType) => {
          state[td.id] = [];
        });
      })

      .addCase(removeTask.fulfilled, (state, action) => {
        const task = state[action.payload.todolistId];
        const index = task.findIndex((ts) => ts.id === action.payload.taskId);
        if (index !== -1) task.splice(index, 1);
      });
  },
});

// thunks
export const ResultCode = {
  success: 0,
  error: 1,
  captcha: 10,
} as const;

// types
export type ArgUpdateThunkType = {
  todolistId: string;
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };
