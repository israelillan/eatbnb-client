import Parse from "../../backend/parse.utils";
import INITIAL_STATE from "./user.state";
import {onSignUpStart} from "./user.sagas";
import {signUpStart} from "./user.actions";
import {testSaga} from "../../tests/tests.utils";

const mockUser = {
    email: 'testUser@eatbnb.com',
    managerName: 'Test User',
    password: 'password'
};

const cleanMockUser = async () => {
    try {
        await Parse.User.logIn(mockUser.email, mockUser.password);
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
        const {finalState} = await testSaga(INITIAL_STATE, signUpStart(mockUser.email, mockUser.password, mockUser.managerName), onSignUpStart())

        expect(Parse.User.current()).toBeTruthy();
        expect(finalState.error).toBeFalsy();
        expect(finalState.currentUser.id).toBeTruthy();
        expect(finalState.currentUser.email).toEqual(mockUser.email);
        expect(finalState.currentUser.managerName).toEqual(mockUser.managerName);
        expect(finalState.currentUser.restaurantName).toBeFalsy();
        expect(finalState.currentUser.emailVerified).toBeFalsy();
    });
    it('logout saga', async () => {
    });
})