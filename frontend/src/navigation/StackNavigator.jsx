import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// --- 1. Pantallas Comunes ---
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";

// --- 2. Pantallas del Cliente (Compañera) ---
import CartScreen from "../screens/CartScreen";
import CategoryAllScreen from "../screens/CategoryAllScreen";
import CategoryFruitsScreen from "../screens/CategoryFruitsScreen";
import CategorySpicesScreen from "../screens/CategorySpicesScreen";
import CategoryVegetablesScreen from "../screens/CategoryVegetablesScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HomeScreen from "../screens/HomeScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import ProfileScreenUser from "../screens/ProfileScreenUser";
import SearchScreen from "../screens/SearchScreen";

// --- 3. Pantallas del Agricultor (Tuyas + Compañera) ---
import AddProductScreen from "../screens/AddProductScreen";
import HomeAgricultorScreen from "../screens/HomeAgricultorScreen";
import InventoryScreen from "../screens/InventoryScreen";
import OrdersAgricultorScreen from "../screens/OrdersAgricultorScreen";
import ProductosAgricultorScreen from "../screens/ProductosAgricultorScreen";
import ProfileScreenAgricultor from "../screens/ProfileScreenAgricultor";
import SearchAgricultorScreen from "../screens/SearchAgricultorScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* COMUNES */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* CLIENTE */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProfileUser" component={ProfileScreenUser} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="CategoryFruits" component={CategoryFruitsScreen} />
        <Stack.Screen
          name="CategoryVegetables"
          component={CategoryVegetablesScreen}
        />
        <Stack.Screen name="CategorySpices" component={CategorySpicesScreen} />
        <Stack.Screen name="CategoryAll" component={CategoryAllScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />

        {/* AGRICULTOR */}
        <Stack.Screen name="HomeAgricultor" component={HomeAgricultorScreen} />
        <Stack.Screen
          name="ProductosAgricultor"
          component={ProductosAgricultorScreen}
        />
        <Stack.Screen
          name="ProfileAgricultor"
          component={ProfileScreenAgricultor}
        />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen
          name="SearchAgricultor"
          component={SearchAgricultorScreen}
        />
        <Stack.Screen
          name="OrdersAgricultor"
          component={OrdersAgricultorScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
