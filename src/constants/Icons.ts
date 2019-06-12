import { Platform } from "react-native";


enum AndroidIonicon {
    Home = "md-home",
    Rocking = "md-basket",
    Light = "md-sunny",
    Music = "md-musical-note",
    Camera = "md-videocam",
    Sound = "md-volume-high",
    ChevronLeft = "md-arrow-back",
    ChevronRight = "md-arrow-forward",
    Male = "md-male",
    Female = "md-female",
    Checkmark = "md-checkmark",
    Settings = "md-settings",
}
enum IosIonicon {
    Home = "ios-home",
    Rocking = "ios-basket",
    Light = "ios-sunny",
    Music = "ios-musical-note",
    Camera = "ios-videocam",
    Sound = "ios-volume-high",
    ChevronLeft = "ios-arrow-back",
    ChevronRight = "ios-arrow-forward",
    Male = "ios-male",
    Female = "ios-female",
    Checkmark = "ios-checkmark",
    Settings = "ios-settings",

}

enum FontAwesome {
    ChevronLeft = "chevron-left",
    ChevronRight = "chevron-right",
    Recycle = "recycle"
}



const CustomIconSet = {
    Ionicon: Platform.OS == "ios" ? IosIonicon : AndroidIonicon,
    FontAwesome
}

export default CustomIconSet;