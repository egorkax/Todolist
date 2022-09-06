import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let startState: InitialStateType;
beforeEach(() => {
    startState = {
        error: null,
        status: "idle",
        isInitialized: true
    };
});

test('correct error should be set', () => {

    const endState = appReducer(startState, setAppErrorAC({error: 'new error'}))

    expect(endState.error).toBe('new error');
    expect(startState.error).toBe(null);

});

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatusAC({status: 'succeeded'}))

    expect(endState.status).toBe('succeeded');
    expect(startState.status).toBe('idle');

});