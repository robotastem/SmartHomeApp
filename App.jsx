import { StyleSheet, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
// import SettingScreen from './src/screens/SettingScreen';
import { darkTheme } from './src/themes/darkTheme';
import { lightTheme } from './src/themes/lightTheme';
import AboutScreen from './src/screens/AboutScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ControlScreen from './src/screens/ControlScreen';
import { Text, Modal, TextInput, Alert, Button, View } from 'react-native';
import FuelLevelScreen from './src/screens/FuelLevelScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';  // Import push notification

const Stack = createNativeStackNavigator();

const App = () => {
  const scheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(scheme === 'dark');
  const [isVerified, setIsVerified] = useState(false);
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState(''); // Store your actual PIN here
  const [modalVisible, setModalVisible] = useState(true);  // Modal opens by default
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);  // Track first launch

  // Fetch PIN from ESP32 on component mount
  useEffect(() => {
    // const fetchPin = async () => {
    //   try {
    //     const response = await axios.get('http://192.168.0.190/pin'); // Replace with ESP32 IP
    //     setStoredPin(response.data); // Store the fetched PIN from ESP32
    //     // console.log(response.data)
    //   } catch (error) {
    //     console.error('Error :', error);
    //     Alert.alert('Error Initializing PIN Verification', 'Ensure The Hardware is Powered On.');

    //   }
    // };
    // fetchPin();

    setStoredPin('1234')

    // Create a notification channel for Android 8.0 and above
    PushNotification.createChannel(
      {
        channelId: "fuel_alert_channel",  // The channel ID
        channelName: "Fuel Alert Notifications",  // The channel name
        channelDescription: "Notification channel for fuel alerts",  // Channel description
        soundName: "default",  // Sound name
        importance: 4,  // Importance level (1 is low, 4 is high)
        vibrate: true,  // Enable vibration
      },
      (created) => console.log(`Notification channel created: ${created}`)
    );

    // Trigger local push notification
    PushNotification.localNotification({
      channelId: "fuel_alert_channel",  
      title: 'Hey There!', // Notification title
      message: 'Welcome back to GenPilot!', // Notification message
      playSound: true,  // Play sound
      soundName: 'default', // Default notification sound
      priority: 'high', // Set priority to high
    });
    
  }, []);

  // PIN verification logic
  const handlePinSubmit = () => {
    // console.log('pin',pin) ;console.log('from esp',storedPin) ;
    if (pin == storedPin) {
      setIsVerified(true);
      setModalVisible(false);  // Hide the modal once PIN is correct
    } else {
      Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
    }
  };

  // Function to toggle themes
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };


  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;  // Render nothing while checking the first launch status
  }

  return (
    <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
      {/* Global PIN modal */}
      <Modal
        visible={modalVisible && !isVerified}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {}} // Disable closing the modal manually
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter Controller PIN</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="Enter PIN"
              secureTextEntry
              value={pin}
              onChangeText={setPin}
            />
            <Button title="Submit" onPress={handlePinSubmit} />
          </View>
        </View>
      </Modal>

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Onboard">
          {(props) => <OnboardingScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} isVerified={isVerified} />}
        </Stack.Screen> */}

        {isFirstLaunch && (
          <Stack.Screen name="Onboard">
            {(props) => <OnboardingScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} isVerified={isVerified} />}
        </Stack.Screen>
        <Stack.Screen name="FuelLevel">
          {(props) => <FuelLevelScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} isVerified={isVerified} />}
        </Stack.Screen>
        <Stack.Screen name="Control">
          {(props) => <ControlScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} isVerified={isVerified} />}
        </Stack.Screen>
        <Stack.Screen name="About">
          {(props) => <AboutScreen {...props} toggleTheme={toggleTheme} isDarkMode={isDarkMode} isVerified={isVerified} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    width: '80%',
    marginBottom: 20,
    padding: 10,
  },
});

export default App;
