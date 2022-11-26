import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {authAPI, LoginParamsType, ResponseType} from "../../api/todolists-api";
import {
    handleServerAppError,
    handleServerAppErrorWorkerSaga,
    handleServerNetworkError,
    handleServerNetworkErrorWorkerSaga
} from "../../utils/error-utils";
import {AuthThunkDispatch, setIsLoggedInAC} from "./auth-reducer";
//saga
export function* loginSagaWorker(action: ReturnType<typeof logIn>) {
    yield put(setAppStatusAC("loading"))
    const res: AxiosResponse<ResponseType<{ userId?: number }>> = yield call(authAPI.logIn, action.data)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))
        } else {
            return handleServerAppErrorWorkerSaga(res.data)
        }
    } catch (e: any) {
        return handleServerNetworkErrorWorkerSaga(e)
    }
}
export const logIn = (data: LoginParamsType) => ({type: "AUTH/LOG-IN", data})

export function* logOutSagaWorker() {
    yield put(setAppStatusAC("loading"))
    const res: AxiosResponse<ResponseType> = yield call(authAPI.logOut)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(setAppStatusAC('succeeded'))
        } else {
            return handleServerAppErrorWorkerSaga(res.data)
        }
    } catch (e: any) {
        return handleServerNetworkErrorWorkerSaga(e)
    }
}
export const logOut = () => ({type: "AUTH/LOG-OUT"})

export function* authSagaWatcher() {
    yield takeEvery('AUTH/LOG-IN', loginSagaWorker)
    yield takeEvery('AUTH/LOG-OUT', logOutSagaWorker)

}

// thunks
export const __loginTC = (data: LoginParamsType) => (dispatch: AuthThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    authAPI.logIn(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const __logOutTC = () => (dispatch: AuthThunkDispatch) => {
    dispatch(setAppStatusAC("loading"))
    authAPI.logOut()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}