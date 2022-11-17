import {addTodolistTC, fetchTodolistsTC, removeTodolistTC,} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, todolistsAPI, UpdateTaskModelType,} from "../../api/todolists-api";
import {TasksStateType} from "../../app/App";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {AppRootStateType} from "../../app/store";


const initialState: TasksStateType = {}


export const fetchTaskTC = createAsyncThunk('tasks/fetchTask', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
    const tasks = res.data.items
    return {tasks, todolistId}
})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    try {
        if (res.data.resultCode === 0) {
            return {taskId: param.taskId, todolistId: param.todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: {
    todolistId: string,
    taskId: string,
    model: UpdateDomainTaskModelType
}, thunkAPI) => {

    const state = thunkAPI.getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
    if (!task) {
        return thunkAPI.rejectWithValue('task not found in the state')
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...param.model
    }
    const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel)

    try {
        if (res.data.resultCode === 0) {
            return {taskId: param.taskId, model: param.model, todolistId: param.todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e as Error | AxiosError, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})


const slice = createSlice({
    name: 'task',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => {
                state[tl.id] = []
            })
        })
        builder.addCase(fetchTaskTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    }
})

//Reducer
export const tasksReducer = slice.reducer

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

