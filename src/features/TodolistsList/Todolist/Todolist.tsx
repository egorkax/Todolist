import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {TodolistDomainType} from "../todolists-reducer";
import {useAction} from "../../../app/store";
import {tasksAction, todolistAction} from "../index";


type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

export const Todolist = memo(({todolist, tasks,}: PropsType) => {
        const {fetchTaskTC, addTaskTC} = useAction(tasksAction)
        const {removeTodolistTC, updateTitleTodolistTC, changeTodolistFilterAC} = useAction(todolistAction)

        useEffect(() => {
            fetchTaskTC(todolist.id)
        }, [])

        const addTask1 = useCallback((title: string) => {
            addTaskTC({title: title, todolistId: todolist.id});
        }, [todolist.id])

        const removeTodolist = () => {
            removeTodolistTC(todolist.id);
        }
        const changeTodolistTitle = (title: string) => {
            updateTitleTodolistTC({todolistId: todolist.id, title: title});
        }

        const onAllClickHandler = () => changeTodolistFilterAC({filter: "all", id: todolist.id});
        const onActiveClickHandler = () => changeTodolistFilterAC({filter: "active", id: todolist.id});
        const onCompletedClickHandler = () => changeTodolistFilterAC({filter: "completed", id: todolist.id});

        let tasksForTodolist = tasks;


        if (todolist.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
        }
        if (todolist.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
        }


        return <div>
            <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === 'loading'}>
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


