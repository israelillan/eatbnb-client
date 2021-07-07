import {runSaga} from "redux-saga";
import Parse from "../backend/parse.utils";

export const testSaga = async (initialState, reducer, startActionData, generator) => {
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
        finalState = reducer(initialState, action);
    })

    return {actionsDispatched, finalState};
}

export const mockUserPassword = 'password';

export const signUpMockUser = async (mockUser) => {
    const user = new Parse.User();
    user.set("username", mockUser.email);
    user.set("password", mockUserPassword);
    user.set("email", mockUser.email);
    user.set("managerName", mockUser.managerName);

    await user.signUp();
};

export const cleanMockUser = async (mockUser) => {
    try {
        await Parse.User.logIn(mockUser.email, mockUserPassword);
    } catch (e) {
        if (e.code !== 101) {
            throw e;
        }
    }

    if (Parse.User.current()) {
        await Parse.User.current().destroy();
    }
};

export const signInMockUser = async (mockUser) => {
    await Parse.User.logIn(mockUser.email, mockUserPassword);
};

export const signOutMockUser = async () => {
    await Parse.User.logOut();
};

jest.setTimeout(300 * 1000)
