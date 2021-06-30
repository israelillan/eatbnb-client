import Parse from "../../backend/parse.utils";
import INITIAL_STATE from "./user.state";
import {signUpStart, logoutStart} from "./user.actions";
import {onSignUpStart, onLogoutStarg, onLogoutStart} from "./user.sagas";
import {testSaga} from "../../tests/tests.utils";

const mockUser = {
    email: 'testUser@eatbnb.com',
    managerName: 'Test User'
};

const cleanMockUser = async () => {
    try {
        await Parse.User.logIn(mockUser.email, 'password');
    } catch (e) {
        if (e.code !== 101) {
            throw e;
        }
    }

    if (Parse.User.current()) {
        await Parse.User.current().destroy();
    }
};

describe('user', () => {
    beforeAll(cleanMockUser);
    afterAll(cleanMockUser);

    it('sign up saga', async () => {
        const {finalState} = await testSaga(INITIAL_STATE, signUpStart(mockUser.email, 'password', mockUser.managerName), onSignUpStart());

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.id).toBeTruthy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
        expect(finalState.currentUser.restaurantName).toBeFalsy();
        expect(finalState.currentUser.emailVerified).toBeFalsy();
    });
    it('logout saga', async () => {
        const {finalState} = await testSaga({
            error: null,
            currentUser: mockUser
        }, logoutStart(), onLogoutStart());

        expect(Parse.User.current()).toBeFalsy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser).toBeFalsy();
    });
})