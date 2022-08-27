import React, {ChangeEvent, memo} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import {removeTaskTC, updateTaskTC} from "./state/tasks-reducer";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "./state/store";
import {AnyAction} from "redux";

type TaskPropsType = {
    task: TaskType
    todolistID: string
}
export const TaskWithRedux = memo(({
                                       task,
                                       todolistID
                                   }: TaskPropsType) => {

    const dispatch = useDispatch<ThunkDispatch<AppRootStateType, void, AnyAction>>()

    const onClickHandler = () => {
        dispatch(removeTaskTC(todolistID, task.id))
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTaskTC(todolistID, task.id, {status}))
    }
    const onTitleChangeHandler = (newValue: string) => {
        dispatch(updateTaskTC(todolistID, task.id, {title: newValue}))
    }

    console.log('task render')

    return (
        <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
            <IconButton onClick={onClickHandler}>
                <Delete/>
            </IconButton>
        </div>
    )
})