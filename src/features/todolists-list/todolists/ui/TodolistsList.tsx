import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/todolists-list/todolists/model/todolists-reducer";
import { TasksStateType, tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { Todolist } from "features/todolists-list/Todolist/Todolist";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);

  const {
    addTodoList,
    fetchTodoLists,
    removeTodolist: removeTL,
    changeTodolistTitle: changeTLTitle,
  } = useActions(todolistsThunks);

  const {
    addTask: AddTS,
    updateTask: updateTS,
    changeTodolistFilter,
  } = useActions({ ...tasksThunks, ...todolistsActions });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodoLists({});

    return function cleanup() {
      dispatch(todolistsActions.removeAll());
    };
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    AddTS({ title, todolistId });
  }, []);

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    updateTS({ taskId: id, domainModel: { status }, todolistId: todolistId });
  }, []);

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    const thunk = tasksThunks.updateTask({ taskId: id, domainModel: { title: newTitle }, todolistId: todolistId });
    dispatch(thunk);
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    changeTodolistFilter({ todoId: todolistId, filter: value });
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    removeTL(id);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    changeTLTitle({ id, title });
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      addTodoList(title);
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
