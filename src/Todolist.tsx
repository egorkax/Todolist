import React, {ChangeEvent, memo, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task";
import {TaskWithRedux} from "./TaskWithRedux";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo(({
                                  id,
                                  title,
                                  tasks,
                                  removeTask,
                                  changeFilter,
                                  addTask,
                                  changeTaskStatus,
                                  removeTodolist,
                                  changeTodolistTitle,
                                  filter,
                                  changeTaskTitle,
                              }: PropsType) => {


        console.log('todolist render')

        const addTask1 = useCallback((title: string) => {
            addTask(title, id);
        }, [id, addTask])

        const removeTodolist1 = () => {
            removeTodolist(id);
        }
        const changeTodolistTitle1 = (title: string) => {
            changeTodolistTitle(id, title);
        }

        const onAllClickHandler = () => changeFilter("all", id);
        const onActiveClickHandler = () => changeFilter("active", id);
        const onCompletedClickHandler = () => changeFilter("completed", id);

        let tasksForTodolist = tasks;
        if (filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
        }
        if (filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
        }

        const removeTask1 = useCallback((taskID: string) => removeTask(taskID, id), [removeTask, id])
        const changeTaskStatus1 = useCallback((taskID: string, status: boolean) => {
            changeTaskStatus(taskID, status, id);
        }, [changeTaskStatus, id])
        const changeTaskTitle1 = useCallback((taskID: string, title: string) => {
            changeTaskTitle(taskID, title, id);
        }, [changeTaskTitle, id])




        return <div>
            <h3><EditableSpan value={title} onChange={changeTodolistTitle1}/>
                <IconButton onClick={removeTodolist1}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask1}/>
            <div>
                {
                    tasksForTodolist.map(t => {

                        return <TaskWithRedux key={t.id} task={t} todolistID={id}/>
                    })
                }
            </div>
            <div style={{paddingTop: "10px"}}>
                <Button variant={filter === 'all' ? 'outlined' : 'text'}
                        onClick={onAllClickHandler}
                        color={'success'}>All
                </Button>
                <Button variant={filter === 'active' ? 'outlined' : 'text'}
                        onClick={onActiveClickHandler}
                        color={'primary'}>Active
                </Button>
                <Button variant={filter === 'completed' ? 'outlined' : 'text'}
                        onClick={onCompletedClickHandler}
                        color={'secondary'}>Completed
                </Button>
            </div>
        </div>
    }
)


