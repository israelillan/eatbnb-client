import Parse from "../../backend/parse.utils";
import INITIAL_STATE from "./user.state";
import {setRestaurantNameStart, signInStart, signInSuccess, signOutStart, signUpStart} from "./user.actions";
import {onSetRestaurantNameStart, onSignInStart, onSignOutStart, onSignUpStart} from "./user.sagas";
import {
    cleanMockUser,
    mockUserPassword, signInMockUser,
    signOutMockUser,
    signUpMockUser,
    testSaga
} from "../../tests/tests.utils";
import userReducer from "./user.reducer";

describe('sign up user tests', () => {
    const mockUser = {
        email: 'testUser_1@eatbnb.com',
        managerName: 'Test User'
    };


    beforeAll(async () => await cleanMockUser(mockUser));
    afterAll(async () => await cleanMockUser(mockUser));

    it('sign up saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, userReducer, signUpStart(mockUser.email, mockUserPassword, mockUser.managerName), onSignUpStart());

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
    const mockUser = {
        email: 'testUser_2@eatbnb.com',
        managerName: 'Test User'
    };

    beforeAll(async () => await signUpMockUser(mockUser));
    afterAll(async () => await cleanMockUser(mockUser));
    beforeEach(signOutMockUser);

    it('sign in saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, userReducer, signInStart(mockUser.email, mockUserPassword), onSignInStart());

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.id).toBeTruthy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
    });
    it('invalid sign in saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, userReducer, signInStart(mockUser.email, 'wrong password'), onSignInStart());

        expect(Parse.User.current()).toBeFalsy();
        expect(finalState.error).toBeTruthy();
    });
});

describe('logged in user tests', () => {
    const mockUser = {
        email: 'testUser_4@eatbnb.com',
        managerName: 'Test User'
    };

    beforeAll(async () => await signUpMockUser(mockUser));
    afterAll(async () => await cleanMockUser(mockUser));
    beforeEach(async () => await signInMockUser(mockUser));
    afterEach(signOutMockUser);

    it('sign out saga', async () => {
        const {finalState} = await testSaga(userReducer(INITIAL_STATE, signInSuccess(mockUser)), userReducer, signOutStart(), onSignOutStart());

        expect(Parse.User.current()).toBeFalsy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser).toBeFalsy();
    });
    it('set restaurant name', async () => {
        const {finalState} = await testSaga(userReducer(INITIAL_STATE, signInSuccess(mockUser)), userReducer,
            setRestaurantNameStart('Test Restaurant'), onSetRestaurantNameStart());

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
        expect(finalState.currentUser.restaurantName).toEqual('Test Restaurant');
    });
});