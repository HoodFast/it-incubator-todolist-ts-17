import * as tasksActions from "./tasks/model/task-actions";
import * as todolistAsyncActions from "./todolists/model/todolists-actions";
import { slice } from "./todolists/model/todolists-reducer";

const todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions,
};

export { tasksActions, todolistActions };
