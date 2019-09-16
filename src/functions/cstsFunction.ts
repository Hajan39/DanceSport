import CSTS from "../server/cstsCommunicator";
import { NavigationParams } from "react-navigation";

export function showProfile(idt: string | number, navigation: NavigationParams) {
    CSTS.getDancerAllData(idt).then(x => {
        navigation.push("Csts", { dancerData: x })
    })
}