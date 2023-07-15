import { ArgUpdateThunkType } from "features/TodolistsList/tasks-reducer";
import { instance } from "common/api/common.api";
import { AddTaskArgType, GetTasksResponse, TaskType, TodolistType } from "features/TodolistsList/todolists.types";
import { ResponseType } from "common/types/common.types";

export const todolistsAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(arg: { id: string; title: string }) {
    return instance.put<ResponseType>(`todo-lists/${arg.id}`, { title: arg.title });
  },
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
