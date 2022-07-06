import React, {ChangeEvent} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Delete} from "@mui/icons-material";
import {Button, Checkbox, IconButton} from "@mui/material";
import {TodolistType} from "./AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeFilterAc, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


type PropsType = {
    todolist: TodolistType
}

export function Todolist1({todolist}: PropsType) {
    const {id, title, filter} = {...todolist}
    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id])
    const dispatch = useDispatch()


    const addTask = (title: string) => {
        const action = addTaskAC(id, title)
        dispatch(action)
    }

    const removeTodolist = () => {
        const action = removeTodolistAC(id)
        dispatch(action)

    }
    const changeTodolistTitle = (title: string) => {
        const action = changeTodolistTitleAC(id, title)
        dispatch(action)

    }

    const onAllClickHandler = () => dispatch(changeFilterAc(id, "all"))
    const onActiveClickHandler = () => dispatch(changeFilterAc(id, "active"))
    const onCompletedClickHandler = () => dispatch(changeFilterAc(id, "completed"))

    if (filter === "active") tasks= tasks.filter(t => !t.isDone)
    if (filter === "completed") tasks= tasks.filter(t => t.isDone)


    return <div>
        <h3><EditableSpan value={title} onChange={changeTodolistTitle}/>
            <IconButton aria-label="delete">
                <Delete onClick={removeTodolist}/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                tasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(id, t.id))
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeStatusAC(id, t.id, newIsDoneValue))
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(id, t.id, newValue))
                    }


                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox onChange={onChangeHandler} checked={t.isDone}/>
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton aria-label="delete">
                            <Delete onClick={onClickHandler}/>
                        </IconButton>

                    </li>
                })
            }
        </ul>
        <div>
            <Button onClick={onAllClickHandler} variant={filter === 'all' ? "contained" : "outlined"}>All</Button>
            <Button onClick={onActiveClickHandler} variant={filter === 'active' ? "contained" : "outlined"}
                    color={"success"}>Active</Button>
            <Button onClick={onCompletedClickHandler} variant={filter === 'completed' ? "contained" : "outlined"}
                    color={"error"}>Completed</Button>
        </div>
    </div>
}


