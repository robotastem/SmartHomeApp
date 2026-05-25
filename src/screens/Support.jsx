// screens/Support.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileHeader from '../components/ProfileHeader';

const Support = () => {
  const socialLinks = [
    {
      name: 'Facebook (Cashpoint)',
      url: 'https://facebook.com/Cashpoint',
      icon: 'facebook',
    },
    {
      name: 'Twitter',
      url: 'https://x.com/Cashpoint_official',
      icon: 'twitter',
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/+2349000000000',
      icon: 'whatsapp',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/cashpoint_support',
      icon: 'instagram',
    },
  ];

  const handleOpenLink = url => {
    Linking.openURL(url).catch(err =>
      console.error('Error opening URL: ', err),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <ProfileHeader />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Help and Support</Text>

        <View style={styles.socialLinksContainer}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialLinkItem}
              onPress={() => handleOpenLink(link.url)}>
              <View style={styles.socialLinkContent}>
                <View style={styles.iconPlaceholder}>
                  <Icon
                    name={link.icon}
                    size={20}
                    color="#000"
                  />
                </View>
                <View style={styles.socialTextContainer}>
                  <Text style={styles.socialTitle}>{link.name}</Text>
                  <Text style={styles.socialUrl}>{link.url}</Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3ADD',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  socialLinksContainer: {
    marginBottom: 20,
  },
  socialLinkItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  socialLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: '#4B72FF1A', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  socialTextContainer: {
    flex: 1,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  socialUrl: {
    fontSize: 12,
    color: '#666',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Support;

