import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';  // Import the Progress module

const ServiceCountDown = ({ initialTime,isDarkMode }) => {
  const { colors } = useTheme();
  const [timeLeft, setTimeLeft] = useState(initialTime);  // Track remaining time
  const [isTextVisible, setIsTextVisible] = useState(true);  // Manage the blinking text
  const [circleColor, setCircleColor] = useState('green');  // Color state for the progress bar

  // Update the progress bar and color based on the countdown
  useEffect(() => {
    // Timer to decrease the time left every second
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);  // Keep decreasing time until it goes below 0
    }, 86400000);  // Update every day instead
  // }, 1000);  // Update every second

    return () => clearInterval(intervalId);  // Cleanup interval on unmount
  }, []);

  // Manage the color and blinking based on the time left
  useEffect(() => {
    if (timeLeft <= 5) {
      setCircleColor('red');  // Turn red when time is 5 seconds or less
    } else if (timeLeft <= 10) {
      setCircleColor('#fca90d');  // Yellow for 6-10 seconds
    } else if (timeLeft > 10) {
      setCircleColor('green');  // Green for above 10 seconds
    }

    // Blink text when time reaches zero or below
    if (timeLeft <= 0) {
      const blinkInterval = setInterval(() => {
        setIsTextVisible(prev => !prev);  // Toggle the visibility of the text
      }, 500);  // Blink every 500ms

      return () => clearInterval(blinkInterval);  // Cleanup blink interval
    }
  }, [timeLeft]);

  // Custom text formatting for the progress circle
  const formatText = () => {
    return isTextVisible ? `${timeLeft} Days` : '';  // Display the countdown in seconds
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
      <Progress.Bar
        progress={Math.max(timeLeft, 0) / initialTime}  // Set progress based on remaining time (0 for below 0)
        width={200}  // Width of the progress bar
        height={20}  // Height of the progress bar
        color={circleColor}  // Color based on time
        unfilledColor="#e6e6e6"  // Background color of the unfilled part
        borderWidth={0}  // Remove border
        animationType="timing"
      />
      <Text style={[styles.timerText, { color: circleColor }]}>
        {timeLeft <= 0 ? (isTextVisible ? 'Generator Due For Service' : '') : `${timeLeft} Days Until Next Service`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    marginTop: 0,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 30,

    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Android shadow properties
    elevation: 1,
  },
  timerText: {
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 20,
  },
});

export default ServiceCountDown;
