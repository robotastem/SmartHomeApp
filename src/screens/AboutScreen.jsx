import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import { spacing } from '../constants/dimension';
import BottomNavBar from '../components/BottomNavBar';
import { useTheme } from '@react-navigation/native';

const ControlScreen = ({ toggleTheme, isDarkMode, isVerified, navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {isVerified ? (
        <View style={styles.mainContainer}>
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.containerCont, { backgroundColor: isDarkMode ? colors.background : colors.card ,borderColor: isDarkMode ? colors.card : colors.borderLight, // Conditional border color
                borderWidth: isDarkMode ?.5:0,}]}>
              {/* Project Title */}
              <Text style={[styles.titleText, { color: isDarkMode ? 'green' : colors.primary }]}>
                Smart Gen
              </Text>

              {/* Project Description */}
              <Text style={[styles.descriptionText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                Smart Gen is a cutting-edge project designed to help businesses and households manage their power needs efficiently.
                With Smart Gen, users can remotely control the operation of their generator, track fuel levels, and receive notifications for servicing due dates, all through a mobile app.
              </Text>

              {/* Key Features */}
              <Text style={[styles.subTitleText, { color: isDarkMode ? 'green' : colors.primary }]}>
                Key Features of Smart Gen
              </Text>

              <View style={styles.featuresContainer}>
                <Text style={[styles.featureText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                  • Remote On/Off Control: Switch your generator on or off from anywhere using the Smart Gen mobile app.
                </Text>
                <Text style={[styles.featureText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                  • PIN verification required to access the app content for security purposes.
                </Text>
                <Text style={[styles.featureText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                  • Fuel Level Monitoring: Keep track of the fuel level of your generator, ensuring that you never run out of power unexpectedly.
                </Text>
                <Text style={[styles.featureText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                  • Servicing Notifications: Receive automatic reminders for servicing and maintenance based on your generator's usage, so you never miss a scheduled service.
                </Text>
                <Text style={[styles.featureText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                  • Automatic Changeover: Smart Gen supports automatic changeover, ensuring that the power supply seamlessly switches between the generator and the main grid in case of any power failure.
                </Text>
              </View>

              {/* Additional Info */}
              <Text style={[styles.descriptionText, { color: isDarkMode ? colors.card : colors.secondary }]}>
                The Smart Gen system also includes hardware components that are attached directly to your generator, providing real-time monitoring and control, improving operational efficiency and convenience.
              </Text>
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
  scrollContainer: {
    padding: spacing.md,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 100,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
    // textAlign: 'center',
  },
  subTitleText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    textAlign: 'justify',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'justify',
  },
  containerCont: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ControlScreen;
