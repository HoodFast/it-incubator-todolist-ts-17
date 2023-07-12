import { TodolistDomainType, todolistsActions, todolistsReducer, todolistsThunks } from "./todolists-reducer";
import { tasksReducer, TasksStateType } from "./tasks-reducer";
import { TodolistType } from "features/TodolistsList/todolists.types";

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
