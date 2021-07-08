import {signOutMockUser} from "../../tests/tests.utils";

describe('logged out reservation tests', () => {
    beforeEach(signOutMockUser);

    it('cannot create a reservation', () => {
        //
    });
});
describe('signed it reservation tests', () => {
    it('create a table', () => {
    });
    it('creating a table must be at the beginning of the hour', () => {
        //
    });
    it('update a reservation', () => {
    });
    it('updating  a table must be at the beginning of the hour', () => {
        //
    });
    it('delete a reservation', () => {
    });
    it('clear reservations on sign out', () => {
    });
    it('read reservations', () => {
    });
    it('read reservation in the future', () => {
    });
    it('read reservation in the past', () => {
    });
    it('table must exist', () => {
    });
    it('cannot create a reservation in the same table at the same time', () => {
        //
    });
    it('cannot move a reservation in the same table at the same time', () => {
        //
    });
});
describe('signed it reservation tests against other user', () => {
    it('cannot create reservation for other user\'s table', () =>{
        //
    });
    it('cannot list reservations for other user\'s table', () =>{
    });
    it('cannot modify other user\'s reservations', () =>{
    });
    it('cannot delete other user\'s reservations', () =>{
    });
});
