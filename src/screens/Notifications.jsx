import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon, SpeakerWaveIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedNotifications, setGroupedNotifications] = useState({});

  // Fetch notifications data
  useEffect(() => {
    // Mock API call
    const fetchData = async () => {
      try {
        // Mock notifications data
        const mockNotifications = [
          {
            id: '1',
            type: 'Debit Transaction',
            message:
              'Your account incured a debit transaction, kindly fund your wallet, to avoid this message, to fund your wallet, goto the dashboard and click the button',
            date: '2025-03-17T10:30:00',
            read: false,
          },
          {
            id: '2',
            type: 'Credit Alert',
            message: 'Your account has been credited with ₦20,000.00',
            date: '2025-03-16T14:22:00',
            read: true,
          },
          {
            id: '3',
            type: 'Security Alert',
            message: 'A new device was used to access your account',
            date: '2025-03-15T09:45:00',
            read: false,
          },
        ];

        setNotifications(mockNotifications);

        // Group notifications by date
        const grouped = mockNotifications.reduce((groups, notification) => {
          const date = new Date(notification.date);
          const dateKey = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          ).toISOString();

          if (!groups[dateKey]) {
            groups[dateKey] = [];
          }

          groups[dateKey].push(notification);
          return groups;
        }, {});

        setGroupedNotifications(grouped);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return date.toLocaleDateString('en-US', options);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#4B39EF]">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-4 relative">
        <TouchableOpacity
          className="absolute left-4 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Notifications</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 bg-white rounded-t-3xl">
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#4B39EF" />
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No notifications yet</Text>
          </View>
        ) : (
          <View className="py-4 px-4">
            {Object.entries(groupedNotifications).map(([dateKey, items]) => (
              <View key={dateKey} className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {formatDate(dateKey)}
                </Text>

                {items.map(notification => (
                  <View
                    key={notification.id}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 mb-3">
                    <View className="flex-row items-start">
                      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                        <SpeakerWaveIcon size={20} color="#111" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-base text-gray-900">
                          {notification.type}
                        </Text>
                        <Text className="text-gray-600 mt-1">
                          {notification.message}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Loading indicator */}
        {notifications.length > 0 && (
          <View className="py-6 items-center">
            <ActivityIndicator size="small" color="#4B39EF" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
