import { WdsfProfile, WdsfDancerData, WdsfCompetitionGlobal, WdsfCompetitionDetail } from '../objects/wdsfData';
import { AsyncStorage } from 'react-native';
const wdsfUrl = "https://services.worlddancesport.org/api/1/";


enum HeaderType {
    Competition = 'application/vnd.worlddancesport.competition+json',
    Profile = 'application/vnd.worlddancesport.person+json',
}


async function getDancerAllData(min: string | number): Promise<WdsfDancerData> {
    var profile: WdsfProfile = await getDancerProfile(min);

    var text = profile.link.find(x => x.rel.search("partner") > 0)
    if (text) {
        var partner = getCachedUrlContent<WdsfProfile>(text.href, false, HeaderType.Profile);

        return { profile, partner: await partner }
    }
    else {
        return { profile, partner: undefined }
    }

}

function getDancerProfile(min: string | number, newData: boolean = false): Promise<WdsfProfile> {
    return getCachedUrlContent<WdsfProfile>(wdsfUrl + "person/" + min, newData, HeaderType.Profile);
}


function getData(url: string, contentType: string, newData: boolean) {
    return getCachedUrlContent(url, newData, contentType)
}


function getCompetitionList(from?: string, to?: string, group?: number, newData: boolean = false): Promise<WdsfCompetitionGlobal[]> {
    var join: string[] = [];
    from && join.push("from=" + from);
    to && join.push("to=" + to);
    group && join.push("groupId=" + group);
    return getCachedUrlContent<WdsfCompetitionGlobal[]>(wdsfUrl + "competition" + (join.length > 0 ? ("?" + join.join("&")) : ""), newData, HeaderType.Competition);
}

function getCompetitionDetail(compId: number, newData: boolean = false): Promise<WdsfCompetitionDetail> {
    return getCachedUrlContent<WdsfCompetitionDetail>(wdsfUrl + "competition/" + compId, newData, HeaderType.Competition);
}



/// -------------- Common methods --------------\\\

async function getCachedUrlContent<T>(urlAsKey: string, newData: boolean, type: HeaderType | string): Promise<T> {
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
    console.log("gettingFromServer", urlAsKey, type);

    return await GetNewDataFromServer<T>(urlAsKey, type);
};

async function GetNewDataFromServer<T>(urlAsKey: string, type: HeaderType | string): Promise<T> {
    let apiRes: T = await fetch(urlAsKey, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Basic aGFqYW4zOTpBbWQzNjk2Mw==',
            'Content-Type': type,
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
    getCompetitionList,
    getCompetitionDetail,
    getData,
    getDancerProfile,
    getDancerAllData,
};

export default WDSF;
