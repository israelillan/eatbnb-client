import {runSaga} from "redux-saga";
import userReducer from "../redux/user/user.reducer";

export const testSaga = async (initialState, startActionData, generator) => {
    const generatorReturn = generator.next().value;
    const actionsDispatched = [];
    await runSaga({
        dispatch: (action) => {
            actionsDispatched.push(action)
        },
        getState: () => initialState,
    }, generatorReturn.payload.args[1], startActionData).toPromise();

    let finalState = initialState;
    actionsDispatched.forEach(action => {
        finalState = userReducer(initialState, action);
    })

    return {actionsDispatched, finalState};
}

