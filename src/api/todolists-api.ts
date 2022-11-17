import axios from "axios";


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'c2552144-2a3f-4ed6-b1f2-2eb2edcd9913'
    }
})

// api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}`)
    },
    updateTitleTodolist(todolistID: string, newTitle: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistID}`, {title: newTitle})
    },
    getTasks(todolistID: string) {
        return instance.get<ResponseTasksType>(`todo-lists/${todolistID}/tasks`)
    },
    createTask(todolistID: string, newTitle: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title: newTitle})
    },
    deleteTask(todolistID: string, taskID: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`)
    },
    updateTask(todolistID: string, taskID: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todolistID}/tasks/${taskID}`, model)
    },
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: boolean
}

export const authAPI = {
    logIn(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId?: number }>>('/auth/login', data)
    },
    me() {
        return instance.get<ResponseType<{ id: number, email: string, login: string }>>('/auth/me')
    },
    logOut() {
        return instance.delete<ResponseType>('/auth/login')
    },

}


// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors?: Array<{ field: string, error: string }>
    data: D
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type ResponseTasksType = {
    items: TaskType[]
    totalCount: number
    error: string | null

}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

