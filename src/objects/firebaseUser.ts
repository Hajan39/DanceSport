export interface User {
    name: string | null,
    firstLoad: boolean,
    firebaseId: string,
    photoUrl: string | null,
    cstsId: number | null,
    cstsIdt: number | null,
    email: string | null,
    wdsfId: string | null,
    followingCstsIdts: number[],
    followingCstsIds: number[],
    followingWdsfIds: string[],
}

export function createNewUser(newUser: firebase.User): User {
    return {
        firstLoad: true,
        email: newUser.email,
        name: newUser.displayName,
        firebaseId: newUser.uid,
        photoUrl: newUser.photoURL,
        cstsId: null,
        cstsIdt: null,
        wdsfId: null,
        followingCstsIds: [],
        followingCstsIdts: [],
        followingWdsfIds: []
    }
}