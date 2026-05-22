import { Text, Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { spacing } from '../constants/dimension';
import PlanFloor from '../components/PlanFloor';
import RemoteControl from '../components/RemoteControl';
import BottomNavBar from '../components/BottomNavBar';
import io from 'socket.io-client';
import FuelLevel from '../components/FuelLevel';
import ServiceCountDown from '../components/ServiceCountDown';
import PowerControl from '../components/PowerControl';
// import ProgressCircle from 'react-native-progress-circle'

const HomeScreen = ({ toggleTheme, isDarkMode, navigation }) => {
    // const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 });
    // const [socket, setSocket] = useState(null);

    // useEffect(() => {
    //     // Connect to your Raspberry Pi server
    //     const newSocket = io('http://<Raspberry_Pi_IP>:<PORT>'); // Replace with your Raspberry Pi's IP and port
    //     setSocket(newSocket);

    //     // Clean up the socket connection on unmount
    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, []);

    return (
        <View style={styles.container}>
            <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <FuelLevel percent={94} isDarkMode={isDarkMode}/>
                <ServiceCountDown initialTime={30} />
                <PowerControl/>
                {/* <PlanFloor robotPosition={robotPosition} /> */}
                {/* <RemoteControl socket={socket} />  */}
            </ScrollView>
            <BottomNavBar navigation={navigation} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        width: '100%',
        height: 200,
        marginTop: 80,
    },
    scrollContainer: {
        padding: spacing.md,
        paddingBottom: 80,
    },
});
