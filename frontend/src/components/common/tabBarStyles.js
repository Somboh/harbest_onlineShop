import { StyleSheet } from "react-native";

export const TAB_BAR_BOTTOM = 18;
export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_RESERVED_SPACE = 120;

export const tabBarStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: TAB_BAR_BOTTOM,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 80,
    elevation: 80,
  },
  pill: {
    width: "75%",
    minWidth: 292,
    maxWidth: 360,
    height: TAB_BAR_HEIGHT,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
