import React, { FC, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import {
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/todolists-list/todolists/model/todolists-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { TaskType } from "features/todolists-list/tasks/api/task.types";
import { useActions } from "common/hooks";
import { FilterTasksButtons } from "features/todolists-list/todolists/ui/filterTasksButtons/filterTasksButtons";
import { TaskList } from "features/todolists-list/todolists/ui/taskList/taskList";
import { TodolistTitle } from "features/todolists-list/todolists/ui/todolist-title/todolist-title";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist: FC<PropsType> = React.memo(function ({ demo = false, todolist, tasks, ...props }: PropsType) {
  const dispatch = useAppDispatch();
  const { addTask } = useActions({
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
    return addTask({ title, todolistId: todolist.id }).unwrap();
  };

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCB} disabled={todolist.entityStatus === "loading"} />
      <TaskList tasks={tasks} todolistId={todolist.id} todoFilter={todolist.filter} />
      <FilterTasksButtons todolist={todolist} />
    </div>
  );
});
