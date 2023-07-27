import React, { ChangeEvent, FC, memo } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/todolist/taskList/tasks/model/tasks-reducer";
import { TaskType } from "features/todolists-list/todolist/taskList/tasks/api/task.types";
import s from "features/todolists-list/todolist/taskList/tasks/ui/task.module.css";

type Props = {
  task: TaskType;
  todolistId: string;
};
export const Task: FC<Props> = memo(({ task, todolistId }) => {
  const { removeTask: removeTS, updateTask } = useActions(tasksThunks);

  const removeTaskHandler = () => removeTS({ taskId: task.id, todolistId });

  const ChangeCheckedHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status: TaskStatuses = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({ taskId: task.id, domainModel: { status }, todolistId });
  };

  const ChangeTitleHandler = (title: string) => {
    updateTask({ taskId: task.id, domainModel: { title }, todolistId });
  };

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={ChangeCheckedHandler} />

      <EditableSpan value={task.title} onChange={ChangeTitleHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
