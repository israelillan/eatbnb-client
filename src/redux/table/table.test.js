import {cleanMockUser, signOutUser, signUpMockUser} from "../../tests/tests.utils";

describe('logged out table tests', () => {
    beforeEach(signOutUser);

    it('cannot create a table', async () => {

    });
});

// describe('signed it table tests', () => {
//     beforeAll(signUpMockUser);
//     afterAll(cleanMockUser);
//
//     it('create a table', async () => {
//
//     });
//     it('cannot read other user\'s tables', async => {
//
//     });
//     it('cannot modify other user\'s tables', async => {
//
//     });
//     it('cannot delete other user\'s tables', async => {
//
//     });
//     it('cannot create a table outside the layout (-1,0)', async => {
//
//     });
//     it('cannot create a table outside the layout (0,-1)', async => {
//
//     });
//     it('cannot create a table outside the layout (15,0)', async => {
//
//     });
//     it('cannot create a table outside the layout (0,10)', async => {
//
//     });
// });
// 'cannot create a table where another already exists'
// 'cannot move a table where another already exists'
// 'table seats must be > 0'
// 'clear tables on user logout'