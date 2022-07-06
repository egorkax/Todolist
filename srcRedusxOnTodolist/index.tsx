import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import AppWithReducers from "./AppWithReducers";
import AppWithRedux from "./AppWithRedux";
import {Provider} from "react-redux";
import {store} from "./state/store";

ReactDOM.render(
    <Provider store={store}>
        <AppWithRedux/>
    </Provider>,
document.getElementById('root')
)
;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// import React, {useState} from 'react'
// import ReactDOM from 'react-dom'
//
// export const TempManager = () => {
//     const [temp, setTemp] = useState(2)
//     const [seconds, setSeconds] = useState(0)
//
//     const resetTemp = () => setTemp(0)
//     const increaseSeconds = () => setSeconds(seconds + 100)
//
//     return (
//         <>
//             <TempDisplay temp={temp} reset={resetTemp}/>
//             <div>
//                 <p><b>Секунды:</b> {seconds} с</p>
//                 <button onClick={increaseSeconds}>
//                     Увеличить время на 100 секунд
//                 </button>
//             </div>
//         </>
//     )
// }
//
// const TempDisplay = React.memo((props: any) => {
//     console.log('Render TempDisplay')
//     return (
//         <div>
//             <p><b>Температура</b>: {props.temp} &#176;</p>
//             <button onClick={props.reset}>Reset</button>
//         </div>
//     )
// })
//
// ReactDOM.render(<TempManager/>, document.getElementById('root'))


//При увеличении времени (при клике на button) компонент TempDisplay
//тоже перерисовывается. Эта перерисовка является избыточной.
//Найдите в чем причина лишних перерисовок.
//Исправленную версию строки напишите в качестве ответа.

//Пример ответа: const increaseSeconds = () => setSeconds(seconds + 100)


//
// import React, { useCallback, useState } from 'react'
// import ReactDOM from 'react-dom'
//
// export const App = () => {
//     const [temp, setTemp] = useState(100)
//     const [seconds, setSeconds] = useState(0)
//
//     const resetTemp = useCallback(() => setTemp(0), [])
//
//     const incSec = useCallback(() => setSeconds(seconds + 1), [])
//
//     return <>
//         <TempDisplay temp={temp} resetTemp={resetTemp}/>
//         <SecDisplay seconds={seconds} incSec={incSec}/>
//     </>
// }
// const TempDisplay = React.memo((props: any) => {
//     console.log('Render TempDisplay')
//     return (
//         <div style={{marginBottom: '10px'}} onClick={props.reset}>
//             <p>
//                 <b>Температура: </b>{props.temp} &#176;
//             </p>
//             <button onClick={props.resetTemp}>Сбросить температуру к 0</button>
//         </div>
//     )
// })
//
// const SecDisplay = React.memo((props: any) => {
//     console.log('Render SecDisplay')
//     return (
//         <div>
//             <p><b>Секунды:</b> {props.seconds} c </p>
//             <button style={{marginRight: '20px'}}
//                     onClick={props.incSec}>
//                 Увеличить время на 1 секунду
//             </button>
//         </div>
//     )
// })
//
// ReactDOM.render(<App/>, document.getElementById('root'))

// Почему не корректно работает счетчик времени при нажатии на кнопку (срабатывает только 1 раз) ?
// Найдите в чем причина.
// Исправленную версию строки напишите в качестве ответа

// Пример ответа: const incSec = () => setSeconds(seconds + 1)


// import React, { useState } from 'react'
// import ReactDOM from 'react-dom'
//
// export const App = () => {
//     const [temp, setTemp] = useState(10)
//     const [seconds, setSeconds] = useState(100)
//
//     const increaseSeconds = () => setSeconds(seconds + 10)
//     const increaseTemp = XXX
//
//     return <>
//         <TempDisplay temp={temp} increaseTemp={increaseTemp}/>
//
//         <div>
//             <b>Секунды :</b> {seconds} с
//             <button style={{marginLeft: '15px'}}
//                     onClick={increaseSeconds}>
//                 Увеличить на 10 секунд
//             </button>
//         </div>
//     </>
// }
// const TempDisplay = React.memo((props: any) => {
//     console.log('Render TempDisplay')
//     return (
//         <div style={{marginBottom: '15px'}}
//              onClick={props.reset}>
//             <b>Температура:</b> {props.temp} &#176;
//             <button style={{marginLeft: '15px'}}
//                     onClick={props.increaseTemp}>
//                 Увеличить температуру на 1 градус
//             </button>
//         </div>
//     )
// })
//
// ReactDOM.render(<App/>, document.getElementById('root'));

// Что надо написать вместо XXX для того, чтобы обязательно выполнялись 2 условия:
// 1) При нажатии на кнопку "Увеличить температуру на 1 градус" температура увеличивалась
// 2) Компонент TempDisplay не должен перерисовываться при нажатии на кнопку "Увеличить на 10 секунд"

// Пример ответа: useEffect(() => setCounter(count + 1), [count])


// import React, { useState } from 'react'
// import ReactDOM from 'react-dom'
//
// type ButtonType = {
//     id: number
//     title: string
//     forAdminOnly: boolean
// }
// const buttons: ButtonType[] = [
//     {id: 1, title: 'delete', forAdminOnly: true},
//     {id: 2, title: 'update', forAdminOnly: true},
//     {id: 3, title: 'create', forAdminOnly: false},
// ]
//
// export const App = ({isAdmin}: { isAdmin: boolean }) => {
//
//     const [seconds, setSeconds] = useState(0)
//
//     const increaseSeconds = () => setSeconds(seconds + 10)
//
//     const correctButtons = XXX(() => {
//         return buttons.filter(b => isAdmin ? true : !b.forAdminOnly)
//     }, [YYY])
//
//     return <>
//         <ButtonsPanel buttons={correctButtons}/>
//         <div>
//             <p>
//                 <b>Секунды: {seconds}</b>
//             </p>
//             <button onClick={increaseSeconds}>
//                 Увеличить на 10 секунд
//             </button>
//         </div>
//     </>
// }
//
// const ButtonsPanel = React.memo((props: { buttons: Array<ButtonType> }) => {
//     console.log('Render ButtonsPanel')
//     return (
//         <div style={{marginBottom: '15px'}}>
//             <div style={{marginBottom: '15px'}}>
//                 <b>Панель с кнопками</b>
//             </div>
//             <div>
//                 {props.buttons.map(b => <button key={b.id}>{b.title}</button>)}
//             </div>
//         </div>
//     )
// })
//
// ReactDOM.render(<App isAdmin={true}/>, document.getElementById('root'))

// Что нужно написать вместо XXX и YYY,
// чтобы избавиться от лишнего перерендера компонента ButtonsPanel
// при нажатии на кнопку "Увеличить на 10 секунд" ?

// Ответ дайте через пробел: 111 222

