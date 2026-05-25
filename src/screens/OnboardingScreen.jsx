import React from 'react';
import OnboardingSlide from './OnboardingSlide';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const slides = [
    {
      imageSource: require('../assets/images/swipe1.jpg'),
      title: 'Securing your home',
      title2: 'through automation',
      subtitle: 'With our customised smart home app, you can ensure security in your own home',
    },
    {
      imageSource: require('../assets/images/swipe22.jpg'),
      title: 'Take control of your ',
      title2: 'home',
      subtitle: 'Build your own dream home according to your own specifications',
    },
    {
      imageSource: require('../assets/images/ats.jpg'),
      title: 'Making your generators ',
      title2: 'smart',
      subtitle: 'We also make smart generators that automatically starts with a press of a button',
    },
  ];



  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      navigation.navigate('Login'); // Go to login screen
    } catch (error) {
      console.error('Error setting launch flag:', error);
    }
  };

  const onNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('LoginOrSignUp');
      // handleGetStarted();
    }
  };

  const onDotPress = (index) => {
    setCurrentIndex(index);
  };

  return (

    <SafeAreaView style={{ flex: 1 }} edges={['top']}>

    <OnboardingSlide
      imageSource={slides[currentIndex].imageSource}
      title={slides[currentIndex].title}
      title2={slides[currentIndex].title2}
      subtitle={slides[currentIndex].subtitle}
      selectedDotIndex={currentIndex}
      onNext={onNext}
      onDotPress={onDotPress}
    />

    </SafeAreaView>

  );
}
