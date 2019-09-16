import firebase from 'firebase/app';
import '@firebase/firestore'
import '@firebase/storage'
import { User, createNewUser } from './firebaseUser';
import { Profile } from './profileData';
import { WdsfProfile } from './wdsfData';
import { QuerySnapshot } from '@firebase/firestore-types';
import UserStore from '../strores/UserStore';
import Login from '../functions/loginFunctions';

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
    Login.registerUserWithEmailAndPassword(name, surname, email, password).then(user => {
        db.collection('users').doc(user.uid).set(createNewUser(user, name + " " + surname, cstsIdt, wdsfId));
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

function getUser(querySnapshot: QuerySnapshot) {
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
        var data = userRef.update({ followingCstsIdts: cstsIdt })
        data.then(x => {

        }).catch(x => {
            console.log("err", x);

        })
    }
}

async function updateVisibility(visibility: {csts: boolean, wdsf: boolean}){
    var cdata = firebase.auth().currentUser;
    if (cdata) {
        const userRef = db.collection("users").doc(cdata.uid);
        var data = userRef.update({ interest: visibility })
    }
}

async function updateWDSFFavorites(wdsfId: number[]) {
    var cdata = firebase.auth().currentUser;
    if (cdata) {
        const userRef = db.collection("users").doc(cdata.uid);
        var data = userRef.update({ followingWdsfIds: wdsfId })
        data.then(x => {

        }).catch(x => {
            console.log("err", x);

        })
    }
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
    UserStore.signOut();
}


// -------------- WDSF -------------- \\

const FirebaseWorker = {
    updateWDSFFavorites,
    getCstsDataByIdt,
    updateLogin,
    registerUser,
    updateCSTSFavorites,
    uploadImage,
    getWdsfDataByIdt,
    updateVisibility,
    setInitCompleted,
    getUserData,
    updateCSTSProfile,
    logout,
    updateWDSFProfile
};

export default FirebaseWorker