import { Platform } from "react-native";

import Constants from "expo-constants";

// Top padding for every custom screen header in the app.
//
// Headers used to hard-code `paddingTop: 54`, which is only right on
// one kind of phone. On Android the status bar is ~24–40dp depending
// on the device (camera cut-outs make it taller), so a flat 54 left
// the back/menu/save buttons jammed right under the status bar, in
// the zone where the notification-shade swipe steals the touch.
//
// Constants.statusBarHeight is the real status-bar/notch height for
// the device, so the header always starts a comfortable distance
// below it. Tune the two numbers below if a header ever feels too
// tight or too loose — every screen follows them.
const STATUS_BAR = Constants.statusBarHeight || 0;

export const HEADER_TOP_PADDING =
  Platform.OS === "ios"
    ? STATUS_BAR + 8
    : Math.max(STATUS_BAR + 32, 60);
