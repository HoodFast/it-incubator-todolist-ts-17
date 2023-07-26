import { instance } from "common/api/common.api";
import { TodolistType } from "features/todolists-list/api/todolists.types";
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
};
