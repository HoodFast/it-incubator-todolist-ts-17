export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type AddTaskArgType = { todolistId: string; title: string };