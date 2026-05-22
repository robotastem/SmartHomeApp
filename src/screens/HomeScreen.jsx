// import { Text, View, StyleSheet, ScrollView } from 'react-native';
// import React from 'react';
// import Header from '../components/Header';
// import { spacing } from '../constants/dimension';
// import BottomNavBar from '../components/BottomNavBar';
// import PowerControl from '../components/PowerControl';
// import FuelLevel from '../components/FuelLevel';
// import ServiceCountDown from '../components/ServiceCountDown';

// const HomeScreen = ({ toggleTheme, isDarkMode, isVerified, navigation }) => {
//   return (
//     <View style={styles.container}>
//       {/* Main UI of the app */}
//       {isVerified ? (
//         <View style={styles.mainContainer}>
//           <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             <FuelLevel percent={40} />
//             <ServiceCountDown initialTime={30} />
//             <PowerControl />
//           </ScrollView>
//           <BottomNavBar navigation={navigation} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
//         </View>
//       ) : (
//         <View style={styles.loadingContainer}>
//           <Text>Verifying PIN...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   mainContainer: {
//     flex: 1,
//   },
//   scrollContainer: {
//     padding: spacing.md,
//     paddingBottom: 80,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;






import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { spacing } from '../constants/dimension';
import BottomNavBar from '../components/BottomNavBar';
import PowerControl from '../components/PowerControl';
import FuelLevel from '../components/FuelLevel';
import ServiceCountDown from '../components/ServiceCountDown';

const HomeScreen = ({ toggleTheme, isDarkMode, isVerified, navigation }) => {
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

  useEffect(() => {
    // Fetch fuel level when the component is mounted
    fetchFuelLevel();

    // Set up an interval to fetch fuel level every 2 seconds
    const interval = setInterval(() => {
      fetchFuelLevel();
    }, 2000);

    // Clean up the interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, [fetchFuelLevel]); // Use useCallback to ensure stable function reference

  return (
    <View style={styles.container}>
      {isVerified ? (
        <View style={styles.mainContainer}>
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Pass the fuel level data to FuelLevel component */}
            <FuelLevel percent={fuelLevel !== null ? fuelLevel : 0} isDarkMode={isDarkMode} />
            <ServiceCountDown initialTime={30} isDarkMode={isDarkMode}/>
            <PowerControl />
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
  scrollContainer: {
    padding: spacing.md,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
