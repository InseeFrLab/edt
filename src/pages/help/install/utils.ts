import chromeAndroid1 from "assets/illustration/install/android/chrome1.svg";
import chromeAndroid2 from "assets/illustration/install/android/chrome2.svg";
import chromeAndroid3 from "assets/illustration/install/android/chrome3.svg";
import edgeAndroid1 from "assets/illustration/install/android/edge1.svg";
import edgeAndroid2 from "assets/illustration/install/android/edge2.svg";
import edgeAndroid3 from "assets/illustration/install/android/edge3.svg";
import mozillaAndroid1 from "assets/illustration/install/android/mozilla1.svg";
import mozillaAndroid2 from "assets/illustration/install/android/mozilla2.svg";
import mozillaAndroid3 from "assets/illustration/install/android/mozilla3.svg";

import chromeIOS1 from "assets/illustration/install/ios/chrome1.svg";
import chromeIOS2 from "assets/illustration/install/ios/chrome2.svg";
import chromeIOS3 from "assets/illustration/install/ios/chrome3.svg";
import edgeIOS1 from "assets/illustration/install/ios/edge1.svg";
import edgeIOS2 from "assets/illustration/install/ios/edge2.svg";
import edgeIOS3 from "assets/illustration/install/ios/edge3.svg";
import safariIOS1 from "assets/illustration/install/ios/safari1.svg";
import safariIOS2 from "assets/illustration/install/ios/safari2.svg";
import safariIOS3 from "assets/illustration/install/ios/safari3.svg";

import {
    isAndroid,
    isChrome,
    isEdge,
    isFirefox,
    isIOS,
    isMacOs,
    isSafari,
    isWindows,
} from "react-device-detect";

export const getDevice = () => {
    return isAndroid || isWindows ? "android" : isIOS || isMacOs ? "ios" : "";
};

export const getNavigator = () => {
    console.log(
        "isChrome:",
        isChrome,
        "isEdge: ",
        isEdge,
        "isFirefox:",
        isFirefox,
        "isSafari:",
        isSafari,
    );
    if (isChrome) {
        return "chrome";
    } else if (isEdge) {
        return "edge";
    } else if (isFirefox) {
        return "firefox";
    } else if (isSafari) {
        return "safari";
    } else return "";
};

export const getLabelStep = (step: number, stepFinal: number) => {
    const label = "component.help.install." + getDevice() + "." + getNavigator() + ".step-" + step;
    const labelFinal = "component.help.install.step-final";
    return step < stepFinal ? label : labelFinal;
};

export const getDeviceNav = (device: string) => {
    const navigatorAndroid = ["chrome", "edge", "firefox"];
    const navigatorIOS = ["chrome", "edge", "safari"];
    const android = [
        chromeAndroid1,
        chromeAndroid2,
        chromeAndroid3,
        edgeAndroid1,
        edgeAndroid2,
        edgeAndroid3,
        mozillaAndroid1,
        mozillaAndroid2,
        mozillaAndroid3,
    ];
    const ios = [
        chromeIOS1,
        chromeIOS2,
        chromeIOS3,
        edgeIOS1,
        edgeIOS2,
        edgeIOS3,
        safariIOS1,
        safariIOS2,
        safariIOS3,
    ];

    if (device == "android") {
        return [navigatorAndroid, android];
    } else {
        return [navigatorIOS, ios];
    }
};

export const createMap = (): Map<string, Map<string, string[]>> => {
    let deviceNavMap = new Map<string, Map<string, string[]>>();

    let devices = ["android", "ios"];

    devices.forEach(device => {
        const navigatorStepMap = new Map<string, string[]>();
        let index = 0;
        const [navigators, stepsImages] = getDeviceNav(device);
        navigators.forEach(navigator => {
            navigatorStepMap.set(navigator, [
                stepsImages[index],
                stepsImages[index + 1],
                stepsImages[index + 2],
            ]);
            index = index + 3;
        });
        deviceNavMap.set(device, navigatorStepMap);
    });
    return deviceNavMap;
};
