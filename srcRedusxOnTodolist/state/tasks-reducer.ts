import {TasksStateType,} from "../App";
import {addTodolistAc, removeTodolistACType} from "./todolists-reducer";
import {v1} from "uuid";

let InitialState:TasksStateType={}
export const tasksReducer = (state= InitialState, action: tasksReducerACType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(e => e.id !== action.payload.taskID)
            }
        }
        case "ADD-TASK": {

            return {...state,[action.payload.todolistID]:[{id: v1(), title: action.payload.title, isDone: false},...state[action.payload.todolistID]]}
        }
        case "CHANGE-TASK-STATUS":{
            return{...state,
                [action.payload.todolistID]:state[action.payload.todolistID].map(e=>e.id===action.payload.taskID?{...e,isDone:action.payload.isDone}:e )
            }
        }
        case "CHANGE-TASK-TITLE":{
            return {...state,[action.payload.todolistID]:state[action.payload.todolistID].map(e=>e.id===action.payload.taskID?{...e,title:action.payload.newTitle}:e)}
        }
        case "ADD-TODOLIST":{
            return {...state,
            [action.payload.todolistID]:[]}
        }
        case "REMOVE-TODOLIST":{
           const copyState={...state}
            delete copyState[action.payload.todolistID]
            return copyState
        }
        default:
            return state
    }
}
type tasksReducerACType = removeTaskACType | addTaskACType | changeStatusACType | changeTaskTitleACType | addTodolistAc | removeTodolistACType

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (todolistID: string, taskID: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistID,
            taskID
        }
    } as const
}

type addTaskACType = ReturnType<typeof addTaskAC>
export const addTaskAC = (todolistID: string, title: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistID,
            title
        }
    } as const
}

type changeStatusACType = ReturnType<typeof changeStatusAC>
export const changeStatusAC = (todolistID: string, taskID:string, isDone:boolean) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            todolistID,
            taskID,
            isDone
        }
    } as const
}

type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
export const changeTaskTitleAC = (todolistID: string, taskID:string, newTitle:string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            todolistID,
            taskID,
            newTitle
        }
    } as const
}