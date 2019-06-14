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
    followingUid: string[]
}

export function createNewUser(newUser: firebase.User, displayName: string, cstsIdt: number | null, wdsfId: number | null): User {
    return {
        firstLoad: true,
        email: newUser.email,
        name: displayName,
        firebaseId: newUser.uid,
        photoUrl: newUser.photoURL,
        cstsIdt: cstsIdt,
        wdsfId: wdsfId,
        followingCstsIdts: [],
        followingWdsfIds: [],
        followingByUid: [],
        followingUid: []
    }
}