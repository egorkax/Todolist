import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType,} from "../../api/todolists-api";
import {TasksStateType} from "../../app/App";
import {Dispatch} from "redux";
import {SetAppErrorActionType, SetAppStatusActionType} from "../../app/app-reducer";


const initialState: TasksStateType = {}

//Reducer
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        // {
        //     const stateCopy = {...state}
        //     const tasks = stateCopy[action.todolistId];
        //     const newTasks = tasks.filter(t => t.id != action.taskId);
        //     stateCopy[action.todolistId] = newTasks;
        //     return stateCopy;
        // }
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        // {
        //     const stateCopy = {...state}
        //     const newTask = action.task
        //     const tasks = stateCopy[newTask.todoListId];
        //     const newTasks = [newTask, ...tasks];
        //     stateCopy[newTask.todoListId] = newTasks;
        //     return stateCopy;
        // }
        case "UPDATE-TASK":
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TODOLIST": {
            const copyState = {...state};
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState;
        }
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        // {
        //     const copyState = {...state};
        //     copyState[action.todolistId] = action.tasks
        //     return copyState
        // }
        default:
            return state;
    }
}


//AC
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)

export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)

export const setTaskAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: "SET-TASKS", tasks, todolistId} as const)


// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof setTaskAC>

export type TasksThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>