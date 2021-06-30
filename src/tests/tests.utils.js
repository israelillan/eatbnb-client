import {runSaga} from "redux-saga";
import userReducer from "../redux/user/user.reducer";
import Parse from "../backend/parse.utils";

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

export const mockUser = {
    email: 'testUser@eatbnb.com',
    managerName: 'Test User'
};
export const mockUserPassword = 'password';

export const signUpMockUser = async () => {
    const user = new Parse.User();
    user.set("username", mockUser.email);
    user.set("password", mockUserPassword);
    user.set("email", mockUser.email);
    user.set("managerName", mockUser.managerName);

    await user.signUp();
};

export const cleanMockUser = async () => {
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

export const signInUser = async () => {
    await Parse.User.logIn(mockUser.email, mockUserPassword);
};

export const signOutUser = async () => {
    await Parse.User.logOut();
};

jest.setTimeout(20000)
