import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DoneButtonComponent = ({onDone}) => {
    return (
        <TouchableOpacity style={styles.doneButton} onPress={onDone}>
            <Text style={styles.doneButtonText}>Let's Start</Text>
        </TouchableOpacity>
    );
};

const DotComponent = ({ selected }) => {
    return (
        <View
            style={{
                height: selected ? 10 : 6,
                width: selected ? 20 : 6,
                marginHorizontal: 6,
                borderRadius: 30,
                backgroundColor: selected ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
            }}
        />
    );
};

const OnboardingScreen = () => {
    const navigation = useNavigation();

    const onDone = async () => {
        // Save to AsyncStorage to avoid showing onboarding again
        await AsyncStorage.setItem('hasLaunched', 'true');
        navigation.navigate('Home');
    };

    return (
        <Onboarding
            DoneButtonComponent={() => <DoneButtonComponent onDone={onDone} />}
            // DoneButtonComponent={DoneButtonComponent}
            DotComponent={DotComponent}
            onDone={onDone}
            onSkip={onDone}
            pages={[
                {
                    backgroundColor: '#047548',
                    image: <Image source={require('../assets/swiper_images/start.png')} />,
                    title: 'Welcome!',
                    subtitle: 'Control your generator with ease, all from your device.',
                },
                {
                    backgroundColor: '#026e53',
                    image: <Image source={require('../assets/swiper_images/smart1-nobg.png')} />,
                    title: 'Track Fuel Levels in Real-Time!',
                    subtitle: 'Monitor your generator\'s fuel level to ensure optimal performance and avoid unexpected downtime.',
                },
                {
                    backgroundColor: '#047548',
                    image: <Image source={require('../assets/swiper_images/start2.png')} />,
                    title: 'Service Reminder Alerts',
                    subtitle: 'Keep track of servicing schedules and receive timely reminders to maintain your generator in top condition.',
                },
            ]}
        />
    );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
    doneButton: {
        marginHorizontal: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        // backgroundColor: '#A76BCF',
        borderRadius: 5,
    },
    doneButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
