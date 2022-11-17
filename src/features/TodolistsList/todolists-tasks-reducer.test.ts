import {addTodolistTC, TodolistDomainType, todolistsReducer} from './todolists-reducer';
import {tasksReducer} from './tasks-reducer';
import {TasksStateType} from "../../app/App";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];
    let todolist = {
        id: 'todolistId1',
        title: 'newTodolistTitle',
        addedDate: '',
        order: 0
    }
    const action = addTodolistTC.fulfilled({todolist}, '', todolist.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;


    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
