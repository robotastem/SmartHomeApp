import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Modal, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';

const RemoteControl = ({ socket }) => {  // Accept socket as a prop
    const { colors } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleBorder = () => {
        setIsToggled(!isToggled);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setIsToggled(false);
    };

    const sendCommand = (command) => {
        if (socket) {
            socket.emit('command', command);
        } else {
            console.warn('Socket is not connected');
        }
    };

    // Inline component for Remote Control Buttons
    const RemoteControlButtons = () => (
        <View style={[styles.remoteControlContainer, { borderColor: isPlaying ? '#4CAF50' : '#FF5252' }]}>
            <View style={styles.directionButtons}>
                <TouchableOpacity 
                    style={styles.directionButton} 
                    onPress={() => sendCommand('move_forward')}
                >
                    <FontAwesome name="arrow-up" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.horizontalButtons}>
                    <TouchableOpacity 
                        style={styles.directionButton} 
                        onPress={() => sendCommand('turn_left')}
                    >
                        <FontAwesome name="arrow-left" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.directionButton, styles.playPauseButton]} 
                        onPress={togglePlayPause}
                    >
                        <AntDesign name={isPlaying ? "pause" : "play"} size={30} color={isPlaying ? "#FF5252" : "#069e85"} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.directionButton} 
                        onPress={() => sendCommand('turn_right')}
                    >
                        <FontAwesome name="arrow-right" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.directionButton} 
                    onPress={() => sendCommand('move_backward')}
                >
                    <FontAwesome name="arrow-down" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Hide default remote when modal is visible */}
            {!modalVisible && <RemoteControlButtons />}

            {/* Floating Button */}
            <TouchableOpacity 
                style={[styles.floatingButton, isToggled && styles.floatingButtonToggled]} 
                onPress={toggleBorder}
            >
                <AntDesign 
                    name={'camerao'} 
                    size={30} 
                    color={colors.iconPrimary} 
                    accessibilityLabel="Toggle Border" 
                />
            </TouchableOpacity>

            {/* Sweet Alert Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <AntDesign name="close" size={30} color="black" />
                        </TouchableOpacity>
                        <Video
                            source={require('../assets/rover_vid.mp4')}
                            style={styles.modalVideo}
                            resizeMode="contain"
                            paused={false}
                            repeat={true}
                        />
                        {/* Remote Control Buttons in Modal */}
                        <RemoteControlButtons />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RemoteControl;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
    },
    remoteControlContainer: {
        width: 150,
        height: 150,
        backgroundColor: 'black',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.2,
        borderBottomColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 10,
    },
    directionButtons: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    horizontalButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    directionButton: {
        padding: 8,
    },
    playPauseButton: {
        backgroundColor: '#fff',
        borderRadius: 100,
        padding: 8,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'transparent',
        borderRadius: 30,
        padding: 10,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingButtonToggled: {
        borderColor: 'skyblue', 
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 400,
        height: 400,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 50,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalVideo: {
        width: 350,
        height: 200,
        marginVertical: 20,
        borderRadius: 20,
    },
});
