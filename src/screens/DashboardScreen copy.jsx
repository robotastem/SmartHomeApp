// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Switch,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   Bars3Icon,
//   BellIcon,
//   MagnifyingGlassIcon,
//   PlusIcon,
// } from "react-native-heroicons/outline";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// const DashboardScreen = () => {
//   const [selectedRoom, setSelectedRoom] = useState("Living room");

//   const rooms = ["Living room", "Bedroom", "Kitchen"];

//   const quickModes = [
//     { title: "Morning", icon: "weather-sunset-up" },
//     { title: "Evening", icon: "weather-sunset-down" },
//     { title: "At home", icon: "home" },
//     { title: "Exit home", icon: "exit-run" },
//     { title: "Smart Gen", icon: "flash" },
//   ];

//   const availableDevices = [
//     { title: "Air Conditioner", devices: "2 Devices connected", isOn: false, icon: "air-conditioner" },
//     { title: "Smart Lights", devices: "4 Devices connected", isOn: true, icon: "lightbulb-on" },
//     { title: "Smart TV", devices: "3 Devices connected", isOn: true, icon: "television" },
//     { title: "Smart plugs", devices: "12 Devices connected", isOn: false, icon: "power-plug" },
//   ];

//   const frequentlyUsed = [
//     { title: "Smart Generators", status: "Connected", isOn: true, icon: "engine" },
//     { title: "Smart Plugs", status: "Connected", isOn: true, icon: "power-plug" },
//     { title: "Air Conditioner", status: "Not Connected", isOn: false, icon: "air-conditioner" },
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-[#10002B] pt-3">
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* TOP BAR */}
//         <View className="flex-row justify-between items-center px-5 mt-2">
//           <Bars3Icon size={30} color="white" />

//           <View className="flex-row items-center space-x-4">
//             <Image
//               source={{ uri: "https://i.pravatar.cc/100" }}
//               className="w-10 h-10 rounded-full"
//             />
//             <BellIcon size={28} color="white" />
//           </View>
//         </View>

//         {/* GREETING */}
//         <View className="px-5 mt-6">
//           <Text className="text-white text-2xl font-bold">Hello Mr Williams</Text>
//           <Text className="text-[#CDB4DB] text-base mt-1">Welcome to your smart home</Text>

//           {/* ROOMS + ADD + SEARCH */}
//           <View className="flex-row justify-between items-center mt-5">
//             <TouchableOpacity>
//               <View className="w-10 h-10 rounded-full bg-[#C77DFF] flex items-center justify-center">
//                 <PlusIcon size={24} color="white" />
//               </View>
//             </TouchableOpacity>

//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <View className="flex-row space-x-3 ml-3">
//                 {rooms.map((room, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() => setSelectedRoom(room)}
//                     className={`px-5 py-2 rounded-full ${
//                       selectedRoom === room ? "bg-[#9D4EDD]" : "bg-[#4C1D95]"
//                     }`}
//                   >
//                     <Text className="text-white font-medium">{room}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </ScrollView>

//             <TouchableOpacity>
//               <MagnifyingGlassIcon size={26} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* QUICK MODES */}
//         <View className="px-5 mt-7">
//           <View className="bg-[#3C1361] p-4 rounded-2xl flex-row justify-between">
//             {quickModes.map((mode, i) => (
//               <TouchableOpacity key={i} className="items-center space-y-1">
//                 <Icon name={mode.icon} size={30} color="white" />
//                 <Text className="text-white text-xs">{mode.title}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* AVAILABLE DEVICES */}
//         <View className="px-5 mt-9">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-white text-base font-bold">Available Devices</Text>
//             <Text className="text-[#C77DFF] text-sm">See All</Text>
//           </View>

//           <View className="flex-row flex-wrap justify-between">
//             {availableDevices.map((device, index) => (
//               <View
//                 key={index}
//                 className="w-[48%] bg-[#C77DFF] p-4 rounded-xl mb-4"
//               >
//                 <Icon name={device.icon} size={30} color="white" />

//                 <Text className="text-white text-lg font-semibold mt-2">
//                   {device.title}
//                 </Text>

//                 <Text className="text-[#F2E9F7] text-xs mt-1">
//                   {device.devices}
//                 </Text>

//                 <View className="flex-row justify-between items-center mt-6">
//                   <Text className="text-white">{device.isOn ? "On" : "Off"}</Text>
//                   <Switch
//                     value={device.isOn}
//                     trackColor={{ false: "#ddd", true: "#5A189A" }}
//                     thumbColor="white"
//                   />
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* FREQUENTLY USED */}
//         <View className="px-5 mt-4 mb-16">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-white text-base font-bold">Frequently Used</Text>
//             <Text className="text-[#C77DFF] text-sm">See All</Text>
//           </View>

