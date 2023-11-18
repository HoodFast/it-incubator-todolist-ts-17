import { RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodolistType } from "features/todolists-list/todolists/api/todolists.types";
import {
  addTodoList,
  changeTodolistTitle,
  fetchTodoLists,
  removeTodolist,
} from "features/todolists-list/todolists/model/todolists-actions";

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

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodoLists, changeTodolistTitle, removeTodolist, addTodoList };
