import firebase, { User } from 'firebase/app';
import firebaseConfig from '../config/firebase';
import '@firebase/firestore'
import * as Google from 'expo-google-app-auth';
import googleLoginConfig from '../config/google';

firebase.initializeApp(firebaseConfig);

async function loginUserWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(x => {
            return x.user;
        });
    }
    catch (error) {
        return error.message;
    }
}

function registerUserWithEmailAndPassword(name: string, surname: string, email: string, password: string): Promise<firebase.User> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        if (user.user) {
            user.user.updateProfile({
                displayName: name + " " + surname
            })
            return user.user;
        } else
            throw new Error("USER CANNOT BE CREATED");
    }).catch(err => {
        throw err;
    })
}
function resetPass(email: string) {
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Email sent.
    }).catch(function (error) {
        // An error happened.
    });

}


async function loginGoogleUser(onSignUser?: (user: User) => void) {
    const result = await Google.logInAsync(googleLoginConfig);

    if (result.type === 'success') {
        onSignIn(result, onSignUser)
        return { token: result.accessToken, success: true };
    } else {
        return { success: false };
    }
}

async function onSignIn(googleUser: any, onSignUser?: (user: User) => void): Promise<void> {
    var credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
    );
    // Sign in with credential from the Google user.
    return firebase.auth().signInWithCredential(credential).then(x => {
        if (x.user && onSignUser) {        
            onSignUser(x.user)
        }
    }
    ).catch(function (error) {
        throw error;
    });
    ;
}

async function signOut() {
    return firebase.auth().signOut();
}

const Login = {
    onSignIn,
    loginGoogleUser,
    loginUserWithEmailAndPassword,
    registerUserWithEmailAndPassword,
    resetPass,
    signOut
}

export default Login;