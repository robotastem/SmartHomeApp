import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const ChangePassword = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!oldPassword) newErrors.oldPassword = 'Please enter your old password';
    if (!newPassword) newErrors.newPassword = 'Please enter a new password';
    else if (newPassword.length < 8)
      newErrors.newPassword = 'Password must be at least 8 characters';

    if (!confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // API call would go here
      // await api.changePassword(oldPassword, newPassword);

      navigation.navigate('ChangePin');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentWrapper}>
          <Text style={styles.headerText}>Change Password</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Old Password</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.oldPassword && styles.errorInput,
              ]}
              placeholder="Enter Old Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={oldPassword}
              onChangeText={text => {
                setOldPassword(text);
                if (errors.oldPassword)
                  setErrors({...errors, oldPassword: null});
              }}
            />
            {errors.oldPassword && (
              <Text style={styles.errorText}>{errors.oldPassword}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.newPassword && styles.errorInput,
              ]}
              placeholder="Enter New Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={newPassword}
              onChangeText={text => {
                setNewPassword(text);
                if (errors.newPassword)
                  setErrors({...errors, newPassword: null});
              }}
            />
            {errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            )}
          </View>

          <View style={styles.inputGroupLarge}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={[
                styles.textInput,
                errors.confirmPassword && styles.errorInput,
              ]}
              placeholder="Make sure password matches"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({...errors, confirmPassword: null});
              }}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              isLoading ? styles.buttonLoading : styles.buttonNormal,
            ]}
            onPress={handleChangePassword}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputGroupLarge: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNormal: {
    backgroundColor: '#111827',
  },
  buttonLoading: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChangePassword;
