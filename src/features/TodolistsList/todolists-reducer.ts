import {todolistsAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";


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

export const todolistAsyncAction = {
    fetchTodolistsTC, removeTodolistTC, addTodolistTC, updateTitleTodolistTC
}

export const slice = createSlice({
    name: 'todolist',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {

        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.status
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({
                ...tl,
                filter: 'all',
                entityStatus: 'idle'
            }))

        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: 'idle'})
        })
        builder.addCase(updateTitleTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistFilterAC,
    changeTodolistStatusAC
} = slice.actions


// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
