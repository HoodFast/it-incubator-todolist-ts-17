import { Task } from "features/todolists-list/todolist/taskList/tasks/ui/task";
import React, { FC } from "react";
import { TaskStatuses } from "common/enums";
import { FilterValuesType } from "features/todolists-list/model/todolists-reducer";
import { TaskType } from "features/todolists-list/todolist/taskList/tasks/api/task.types";

type PropsType = {
  tasks: Array<TaskType>;
  todolistId: string;
  todoFilter: FilterValuesType;
};

export const TaskList: FC<PropsType> = ({ tasks, todolistId, todoFilter }) => {
  let tasksForTodolist = tasks;

  if (todoFilter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todoFilter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={todolistId} />
      ))}
    </div>
  );
};
