import { Profile, CompData, Partner, CstsDancerData, CompResults } from "../objects/profileData";
import { Ranklist } from "../objects/ranklistData";
import { AsyncStorage } from "react-native";

const cstsUrl: string = "http://www.csts.cz/";

async function getDancerAllData(idt: string | number): Promise<CstsDancerData> {
    var profile: Profile = await getDancerProfile(idt);
    var competition = getDancerCompetitionData(profile.Id);
    var partner = getDancerPartner(profile.Id)
    var results = getDancerCompetitionResultsData(idt)
    return { profile, compData: await competition, partner: await partner, compResults: await results };

}


async function getDancerProfile(idt: string | number, newData: boolean = false): Promise<Profile> {
    return getCachedUrlContent<Profile>(cstsUrl + 'api/evidence/clenove/detail-clena/osobni-udaje/' + idt, newData);
}
async function getDancerCompetitionData(id: string | number, newData: boolean = false): Promise<CompData> {
    return getCachedUrlContent<CompData>(cstsUrl + 'api/evidence/clenove/detail-clena/soutezni-udaje/' + id, newData);
}

async function getDancerCompetitionResultsData(idt: string | number, newData: boolean = false): Promise<CompResults> {
    return getCachedUrlContent<CompResults>(cstsUrl + "api/evidence/clenove/detail-clena/vysledky-soutezi/" + idt + "?%24count=true&%24skip=0&%24top=20&%24orderby=Datum%20desc", newData)
}

async function getDancerPartner(id: string | number, newData: boolean = false): Promise<Partner> {
    return getCachedUrlContent<Partner>(cstsUrl + "api/evidence/pary/seznam-partneru/" + id + "?%24count=true&%24skip=0&%24top=20&%24orderby=Id%20desc", newData);
}

async function getRanklist(vekKtg: string | null = null, disciplina: string | null = null, datum: string | null = null, divize: number | null = null, newData: boolean = false): Promise<Ranklist> {
    var url = cstsUrl + "api/ranklist-csts/ranklist";
    if (vekKtg || disciplina || datum || divize) {
        url +=
            "?" +
            (vekKtg ? "vekKtg=" + vekKtg + "&" : "") +
            (disciplina ? "disciplina=" + disciplina + "&" : "") +
            (datum ? "datum=" + datum + "&" : "") +
            (divize ? "divize=" + divize + "&" : "");
        url = url.slice(0, -1);

    }
    return getCachedUrlContent<Ranklist>(url, newData);
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
    var apiRes: T = await fetch(urlAsKey).then((response) => response.json());
    apiRes.expireAt = getExpireDate().toDateString();
    const objectToStore = JSON.stringify(apiRes);
    AsyncStorage.setItem(urlAsKey, objectToStore);
    return apiRes;
}

function getExpireDate(): Date {
    const now = new Date();
    let expireTime = new Date(now);
    expireTime.setMinutes(now.getMinutes() + 1440);
    return expireTime;
}

const CSTS = {
    getDancerAllData,
    getDancerProfile,
    getDancerCompetitionResultsData,
    getDancerCompetitionData,
    getDancerPartner,
    getRanklist
};

export default CSTS;