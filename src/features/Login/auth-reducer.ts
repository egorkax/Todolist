import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk('auth/login', async (data: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.logIn(data)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {value: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (err) {
        // @ts-ignore
        const error: AxiosError = err
        handleServerNetworkError(error as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})

    }
})

export const logOutTC = createAsyncThunk('auth/logOut', async (_, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await authAPI.logOut()
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            thunkAPI.dispatch(setIsLoggedInAC({value: false}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
    }
})

export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// thunks




