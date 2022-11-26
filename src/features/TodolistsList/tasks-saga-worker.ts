import {call, put} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {ResponseTasksType, ResponseType, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {
    handleServerAppError,
    handleServerAppErrorWorkerSaga,
    handleServerNetworkError,
    handleServerNetworkErrorWorkerSaga
} from "../../utils/error-utils";
import {TasksStateType} from "../../app/App";
import {AppRootStateType} from "../../app/store";
import {
    addTaskAC,
    removeTaskAC,
    setTaskAC,
    TasksThunkDispatch,
    UpdateDomainTaskModelType,
    updateTaskAC
} from "./tasks-reducer";

//saga
export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseTasksType> = yield call(todolistsAPI.getTasks, action.todolistId)
    yield put(setTaskAC(res.data.items, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}
export const fetchTasks = (todolistId: string) => ({type: 'TASK/FETCH-TASKS', todolistId})

export function* addTaskSagaWorker(action: ReturnType<typeof addTask>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield  call(todolistsAPI.createTask, action.todolistId, action.title)
        if (res.data.resultCode === 0) {
            yield put(addTaskAC(res.data.data.item))
            yield put(setAppStatusAC('succeeded'))
        } else {
            return handleServerAppErrorWorkerSaga(res.data)
        }
    } catch (e: any) {
        return handleServerNetworkErrorWorkerSaga(e)
    }
}
export const addTask = (todolistId: string, title: string) => ({type: 'TASK/ADD-TASK', todolistId, title})

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTask>) {
    try {
        const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
        if (res.data.resultCode === 0) {
            yield  put(removeTaskAC(action.taskId, action.todolistId))
        } else {
            return handleServerAppErrorWorkerSaga(res.data)
        }
    } catch (error: any) {
        return handleServerNetworkErrorWorkerSaga(error)
    }
}
export const removeTask = (todolistId: string, taskId: string) => ({type: 'TASK/REMOVE-TASK', todolistId, taskId})

export function* updateTaskSagaWorker(action: ReturnType<typeof updateTask>) {

    const task = action.state[action.todolistId].find((t: TaskType) => {

        return t.id === action.taskId
    });
    if (!task) {
        console.warn('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...action.model
    }
    try {
        const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel)
        if (res.data.resultCode === 0) {
            yield put(updateTaskAC(action.taskId, apiModel, action.todolistId))
        } else {
            return handleServerAppErrorWorkerSaga(res.data)

        }
    } catch (e: any) {
        return handleServerNetworkErrorWorkerSaga(e)
    }
}
export const updateTask = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType, state: TasksStateType) => ({
    type: 'TASK/UPDATE-TASK',
    todolistId,
    taskId,
    model,
    state
})
// thunks
export const __fetchTaskTC = (todolistId: string) => {
    return (dispatch: TasksThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTasks(todolistId)
            .then(res => {
                dispatch(setTaskAC(res.data.items, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const __removeTaskTC = (todolistId: string, taskId: string) => (dispatch: TasksThunkDispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })

}
export const __addTaskTC = (todolistId: string, title: string) => (dispatch: TasksThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const __updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: TasksThunkDispatch, getState: () => AppRootStateType) => {

    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId);
    if (!task) {
        console.warn('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
    }
    todolistsAPI.updateTask(todolistId, taskId, apiModel)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC(taskId, apiModel, todolistId))
            } else {
                handleServerAppError(res.data, dispatch)
                // if (res.data.messages.length) {
                //     dispatch(setAppErrorAC(res.data.messages[0]))
                // } else {
                //     dispatch(setAppErrorAC('Some error occurred'))
                // }
                // dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
            // dispatch(setAppErrorAC(e.message))
            // dispatch(setAppStatusAC('failed'))

        })
}