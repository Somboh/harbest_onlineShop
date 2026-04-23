import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CartScreen from "../screens/CartScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreenUser from "../screens/ProfileScreenUser";
import SearchScreen from "../screens/SearchScreen";
import colors from "../styles/colors";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home-outline",
            Search: "search-outline",
            Favorites: "heart-outline",
            Cart: "cart-outline",
            ProfileUser: "person-outline",
          };

          return (
            <Ionicons
              name={icons[route.name] || "ellipse-outline"}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="ProfileUser" component={ProfileScreenUser} />
    </Tab.Navigator>
  );
}
