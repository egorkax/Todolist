import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";


let InitialState:Array<TodolistType>=[]

export const todolistsReducer = (state=InitialState, action: todolistReducerType) => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(e => e.id !== action.payload.todolistID)
        }
        case "ADD-TODOLIST": {
            let newTodolistId = action.payload.todolistID;
            let newTodolist: TodolistType = {id: newTodolistId, title: action.payload.newTodolistTitle, filter: "all"}
            return [...state, newTodolist]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(e => e.id === action.payload.todolistId2 ? {
                ...e,
                title: action.payload.newTodolistTitle
            } : e)
        }
        case "CHANGE-TODOLIST-FILTER": {
            return state.map(e => e.id === action.payload.todolistId2 ? {...e, filter: action.payload.newFilter} : e)
        }
        default:
            return state
    }
}
type todolistReducerType = removeTodolistACType | addTodolistAc | changeTodolistTitleACType | changeFilterAcType

export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todolistID: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {todolistID}
    } as const
}

export type addTodolistAc = ReturnType<typeof addTodolistAc>
export const addTodolistAc = (newTodolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTodolistTitle,
            todolistID:v1()
        }
    } as const
}
type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export const changeTodolistTitleAC = (todolistId2: string, newTodolistTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId2,
            newTodolistTitle
        }
    } as const
}

type changeFilterAcType = ReturnType<typeof changeFilterAc>
export const changeFilterAc = (todolistId2: string, newFilter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            todolistId2,
            newFilter
        }
    } as const
}

