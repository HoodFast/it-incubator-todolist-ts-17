import React, { ChangeEvent } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { TaskType } from "features/todolists-list/tasks/api/task.types";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};
export const Task = React.memo((props: TaskPropsType) => {
  const { removeTask: removeTS, updateTask } = useActions(tasksThunks);

  const removeTaskHandler = () => removeTS({ taskId: props.task.id, todolistId: props.todolistId });

  const ChangeCheckedHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked;
    let status: TaskStatuses = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({ taskId: props.task.id, domainModel: { status }, todolistId: props.todolistId });
  };

  const TitleChangeHandler = (newValue: string) => {
    updateTask({ taskId: props.task.id, domainModel: { title: newValue }, todolistId: props.todolistId });
  };

  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={ChangeCheckedHandler}
      />

      <EditableSpan value={props.task.title} onChange={TitleChangeHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
