import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/apiServices'; 
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

const loadingImage = require('../assets/images/1.png');

const SignupScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // NEW SUCCESS MODAL
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Animated value for the zoom effect
  const zoomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(zoomAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(zoomAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      zoomAnim.stopAnimation();
      zoomAnim.setValue(0);
    }
  }, [isLoading, zoomAnim]);

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!lastName.trim()) newErrors.lastName = 'Please enter your last name';

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^\d+$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = 'Phone number must contain only digits';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    // if (!validateForm()) return;

    // setIsLoading(true);
    // setErrors({});

    // try {
    //   const userData = {
    //     first_name: firstName.trim(),
    //     last_name: lastName.trim(),
    //     middle_name: middleName.trim() || null,
    //     username: email.toLowerCase().trim(),
    //     email: email.toLowerCase().trim(),
    //     phone: phoneNumber.trim(),
    //     password,
    //   };

    //   const registerResult = await authAPI.register(userData);

    //   if (registerResult.success) {
    //     const { token, user } = registerResult.data.results;

    //     await AsyncStorage.setItem('auth_token', token);
    //     if (user) {
    //       await AsyncStorage.setItem('user_data', JSON.stringify(user));
    //     }

    //     const otpResult = await authAPI.sendOTP({ email: email.toLowerCase().trim() });

    //     if (otpResult.success) {
    //       // SHOW SUCCESS MODAL HERE
    //       setShowSuccessModal(true);
    //     } else {
    //       Alert.alert('OTP Error', otpResult.error || 'Failed to send OTP.');
    //     }
    //   } else {
    //     Alert.alert('Registration Failed', registerResult.error || 'Something went wrong.');
    //   }
    // } catch (error) {
    //   console.error('Registration Error:', error);
    //   Alert.alert('Error', 'Network error or unexpected issue.');
    // } finally {
    //   setIsLoading(false);
    // }


          setShowSuccessModal(true);

  };

  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#10002B] pt-5 px-2">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="flex-row items-center justify-center px-4 py-3 relative">
          <TouchableOpacity className="absolute left-4 z-10" onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Register Account</Text>
        </View>

        <View className="flex-1 py-5 px-6">
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text className="text-3xl mt-4 font-bold text-white">Register Account</Text>
            <Text className="text-base text-[#ACB4BE] mb-5">You dont have an account? Create a new one</Text>

            {/* First Name */}
            <View className="mb-6">
              <Text className="text-base font-medium text-white mb-4">First Name</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-white text-base ${
                  errors.firstName ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}
                placeholder="Enter your first name"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (errors.firstName) setErrors({ ...errors, firstName: null });
                }}
                editable={!isLoading}
              />
              {errors.firstName && <Text className="text-red-500 mt-1 text-sm">{errors.firstName}</Text>}
            </View>

            {/* Middle Name */}
            <View className="mb-6">
              <Text className="text-base font-medium text-white mb-4">Middle Name (Optional)</Text>
              <TextInput
                className="h-14 border rounded-xl px-4 text-base border-[#D9D9D9]"
                placeholder="Enter your middle name"
                placeholderTextColor="#9CA3AF"
                value={middleName}
                onChangeText={setMiddleName}
                editable={!isLoading}
              />
            </View>

            {/* Last Name */}
            <View className="mb-6">
              <Text className="text-base font-medium text-white mb-4">Last Name</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.lastName ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}
                placeholder="Enter your last name"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (errors.lastName) setErrors({ ...errors, lastName: null });
                }}
                editable={!isLoading}
              />
              {errors.lastName && <Text className="text-red-500 mt-1 text-sm">{errors.lastName}</Text>}
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="text-base font-medium text-white mb-4">Email Address</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.email ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                editable={!isLoading}
              />
              {errors.email && <Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>}
            </View>

            {/* Phone Number */}
            <View className="mb-6">
              <Text className="text-base font-medium text-white mb-4">Phone Number</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base ${
                  errors.phoneNumber ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null });
                }}
                editable={!isLoading}
              />
              {errors.phoneNumber && <Text className="text-red-500 mt-1 text-sm">{errors.phoneNumber}</Text>}
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-base font-medium text-white mb-4">Password</Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base text-black ${
                  errors.password ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                editable={!isLoading}
              />
              {errors.password && <Text className="text-red-500 mt-1 text-sm">{errors.password}</Text>}
            </View>

            {/* Remember me */}
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center" disabled={isLoading}>
              <View
                className={`w-5 h-5 rounded border mr-2 ${
                  rememberMe ? 'border-gray-400' : 'border-gray-400'
                } justify-center items-center`}
              >
                {rememberMe && <Icon name="check-box" size={15} color="white" />}
              </View>
              <Text className="text-sm font-light text-[#B259FF]">I agree with terms and conditions</Text>
            </TouchableOpacity>
          </ScrollView>

          <View className="mt-auto pb-6">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isLoading ? 'bg-gray-500' : 'bg-[#C77DFF]'
              }`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* LOADING OVERLAY */}
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Registering...</Text>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>🥳</Text>

            <Text style={styles.successTitle}>Congratulations!!!</Text>

            <Text style={styles.successSubtitle}>
              You have successfully created your account
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Verify', { email: email.toLowerCase().trim() });
              }}
            >
              <Text style={styles.successButtonText}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 150,
    height: 150,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },

  /** SUCCESS MODAL STYLES **/
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    width: '80%',
    backgroundColor: '#C77DFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  successButton: {
    backgroundColor: '#5A189A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignupScreen;
