import React, { FC, useCallback, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TodolistDomainType, todolistsActions, todolistsThunks } from "features/todolists-list/model/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "features/todolists-list/todolist/taskList/tasks/model/tasks-reducer";
import { TaskType } from "features/todolists-list/todolist/taskList/tasks/api/task.types";
import { useActions } from "common/hooks";
import { FilterTasksButtons } from "components/filterTasksButtons/filterTasksButtons";
import { TaskList } from "features/todolists-list/todolist/taskList/taskList";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist: FC<PropsType> = React.memo(function ({ demo = false, todolist, tasks, ...props }: PropsType) {
  const dispatch = useAppDispatch();
  const { addTask, removeTodolist, changeTodolistTitle } = useActions({
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

  const addTaskCB = (title: string) => {
    addTask({ title, todolistId: todolist.id });
  };

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
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeToDoTitle} />
        <IconButton onClick={removeTL} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCB} disabled={todolist.entityStatus === "loading"} />
      <TaskList tasks={tasks} todolistId={todolist.id} todoFilter={todolist.filter} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  );
});
