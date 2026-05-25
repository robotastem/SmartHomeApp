import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ArrowRightIcon } from 'react-native-heroicons/solid';
import LinearGradient from 'react-native-linear-gradient';

// const { width, height } = Dimensions.get('window');

const OnboardingSlide = ({
  imageSource,
  title,
  subtitle,title2,
  selectedDotIndex,
  onNext,
  onDotPress,
}) => {
  return (
    <ImageBackground source={imageSource} style={styles.background} resizeMode="cover">
      <LinearGradient
        colors={[
          'rgba(16, 0, 43, 0.9)',
          'rgba(16, 0, 43, 0.66)',
          'rgba(16, 0, 43, 0.27)',
          'rgba(16, 0, 43, 0)',
        ]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.contentOverlay}
      >
        <Text className='text-4xl' style={styles.title}>{title}</Text>
        <Text className='text-4xl' style={styles.title2}>{title2}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* Pagination + Arrow in one row */}
        <View style={styles.bottomRow}>
          <View style={styles.pagination}>
            {[0, 1, 2].map((i) => {
              const isActive = i === selectedDotIndex;

              return (
                <TouchableOpacity key={i} onPress={() => onDotPress(i)}>
                  <View style={[styles.dot, isActive && styles.activeDot]} />
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.8}>
            <ArrowRightIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default OnboardingSlide;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // width,
    height:'100%',
    justifyContent: 'flex-end',
    // ...StyleSheet.absoluteFillObject,
  },

  contentOverlay: {
    paddingHorizontal: 25,
    paddingVertical: 70,
  },

  title: {
    color: 'white',
    fontWeight: '900',
    // fontSize: 26,
    marginBottom: -5,
  },
  title2: {
    color: 'white',
    fontWeight: '900',
    // fontSize: 26,
    marginBottom: 10,

  },

  subtitle: {
    color: 'white',
    fontWeight: '300',
    fontSize: 15,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },

  pagination: {
    flexDirection: 'row',
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#fff',
  },

  activeDot: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#B259FF',
    shadowColor: '#B259FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 10,
    width: 13,
    height: 13,
  },

  nextButton: {
    backgroundColor: '#B259FF',
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});