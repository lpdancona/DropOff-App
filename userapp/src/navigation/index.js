import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
//import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Foundation, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
//import { useAuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  //const { dbUser } = useAuthContext();
  //console.log(dbUser);
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
        <Stack.Screen 
          name='Home' 
          component={HomeTabs}
        />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} barStyle={{ backgroundColor:'white'} }>
      <Tab.Screen 
        name='Home' 
        component={HomeStackNavigator} 
        options={{
          tabBarIcon: ({color}) => (<Foundation name="home" size={24} color={color} />
          ),
        }} 
      />
      
    </Tab.Navigator>
  )
};

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () =>{
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='MapVanTracker' component={HomeScreen} />
    </HomeStack.Navigator>
  )
}


export default RootNavigator;