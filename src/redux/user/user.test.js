import Parse from "../../backend/parse.utils";
import INITIAL_STATE from "./user.state";
import {setRestaurantNameStart, signInStart, signInSuccess, signOutStart, signUpStart} from "./user.actions";
import {onSetRestaurantNameStart, onSignInStart, onSignOutStart, onSignUpStart} from "./user.sagas";
import {testSaga} from "../../tests/tests.utils";
import userReducer from "./user.reducer";

const mockUser = {
    email: 'testUser@eatbnb.com',
    managerName: 'Test User'
};
const mockUserPassword = 'password';

const signUpMockUser = async () => {
    const user = new Parse.User();
    user.set("username", mockUser.email);
    user.set("password", mockUserPassword);
    user.set("email", mockUser.email);
    user.set("managerName", mockUser.managerName);

    await user.signUp();
};
const cleanMockUser = async () => {
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

const signInUser = async () => {
    await Parse.User.logIn(mockUser.email, mockUserPassword);
};

const signOutUser = async () => {
    await Parse.User.logOut();
};

describe('sign up user tests', () => {
    beforeAll(cleanMockUser);
    afterAll(cleanMockUser);

    it('sign up saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, signUpStart(mockUser.email, mockUserPassword, mockUser.managerName), onSignUpStart());

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.id).toBeTruthy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
        expect(finalState.currentUser.restaurantName).toBeFalsy();
        expect(finalState.currentUser.emailVerified).toBeFalsy();
    });
});

describe('logged out user tests', () => {
    beforeAll(signUpMockUser);
    afterAll(cleanMockUser);
    beforeEach(signOutUser);

    it('sign in saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, signInStart(mockUser.email, mockUserPassword), onSignInStart());

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.id).toBeTruthy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
    });
    it('invalid sign in saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, signInStart(mockUser.email, 'wrong password'), onSignInStart());

        expect(Parse.User.current()).toBeFalsy();
        expect(finalState.error).toBeTruthy();
    });
});

describe('logged in user tests', () => {
    beforeAll(signUpMockUser);
    afterAll(cleanMockUser);
    beforeEach(signInUser);
    afterEach(signOutUser);

    it('sign out saga', async () => {
        const {finalState} = await testSaga(userReducer(INITIAL_STATE, signInSuccess(mockUser)), signOutStart(), onSignOutStart());

        expect(Parse.User.current()).toBeFalsy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser).toBeFalsy();
    });
    it('set restaurant name', async () => {
        const {finalState} = await testSaga(userReducer(INITIAL_STATE, signInSuccess(mockUser)),
            setRestaurantNameStart('Test Restaurant'), onSetRestaurantNameStart());

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
        expect(finalState.currentUser.restaurantName).toEqual('Test Restaurant');
    });
});