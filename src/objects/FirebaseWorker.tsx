import firebase from 'firebase/app';
import '@firebase/firestore'
import '@firebase/storage'
import firebaseConfig from '../config/firebase';
import { User, createNewUser } from './firebaseUser';
import { Profile } from './profileData';
import { WdsfProfile } from './wdsfData';
import {  QuerySnapshot } from '@firebase/firestore-types';
import { Platform } from 'react-native';
import * as Google from 'expo-google-app-auth';
import UserStore from '../strores/UserStore';

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage().ref();

async function uploadImage(uri: string, user: User): Promise<string> {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = storage.child("Images/" + user.cstsIdt + "/profile.jpg")

    const snapshot = await ref.put(blob);
    blob.close();
    var newUrl = await snapshot.ref.getDownloadURL();
    user.photoUrl = newUrl
    db.collection('users').doc(user.firebaseId).update(user);
    var currentUser = firebase.auth().currentUser;
    if (currentUser)
        currentUser.updateProfile({ photoURL: newUrl })
    return newUrl;
}


async function loginUser(email: string, password: string): Promise<string | undefined> {
    try {
        firebase.auth().signInWithEmailAndPassword(email, password).then(x => {
            if (x.user) updateLogin(x.user)
        });
    }
    catch (error) {
        return error.message;
    }
}

async function getUserData(fireuser: firebase.User): Promise<User> {
    var coll = db.collection('users').doc(fireuser.uid)
    coll.onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {
        console.log("snapshot", snapshot.exists);
        
        if (snapshot.exists) {
            var user = snapshot.data() as User;
            UserStore.setUser(user)
        }
        else {
            updateLogin(fireuser);
        }
    });
    var data = await coll.get();
    return data.data() as User;
}

function registerUser(name: string, surname: string, email: string, password: string, cstsIdt: number | null, wdsfId: number | null): void {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        if (user.user) {
            user.user.updateProfile({
                displayName: name + " " + surname
            })
            db.collection('users').doc(user.user.uid).set(createNewUser(user.user, name + " " + surname, cstsIdt, wdsfId));
        } else
            throw new Error("USER CANNOT BE CREATED");
    }).catch(err => {
        throw err;
    })
}

function updateCSTSProfile(profile: Profile) {
    var user = firebase.auth().currentUser;
    if (user)
        db.collection("users").doc(user.uid).update({
            cstsIdt: profile.IdtClena
        })
}

function updateWDSFProfile(profile: WdsfProfile) {
    var user = firebase.auth().currentUser;
    if (user)
        db.collection("users").doc(user.uid).update({
            wdsfId: profile.id
        })
}

async function getCstsDataByIdt(cstsIdt: number): Promise<User | undefined> {
    var querySnapshot = await db.collection("users").where("cstsIdt", "==", cstsIdt).get();

    return getUser(querySnapshot)
}

function getUser(querySnapshot:QuerySnapshot) {
    if (!querySnapshot.empty) {
        var max = querySnapshot.docs.reduce((prev, current) => {
            var prevD = prev.data() as User;
            var currD = current.data() as User;
            if (currD.lastLogin > prevD.lastLogin) {
                return current;
            } else {
                return prev;
            }
        });

        return max.data() as User;
    }
    else
        return undefined;
}

async function getWdsfDataByIdt(wdsfData: number): Promise<User | undefined> {
    var querySnapshot = await db.collection("users").where("wdsfId", "==", wdsfData).get();
    return getUser(querySnapshot);
}
async function updateCSTSFavorites(cstsIdt: number[]) {
    var cdata = firebase.auth().currentUser;
    if (cdata) {
        const userRef = db.collection("users").doc(cdata.uid);
        var data = userRef.update({followingCstsIdts: cstsIdt })
       data.then(x=> {
        
       }).catch(x=> {
           console.log("err", x);
           
       })
    }
}

async function updateWDSFFavorites(wdsfId: number[]) {
    var cdata = firebase.auth().currentUser;
    if (cdata) {
        const userRef = db.collection("users").doc(cdata.uid);
        var data = userRef.update({followingWdsfIds: wdsfId })
       data.then(x=> {
        
       }).catch(x=> {
           console.log("err", x);
           
       })
    }
}

function resetPass(email: string) {
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Email sent.
    }).catch(function (error) {
        // An error happened.
    });

}
async function loginGoogleUser() {
    try {
        const result = await Google.logInAsync({
            behavior: "web",
            clientId: Platform.OS === 'android' ? "590146774413-5mggdst0c2f3lvf66upn11oav95jn28u.apps.googleusercontent.com" : "590146774413-8pi07nhecjc2dp163djtptuqagsbo14r.apps.googleusercontent.com",
            androidClientId: "590146774413-u353107dp84kae851sdiao48m8pdvgkq.apps.googleusercontent.com",
            iosClientId: "590146774413-8pi07nhecjc2dp163djtptuqagsbo14r.apps.googleusercontent.com",
            scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
            onSignIn(result)
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
    } catch (e) {
        return { error: true };
    }
}
function isUserEqual(googleUser: any, firebaseUser: any) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

async function onSignIn(googleUser: any) {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            );
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).then(x => {
                if (x.user)
                    updateLogin(x.user)

            }).catch(function (error) {

            });
        }
    });
}

async function updateLogin(user: firebase.User) {
    var exist = await db.collection("users").doc(user.uid).get();
    if (exist.exists) {
        db.collection("users").doc(user.uid).update({ lastLogin: Date.now() })
    }
    else {
        db.collection("users").doc(user.uid).set(createNewUser(user, null, null, null));
    }
}

function setInitCompleted() {
    var user = firebase.auth().currentUser;
    if (user) {
        db.collection("users").doc(user.uid).update({ firstLoad: false })
    }
}

function logout() {
    console.log("signing out");
    firebase.auth().signOut();
    UserStore.signOut();
}

const FirebaseWorker = {
    updateWDSFFavorites,
    loginGoogleUser,
    getCstsDataByIdt,
    resetPass,
    registerUser,
    updateCSTSFavorites,
    uploadImage,
    getWdsfDataByIdt,
    setInitCompleted,
    loginUser,
    getUserData,
    updateCSTSProfile,
    logout,
    updateWDSFProfile
};

export default FirebaseWorker