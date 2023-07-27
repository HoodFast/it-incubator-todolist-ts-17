import { ArgUpdateThunkType } from "features/todolists-list/todolist/taskList/tasks/model/tasks-reducer";
import { instance } from "common/api/common.api";
import { AddTaskArgType } from "features/todolists-list/api/todolists.types";
import { ResponseType } from "common/types/common.types";
import { GetTasksResponse, TaskType } from "features/todolists-list/todolist/taskList/tasks/api/task.types";

export const taskAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(arg: { todolistId: string; taskId: string }) {
    return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {
      title: arg.title,
    });
  },
  updateTask(arg: ArgUpdateThunkType) {
    return instance.put<ResponseType<TaskType>>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`, arg.domainModel);
  },
};
