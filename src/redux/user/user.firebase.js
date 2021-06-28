import firestore from '../../firebase/firebase.utils'


export const createUserProfileDocument = async (userAuth, managerName) => {
    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const {email} = userAuth;
    const createdAt = new Date();
    try {
        await userRef.set({
            email,
            createdAt,
            managerName,
            restaurantName: null
        });
    } catch (error) {
        console.log('error creating user', error.message);
    }

    return userRef;
};