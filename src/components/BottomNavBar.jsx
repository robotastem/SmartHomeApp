import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavBar = ({ navigation, toggleTheme, isDarkMode }) => {
  const currentRoute = navigation.getState().routes[navigation.getState().index].name;

  const themeColors = isDarkMode
    ? {
        background: '#000000',
        iconColor: '#FFFFFF',
        textColor: '#FFFFFF',
        activeColor: '#069e85',
      }
    : {
        background: '#FFFFFF',
        iconColor: '#000000',
        textColor: '#000000',
        activeColor: '#069e85',
      };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <AntDesign
          name="home"
          size={24}
          color={currentRoute === 'Home' ? themeColors.activeColor : themeColors.iconColor}
        />
        <Text style={[styles.navText, { color: currentRoute === 'Home' ? themeColors.activeColor : themeColors.textColor }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('FuelLevel')}>
        <MaterialCommunityIcons
          name="fuel-cell"
          size={24}
          color={currentRoute === 'FuelLevel' ? themeColors.activeColor : themeColors.iconColor}
        />
        <Text style={[styles.navText, { color: currentRoute === 'FuelLevel' ? themeColors.activeColor : themeColors.textColor }]}>Fuel Level</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Control')}>
        <FontAwesome
          name="key"
          size={24}
          color={currentRoute === 'Control' ? themeColors.activeColor : themeColors.iconColor}
        />
        <Text style={[styles.navText, { color: currentRoute === 'Control' ? themeColors.activeColor : themeColors.textColor }]}>Control</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('About')}>
        <AntDesign
          name="infocirlceo"
          size={24}
          color={currentRoute === 'About' ? themeColors.activeColor : themeColors.iconColor}
        />
        <Text style={[styles.navText, { color: currentRoute === 'About' ? themeColors.activeColor : themeColors.textColor }]}>About</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
  },
});
