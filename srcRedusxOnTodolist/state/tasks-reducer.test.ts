import {v1} from "uuid";
import {TasksStateType} from "../App";
import {addTaskAC, changeStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";
import {addTodolistAc} from "./todolists-reducer";

let startState:TasksStateType


beforeEach(()=>{
     startState={
        'todolistId1': [
            {id: '1', title: "HTML&CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "TS", isDone: true}
        ],
        'todolistId2': [
            {id: '1', title: "Milk", isDone: true},
            {id: '2', title: "React Book", isDone: true},
            {id: '3', title: "React", isDone: true}
        ]
    };
})


test('task should be removed',()=>{

    const action=removeTaskAC('todolistId2','2')
    let endState=tasksReducer(startState,action)

    expect(endState['todolistId2'].length).toBe(2)
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][1].title).toBe('JS')
    expect(endState['todolistId2'][1].title).toBe('React')
})

test('task should be add',()=>{

    const action=addTaskAC('todolistId1','yoyoyo')
    const endState=tasksReducer(startState,action)

    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId1'].length).toBe(4)
    expect(endState['todolistId1'][0].title).toBe('yoyoyo')
    expect(endState['todolistId2'][0].title).toBe('Milk')
})

test('task issDone cheked',()=>{

    const action=changeStatusAC('todolistId1','2',false)
    const endState=tasksReducer(startState,action)

    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][1].isDone).toBe(false)
    expect(endState['todolistId2'][1].isDone).toBe(true)
})

test('task title checked',()=>{

    const action=changeTaskTitleAC('todolistId2','3','yoyoyo')
    const endState=tasksReducer(startState,action)

    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][2].title).toBe("TS")
    expect(endState['todolistId2'][2].title).toBe('yoyoyo')
})

test('new array should be added when new todolist is added', () => {


    const action = addTodolistAc("new todolist");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});