import {Dispatch} from "redux";
import {SetAppErrorActionType, SetAppStatusActionType} from "../../app/app-reducer";

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


export type InitialStateType = {
    isLoggedIn: boolean
}

export type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>

type ActionsType =
    | SetIsLoggedInActionType


export  type AuthThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>