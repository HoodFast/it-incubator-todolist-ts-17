import React, { FC, useCallback } from "react";
import { Button } from "@mui/material";

import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/todolists-list/todolists/model/todolists-reducer";
import { useActions } from "common/hooks";
import s from "features/todolists-list/todolists/ui/filterTasksButtons/filterTasksButtons.module.css";

type PropsType = {
  todolist: TodolistDomainType;
};

export const FilterTasksButtons: FC<PropsType> = ({ todolist }) => {
  const { changeTodolistFilter } = useActions(todolistsActions);

  const changeFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ filter, todoId: todolist.id });
  };

  return (
    <div className={s.buttonsFilter}>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("all")}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("active")}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("completed")}
        color={"secondary"}
      >
        Completed
      </Button>
    </div>
  );
};
