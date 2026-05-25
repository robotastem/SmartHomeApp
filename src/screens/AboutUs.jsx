import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProfileHeader from '../components/ProfileHeader';

const AboutUs = () => {
  const handleLinkPress = url => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4B39EF" barStyle="light-content" />

      {/* Reusable Profile Header */}
      <ProfileHeader />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageTitle}>About Us</Text>

        <View style={styles.contentBox}>
          <Text style={styles.paragraph}>
            Lorem ipsum is a dummy or placeholder text commonly used in graphic
            design, publishing, and web development. Its purpose is to permit a
            page layout to be designed, independently of the{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Copy')
              }>
              copy
            </Text>{' '}
            that will subsequently populate it, or to demonstrate various{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Font')
              }>
              fonts
            </Text>{' '}
            of a{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Typeface')
              }>
              typeface
            </Text>{' '}
            without meaningful text that could be distracting.
          </Text>

          <Text style={styles.paragraph}>
            Lorem ipsum is typically a corrupted version of{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress(
                  'https://en.wikipedia.org/wiki/De_finibus_bonorum_et_malorum',
                )
              }>
              De finibus bonorum et malorum
            </Text>
            , a 1st-century BC text by the{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Ancient_Rome')
              }>
              Roman
            </Text>{' '}
            statesman and philosopher{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Cicero')
              }>
              Cicero
            </Text>
            , with words altered, added, and removed to make it nonsensical and
            improper{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Latin')
              }>
              Latin
            </Text>
            . The first two words themselves are a{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Truncation')
              }>
              truncation
            </Text>{' '}
            of dolorem ipsum ("pain itself").
          </Text>

          <Text style={styles.paragraph}>
            Versions of the Lorem ipsum text have been used in{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Typesetting')
              }>
              typesetting
            </Text>{' '}
            at least since the 1960s, when it was popularized by advertisements
            for{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Letraset')
              }>
              Letraset
            </Text>{' '}
            transfer sheets.[1] Lorem ipsum was introduced to the digital world
            in the mid-1980s, when{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/Aldus')
              }>
              Aldus
            </Text>{' '}
            employed it in graphic and word-processing templates for its desktop
            publishing program{' '}
            <Text
              style={styles.link}
              onPress={() =>
                handleLinkPress('https://en.wikipedia.org/wiki/PageMaker')
              }>
              PageMaker
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3ADD',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  contentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 15,
  },
  link: {
    color: '#4B39EF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default AboutUs;
