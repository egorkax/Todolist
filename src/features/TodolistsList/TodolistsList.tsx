import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType, useAction} from "../../app/store";
import {
    FilterValuesType,
    TodolistDomainType,
} from "./todolists-reducer";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../app/App";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Login/selectors";
import {todolistAction} from "./index";

export const TodolistsList: React.FC = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const {addTodolistTC, fetchTodolistsTC,} = useAction(todolistAction)


    useEffect(() => {
        if (!isLoggedIn) return
        fetchTodolistsTC()

    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodolistTC(title)
    }, [])
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
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>

    )

}