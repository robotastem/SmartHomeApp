import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { authAPI } from '../services/apiServices'; // Adjust path
import loadingImage from '../assets/images/1.png'; // Adjust path

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const validateStep1 = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!otp || otp.length !== 6) {
      newErrors.otp = 'Enter a valid 6-digit OTP';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async () => {
    if (!validateStep1()) return;
    setIsLoading(true);
    try {
      const result = await authAPI.resetOtp(email.trim().toLowerCase());
      if (result.success) {
        Alert.alert('Success', result.data.message || 'OTP sent to your email.');
        setStep(2);
      } else {
        Alert.alert('Error', result.error || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      Alert.alert('Error', 'Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateStep2()) return;
    setIsLoading(true);
    try {
      const result = await authAPI.resetPassword({
        email: email.trim().toLowerCase(),
        otp,
        password,
        password_confirmation: confirmPassword,
      });
      if (result.success) {
        Alert.alert('Success', result.data.message || 'Password reset successfully.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', result.error || 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text className="text-4xl font-bold text-black mb-10">Forgot Password</Text>

            {step === 1 && (
              <>
                <Text className="text-base font-medium text-gray-800 mb-4">Email Address</Text>
                <TextInput
                  className={`h-14 border rounded-xl px-4 text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  editable={!isLoading}
                />
                {errors.email && (
                  <Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <View className="mt-6">
                  <Text className="text-base font-medium text-gray-800 mb-4">OTP Code</Text>
                  <TextInput
                    className={`h-14 border rounded-xl px-4 text-base ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit OTP"
                    keyboardType="numeric"
                    maxLength={6}
                    value={otp}
                    onChangeText={(text) => {
                      setOtp(text);
                      if (errors.otp) setErrors({ ...errors, otp: null });
                    }}
                    editable={!isLoading}
                  />
                  {errors.otp && (
                    <Text className="text-red-500 mt-1 text-sm">{errors.otp}</Text>
                  )}
                </View>

                <View className="mt-6">
                  <Text className="text-base font-medium text-gray-800 mb-4">New Password</Text>
                  <TextInput
                    className={`h-14 border rounded-xl px-4 text-base ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    editable={!isLoading}
                  />
                  {errors.password && (
                    <Text className="text-red-500 mt-1 text-sm">{errors.password}</Text>
                  )}
                </View>

                <View className="mt-6">
                  <Text className="text-base font-medium text-gray-800 mb-4">Confirm Password</Text>
                  <TextInput
                    className={`h-14 border rounded-xl px-4 text-base ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: null });
                    }}
                    editable={!isLoading}
                  />
                  {errors.confirmPassword && (
                    <Text className="text-red-500 mt-1 text-sm">{errors.confirmPassword}</Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          <View className="mt-auto pb-6">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isLoading ? 'bg-gray-500' : 'bg-black'
              }`}
              onPress={step === 1 ? handleRequestOtp : handleResetPassword}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {step === 1 ? 'Send OTP' : 'Reset Password'}
              </Text>
            </TouchableOpacity>

            {step === 2 && (
              <TouchableOpacity
                className="mt-4 items-center"
                onPress={() => setStep(1)}
                disabled={isLoading}
              >
                <Text className="text-sm text-blue-500 font-medium">
                  Go back to Email Entry
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <Modal transparent={true} visible={isLoading} animationType="fade">
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>
            {step === 1 ? 'Sending OTP...' : 'Resetting Password...'}
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 150,
    height: 150,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
