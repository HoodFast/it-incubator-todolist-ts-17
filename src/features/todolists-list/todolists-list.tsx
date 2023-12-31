import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useActions } from "common/hooks";
import {
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/todolists-list/todolists/model/todolists-reducer";
import { TasksStateType } from "features/todolists-list/tasks/model/tasks-reducer";
import { Todolist } from "features/todolists-list/todolists/ui/Todolist";
import s from "features/todolists-list/TodolistsList.module.css";
import { selectIsLoggedIn } from "features/auth/selectors";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const { addTodoList, fetchTodoLists } = useActions(todolistsThunks);

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

  const addTodolist = useCallback(
    (title: string) => {
      return addTodoList(title).unwrap();
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container className={s.grid}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper className={s.paper}>
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
