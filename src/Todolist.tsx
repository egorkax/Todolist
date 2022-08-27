import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TaskWithRedux} from "./TaskWithRedux";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {fetchTodolistsTC, FilterValuesType} from "./state/todolists-reducer";
import {useDispatch} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "./state/store";
import {AnyAction} from "redux";
import {fetchTaskTC} from "./state/tasks-reducer";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    // changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    // changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo(({
                                  id,
                                  title,
                                  tasks,
                                  changeFilter,
                                  addTask,
                                  removeTodolist,
                                  changeTodolistTitle,
                                  filter,
                              }: PropsType) => {


    const dispatch = useDispatch<ThunkDispatch<AppRootStateType, void, AnyAction>>()

    useEffect(() => {
        dispatch(fetchTaskTC(id))
    }, [])

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
            tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New);
        }
        if (filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
        }


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


