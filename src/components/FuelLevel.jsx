import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import * as Progress from 'react-native-progress';  // Import the Progress module
// import { colors } from '../constants/color';
import PushNotification from 'react-native-push-notification';  // Import push notification


const FuelLevel = ({ percent, isDarkMode }) => {
  const { colors } = useTheme();
  const [isTextVisible, setIsTextVisible] = useState(true);  // Manage the blinking text
  const [alertShown, setAlertShown] = useState(false); // To prevent showing the alert repeatedly

  // Determine the color based on the percent
  let circleColor = '#3498db';  // Default color (green for above 41%)
  
  if (percent <= 20) {
    circleColor = 'red';  // Color for 20% or below
  } else if (percent <= 40) {
    circleColor = '#fca90d';  // Color for 21% to 40%
  } else {
    circleColor = 'green';  // Color for above 40%
  }

  // Blink the text when percent <= 20
  useEffect(() => {
    let intervalId;

    if (percent <= 20) {
      // Blink every 500ms if the fuel level is <= 20%
      intervalId = setInterval(() => {
        setIsTextVisible(prev => !prev); // Toggle text visibility
      }, 500);  // Blink every 500ms
    } else {
      // If the percent is greater than 20%, stop blinking
      setIsTextVisible(true);
    }

    // Cleanup interval when component unmounts or percent changes
    return () => clearInterval(intervalId);
  }, [percent]);



  // Periodic alert every 30 seconds when percent <= 20
  useEffect(() => {
    let alertInterval;

    if (percent <= 20 && !alertShown) {
      // Show the alert every 30 seconds when fuel is <= 20%
      alertInterval = setInterval(() => {
        Alert.alert(
          'Fuel Alert', 
          'Fuel level is low. Please top up the fuel!', 
          [{ text: 'OK', onPress: () => setAlertShown(false) }]
        );
        setAlertShown(true);  // Mark alert as shown
      }, 30000); // Alert every 30 seconds

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
        title: 'Fuel Level Alert', // Notification title
        message: 'Fuel level is low. Please top up the fuel!', // Notification message
        playSound: true,  // Play sound
        soundName: 'default', // Default notification sound
        priority: 'high', // Set priority to high
      });

    } else if (percent > 20 && alertShown) {
      // Reset alert interval if percent goes above 20%
      clearInterval(alertInterval);
      setAlertShown(false);  // Reset alert shown state
    }

    // Cleanup interval when component unmounts
    return () => clearInterval(alertInterval);
  }, [percent, alertShown]);

  // Custom function to format the text inside the circle
  const formatText = (progress) => {
    if (percent <= 20) {
      return isTextVisible ? `${percent}%` : ''; // Make text blink
    }
    return `${percent}%`;  // Regular text display for higher percentages
  };

  return (
    <View style={[
        styles.container,
        { 
          backgroundColor: isDarkMode ? colors.background : colors.card,
          borderColor: isDarkMode ? colors.card : colors.borderLight, // Conditional border color
          borderWidth: isDarkMode ?.5:0, // You can also add borderWidth here if you want
        }
      ]}
    >
      <Progress.Circle
        size={170}  // Size of the circle
        progress={percent / 100}  // Progress is a value between 0 and 1, so divide percent by 100
        showsText={true}  // To show the percentage text inside the circle
        formatText={formatText}  // Use the custom formatText function for the textual representation
        color={circleColor}  // Conditional color based on fuel level
        unfilledColor="#e6e6e6"  // Color of the unfilled part of the circle
        thickness={12}  // Thickness of the circle border (donut effect)
        borderWidth={0}  // Remove the border around the circle to make it a donut
        direction="clockwise"  // Direction of progress (clockwise by default)
        strokeCap="round"
      />
      <Text style={[styles.fuelLevelText, { color: isDarkMode ? colors.card : colors.text }]}>Fuel Level <Text style={{color:circleColor}}>(Of 15L)</Text> </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,  // Add some margin for spacing
    marginTop: 100, 
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,


    // iOS shadow properties
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow direction
    shadowOpacity: 0.1, // Shadow opacity (lower is more transparent)
    shadowRadius: 10, // Blur radius of the shadow
    
    // Android shadow properties
    elevation: 1, // Elevation for Android (higher number gives a larger shadow)
  },
  fuelLevelText: {
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 20,
    color: '#000'
  }
});

export default FuelLevel;
