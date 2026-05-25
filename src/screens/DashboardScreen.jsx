import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const DashboardScreen = () => {

  // const navigate = useNavigation(); 
  const navigation = useNavigation();
  
  const [selectedRoom, setSelectedRoom] = useState("CEO Office");

  const rooms = ["CEO Office", "Reception", "Coding class", "Passage"];

  const quickModes = [
    // { title: "Morning", icon: "weather-sunset-up" },
    // { title: "Evening", icon: "weather-sunset-down" },
    { title: "At home", icon: "home" },
    { title: "Exit home", icon: "exit-run" },
    { title: "Smart Gen", icon: "flash" },
  ];

  const availableDevices = [
    { title: "Air Conditioner", devices: "2 Devices connected", isOn: false, icon: "air-conditioner" },
    { title: "Smart Lights", devices: "4 Devices connected", isOn: true, icon: "lightbulb-on" },
    { title: "Smart TV", devices: "3 Devices connected", isOn: true, icon: "television" },
    { title: "Smart plugs", devices: "12 Devices connected", isOn: false, icon: "power-plug" },
  ];

  const frequentlyUsed = [
    { title: "Smart Generators", status: "Connected", isOn: true, icon: "engine" },
    { title: "Smart Plugs", status: "Connected", isOn: true, icon: "power-plug" },
    { title: "Air Conditioner", status: "Not Connected", isOn: false, icon: "air-conditioner" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#10002B] pt-3">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOP BAR */}
        <View className="flex-row justify-between items-center px-5 mt-2">
          <Bars3Icon size={28} color="white" style={{backgroundColor:'#B259FF',borderRadius:'100%',padding:15}} />

          <View className="flex-row items-center space-x-4">
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              className="w-14 h-14 rounded-full m-5"
            />
            <BellIcon size={28} color="white" className="m-5" style={{backgroundColor:'#B259FF',borderRadius:'100%',padding:12}} />
          </View>
        </View>

        {/* GREETING */}
        <View className="px-5 mt-6">
          <View style={{display:'flex',justifyContent:'space-between',}} className="flex justify-between">
            <Text className="text-white text-2xl font-bold">Hello Mr Williams</Text>
            <Text className="text-[#CDB4DB] text-base mt-1">Welcome to your smart home</Text>

            <TouchableOpacity>
                <MagnifyingGlassIcon size={26} color="white" />
            </TouchableOpacity>
          </View>
          

          {/* ROOMS + ADD + SEARCH */}
          <View className="flex-row justify-between items-center mt-5">
            <TouchableOpacity onPress={()=>navigation.navigate('AddRoom')}>
              <View className="w-10 h-10 rounded-full bg-[#C77DFF] flex items-center justify-center">
                <PlusIcon size={24} color="white" />
              </View>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row space-x-3 ml-3">
                {rooms.map((room, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedRoom(room)}
                    className={`px-5 mx-1 py-2 rounded-full ${
                      selectedRoom === room ? "bg-[#9D4EDD]" : "bg-[#4C1D95]"
                    }`}
                  >
                    <Text className="text-white font-medium">{room}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            
          </View>
        </View>

        {/* QUICK MODES */}
        <View className="px-5 mt-7">
          <View className="bg-[#E0AAFF] p-4 rounded-2xl flex-row justify-between">
            {quickModes.map((mode, i) => (
              <TouchableOpacity key={i} className="items-center space-y-1">
                <Icon name={mode.icon} size={30} color="#B259FF"  className="bg-[#fff] rounded-full w-12 p-2" />
                <Text className="text-white text-xs">{mode.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AVAILABLE DEVICES */}
        <View className="px-5 mt-9">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-base font-bold">Available Devices</Text>
            <Text className="text-[#C77DFF] text-sm">See All</Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {availableDevices.map((device, index) => (
              <View
                key={index}
                className="w-[48%] bg-[#E0AAFF] p-4 rounded-xl mb-4"
              >
                <Icon name={device.icon} size={25} color="white" className="bg-[#B259FF] rounded-full w-12 p-2" />

                <Text className="text-black text-lg font-bold mt-2">
                  {device.title}
                </Text>

                <Text className="text-[#B259FF] text-xs mt-1">
                  {device.devices}
                </Text>

                <View className="flex-row justify-between items-center mt-6">
                  <Text className="text-white">{device.isOn ? "On" : "Off"}</Text>
                  <Switch
                    value={device.isOn}
                    trackColor={{ false: "#ddd", true: "#5A189A" }}
                    thumbColor="white"
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* FREQUENTLY USED */}
        <View className="px-5 mt-4 mb-16">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-base font-bold">Frequently Used</Text>
            <Text className="text-[#C77DFF] text-sm">See All</Text>
          </View>

          {frequentlyUsed.map((item, index) => (
            <View
              key={index}
              className="bg-[#C77DFF] p-4 rounded-xl flex-row justify-between items-center mb-3"
            >
              <View className="flex-row items-center space-x-3">
                <Icon name={item.icon} size={26} color="white" />
                <View>
                  <Text className="text-white text-base font-semibold">{item.title}</Text>
                  <Text className="text-[#FBE7FF] text-xs mt-1">{item.status}</Text>
                </View>
              </View>

              <Switch
                value={item.isOn}
                trackColor={{ false: "#ddd", true: "#5A189A" }}
                thumbColor="white"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
