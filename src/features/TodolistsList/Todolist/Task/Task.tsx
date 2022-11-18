import React, {ChangeEvent, memo} from "react";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";
import {useAction} from "../../../../app/store";
import {tasksAction} from "../../index";

type TaskPropsType = {
    task: TaskType
    todolistID: string
}
export const Task = memo(({
                              task,
                              todolistID
                          }: TaskPropsType) => {

    const {removeTaskTC, updateTaskTC} = useAction(tasksAction)

    const onClickHandler = () => {
        removeTaskTC({todolistId: todolistID, taskId: task.id})
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        updateTaskTC({todolistId: todolistID, taskId: task.id, model: {status}})
    }
    const onTitleChangeHandler = (newValue: string) => {
        updateTaskTC({todolistId: todolistID, taskId: task.id, model: {title: newValue}})
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