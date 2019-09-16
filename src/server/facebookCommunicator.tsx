import { FbResponseObject } from "../objects/FacebookResponse";
import { FB_APP_ID, FB_APP_SECRET } from 'react-native-dotenv'

export async function getAccessToken() {
    const x = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&grant_type=client_credentials`);
    const json = await x.json();
    return json.access_token;
}

export async function getFeeds(accessToken: string) {
    const response = await fetch(`https://graph.facebook.com/210271225728892/feed?fields=attachments{media},message,id,created_time&access_token=${accessToken}`);
    const fbresp = await response.json();
    if (!fbresp.error)
        return fbresp;
    else
        return undefined;

}