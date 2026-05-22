import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { spacing } from '../constants/dimension';
import BottomNavBar from '../components/BottomNavBar';
import PowerControl from '../components/PowerControl';
import FuelLevel from '../components/FuelLevel';
import ServiceCountDown from '../components/ServiceCountDown';
import { useTheme } from '@react-navigation/native';

const ControlScreen = ({ toggleTheme, isDarkMode, isVerified, navigation }) => {
  const { colors } = useTheme();
  const [fuelLevel, setFuelLevel] = useState(null);

  // Use useCallback to memoize the fetch function
  const fetchFuelLevel = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.0.190/fuel'); // your ESP32 IP
      setFuelLevel(Number(response.data)); // Update the state with fuel level
    } catch (error) {
      console.error('Error fetching fuel level:', error);
    }
  }, []);

  // useEffect(() => {
  //   // Fetch fuel level when the component is mounted
  //   fetchFuelLevel();

  //   // Set up an interval to fetch fuel level every 2 seconds
  //   const interval = setInterval(() => {
  //     fetchFuelLevel();
  //   }, 2000);

  //   // Clean up the interval on unmount
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [fetchFuelLevel]); // Use useCallback to ensure stable function reference

  return (
    <View style={styles.container}>
      {isVerified ? (
        <View style={styles.mainContainer}>
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Pass the fuel level data to FuelLevel component */}
            {/* <FuelLevel percent={fuelLevel !== null ? fuelLevel : 0} isDarkMode={isDarkMode} /> */}
            {/* <ServiceCountDown initialTime={30} isDarkMode={isDarkMode}/> */}

            <View style={[styles.containerCont,
              { 
                backgroundColor: isDarkMode ? colors.background : colors.card,
                borderColor: isDarkMode ? colors.card : colors.borderLight, // Conditional border color
                borderWidth: isDarkMode ?.5:0, // You can also add borderWidth here if you want
              }
            ]}>
              <Text style={[styles.timerText, { color: 'green' }]}>
                {/* Welcome Here's Control Screen! */}
              </Text>
              <PowerControl />
            </View>
          </ScrollView>
          <BottomNavBar navigation={navigation} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Verifying PIN...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  timerText: {
    fontWeight: 'bold',
    marginTop: 15,
    fontSize: 20,
    borderBottomColor:'green',
    borderTopColor:'transparent',
    borderLeftColor:'transparent',
    borderRightColor:'transparent',
    borderWidth:3
  },
  scrollContainer: {
    // marginTop:200,
    // backgroundColor:'black',
    height:'100%',
    padding: spacing.md,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
    // paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'white',
    padding: 32,
    paddingVertical: 80,
    borderRadius: 30,

    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Android shadow properties
    elevation: 1,
  },
});

export default ControlScreen;
