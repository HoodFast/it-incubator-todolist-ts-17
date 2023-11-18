import { createAppAsyncThunk, handleServerNetworkError } from "common/utils";
import { TaskType, UpdateTaskModelType } from "features/todolists-list/tasks/api/task.types";
import { taskAPI } from "features/todolists-list/tasks/api/tasks.api";
import { appActions } from "app/app-reducer";
import { AddTaskArgType } from "features/todolists-list/todolists/api/todolists.types";
import { ArgUpdateThunkType, ResultCode } from "features/todolists-list/tasks/model/tasks-reducer";

export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasksTC",

  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await taskAPI.getTasks(todolistId);
      const tasks = res.data.items;
      // dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);
export const removeTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>("tasks/removeTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  try {
    const res = await taskAPI.deleteTask({ todolistId: arg.todolistId, taskId: arg.taskId });
    if (res.data.resultCode === ResultCode.success) {
      // dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return arg;
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const res = await taskAPI.createTask(arg);
    if (res.data.resultCode === ResultCode.success) {
      const task = res.data.data.item;
      return { task };
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  }
);
export const updateTask = createAppAsyncThunk<ArgUpdateThunkType, ArgUpdateThunkType>(
  "tasks/updateTaskTC",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      dispatch(appActions.setAppError({ error: "task not found in the state" }));
      return rejectWithValue(null);
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    };

    const res = await taskAPI.updateTask({
      taskId: arg.taskId,
      todolistId: arg.todolistId,
      domainModel: apiModel,
    });
    if (res.data.resultCode === ResultCode.success) {
      return arg;
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  }
);
