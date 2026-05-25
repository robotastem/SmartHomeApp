import {View, Text, Image, StyleSheet} from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileHeader = ({title}) => {
  const { user } = useAuth();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.profileContainer}>
        <Image
          source={{uri: 'https://randomuser.me/api/portraits/women/44.jpg'}}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>
          Welcome, <Text style={styles.userName}>{user.firstName}!</Text>
        </Text>
      </View>
      {title && <Text style={styles.titleText}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#4B39EF',
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  userName: {
    fontWeight: '700',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileHeader;
