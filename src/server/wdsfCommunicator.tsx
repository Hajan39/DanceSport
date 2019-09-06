import React, { Component } from 'react';
import { WdsfProfile, WdsfDancerData } from '../objects/wdsfData';
import { AsyncStorage } from 'react-native';
const wdsfUrl = "https://services.worlddancesport.org/api/1/";

async function getDancerAllData(min: string | number): Promise<WdsfDancerData> {
    var profile: WdsfProfile = await getDancerProfile(min);

    var text = profile.link.find(x => x.rel.search("partner") > 0)
    if (text) {
        var partner = getCachedUrlContent<WdsfProfile>(text.href, false);

        return { profile, partner: await partner }
    }
    else {
        return { profile, partner: undefined }
    }

}

function getDancerProfile(min: string | number, newData: boolean = false): Promise<WdsfProfile> {
    return getCachedUrlContent<WdsfProfile>(wdsfUrl + "person/" + min, newData);
}


async function getCachedUrlContent<T>(urlAsKey: string, newData: boolean): Promise<T> {
    if (newData) {
        await AsyncStorage.getItem(urlAsKey, async (err, value) => {
            if (value) {
                let data: T = (JSON.parse(value));
                if (data !== null && data['expireAt'] &&
                    new Date(data.expireAt) < (new Date())) {
                    AsyncStorage.removeItem(urlAsKey);

                } else {
                    return data;

                }
            }
        });
    }
    return await GetNewDataFromServer<T>(urlAsKey);
};

async function GetNewDataFromServer<T>(urlAsKey: string): Promise<T> {
    let apiRes: T = await fetch(urlAsKey, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Basic aGFqYW4zOTpBbWQzNjk2Mw==',
            'Content-Type': 'application/vnd.worlddancesport.person+json',
            'Accept': 'application/json',
        })
    }).then((response) => {
        return response.json();
    }).catch(x => {
        console.log('ERROR', x)
    });
    apiRes.expireAt = getExpireDate().toDateString();
    const objectToStore = JSON.stringify(apiRes);
    AsyncStorage.setItem(urlAsKey, objectToStore);
    return apiRes;
}

function getExpireDate(): Date {
    const now = new Date();
    const expireTime = new Date(now);
    expireTime.setMinutes(now.getMinutes() + 1440);
    return expireTime;
}

const WDSF = {
    getDancerProfile,
    getDancerAllData,
};

export default WDSF;
