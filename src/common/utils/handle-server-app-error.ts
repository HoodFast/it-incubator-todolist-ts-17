import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";
import { ResponseType } from "common/types/common.types";
import { RejectValueType } from "common/utils/create-app-async-thunk";

/**
 * Обрабатывает ошибку, полученную от сервера.
 *
 * @template D - Тип данных возвращаемых с сервером
 * @param {ResponseType<D>} data  - Данные, полученные от сервера
 * @param {Dispatch} dispatch - Функция для отправки сообщений в store Redux
 * @param {showError:boolean} [showError=true] - Флаг, указывающий, нужно ли отображать ошибку
 * @returns {void} - ничего не возвращает
 */

export const handleServerAppError = <D>(data: RejectValueType<D>, dispatch: Dispatch, showError = true) => {
  // if (showError) {
  //   dispatch(
  //     appActions.setAppError({ error: data.data.messages.length ? data.data.messages[0] : "Some error occurred" })
  //   );
  // }
  // dispatch(appActions.setAppStatus({ status: "failed" }));
};
