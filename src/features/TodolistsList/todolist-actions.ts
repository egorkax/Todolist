import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "../../app/app-reducer";
import {todolistsAPI} from "../../api/todolists-api";
import {handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {changeTodolistStatusAC} from "./todolists-reducer";

export const fetchTodolistsTC = createAsyncThunk('todolist/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data}

    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk('todolist/removeTodolists', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTodolistStatusAC({todolistId: todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(todolistId)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolistId: todolistId}

})
export const addTodolistTC = createAsyncThunk('todolist/addTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(title)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolist: res.data.data.item}
})

export const updateTitleTodolistTC = createAsyncThunk('todolist/updateTitleTodolist', async (param: { todolistId: string, title: string }, thunkAPI) => {
    const res = await todolistsAPI.updateTitleTodolist(param.todolistId, param.title)
    return {id: param.todolistId, title: param.title}
})