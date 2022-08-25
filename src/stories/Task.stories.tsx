import React, {ChangeEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {AddItemForm} from "../AddItemForm";
import {action} from "@storybook/addon-actions";
import {Task} from "../Task";
import {TaskType} from "../Todolist";

export default {
    title: 'TODOLIST/TaskStory',
    component: Task,
    args:{
        // removeTask: action('changeRemoveTask'),
        // changeTaskStatus: action('changeTaskStatus'),
        // changeTaskTitle: action('changeTaskTitle'),
    }

} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) =>{
  const [task,setTask]=useState({id: 'ewe', title: 'HTML', isDone: true})

    const changeTaskStatus=()=>setTask({id: 'ewe', title: 'HTML', isDone: !task.isDone})
    const changeTaskTitle=(id:string,title:string)=>setTask({id: id, title:title, isDone: task.isDone})

    return(
        <Task task={task} removeTask={action('changeRemoveTask')} changeTaskStatus={changeTaskStatus} changeTaskTitle={changeTaskTitle}/>
    )
}
export const TaskStory = Template.bind({});
TaskStory.args={}




// export const TaskIsDoneStory = Template.bind({});
// TaskIsDoneStory.args = {
//     task: {id: 'ewe', title: 'HTML', isDone: true},
//
// };
//
// export const TaskIsNotDoneStory = Template.bind({});
// TaskIsNotDoneStory.args = {
//     task: {id: 'ewesf', title: 'CSS', isDone: false},
// };