//           {frequentlyUsed.map((item, index) => (
//             <View
//               key={index}
//               className="bg-[#C77DFF] p-4 rounded-xl flex-row justify-between items-center mb-3"
//             >
//               <View className="flex-row items-center space-x-3">
//                 <Icon name={item.icon} size={26} color="white" />
//                 <View>
//                   <Text className="text-white text-base font-semibold">{item.title}</Text>
//                   <Text className="text-[#FBE7FF] text-xs mt-1">{item.status}</Text>
//                 </View>
//               </View>

//               <Switch
//                 value={item.isOn}
//                 trackColor={{ false: "#ddd", true: "#5A189A" }}
//                 thumbColor="white"
//               />
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default DashboardScreen;


















import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Heroicons
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
  BoltIcon,
  TvIcon,
  LightBulbIcon,
  PowerIcon
} from "react-native-heroicons/solid";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ---------- HEADER ---------- */}
        <View style={styles.headerRow}>
          <Bars3Icon size={30} color="#fff" />
          <View style={styles.profileWrapper}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150" }}
              style={styles.profileImg}
            />
            <BellIcon size={28} color="#fff" style={{ marginLeft: 10 }} />
          </View>
        </View>

        <Text style={styles.greeting}>Hello Mr Williams</Text>
        <Text style={styles.subGreeting}>Welcome to your smart home</Text>

        {/* Search */}
        <View style={{ alignItems: "flex-end", marginTop: 10 }}>
          <MagnifyingGlassIcon size={28} color="#fff" />
        </View>

        {/* ---------- ROOM TABS ---------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 25 }}
        >
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>

          {["Living room", "Bedroom", "Kitchen"].map((tab, i) => (
            <TouchableOpacity key={i} style={styles.roomTab}>
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ---------- SCENES ---------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 25 }}
        >
          {[
            { icon: <SunIcon color="#fff" size={24} />, label: "Morning" },
            { icon: <MoonIcon color="#fff" size={24} />, label: "Evening" },
            { icon: <HomeIcon color="#fff" size={24} />, label: "At home" },
            { icon: <ArrowRightEndOnRectangleIcon color="#fff" size={24} />, label: "Exit home" },
            { icon: <BoltIcon color="#fff" size={24} />, label: "Smart Gen" },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.sceneCard}>
              {item.icon}
              <Text style={styles.sceneLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ---------- AVAILABLE DEVICES ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Devices</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View style={styles.devicesGrid}>
          {[
            {
              title: "Air Conditioner",
              icon: <BoltIcon size={30} color="#fff" />,
              devices: 2,
              toggle: false,
            },
            {
              title: "Smart Lights",
              icon: <LightBulbIcon size={30} color="#fff" />,
              devices: 4,
              toggle: true,
            },
            {
              title: "Smart TV",
              icon: <TvIcon size={30} color="#fff" />,
              devices: 3,
              toggle: true,
            },
            {
              title: "Smart plugs",
              icon: <PowerIcon size={30} color="#fff" />,
              devices: 12,
              toggle: false,
            },
          ].map((item, i) => (
            <View key={i} style={styles.deviceCard}>
              {item.icon}
              <Text style={styles.deviceTitle}>{item.title}</Text>
              <Text style={styles.deviceSub}>{item.devices} Devices connected</Text>
              <Switch
                value={item.toggle}
                trackColor={{ false: "#aaa", true: "#8f3fff" }}
                thumbColor={item.toggle ? "#fff" : "#eee"}
              />
            </View>
          ))}
        </View>

        {/* ---------- FREQUENTLY USED ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequently used</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        {[
          { label: "Smart Generators", connected: true },
          { label: "Smart Plugs", connected: true },
          { label: "Air Conditioner", connected: false },
        ].map((item, i) => (
          <View key={i} style={styles.freqCard}>
            <Text style={styles.freqText}>{item.label}</Text>
            <Switch
              value={item.connected}
              trackColor={{ false: "#aaa", true: "#8f3fff" }}
              thumbColor={item.connected ? "#fff" : "#eee"}
            />
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#130024",
    paddingHorizontal: 20,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  profileWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  greeting: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "600",
    marginTop: 25,
  },
  subGreeting: {
    color: "#c4b8d9",
    fontSize: 16,
  },

  /* Room Tabs */
  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#9b4bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
  },
  addText: { color: "#fff", fontSize: 22 },
  roomTab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#9b4bff",
    borderRadius: 20,
    marginRight: 10,
  },
  tabText: { color: "#fff", fontSize: 14 },

  /* Scenes */
  sceneCard: {
    width: 110,
    height: 80,
    backgroundColor: "#9b4bff",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sceneLabel: {
    color: "#fff",
    marginTop: 8,
  },

  /* Sections */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    color: "#b982ff",
    fontSize: 14,
  },

  /* Device Cards */
  devicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  deviceCard: {
    width: "47%",
    backgroundColor: "#692cab",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  deviceTitle: {
    color: "#fff",
    fontSize: 15,
    marginTop: 10,
  },
  deviceSub: {
    color: "#e0cefa",
    fontSize: 12,
    marginBottom: 10,
  },

  /* Frequently Used */
  freqCard: {
    backgroundColor: "#9b4bff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  freqText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
