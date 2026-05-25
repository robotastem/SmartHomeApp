import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/apiServices';

const ProfileUpdateScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const fullNameString = [user?.firstName, user?.middleName, user?.lastName]
    .filter(Boolean)
    .join(' ');

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || 'https://randomuser.me/api/portraits/men/44.jpg'
  );
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to select image');
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedPhoto(asset);
          setProfileImage(asset.uri);
        }
      }
    );
  };

  const handleUpdate = async () => {
    if (!selectedPhoto) {
      Alert.alert('Nothing to update', 'Please select a new profile picture.');
      return;
    }

    setIsUpdating(true);

    try {
      const photo = {
        uri: selectedPhoto.uri,
        type: selectedPhoto.type,
        name: selectedPhoto.fileName || `profile_${Date.now()}.jpg`,
      };

      const formData = new FormData();
      formData.append('photo', photo);

      const response = await authAPI.UploadProfilePic(formData);

      Alert.alert('Success', 'Profile picture updated!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Update Failed', error.message || 'Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-[#4B39EF] px-5 pb-10 items-center justify-center">
          <View className="mt-20 items-center">
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: profileImage }}
                className="w-20 h-20 rounded-full mr-2"
              />
              <TouchableOpacity
                onPress={handleChoosePhoto}
                className="bg-black px-3 py-2 rounded-lg"
              >
                <Text className="text-white text-xs font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-xl font-normal">
              Welcome, <Text className="font-bold">{user?.firstName}!</Text>
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className="flex-1 pt-12 px-6 bg-white rounded-t-3xl -mt-6">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Full Name */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Full Name</Text>
              <TextInput
                className="h-14 border border-gray-300 rounded-xl px-4 text-base bg-gray-100 text-gray-700"
                value={fullNameString}
                editable={false}
              />
            </View>

            {/* Phone Number */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Phone Number</Text>
              <TextInput
                className="h-14 border border-gray-300 rounded-xl px-4 text-base bg-gray-100 text-gray-700"
                value={user?.phone || ''}
                editable={false}
              />
            </View>

            {/* Username */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Username</Text>
              <TextInput
                className="h-14 border border-gray-300 rounded-xl px-4 text-base bg-gray-100 text-gray-700"
                value={user?.username || ''}
                editable={false}
              />
            </View>

            {/* Email */}
            <View className="mb-6">
              <Text className="text-xl font-normal text-gray-800 mb-4">Email Address</Text>
              <TextInput
                className="h-14 border border-gray-300 rounded-xl px-4 text-base bg-gray-100 text-gray-700"
                value={user?.email || ''}
                editable={false}
              />
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View className="mt-auto pb-6 mb-5">
            <TouchableOpacity
              className={`h-14 rounded-xl justify-center items-center ${
                isUpdating ? 'bg-gray-500' : 'bg-black'
              }`}
              onPress={handleUpdate}
              disabled={isUpdating}
            >
              <Text className="text-white font-semibold text-base">
                {isUpdating ? 'Uploading...' : 'Update Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileUpdateScreen;
