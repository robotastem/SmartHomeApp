import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
// import { AntDesign } from "react-native-vector-icons";
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/apiServices'; // Adjust path as needed
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

// Import your image
const loadingImage = require('../assets/images/1.png'); // Adjust path if necessary

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();


  // Animated value for the zoom effect
  const zoomAnim = useRef(new Animated.Value(0)).current;

  // Effect to start/stop the animation when isLoading changes
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(zoomAnim, {
            toValue: 1, // Zoom in
            duration: 1500, // Speed of zoom in (1.5 seconds)
            easing: Easing.inOut(Easing.ease), // Smooth easing
            useNativeDriver: true,
          }),
          Animated.timing(zoomAnim, {
            toValue: 0, // Zoom out
            duration: 1500, // Speed of zoom out (1.5 seconds)
            easing: Easing.inOut(Easing.ease), // Smooth easing
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

    // Email validation
    if (!email) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleLogin = async () => {
  //   if (!validateForm()) return;
  //   setIsLoading(true);
  //   setErrors({}); // Clear any previous errors
  //   try {
  //     // Call your Laravel API
  //     const result = await authAPI.login(email, password);

  //     if (result.success) {
  //       // Access token and user from result.data.results
  //       // await signIn(user, token);
  //       const { token, user } = result.data.results;

  //       console.log(result.data.results)

  //       // Store the token
  //       await AsyncStorage.setItem('auth_token', token);

  //       // Save last used email for prefill regardless of Remember Me (added)
  //       await AsyncStorage.setItem('last_email', email.toLowerCase().trim());

  //       // Store user data if needed
  //       if (user) {
  //         await AsyncStorage.setItem('user_data', JSON.stringify(user));
  //       }

  //       // Handle remember me (unchanged)
  //       if (rememberMe) {
  //         await AsyncStorage.setItem('remember_email', email);
  //       } else {
  //         await AsyncStorage.removeItem('remember_email');
  //       }

  //       // Check if user needs to verify email/phone or create PIN
  //       if (user?.email_verified_at === null) {
  //         const otpResult = await authAPI.sendOTP({ email: email.toLowerCase().trim() });
  //         if (otpResult.success) {
  //           Alert.alert('Success', otpResult.data.message || 'OTP sent successfully! Please verify your account.');
  //           // Navigate to Verify screen
  //           navigation.navigate('Verify', { email: email.toLowerCase().trim() });
  //         } else {
  //           // Handle OTP sending failure (e.g., show error but still logged in)
  //           Alert.alert('OTP Error', otpResult.error || 'Failed to send OTP. Please try again later.');
  //         }
  //         // Navigate to email verification
  //         navigation.navigate('Verify', { email: email.toLowerCase().trim() }); // Pass email to VerifyScreen
  //       }
  //       // else if (!user?.pin_set) {
  //       //   navigation.navigate('ChangePin');
  //       // }
  //       else {
  //         // Navigate to main dashboard
  //         await signIn(user, token);
  //         navigation.navigate('Dashboard');
  //       }
  //     } else {
  //       // Handle API errors
  //       Alert.alert('Login Failed', result.error);
  //       console.log(result);
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error); // Log the full error for debugging
  //     Alert.alert('Login Failed', 'Network error. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleLogin = async () => {
  if (!validateForm()) return;
  setIsLoading(true);
  setErrors({}); // Clear any previous errors

  try {
    const result = await authAPI.login(email, password);

    if (result.success) {
      console.log(result.data);
      // return;
      const { token } = result.data.results;

      console.log("Login Token:", token);

      // Store the token first
      await AsyncStorage.setItem('auth_token', token);

      // Save last used email for prefill regardless of Remember Me
      await AsyncStorage.setItem('last_email', email.toLowerCase().trim());

      // Handle remember me
      if (rememberMe) {
        await AsyncStorage.setItem('remember_email', email);
      } else {
        await AsyncStorage.removeItem('remember_email');
      }

      // NOW: Fetch user using token
      const userResult = await authAPI.getUser();

      if (!userResult.success) {
        Alert.alert('User Fetch Failed', userResult.error || 'Unable to fetch user details.');
        return;
      }

      const user = userResult.data;

      // Store user data if needed
      if (user) {
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        console.log(user)
      }

      // Handle email verification
      if (user?.email_verified_at === null) {
        const otpResult = await authAPI.sendOTP({ email: email.toLowerCase().trim() });

        if (otpResult.success) {
          Alert.alert('Success', otpResult.data.message || 'OTP sent successfully! Please verify your account.');
        } else {
          Alert.alert('OTP Error', otpResult.error || 'Failed to send OTP. Please try again later.');
        }

        navigation.navigate('Verify', { email: email.toLowerCase().trim() });
      }
      // else if (!user?.pin_set) {
      //   navigation.navigate('ChangePin');
      // }
      else {
        // Proceed to main dashboard
        await signIn(user, token);
        navigation.navigate('Dashboard');
      }

    } else {
      Alert.alert('Login Failed', result.error);
      console.log(result);
    }

  } catch (error) {
    console.error('Login error:', error);
    Alert.alert('Login Failed', 'Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};




  // Load remembered email on component mount

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        // Prefer remember_email (when user opted-in)
        const rememberedEmail = await AsyncStorage.getItem('remember_email');
        if (rememberedEmail) {
          setEmail(rememberedEmail);
          setRememberMe(true);
          return;
        }
        // Fallback to last used email (added)
        const lastEmail = await AsyncStorage.getItem('last_email');
        if (lastEmail) {
          setEmail(lastEmail);
        }
      } catch (error) {
        console.error('Error loading remembered email:', error);
      }
    };
    loadRememberedEmail();
  }, []);

  // Interpolate the animated value to a scale range
  const scale = zoomAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1], // Zooms from 100% to 110%
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#10002B] pt-5 px-2">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 pt-10"
      >
        <View className="flex-row items-center justify-center px-4 py- relative">
          <TouchableOpacity
            className="absolute left-4 z-10"
            onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Sign in</Text>
        </View>
        <View className="flex-1 pt-8 px-6">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-3xl mt-4 font-bold text-white">Sign in</Text>
            <Text className="text-base text-[#ACB4BE] leading-relaxed mb-5">
              Enter your email and password to enter the app
            </Text>

            {/* Email Input */}
            <View className="mb-6 mt-6">
              <Text className="text-base font-light text-white mb-4">
                Email
              </Text>
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
                  setEmail(text.toLowerCase().trim());
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                // Optional: persist last_email on blur so it's saved even if login isn't completed
                onBlur={async () => {
                  try {
                    if (email) {
                      await AsyncStorage.setItem('last_email', email.toLowerCase().trim());
                    }
                  } catch {}
                }}
                editable={!isLoading}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            {/* <View className="mb-6 mt-6 flex-col relative">
              <Text className="text-base font-medium text-gray-800 mb-4">
                Password
              </Text>
              <TextInput
                className={`h-14 border rounded-xl px-4 text-base text-black ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
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
              {errors.password && (
                <Text className="text-red-500 mt-1 text-sm">
                  {errors.password}
                </Text>
              )}
            </View> */}
              {/* <AntDesign name={'eye'} size={5}></AntDesign> */}

          {/* Password Input */}
          <View className="mb-6 mt-6 flex-col relative">
            <Text className="text-base font-light text-white mb-4">
              Password
            </Text>
            <TextInput
              className={`h-14 border rounded-xl px-4 text-base text-white ${
                errors.password ? 'border-red-500' : 'border-[#D9D9D9]'
              }`}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword} // toggle this!
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              editable={!isLoading}
            />
            
            {/* Eye icon button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 15,
                top: 42,
                height: 24,
                width: 24,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>

            {errors.password && (
              <Text className="text-red-500 mt-1 text-sm">
                {errors.password}
              </Text>
            )}
          </View>


            {/* Remember Me + Forgot Password */}
            <View className="flex-row justify-between items-center mt-2 px-2">
              {/* <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                className="flex-row items-center"
                disabled={isLoading}
              >
                <View
                  className={`w-5 h-5 rounded border mr-2 ${
                    rememberMe ? 'border-gray-400' : 'border-gray-400'
                  } justify-center items-center`}
                >
                  {rememberMe && <Icon name="check-box" size={15} color="black" />}
                </View>
                <Text className="text-sm text-gray-700">Remember me</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={isLoading}
              >
                <Text className="text-sm text-[#B259FF] font-light">
                  Forget password?
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Fixed bottom: Login button + Register */}
          <View className="mt-auto pb-6">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isLoading ? 'bg-gray-500' : 'bg-[#B259FF]'
                // style={{ backgroundColor: '#B259FF' }}
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? 'Login' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              className="mt-6 items-center"
              onPress={() => navigation.navigate('Signup')}
              disabled={isLoading}
            >
              <Text className="text-sm text-gray-700">
                {"Don't have an account? "}
                <Text className="text-blue-500 font-medium">Register Here!</Text>
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Loading Overlay Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <Animated.Image
            source={loadingImage}
            style={[styles.loadingImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>Logging in...</Text>
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
});

export default LoginScreen;