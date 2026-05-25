import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
  } from 'react-native';
  import {useNavigation} from '@react-navigation/native';
  import {ArrowLeftIcon, BellIcon} from 'react-native-heroicons/outline';
  import { SpeakerWaveIcon } from 'react-native-heroicons/outline';

  
  const Notifications = () => {
    const navigation = useNavigation();
  
    // Sample notifications (you can replace this with API data)
    const notifications = [
      {
        id: 1,
        title: 'Debit Transaction',
        message: 'Your account incured a debit transaction, kindly fund your wallet, to avoid this message, to fund your wallet, goto the dashboard and click the button',
        time: '2 hours ago',
      },
    ];
  
    // Notification card component
    const NotificationCard = ({title, message, time}) => (
  <View className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm flex-row">
    <SpeakerWaveIcon size={40} color="#000" />
    <View className="flex-1 mx-3">
      <Text className="font-semibold text-gray-800 mb-1">{title}</Text>
      <Text className="text-gray-600 text-sm">{message}</Text>
      <Text className="text-xs text-gray-400 mt-2">{time}</Text>
    </View>
  </View>
);

  
    return (
      <SafeAreaView className="flex-1 bg-[#4B39EF]">
        {/* Header */}
        <View className="flex-row items-center justify-center px-4 py-16 relative">
          <TouchableOpacity
            className="absolute left-4"
            onPress={() => navigation.goBack()}>
            <ArrowLeftIcon size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Notifications</Text>
        </View>
  
        {/* Content */}
        <View className="flex-1 bg-white rounded-t-3xl px-4 pt-6">
          <Text className=" text-black px-2 py-2">17th March, 2025</Text>
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  title={notification.title}
                  message={notification.message}
                  time={notification.time}
                />
              ))
            ) : (
              <View className="flex-1 justify-center items-center mt-20">
                <BellIcon size={64} color="gray" />
                <Text className="text-gray-500 mt-4">No notifications yet</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
  
  export default Notifications;
  