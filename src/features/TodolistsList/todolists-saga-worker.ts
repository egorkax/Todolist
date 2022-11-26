import {setAppStatusAC} from "../../app/app-reducer";
import {ResponseType, todolistsAPI, TodolistType} from "../../api/todolists-api";
import {call, put, takeEvery} from "redux-saga/effects";
import {handleServerNetworkError, handleServerNetworkErrorWorkerSaga} from "../../utils/error-utils";
import {AxiosResponse} from "axios";
import {
    addTodolistAC,
    changeTodolistStatusAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistAC, TodolistThunkDispatch
} from "./todolists-reducer";


//saga

export function* fetchTodolistSagaWorker() {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<TodolistType[]> = yield call(todolistsAPI.getTodolists)
    try {
        yield put(setTodolistAC(res.data))
        yield put(setAppStatusAC('succeeded'))
    } catch (e: any) {
        return handleServerNetworkErrorWorkerSaga(e)
    }
}
export const fetchTodolist = () => ({type: 'TD/FETCH-TODOLISTS'})

export function* removeTodolistSagaWorker(action: ReturnType<typeof removeTodolist>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistStatusAC(action.todolistId, 'loading'))
    try {
        yield call(todolistsAPI.deleteTodolist, action.todolistId)
        yield put(removeTodolistAC(action.todolistId))
        yield put(setAppStatusAC('succeeded'))
    } catch (e: any) {
        return handleServerNetworkErrorWorkerSaga(e)
    }
}
export const removeTodolist = (todolistId: string) => ({type: 'TD/REMOVE-TODOLISTS', todolistId})

export function* addTodolistSagaWorker(action: ReturnType<typeof addTodolist>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType<{ item: TodolistType }>, any> = yield call(todolistsAPI.createTodolist, action.title)
    yield put(addTodolistAC(res.data.data.item))
    yield put(setAppStatusAC('succeeded'))
}
export const addTodolist = (title: string) => ({type: 'TD/ADD-TODOLISTS', title})

export function* updateTitleTodolistSagaWorker(action: ReturnType<typeof updateTodolist>) {
    yield call(todolistsAPI.updateTitleTodolist, action.todolistId, action.title)
    yield put(changeTodolistTitleAC(action.todolistId, action.title))
}
export const updateTodolist = (todolistId: string, title: string) => ({type: 'TD/UPDATE-TODOLISTS', todolistId, title})

export function* todolistsWatcherSaga(){
    yield takeEvery('TD/FETCH-TODOLISTS', fetchTodolistSagaWorker)
    yield takeEvery('TD/REMOVE-TODOLISTS', removeTodolistSagaWorker)
    yield takeEvery('TD/ADD-TODOLISTS', addTodolistSagaWorker)
    yield takeEvery('TD/UPDATE-TODOLISTS', updateTitleTodolistSagaWorker)
}

// thunks

export const __fetchTodolistsTC = () => {
    return (dispatch: TodolistThunkDispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.getTodolists()
            .then(res => {
                dispatch(setTodolistAC(res.data))
                dispatch(setAppStatusAC('succeeded'))

            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
            })
    }
}
export const __removeTodolistTC = (todolistId: string) => (dispatch: TodolistThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistStatusAC(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))

        })
}
export const __addTodolistTC = (title: string) => (dispatch: TodolistThunkDispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const __updateTitleTodolistTC = (todolistId: string, title: string) => (dispatch: TodolistThunkDispatch) => {
    todolistsAPI.updateTitleTodolist(todolistId, title)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
}