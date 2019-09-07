import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub';
import { WdsfDancerData } from '../objects/wdsfData';
import { CstsDancerData } from '../objects/profileData';
import { User } from '../objects/firebaseUser';
import CSTS from '../server/cstsCommunicator';
import WDSF from '../server/wdsfCommunicator';

enum TriggerKeys {
    Router = 'router',
    User = 'user',
    Wdsf = "wdsf",
    Csts = "csts"
}

@AutoSubscribeStore
class UserStore extends StoreBase {
    private wdsfProfile?: WdsfDancerData;
    private cstsProfile?: CstsDancerData;
    private user?: User
    private routerSettings?: {firstLoad: boolean, csts: boolean, wdsf: boolean}
/**
 *
 */
constructor() {
    super();
}
    signOut(){
        this.wdsfProfile = undefined;
        this.cstsProfile= undefined;
        this.user = undefined;
        this.routerSettings= undefined;
        this.trigger();
    }

    setUser(user: User) {
        if(!this.routerSettings || this.routerSettings.firstLoad !=user.firstLoad || this.routerSettings.csts != !!user.cstsIdt|| this.routerSettings.wdsf != !!user.wdsfId){
            this.routerSettings = {firstLoad: user.firstLoad, csts: !!user.cstsIdt, wdsf: !!user.wdsfId}
            this.trigger(TriggerKeys.Router)
        }

        this.user = user;
        this.trigger(TriggerKeys.User);

        if(user.cstsIdt){
            CSTS.getDancerAllData(user.cstsIdt).then(x=> {
                this.setCstsProfile(x);
            })
        }
        if(user.wdsfId){
            WDSF.getDancerAllData(user.wdsfId).then(x=> {
                this.setWdsfProfile(x);
            })
        }
    }

    setWdsfProfile(wdsfProfile: WdsfDancerData) {
        this.wdsfProfile = wdsfProfile;
        this.trigger(TriggerKeys.Wdsf);
    }

    setCstsProfile(cstsProfile: CstsDancerData) {
        this.cstsProfile = cstsProfile;
        this.trigger(TriggerKeys.Csts);
    }

    @autoSubscribeWithKey(TriggerKeys.User)
    getUser() {
        return this.user;
    }

    @autoSubscribeWithKey(TriggerKeys.Wdsf)
    getWdsfProfile(){
        return this.wdsfProfile;
    }

    @autoSubscribeWithKey(TriggerKeys.Csts)
    getCstsProfile(){
        return this.cstsProfile;
    }

    @autoSubscribeWithKey(TriggerKeys.Router)
    getRouterSettings(){
        return this.routerSettings;
    }
}

export default new UserStore();