import {
  TodolistDomainType,
  todolistsReducer,
  todolistsThunks,
} from "features/todolists-list/todolists/model/todolists-reducer";
import { tasksReducer, TasksStateType } from "features/todolists-list/tasks/model/tasks-reducer";
import { TodolistType } from "features/todolists-list/todolists/api/todolists.types";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = todolistsThunks.addTodoList.fulfilled(todolist, "requestId", "new todolist");

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;
  console.log(idFromTasks);

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolists).toBe(action.payload.id);
});
