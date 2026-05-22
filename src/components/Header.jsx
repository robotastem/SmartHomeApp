// import { 
//     Image, 
//     StyleSheet, 
//     TouchableOpacity, 
//     View, 
//     Modal, 
//     TextInput, 
//     Button, 
//     Alert, 
//     ActivityIndicator, 
//     FlatList, 
//     Text 
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import { useTheme } from '@react-navigation/native';
// import WifiManager from 'react-native-wifi-reborn';
// import { iconSizes, spacing } from '../constants/dimension';
// import { PermissionsAndroid } from 'react-native';

// const HeaderWithVideo = ({ toggleTheme, isDarkMode }) => {
//     const { colors } = useTheme();
//     const [isConnected, setIsConnected] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [availableNetworks, setAvailableNetworks] = useState([]);
//     const [password, setPassword] = useState('');
//     const [selectedSSID, setSelectedSSID] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [isScanning, setIsScanning] = useState(false);

//     const requestLocationPermission = async () => {
//         try {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 {
//                     title: 'Location Permission Required',
//                     message: 'This app needs access to your location to scan for Wi-Fi networks.',
//                     buttonPositive: 'OK',
//                 }
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } catch (err) {
//             console.warn(err);
//             return false;
//         }
//     };

//     const checkWifiAndScan = async () => {
//         const isEnabled = await WifiManager.isEnabled();
//         if (!isEnabled) {
//             Alert.alert('Wi-Fi is off', 'Please turn on Wi-Fi to connect to a network.');
//             return;
//         }

//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             Alert.alert('Location Permission', 'Location permission is required to scan Wi-Fi networks.');
//             return;
//         }

//         startScanning();
//     };

//     const startScanning = async () => {
//         setIsScanning(true);
//         try {
//             const networks = await WifiManager.loadWifiList();
//             setAvailableNetworks(networks);
//             setModalVisible(true);
//         } catch (error) {
//             console.error('Failed to load Wi-Fi list:', error);
//             Alert.alert('Error', 'Failed to load Wi-Fi networks. Please try again.');
//         } finally {
//             setIsScanning(false);
//         }
//     };

//     const connectToNetwork = async () => {
//         if (password.length < 6) {
//             Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
//             return;
//         }
//         setIsLoading(true);
//         try {
//             await WifiManager.connectToProtectedSSID(selectedSSID, password, false);
//             setIsConnected(true);
//             Alert.alert('Success', `Connected to ${selectedSSID}!`);
//             setModalVisible(false);
//             setPassword('');
//         } catch (error) {
//             console.error('Connection error:', error);
//             Alert.alert('Connection Failed', 'Check your password or try again later.');
//             setIsConnected(false);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             if (modalVisible && isScanning) {
//                 startScanning();
//             }
//         }, 5000);

//         return () => clearInterval(intervalId);
//     }, [modalVisible, isScanning]);

//     return (
//         <View style={styles.container}>
//             <View style={[styles.header, { backgroundColor: isDarkMode ? colors.background : colors.card }]}>
//                 <Image 
//                     source={require('../assets/logo.png')} 
//                     style={[styles.logo, { tintColor: isDarkMode ? '#fff' : null }]}
//                 />
//                 <View style={styles.iconsContainer}>
//                     <TouchableOpacity onPress={toggleTheme}>
//                         <Feather 
//                             name={isDarkMode ? 'moon' : 'sun'} 
//                             size={iconSizes.md} 
//                             color={isDarkMode ? '#fff' : '#000'} 
//                             accessibilityLabel="Toggle theme" 
//                             accessibilityHint={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} 
//                         />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={checkWifiAndScan} style={styles.wifiIcon}>
//                         {isConnected ? (
//                             <AntDesign name={'wifi'} size={iconSizes.lg} color={colors.iconPrimary} accessibilityLabel="Connected to WiFi" />
//                         ) : (
//                             <Feather name={'wifi-off'} size={iconSizes.lg} color={colors.iconPrimary} accessibilityLabel="Not connected to WiFi" />
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Modal for Wi-Fi Selection */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={modalVisible}
//                 onRequestClose={() => {
//                     if (!password && !isConnected) {
//                         setSelectedSSID(''); // Clear SSID if no password and not connected
//                     }
//                     setModalVisible(false);
//                 }}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                         <FlatList
//                             data={availableNetworks}
//                             keyExtractor={(item) => item.BSSID}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity onPress={() => {
//                                     setSelectedSSID(item.SSID);
//                                     setPassword(''); // Reset password when a new network is selected
//                                 }}>
//                                     <View style={styles.networkItem}>
//                                         <Text>{item.SSID || 'Unknown Network'}</Text>
//                                     </View>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                         {isScanning && <ActivityIndicator size="large" color={colors.iconPrimary} />}
//                         {selectedSSID ? (
//                             <>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Enter Password"
//                                     secureTextEntry
//                                     value={password}
//                                     onChangeText={setPassword}
//                                     accessibilityLabel="Password input"
//                                 />
//                                 <Button title="Connect" onPress={connectToNetwork} />
//                             </>
//                         ) : null}
//                         <Button title="Close" onPress={() => setModalVisible(false)} color="red" />
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// export default HeaderWithVideo;

// const styles = StyleSheet.create({
//     container: {
//         paddingTop: 0,
//         zIndex: 10,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: spacing.lg,
//         paddingTop: spacing.sm,
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         elevation: 5,
//     },
//     logo: {
//         width: 110,
//         height: 80,
//         resizeMode: 'contain',
//     },
//     iconsContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: spacing.md,
//     },
//     wifiIcon: {
//         fontWeight: 'bold',
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContainer: {
//         width: '80%',
//         padding: 20,
//         backgroundColor: 'white',
//         borderRadius: 10,
//         elevation: 5,
//     },
//     input: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         marginBottom: 15,
//         paddingHorizontal: 10,
//         borderRadius: 5,
//     },
//     networkItem: {
//         padding: 10,
//         borderBottomColor: 'gray',
//         borderBottomWidth: 1, // Added border bottom for each network item
//     },
//     buttonSpacing: {
//         marginVertical: 10,
//     },
// });



import { 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    View, 
    Alert, 
    Platform,
    Linking 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import WifiManager from 'react-native-wifi-reborn';
import { iconSizes, spacing } from '../constants/dimension';
import { PermissionsAndroid } from 'react-native';

const HeaderWithVideo = ({ toggleTheme, isDarkMode }) => {
    const { colors } = useTheme();
    const [isConnected, setIsConnected] = useState(false);

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission Required',
                    message: 'This app needs access to your location to scan for Wi-Fi networks.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const checkWifiStatus = async () => {
        const isEnabled = await WifiManager.isEnabled();

        if (!isEnabled) {
            // Wi-Fi is off, show an alert and provide an option to go to settings
            Alert.alert(
                'Wi-Fi is off',
                'Please turn on Wi-Fi to connect to same network as the hardware.',
                [
                    // {
                    //     text: 'Go to Settings',
                    //     onPress: () => openWifiSettings(),
                    // },
                    { text: 'OK', style: 'cancel' },
                ],
                { cancelable: false }
            );
        } else {
            // Wi-Fi is already on
            setIsConnected(true);
            Alert.alert('Wi-Fi is on', 'You are connected to Wi-Fi!');
        }
    };

    // Function to open Wi-Fi settings page
    const openWifiSettings = () => {
        if (Platform.OS === 'android') {
            Linking.openURL('android.settings.WIFI_SETTINGS').catch((err) => {
                console.error('Failed to open Wi-Fi settings:', err);
                Alert.alert('Error', 'Unable to open Wi-Fi settings.');
            });
        } else if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:').catch((err) => {
                console.error('Failed to open settings:', err);
                Alert.alert('Error', 'Unable to open app settings.');
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { backgroundColor: isDarkMode ? colors.background : colors.card }]}>
                <Image 
                    source={require('../assets/logo.png')} 
                    style={[styles.logo, { tintColor: isDarkMode ? '#fff' : null }]}
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={toggleTheme}>
                        <Feather 
                            name={isDarkMode ? 'moon' : 'sun'} 
                            size={iconSizes.md} 
                            color={isDarkMode ? '#fff' : '#000'} 
                            accessibilityLabel="Toggle theme" 
                            accessibilityHint={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={checkWifiStatus} style={styles.wifiIcon}>
                        {isConnected ? (
                            <AntDesign name={'wifi'} size={iconSizes.lg} color={colors.iconPrimary} accessibilityLabel="Connected to WiFi" />
                        ) : (
                            <Feather name={'wifi-off'} size={iconSizes.lg} color={colors.iconPrimary} accessibilityLabel="Not connected to WiFi" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default HeaderWithVideo;

const styles = StyleSheet.create({
    container: {
        paddingTop: 0,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        elevation: 5,
    },
    logo: {
        width: 110,
        height: 80,
        resizeMode: 'contain',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    wifiIcon: {
        fontWeight: 'bold',
    },
});
