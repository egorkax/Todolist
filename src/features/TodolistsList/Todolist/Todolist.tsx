import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {changeTodolistFilterAC, TodolistDomainType} from "../todolists-reducer";
import {useDispatch} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "../../../app/store";
import {AnyAction} from "redux";
import {addTask, fetchTasks} from "../tasks-saga-worker";
import {removeTodolist, updateTodolist} from "../todolists-saga-worker";


type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist = memo(({todolist, tasks,}: PropsType) => {

        const dispatch = useDispatch<ThunkDispatch<AppRootStateType, void, AnyAction>>()

        useEffect(() => {
            dispatch(fetchTasks(todolist.id))
        }, [])

        const addTask1 = useCallback((title: string) => {
            dispatch(addTask(todolist.id, title));
        }, [todolist.id])

        const removeTodolist1 = () => {
            dispatch(removeTodolist(todolist.id));
        }
        const changeTodolistTitle1 = (title: string) => {
            dispatch(updateTodolist(todolist.id, title))
        }

        const onAllClickHandler = () => dispatch(changeTodolistFilterAC(todolist.id, "all"));
        const onActiveClickHandler = () => dispatch(changeTodolistFilterAC(todolist.id, "active"));
        const onCompletedClickHandler = () => dispatch(changeTodolistFilterAC(todolist.id, "completed"));


        let tasksForTodolist = tasks;
        if (todolist.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
        }
        if (todolist.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
        }


        return <div>
            <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle1}/>
                <IconButton onClick={removeTodolist1} disabled={todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask1} disabled={todolist.entityStatus === 'loading'}/>
            <div>
                {
                    tasksForTodolist.map(t => {

                        return <Task key={t.id} task={t} todolistID={todolist.id}/>
                    })
                }
            </div>
            <div style={{paddingTop: "10px"}}>
                <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                        onClick={onAllClickHandler}
                        color={'success'}>All
                </Button>
                <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                        onClick={onActiveClickHandler}
                        color={'primary'}>Active
                </Button>
                <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                        onClick={onCompletedClickHandler}
                        color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    }
)


