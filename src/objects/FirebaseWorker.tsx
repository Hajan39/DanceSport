import firebase from 'firebase/app';
import '@firebase/firestore'
import '@firebase/storage'
import firebaseConfig from '../config/firebase';
import { User, createNewUser } from './firebaseUser';
import { Profile } from './profileData';
import { WdsfProfile } from './wdsfData';

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
        firebase.auth().signInWithEmailAndPassword(email, password);
    }
    catch (error) {
        return error.message;
    }
}

async function getUserData(user: firebase.User): Promise<User> {
    var x = await db.collection('users').doc(user.uid).get();
    return x.data() as User
}

function registerUser(name: string, surname: string, email: string, password: string): void {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
        if (user.user) {
            user.user.updateProfile({
                displayName: name + " " + surname
            })
            var newUser = user.user;
            newUser.displayName = name + " " + surname;
            db.collection('users').doc(user.user.uid).set(createNewUser(newUser));
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

const FirebaseWorker = {
    registerUser,
    uploadImage,
    loginUser,
    getUserData,
    updateCSTSProfile,
    updateWDSFProfile
};

export default FirebaseWorker