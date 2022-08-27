import React, {useState} from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {Task} from "../Task";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

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
  const [task,setTask]=useState({id: 'ewe', title: 'HTML', status: TaskStatuses.New,
      todoListId: "todolistId2", description: '',
      startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low})

    // const changeTaskStatus=()=>setTask({id: 'ewe', title: 'HTML', status: TaskStatuses.Completed})
    // const changeTaskTitle=(id:string,title:string)=>setTask({id: id, title:title, isDone: task.isDone})

    return(
        <div></div>
        // <Task task={task} removeTask={action('changeRemoveTask')} changeTaskStatus={changeTaskStatus} changeTaskTitle={changeTaskTitle}/>
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
