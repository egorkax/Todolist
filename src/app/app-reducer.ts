import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {call, put} from "redux-saga/effects";

const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}
export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: action.value}
        default :
            return {...state}
    }

}
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    status
} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-INITIALIZED', value} as const)

export function* initializeAppWorkerSaga() {
    // @ts-ignore
    const res = yield call(authAPI.me)
    if (res.data.resultCode === 0) {
        yield put(setIsLoggedInAC(true))

    } else {

    }
    yield  put(setAppInitializedAC(true))
}

export const initializeApp=()=>({type:"APP/INITIALIZE-APP"})

// thunks
// export const initializeAppTC = () => async (dispatch: Dispatch) => {
//     const res = await authAPI.me()
//     if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC(true))
//
//     } else {
//
//     }
//     dispatch(setAppInitializedAC(true))
// }

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая то глобальная произойдет мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось
    isInitialized: boolean
}
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>
type ActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetAppInitializedActionType