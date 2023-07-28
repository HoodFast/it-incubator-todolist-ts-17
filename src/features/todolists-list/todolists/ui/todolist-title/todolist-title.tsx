import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { FC, useCallback } from "react";
import { useActions } from "common/hooks";
import { TodolistDomainType, todolistsThunks } from "features/todolists-list/todolists/model/todolists-reducer";

type PropsType = {
  todolist: TodolistDomainType;
};

export const TodolistTitle: FC<PropsType> = ({ todolist }) => {
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks);
  const removeTL = function () {
    removeTodolist(todolist.id);
  };

  const changeToDoTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolist.id, title });
    },
    [todolist.title]
  );
  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeToDoTitle} />
      <IconButton onClick={removeTL} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};
