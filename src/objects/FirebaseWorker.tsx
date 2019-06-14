import firebase from 'firebase/app';
import '@firebase/firestore'
import '@firebase/storage'
import firebaseConfig from '../config/firebase';
import { User, createNewUser } from './firebaseUser';
import { Profile } from './profileData';
import { WdsfProfile } from './wdsfData';
import { QueryDocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types';

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
    if (!querySnapshot.empty)
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            return doc.data();
        });
    return undefined;
}

async function getWdsfDataByIdt(wdsfData: number): Promise<User | undefined> {
    var querySnapshot = await db.collection("users").where("wdsfId", "==", wdsfData).get();
    if (!querySnapshot.empty)
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
            return doc.data();
        });
    return undefined;
}
async function toggleCSTSFavorites(cstsIdt: number) {
    var cdata = firebase.auth().currentUser;
    if (cdata) {
        const userRef = db.collection("users").doc(cdata.uid);

        db.runTransaction(transaction => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(userRef).then(doc => {
                var data = doc.data() as User;
                if (data.followingCstsIdts) {
                    transaction.update(userRef, {
                        followingCstsIdts: [cstsIdt]
                    });
                } else {
                    var bookings = data.followingCstsIdts as number[];
                    if (bookings.includes(cstsIdt)) {
                        bookings = bookings.filter(x => x != cstsIdt);
                    } else
                        bookings.push(cstsIdt);
                    transaction.update(userRef, { followingCstsIdts: bookings });
                }
            });
        }).then(function () {
            console.log("Transaction successfully committed!");
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
        });
    }
}
async function toggleWDSFFavorites(wdsfId: number) {
    var cdata = firebase.auth().currentUser;
    if (cdata) {
        const userRef = db.collection("users").doc(cdata.uid);

        db.runTransaction(transaction => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(userRef).then(doc => {
                var data = doc.data() as User;
                if (data.followingWdsfIds) {
                    transaction.update(userRef, {
                        followingWdsfIds: [wdsfId]
                    });
                } else {
                    var bookings = data.followingWdsfIds as number[];
                    if (bookings.includes(wdsfId)) {
                        bookings = bookings.filter(x => x != wdsfId);
                    } else
                        bookings.push(wdsfId);
                    transaction.update(userRef, { followingWdsfIds: bookings });
                }
            });
        }).then(function () {
            console.log("Transaction successfully committed!");
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
        });

    }
}


const FirebaseWorker = {
    toggleWDSFFavorites,
    getCstsDataByIdt,
    toggleCSTSFavorites,
    registerUser,
    uploadImage,
    getWdsfDataByIdt,
    loginUser,
    getUserData,
    updateCSTSProfile,
    updateWDSFProfile
};

export default FirebaseWorker