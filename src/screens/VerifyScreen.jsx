import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/apiServices';

const loadingImage = require('../assets/images/1.png');

const VerifyScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [email, setEmail] = useState(route.params?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(180);

  // New Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputRefs = useRef([...Array(6)].map(() => React.createRef()));

  const zoomAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVerifying) {
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
  }, [isVerifying]);

  // OTP Timer
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleVerify = async () => {
    // const fullOtp = otp.join('');
    // if (fullOtp.length !== 6) {
    //   Alert.alert('Invalid OTP', 'Please enter the full 6-digit code.');
    //   return;
    // }

    // setIsVerifying(true);
    // try {
    //   const result = await authAPI.verifyOTP(fullOtp);

    //   if (result.success) {
    //     await AsyncStorage.setItem(
    //       'user_data',
    //       JSON.stringify(result.data.results.user)
    //     );

    //     // Show success modal instead of alerts
    //     setShowSuccessModal(true);

    //   } else {
    //     Alert.alert('Verification Failed', result.error || 'Invalid or expired OTP');
    //   }
    // } catch (e) {
    //   Alert.alert('Error', 'Network issue. Try again.');
    // } finally {
    //   setIsVerifying(false);
    // }



        setShowSuccessModal(true);

  };

  const handleResend = async () => {
    if (timer > 0) return;

    setIsVerifying(true);
    try {
      const result = await authAPI.resendOTP();
      if (result.success) {
        Alert.alert('OTP Sent', `A new OTP has been sent to ${email}`);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].current.focus();
        setTimer(180);
      } else {
        Alert.alert('Error', result.error || 'Failed to resend OTP.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#10002B] pt-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-6">
          <Text className="text-4xl font-bold text-white mb-6">Verification</Text>

          <Text className="text-base text-[#D1C4E9] mb-8">
            Enter the 6-digit code sent to:{' '}
            <Text className="text-[#C77DFF] font-semibold">{email}</Text>
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-between mb-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs.current[index]}
                className="w-14 h-14 border border-[#C77DFF] bg-white/10 rounded-xl text-center text-xl text-white"
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => {
                  const newOtp = [...otp];
                  newOtp[index] = value;
                  setOtp(newOtp);

                  if (value && index < 5) inputRefs.current[index + 1].current.focus();
                  if (!value && index > 0) inputRefs.current[index - 1].current.focus();
                }}
                placeholderTextColor="#CBBBDD"
              />
            ))}
          </View>

          {/* Resend + Timer */}
          <View className="flex-row justify-between items-center mb-10 px-1">
            <TouchableOpacity disabled={timer > 0} onPress={handleResend}>
              <Text
                className={`text-sm font-semibold ${
                  timer > 0 ? 'text-gray-500' : 'text-[#C77DFF]'
                }`}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>

            <Text className="text-lg text-white font-bold">{formatTime(timer)}</Text>
          </View>
        </View>

        {/* Verify Button */}
        <View className="px-6 pb-10">
          <TouchableOpacity
            className={`h-14 rounded-xl justify-center items-center ${
              isVerifying ? 'bg-gray-600' : 'bg-[#C77DFF]'
            }`}
            onPress={handleVerify}
            disabled={isVerifying}
          >
            <Text className="text-white font-semibold text-base">
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <Modal transparent visible={isVerifying} animationType="fade">
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
          />
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Verifying...</Text>
        </View>
      </Modal>

      {/* SUCCESS MODAL (same as registration) */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>

            <Text style={styles.successEmoji}>🥳</Text>

            <Text style={styles.successTitle}>Congratulations!!!</Text>

            <Text style={styles.successSubtitle}>
              Your account has been successfully verified
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Dashboard');
              }}
            >
              <Text style={styles.successButtonText}>Get Started</Text>
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
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },

  /** SUCCESS MODAL **/
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
    marginBottom: 10,
    textAlign: 'center',
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
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
  },
  successButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyScreen;
