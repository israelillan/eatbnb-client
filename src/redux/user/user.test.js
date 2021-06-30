import Parse from "../../backend/parse.utils";
import INITIAL_STATE from "./user.state";
import {setRestaurantNameStart, signInStart, signInSuccess, signOutStart, signUpStart} from "./user.actions";
import {onSetRestaurantNameStart, onSignInStart, onSignOutStart, onSignUpStart} from "./user.sagas";
import {
    cleanMockUser,
    mockUser,
    mockUserPassword, signInUser,
    signOutUser,
    signUpMockUser,
    testSaga
} from "../../tests/tests.utils";
import userReducer from "./user.reducer";

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