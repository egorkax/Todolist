const initialState: InitialStateType = {
    status: "idle",
    error: null
}
export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default :
            return {...state}
    }

}
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    status
} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)


// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая то глобальная произойдет мы запишем текст ошибки сюда
    error: string | null
}
export type SetAppErrorActionType =ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType =ReturnType<typeof setAppStatusAC>
type ActionsType =
    | SetAppStatusActionType
    | SetAppErrorActionType