import { Profile } from "./profileData";
import { WdsfProfile } from "./wdsfData";

export interface User {
    name: string | null,
    firstLoad: boolean,
    firebaseId: string,
    photoUrl: string | null,
    cstsIdt: number | null,
    email: string | null,
    wdsfId: number | null,
    followingCstsIdts: number[],
    followingWdsfIds: number[],
    followingByUid: string[],
    followingUid: string[],
    lastLogin: number,
    created: number
}

export function createNewUser(newUser: firebase.User, displayName: string|null, cstsIdt: number | null, wdsfId: number | null): User {
    return {
        firstLoad: true,
        email: newUser.email,
        name: displayName || newUser.displayName ,
        firebaseId: newUser.uid,
        photoUrl: newUser.photoURL,
        cstsIdt: cstsIdt,
        wdsfId: wdsfId,
        followingCstsIdts: [],
        followingWdsfIds: [],
        followingByUid: [],
        followingUid: [],
        lastLogin: Date.now(),
        created: Date.now()
    }
}