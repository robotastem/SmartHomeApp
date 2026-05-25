import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import ProfileHeader from '../components/ProfileHeader';
import KYCStatusCard from '../components/KYCStatusCard';
import {authAPI} from '../services/apiServices'; // adjust path if needed
import {useAuth} from '../context/AuthContext';

function ProfileScreen() {
  const navigation = useNavigation();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const {user} = useAuth();

  const ProfileItem = ({
    icon,
    title,
    description,
    onPress,
    isPersonIcon,
    isLogout,
  }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View
          style={[
            styles.iconContainer,
            isPersonIcon
              ? styles.personIconContainer
              : styles.regularIconContainer,
          ]}>
          <Icon
            name={icon}
            size={16}
            color={isLogout ? '#FF3B30' : isPersonIcon ? '#FFF' : '#C7C7C7'}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, isLogout && {color: '#FF3B30'}]}>
            {title}
          </Text>
          <Text style={styles.itemDescription}>{description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionTitle = ({title}) => {
    return <Text style={styles.sectionTitle}>{title}</Text>;
  };

  const handleLogout = async () => {
    try {
      const result = await authAPI.logout();

      // Clear AsyncStorage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');

      // Reset navigation stack to Login
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });

      if (!result.success) {
        Alert.alert('Logout Error', result.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Something went wrong during logout.');
    } finally {
      setLogoutVisible(false);
    }
  };

  const handleKYCUpgrade = () => {
    if (!user) return;

    const currentTier = user.kyc_tier
      ? user.kyc_tier === 'tier1'
        ? 1
        : user.kyc_tier === 'tier2'
        ? 2
        : 3
      : 1;

    if (currentTier === 1) {
      navigation.navigate('UpgradeToTierTwo');
    } else if (currentTier === 2) {
      navigation.navigate('UpgradeToTierThree');
    } else {
      navigation.navigate('KycStatus', {currentTier});
    }
  };

  const handleKYCStatus = () => {
    if (!user) return;

    const currentTier = user.kyc_tier
      ? user.kyc_tier === 'tier1'
        ? 1
        : user.kyc_tier === 'tier2'
        ? 2
        : 3
      : 1;

    navigation.navigate('KycStatus', {currentTier});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />

      {/* Profile Header */}
      <ProfileHeader />

      {/* Main Content */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* KYC Status Card */}
        <KYCStatusCard
          user={user}
          onUpgrade={handleKYCUpgrade}
          style={styles.kycCard}
        />

        {/* Account Section */}
        <SectionTitle title="Account" />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="person-outline"
            title="Personal Information"
            description="See your account information and login details"
            isPersonIcon={true}
            // onPress={() => navigation.navigate('')}
            onPress={() =>
              navigation.navigate('MoreServices', {
                screen: 'ProfileUpdateScreen',
              })
            }
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="card-outline"
            title="Bank Card/Account"
            description="2 visa / 1 Naira linked Card/Account"
            isPersonIcon={false}
            // onPress={() => navigation.navigate('BankAccounts')}
            onPress={() =>
              navigation.navigate('MoreServices', {screen: 'Withdrawal'})
            }
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="person-outline"
            title="Leaderboard"
            description="View the Leaderboard"
            isPersonIcon={false}
            // onPress={() => navigation.navigate('BankAccounts')}
            onPress={() =>
              navigation.navigate('Leaderboard')
            }
          />
        </View>

        {/* Security Section */}
        <SectionTitle title="Security" />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="lock-closed-outline"
            title="Change Password"
            description="Make changes to your account password"
            isPersonIcon={true}
            // onPress={() => navigation.navigate('')}
            onPress={() =>
              navigation.navigate('MoreServices', {screen: 'ChangePassword'})
            }
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="shield-checkmark-outline"
            title="KYC Verification"
            description="View your identity verification status and documents"
            isPersonIcon={false}
            onPress={handleKYCStatus}
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="key-outline"
            title="PIN Management"
            description="Make changes to your transaction PIN"
            isPersonIcon={false}
            onPress={() => navigation.navigate('ChangePin')}
          />
        </View>

        {/* Services Section */}
        <SectionTitle title="Services" />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="information-circle-outline"
            title="About Us"
            description="Learn more about CashPoint"
            isPersonIcon={true}
            // onPress={() => navigation.navigate('AboutUs')}
            onPress={() =>
              navigation.navigate('MoreServices', {screen: 'AboutUs'})
            }
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="help-buoy-outline"
            title="Help and Support"
            description="Contact our support, we are available to assist you 24/7"
            isPersonIcon={false}
            // onPress={() => navigation.navigate('Support')}
            onPress={() =>
              navigation.navigate('MoreServices', {screen: 'Support'})
            }
          />
          <View style={styles.divider} />
          <ProfileItem
            icon="document-text-outline"
            title="Terms and Conditions"
            description="See our terms of use and conditions"
            isPersonIcon={false}
            // onPress={() => navigation.navigate('Terms')}
            onPress={() =>
              navigation.navigate('MoreServices', {screen: 'Terms'})
            }
          />
        </View>

        {/* Logout Section */}
        <SectionTitle title=" " />
        <View style={styles.sectionContainer}>
          <ProfileItem
            icon="log-out-outline"
            title="Logout"
            description="Sign out from your account"
            isPersonIcon={false}
            isLogout={true}
            onPress={() => setLogoutVisible(true)}
          />
        </View>

        <View style={{height: 20}} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setLogoutVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={handleLogout}>
                <Text style={styles.confirmButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3ADD',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  kycCard: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  personIconContainer: {
    backgroundColor: '#4B39EF',
  },
  regularIconContainer: {
    backgroundColor: '#F0F0F0',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 62,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ProfileScreen;
