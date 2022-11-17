import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {Login} from "../features/Login/Login";
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import {ThunkDispatch} from "redux-thunk";


import {AnyAction} from "redux";
import {logOutTC} from "../features/Login/auth-reducer";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


export function App() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

    const dispatch = useDispatch<ThunkDispatch<AppRootStateType, void, AnyAction>>()

    useEffect(() => {

        dispatch(initializeAppTC())
    }, [dispatch])

    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: "center", width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    const logOut = () => {
        dispatch(logOutTC())
    }
    return (
        <HashRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button onClick={logOut} color="inherit">LogOut</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress color="secondary"/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path="/" element={<TodolistsList/>}/>
                        <Route path="login" element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
        </HashRouter>
    );
}



