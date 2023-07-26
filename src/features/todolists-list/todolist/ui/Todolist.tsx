import React, { FC, MouseEventHandler, useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { Task } from "features/todolists-list/todolist/tasks/ui/task";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/todolists-list/model/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "features/todolists-list/todolist/tasks/model/tasks-reducer";
import { TaskStatuses } from "common/enums";
import { TaskType } from "features/todolists-list/todolist/tasks/api/task.types";
import { useActions } from "common/hooks";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist: FC<PropsType> = React.memo(function ({ demo = false, todolist, ...props }: PropsType) {
  const dispatch = useAppDispatch();
  const { addTask, changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions({
    ...tasksThunks,
    ...todolistsActions,
    ...todolistsThunks,
  });
  useEffect(() => {
    if (demo) {
      return;
    }
    const thunk = tasksThunks.fetchTasks(todolist.id);
    dispatch(thunk);
  }, []);

  const changeFilter = function (value: FilterValuesType, todolistId: string) {
    changeTodolistFilter({ todoId: todolistId, filter: value });
  };

  const addTaskCB = (title: string) => {
    addTask({ title, todolistId: todolist.id });
  };

  const removeTL = function () {
    removeTodolist(todolist.id);
  };

  const changeToDoTitle = (title: string) => {
    changeTodolistTitle({ id: todolist.id, title });
  };

  const onAllClickHandler = useCallback(() => changeFilter("all", todolist.id), [todolist.id, changeFilter]);
  const onActiveClickHandler = useCallback(() => changeFilter("active", todolist.id), [todolist.id, changeFilter]);
  const onCompletedClickHandler = useCallback(
    () => changeFilter("completed", todolist.id),
    [todolist.id, changeFilter]
  );

  let tasksForTodolist = props.tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeToDoTitle} />
        <IconButton onClick={removeTL} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCB} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button variant={todolist.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
