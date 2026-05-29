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
    backgroundColor: "#FFFCF2",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#B8C98A",
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 10,
  },
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
