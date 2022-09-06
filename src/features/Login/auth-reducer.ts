import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}


// reducer
export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state;
    }
}

// AC
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)



// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: ThunkDispatch) => {
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

export const logOutTC = () => (dispatch: ThunkDispatch) => {
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

export type InitialStateType = {
    isLoggedIn: boolean
}

export type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>

type ActionsType =
    | SetIsLoggedInActionType


type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>