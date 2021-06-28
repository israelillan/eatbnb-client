import {takeLatest, put, call} from 'redux-saga/effects';

import {onSignUpStart, signUp, onSignUpSuccess, signInAfterSignUp} from "./user.sagas";
import UserActionTypes from "./user.actions.types";
import {auth} from "../../firebase/firebase.utils";
import {signUpFailure, signUpStart, signUpSuccess} from "./user.actions";
import userReducer from "./user.reducer";
import INITIAL_STATE from "./user.state";
import {createUserProfileDocument} from "./user.firebase";

describe('user signup', () => {
    it('initial state', () => {
        expect(userReducer(undefined, {})).toEqual(INITIAL_STATE)
    });

    const mockUser = {
        email: 'testUser@eatbnb.com',
        managerName: 'Test User',
        password: 'password'
    }
    const signUpAction = signUpStart(mockUser.email, mockUser.password, mockUser.managerName)
    it('start SIGN_UP_START action', () => {
        expect(signUpAction).toEqual({
            type: UserActionTypes.SIGN_UP_START,
            payload: mockUser
        });
    });
    it('trigger signUp on SIGN_UP_START', () => {
        const generator = onSignUpStart();
        expect(generator.next().value).toEqual(
            takeLatest(signUpAction.type, signUp)
        );
    });
    it('call auth.createUserWithEmailAndPassword', () => {
        const generator = signUp(signUpAction);
        const mockCreateUserWithEmailAndPassword = jest.spyOn(
            auth,
            'createUserWithEmailAndPassword'
        );
        generator.next();
        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(mockUser.email, mockUser.password);
    });
    it('do not set current user on sign up success', () => {
        expect(userReducer(INITIAL_STATE, signUpSuccess(mockUser))).toEqual({
            currentUser: null,
            error: null
        })
    });
    it('trigger sign in after SIGN_UP_SUCCESS', () => {
        const generator = onSignUpSuccess();
        expect(generator.next().value).toEqual(
            takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp)
        );
    });
    it('trigger get snapshot from user authentication', () => {
        const generator = signInAfterSignUp({
            payload: {
                user: {email: mockUser.email},
                managerName: mockUser.managerName
            }
        });
        expect(generator.next().value).toEqual(
            createUserProfileDocument({ email: mockUser.email}, mockUser.managerName)
        );
    });
    it('set error on sign up failure', () => {
        const mockError = {
            message: 'errored',
            code: 404
        }
        expect(userReducer(undefined, signUpFailure(mockError))).toEqual({
            currentUser: null,
            error: mockError
        })
    });
});