import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType,} from "../../api/todolists-api";
import {TasksStateType} from "../../app/App";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";


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


// thunks
export const fetchTaskTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.getTasks(todolistId)
            .then(res => {
                dispatch(setTaskAC(res.data.items, todolistId))
            })
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {

    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId);
    if (!task) {
        console.warn('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
    }
    todolistsAPI.updateTask(todolistId, taskId, apiModel)
        .then((res) => {
            dispatch(updateTaskAC(taskId, apiModel, todolistId))

        })
}

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