import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';

const HomeProfileHeader = ({ imageUrl, badgeCount = 0, navigation }) => {
  

  const { user } = useAuth();
  
    const firstName = (() => {
      const n =
        user?.firstName ||
        '';
      if (!n) return '';
      return n.charAt(0).toUpperCase() + n.slice(1);
    })();

  return (
    <View style={styles.headerContainer} className="mb-2 -mt-2">
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />
        <Text style={styles.welcomeText}>
          {'Welcome, '}<Text style={styles.userName}>{firstName}!</Text>
        </Text>
      </TouchableOpacity>
      {/* Notification Icon with Badge */}
      <TouchableOpacity
        style={styles.notificationContainer}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Feather name="bell" size={35} color="#000" />
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 5,
    paddingBottom: 25,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 99,
    marginRight: 10,
  },
  welcomeText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
  },
  userName: {
    fontWeight: '700',
  },
  notificationContainer: {
    marginTop: 40,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -5,
    backgroundColor: '#EE1C25',
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 3,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bolder',
  },
});

export default HomeProfileHeader;