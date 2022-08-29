import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let startState: InitialStateType;
beforeEach(() => {
    startState = {
        error: null,
        status: "idle"
    };
});

test('correct error should be set', () => {

    const endState = appReducer(startState, setAppErrorAC('new error'))

    expect(endState.error).toBe('new error');
    expect(startState.error).toBe(null);

});

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatusAC('succeeded'))

    expect(endState.status).toBe('succeeded');
    expect(startState.status).toBe('idle');

});