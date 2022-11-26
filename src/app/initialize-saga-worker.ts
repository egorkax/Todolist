import {call, put, takeEvery} from "redux-saga/effects";
import {authAPI, ResponseType} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {Dispatch} from "redux";
import {setAppInitializedAC} from "./app-reducer";
import {AxiosResponse} from "axios";

export function* initializeAppWorkerSaga() {
    const res: AxiosResponse<ResponseType<{ id: number, email: string, login: string }>> = yield call(authAPI.me)
    if (res.data.resultCode === 0) {
        yield put(setIsLoggedInAC(true))

    } else {

    }
    yield  put(setAppInitializedAC(true))
}

export const initializeApp = () => ({type: "APP/INITIALIZE-APP"})

export function* initializeSagaWatcher() {
    yield takeEvery('APP/INITIALIZE-APP', initializeAppWorkerSaga)
}

//thunks
export const __initializeAppTC = () => async (dispatch: Dispatch) => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))

    } else {

    }
    dispatch(setAppInitializedAC(true))
}