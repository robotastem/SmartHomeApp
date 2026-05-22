import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import from react-native-vector-icons

const PlanFloor = ({ robotPosition }) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.planFloor}
                source={require('../assets/floor_plan.png')}
            />
            {/* Location Marker */}
            <View
                style={[
                    styles.marker,
                    {
                        left: robotPosition.x,
                        top: robotPosition.y,
                    },
                ]}
            >
                <TouchableOpacity>
                    <Icon name="location-on" size={30} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PlanFloor;

const styles = StyleSheet.create({
    container: {
        position: 'relative', // Make parent view relative
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planFloor: {
        width: 300, 
        height: 300, 
    },
    marker: {
        position: 'absolute', // Marker positioned absolutely
        width: 30, // Width of the marker icon
        height: 30, // Height of the marker icon
        justifyContent: 'center',
        alignItems: 'center',
    },
});
