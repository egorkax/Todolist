import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    updateTitleTodolistTC
} from "./todolists-reducer";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {addTaskTC,} from "./tasks-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";
import {Navigate} from "react-router-dom";

export const TodolistsList: React.FC = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

    const dispatch = useDispatch<ThunkDispatch<AppRootStateType, void, AnyAction>>()


    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(fetchTodolistsTC())

    }, [])


    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskTC({todolistId, title}))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC({id: todolistId, filter: value});
        dispatch(action);
    }, [dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistTC(id));
    }, [dispatch])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(updateTitleTodolistTC({todolistId: id, title}));
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch])
    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolist={tl}
                                    tasks={tasks[tl.id]}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    removeTodolist={removeTodolist}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>

    )

}