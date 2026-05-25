// App.jsx
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  ImageBackground,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


// Screens

import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';


// Service Screens

import Notifications from './src/screens/Notifications';


// Assets
import logo from './src/assets/images/1.png';
import bgImage from './src/assets/images/3.png';
import './global.css';
import {AuthProvider} from './src/context/AuthContext';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginOrSignUp from './src/screens/LoginOrSignUp';
import VerifyScreen from './src/screens/VerifyScreen';
import AddRoomScreen from './src/screens/AddRoomScreen';
import AddRoomDevicesScreen from './src/screens/AddRoomDevicesScreen';

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ServicesStack = createNativeStackNavigator();

// function ServicesNav() {
//   return (
//     <ServicesStack.Navigator screenOptions={{headerShown: false}}>
//       <ServicesStack.Screen name="MoreServicesMain" component={MoreServices} />
//       <ServicesStack.Screen name="BuyAirtime" component={Airtime} />
//       <ServicesStack.Screen name="MoreServices" component={ServicesNav} />
//     </ServicesStack.Navigator>
//   );
// }

// const ProfileStackScreen = () => (
//   <Stack.Navigator screenOptions={{headerShown: false}}>
//     <Stack.Screen name="Profile" component={ProfileScreen} />
    
//   </Stack.Navigator>
// );

// Tab Navigation
// const MyTabs = () => (
//   <Tab.Navigator
//     screenOptions={({route}) => ({
//       headerShown: false,
//       tabBarIcon: ({focused, color}) => {
//         let Icon;
//         const iconProps = {color: focused ? '#000' : color, size: 24};
//         switch (route.name) {
//           case 'Home':
//             Icon = HomeIcon;
//             break;
//           case 'Fund':
//             Icon = PlusIcon;
//             break;
//           case 'Transaction':
//             Icon = Square3Stack3DIcon;
//             break;
//           case 'Profile':
//             Icon = UsersIcon;
//             break;
//         }
//         return (
//           <View
//             style={[styles.iconWrapper, focused ? styles.focusedIcon : null]}>
//             <Icon {...iconProps} />
//           </View>
//         );
//       },
//       tabBarActiveTintColor: 'black',
//       tabBarInactiveTintColor: 'black',
//       tabBarLabelStyle: {fontWeight: 'bold'},
//       tabBarStyle: [
//         styles.tabBar,
//         Platform.OS === 'android' && {height: 65},
//         Platform.OS === 'ios' && {height: 70},
//       ],
//     })}>
//     <Tab.Screen name="Home" component={HomeScreen} />
//     <Tab.Screen name="Fund" component={FundWallet} />
//     <Tab.Screen name="Transaction" component={TransactionScreen} />
//     <Tab.Screen
//       name="Profile"
//       component={ProfileStackScreen}
//       listeners={({navigation, route}) => ({
//         tabPress: e => {
//           const state = navigation.getState();
//           const isFocused =
//             state.index === state.routes.findIndex(r => r.key === route.key);
//           if (isFocused) {
//             e.preventDefault();
//             navigation.navigate('Profile', {screen: 'Profile'});
//           }
//         },
//       })}
//     />
//   </Tab.Navigator>
// );

// App Root
export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldCheckAuth, setShouldCheckAuth] = useState(0);
  const appState = useRef(AppState.currentState);
  const logoutTimeout = useRef(null);
  // Handle app state changes for auto logout
  useEffect(() => {
   // Define timeout reference outside handler

  const handleAppStateChange = async (nextAppState) => {
    console.log('App state changed from', appState.current, 'to', nextAppState);

    // App going to background — start 30s logout timer
    if (
      appState.current.match(/active|foreground/) &&
      nextAppState === 'background'
    ) {
      console.log('App is going to background — starting logout timer');
      logoutTimeout.current = setTimeout(async () => {
        console.log('App stayed in background — logging out user');
        await AsyncStorage.removeItem('auth_token');
        setShouldCheckAuth(prev => prev + 1);
      }, 30000); // 30 seconds
    }

    // App coming back to foreground — cancel logout timer
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (logoutTimeout.current) {
        clearTimeout(logoutTimeout.current);
        logoutTimeout.current = null;
        console.log('User returned — logout timer cancelled');
      }
      setShouldCheckAuth(prev => prev + 1);
    }

    appState.current = nextAppState;
  };

  const subscription = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    subscription?.remove();
    if (logoutTimeout.current) {
      clearTimeout(logoutTimeout.current);
    }
  };
}, []);


  useEffect(() => {
    const initializeApp = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const userToken = await AsyncStorage.getItem('auth_token');

        setIsFirstLaunch(hasLaunched === null);
        setIsAuthenticated(!!userToken);

        console.log('Auth check - Has launched:', hasLaunched !== null);
        console.log('Auth check - Token exists:', !!userToken);
      } catch (error) {
        console.error('App init error:', error);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => setIsLoading(false), 2000);
      }
    };

    initializeApp();
  }, [shouldCheckAuth]); // Re-run when shouldCheckAuth changes

  if (isLoading || isFirstLaunch === null) {
    return (
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.splashText}>SmartRob</Text>
        </View>
      </ImageBackground>
    );
  }

  // const initialRoute = isFirstLaunch
  //   ? 'Onboarding'
  //   : isAuthenticated
  //   ? 'Dashboard'
  //   : 'Login';

  const initialRoute = isFirstLaunch
    ? 'Dashboard'
    // ? 'Onboarding'
    : isAuthenticated
    ? 'Dashboard'
    : 'LoginOrSignUp';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName={initialRoute}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="LoginOrSignUp" component={LoginOrSignUp} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
            

            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="AddRoom" component={AddRoomScreen} />
            <Stack.Screen name="AddRoomDevices" component={AddRoomDevicesScreen} />


            {/* <Stack.Screen name="Dashboard" component={MyTabs} /> */}
             {/*<Stack.Screen name="CreatePin" component={CreatePinScreen} /> */}
            {/* <Stack.Screen name="MoreServices" component={ServicesNav} /> */}
            <Stack.Screen name="Notifications" component={Notifications} />
            
           
           
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#10002BCC',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  splashText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  iconWrapper: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  focusedIcon: {
    backgroundColor: '#D9D9D9',
  },
});
