import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';  // Importing FontAwesome for the power icon
import Toast from 'react-native-toast-message';  // Importing toast message library
import axios from 'axios';  // Importing axios to make requests to your ESP32 server


 // Custom debounce function
 const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};




const PowerControl = () => {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const rotateValue = new Animated.Value(0);  // For rotation of image
  const shakeValue = new Animated.Value(0);   // For shaking the image


 

  const togglePower = debounce(async () => {
    try {
      if (isPowerOn) {
        // Send request to turn off the generator
        await axios.get('http://192.168.0.190/off'); // Replace with your ESP32 IP address
        Toast.show({
          type: 'error',
          text1: 'Power off!',
          position: 'top',
          topOffset: 50,
        });
      } else {
        // Send request to turn on the generator
        await axios.get('http://192.168.0.190/on'); // Replace with your ESP32 IP address
        Toast.show({
          type: 'success',
          text1: 'Power on!',
          position: 'top',
          topOffset: 50,
        });
      }
      setIsPowerOn(prevState => !prevState);
    } catch (error) {
      console.error('Error toggling power:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to toggle power!',
        position: 'top',
        topOffset: 50,
      });
    }
  }, 1000); // 1 second debounce delay
  

// using local fetch
  // const togglePower = async () => {
  //   try {
  //     const url = isPowerOn ? 'http://192.168.0.190/off' : 'http://192.168.0.190/on';
  //     const response = await fetch(url);
  //     const text = await response.text();
  //     Toast.show({
  //       type: isPowerOn ? 'error' : 'success',
  //       text1: isPowerOn ? 'Power off!' : 'Power on!',
  //       position: 'top',
  //       topOffset: 50,
  //     });
  //     setIsPowerOn(prevState => !prevState);
  //   } catch (error) {
  //     console.error('Error toggling power:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Failed to toggle power!',
  //       position: 'top',
  //       topOffset: 50,
  //     });
  //   }
  // };
  


  // Function to toggle power state
  // const togglePower = async () => {
  //   try {
  //     if (isPowerOn) {
  //       // Send request to turn off the generator
  //       await axios.get('http://192.168.0.190/off'); // Replace with your ESP32 IP address
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Power off!',
  //         position: 'top',
  //         topOffset: 50,
  //       });
  //     } else {
  //       // Send request to turn on the generator
  //       await axios.get('http://192.168.0.190/on'); // Replace with your ESP32 IP address
  //       Toast.show({
  //         type: 'success',
  //         text1: 'Power on!',
  //         position: 'top',
  //         topOffset: 50,
  //       });
  //     }
  //     setIsPowerOn(prevState => !prevState);
  //   } catch (error) {
  //     console.error('Error toggling power:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Failed to toggle power!',
  //       position: 'top',
  //       topOffset: 50,
  //     });
  //   }
  // };

  // Shake animation logic (only when power is off)
  const handleImagePress = async () => {
    console.log("Image pressed!");  // Debugging log to check if the press is triggered

    if (!isPowerOn) {
      Toast.show({
        type: 'error',
        text1: 'Please, switch on to start!',
        position: 'top',
        topOffset: 50,
      });
      shakeImage();  // Trigger shake animation when power is off
    } else {
      await startGenerator();  // Trigger start generator action when power is on
      rotateImage();  // Trigger rotation animation
    }
  };

  // Shake animation for the image
  const shakeImage = () => {
    Animated.sequence([
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Rotation animation for the image (rotate 45 degrees and then back to 0 degrees after 3 seconds)
  const rotateImage = () => {
    Animated.sequence([
      // Rotate to 45 degrees
      Animated.timing(rotateValue, {
        toValue: 45,  
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Stay at 45 degrees for 3 seconds
      Animated.delay(3000),
      // Rotate back to 0 degrees
      Animated.timing(rotateValue, {
        toValue: 0,  
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Start generator function (you can replace this with an API request if needed)
  const startGenerator = async () => {
    try {
      await axios.get('http://192.168.0.190/start'); // Replace with your ESP32 IP address
      Toast.show({
        type: 'success',
        text1: 'Generator started!',
        position: 'top',
        topOffset: 50,
      });
    } catch (error) {
      console.error('Error starting generator:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to start generator!',
        position: 'top',
        topOffset: 50,
      });
    }
  };

  // Interpolate rotation value for image rotation effect
  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 45],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View>
      <View style={styles.container}>
        {/* Power Icon Section */}
        <TouchableOpacity
          style={[
            styles.powerButton,
            {
              backgroundColor: isPowerOn ? 'green' : 'white',
              borderColor: isPowerOn ? 'white' : 'green',
            },
          ]}
          onPress={togglePower}
        >
          {/* Power Icon */}
          <Icon
            name="power-off"
            size={30}
            color={isPowerOn ? 'white' : 'green'}
          />
        </TouchableOpacity>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImagePress}>
            <Animated.Image
              source={isPowerOn ? require('../assets/swiper_images/start.png') : require('../assets/swiper_images/start_grey.png')}
              style={[styles.image, { transform: [{ rotate: rotateInterpolate }, { translateX: shakeValue }] }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Messages */}
      <View style={{ marginTop: 40, position: 'absolute', zIndex: 20000, width: '100%' }}>
        <Toast />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  powerButton: {
    padding: 20,
    borderRadius: 100,
    marginRight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    // iOS shadow properties
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow direction
    shadowOpacity: 0.1, // Shadow opacity (lower is more transparent)
    shadowRadius: 10, // Blur radius of the shadow
    
    // Android shadow properties
    elevation: 2, // Elevation for Android (higher number gives a larger shadow)
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default PowerControl;
