import {tasksAction as tasksAction} from './tasks-reducer'
import {todolistAsyncAction as todolistAsyncAction} from './todolists-reducer'
import {slice} from './todolists-reducer'

const todolistAction = {
    ...todolistAsyncAction,
    ...slice.actions
}

export {
    tasksAction,
    todolistAction
}
