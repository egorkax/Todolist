import {
    tasksReducer
} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from "redux-thunk";
import {appReducer, initializeAppWorkerSaga} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import createSagaMiddleware from 'redux-saga'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {
    addTaskSagaWorker, fetchTasksWorkerSaga,
    removeTaskWorkerSaga,
    updateTaskSagaWorker
} from "../features/TodolistsList/tasks-saga-worker";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const sagaMiddleware = createSagaMiddleware()

// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield takeEvery('APP/INITIALIZE-APP',initializeAppWorkerSaga)
    yield takeEvery('TASK/FETCH-TASKS',fetchTasksWorkerSaga)
    yield takeEvery('TASK/REMOVE-TASK',removeTaskWorkerSaga)
    yield takeEvery('TASK/ADD-TASK',addTaskSagaWorker)
    yield takeEvery('TASK/UPDATE-TASK',updateTaskSagaWorker)
}


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
