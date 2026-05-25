import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import imageSrc from '../assets/images/vector.png';

const screenHeight = Dimensions.get('window').height;

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-[#10002B]">

      {/* Skip */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        className="w-full items-end px-8 pt-8">
        <Text className="text-white text-right">Skip</Text>
      </TouchableOpacity>

      {/* Image Section */}
      <View style={{ height: screenHeight * 0.5 }} className="justify-center items-center">
        <Image
          source={imageSrc}
          resizeMode="contain"
          className="w-4/5 h-full"
        />
      </View>

      {/* Text + Buttons Section */}
      <View className="flex-1 px-10 items-center">

        {/* Title */}
        <View className="w-full">
          <Text className="text-4xl font-bold text-white">
            Building your dream
          </Text>
          <Text className="text-4xl font-bold text-white mb-4">
            smart house
          </Text>
        </View>

        {/* Description */}
        <Text className="text-base text-[#ACB4BE] leading-relaxed text-cente px-">
          Build your dream smart home with us for ease of mind here at Robota.
        </Text>

        {/* Buttons */}
        <View className="mt-auto pb-8 w-full items-center">

          {/* Register Button */}
          <TouchableOpacity
            className="h-14 rounded-3xl justify-center items-center mb-3 w-full"
            style={{ backgroundColor: '#B259FF' }}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text className="text-white font-semibold text-base">
              Register Account
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className="h-14 rounded-3xl justify-center items-center bg-white w-full"
            onPress={() => navigation.navigate('Login')}
          >
            <Text
              className="font-semibold text-base"
              style={{ color: '#8e44ad' }}
            >
              Login
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
};

export default OnboardingScreen;
