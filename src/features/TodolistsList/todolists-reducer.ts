import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";

import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "common/utils";
import { todolistsAPI, TodolistType } from "features/TodolistsList/todolists.api";

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todoLists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{ todoId: string }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todoId);
      if (index !== -1) state.splice(index, 1);
    },
    addTodolist: (state, action: PayloadAction<{ todo: TodolistType }>) => {
      const newTodo = { ...action.payload.todo, filter: "all", entityStatus: "idle" } as TodolistDomainType;
      state.unshift(newTodo);
    },
    changeTodolistTitle: (state, action: PayloadAction<{ todoId: string; title: string }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todoId);
      if (index !== -1) state[index].title = action.payload.title;
    },
    changeTodolistFilter: (state, action: PayloadAction<{ todoId: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todoId);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((td) => td.id === action.payload.todoId);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    setTodoLists: (state, action: PayloadAction<{ todoLists: TodolistType[] }>) => {
      return action.payload.todoLists.map((td) => ({ ...td, filter: "all", entityStatus: "idle" }));
    },
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistsActions.setTodoLists({ todoLists: res.data }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setAppStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(todolistsActions.changeTodolistEntityStatus({ todoId: todolistId, entityStatus: "loading" }));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(todolistsActions.removeTodolist({ todoId: todolistId }));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(todolistsActions.addTodolist({ todo: res.data.data.item }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(todolistsActions.changeTodolistTitle({ todoId: id, title: title }));
    });
  };
};

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
