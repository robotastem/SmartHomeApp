// import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ChevronLeftIcon,
  PlusIcon,
  PowerIcon,
  InformationCircleIcon,
  PencilSquareIcon,
} from "react-native-heroicons/outline";

// import {
//   FanIcon,
//   TvIcon,
//   BoltIcon,
//   LightBulbIcon,
//   HomeIcon,
// } from "react-native-heroicons/solid";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import LinearGradient from "react-native-linear-gradient";

import living_room_bg from "../assets/images/addbg.jpg";

const roomDevices = [
  {
    id: 1,
    name: "Smart Fans",
    status: "Powered off",
    active: false,
    icon: "fan",
  },
  {
    id: 2,
    name: "AC",
    brand: "Samsung",
    status: "Powered on",
    active: true,
    icon: "ac",
  },
  {
    id: 3,
    name: "TV",
    brand: "LG",
    status: "Powered off",
    active: false,
    icon: "tv",
  },
  {
    id: 4,
    name: "Smart Plug",
    status: "Powered on",
    active: true,
    icon: "plug",
  },
  {
    id: 5,
    name: "Smart Lights",
    status: "Powered on",
    active: true,
    icon: "light",
  },
  {
    id: 6,
    name: "Fridge",
    brand: "Hisense",
    status: "Powered off",
    active: false,
    icon: "fridge",
  },
  {
    id: 7,
    name: "Smart Door",
    status: "Powered on",
    active: true,
    icon: "door",
  },
];

const RoomDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomName, roomImage } = route.params;

//   const renderDeviceIcon = (type, active) => {
//     const color = active ? "#C77DFF" : "white";

//     switch (type) {
//       case "fan":
//         return <FanIcon size={28} color={color} />;

//       case "tv":
//         return <TvIcon size={28} color={color} />;

//       case "plug":
//         return <BoltIcon size={28} color={color} />;

//       case "light":
//         return <LightBulbIcon size={28} color={color} />;

//       case "door":
//         return <HomeIcon size={28} color={color} />;

//       case "fridge":
//         return <HomeIcon size={28} color={color} />;

//       case "ac":
//         return <FanIcon size={28} color={color} />;

//       default:
//         return <HomeIcon size={28} color={color} />;
//     }
//   };

const renderDeviceIcon = (type, active) => {
  const color = active ? "#C77DFF" : "white";

  switch (type) {
    case "fan":
      return (
        <MaterialCommunityIcons
          name="fan"
          size={28}
          color={color}
        />
      );

    case "tv":
      return (
        <MaterialCommunityIcons
          name="television"
          size={28}
          color={color}
        />
      );

    case "plug":
      return (
        <MaterialCommunityIcons
          name="power-plug"
          size={28}
          color={color}
        />
      );

    case "light":
      return (
        <MaterialCommunityIcons
          name="lightbulb"
          size={28}
          color={color}
        />
      );

    case "door":
      return (
        <MaterialCommunityIcons
          name="door"
          size={28}
          color={color}
        />
      );

    case "fridge":
      return (
        <MaterialCommunityIcons
          name="fridge-outline"
          size={28}
          color={color}
        />
      );

    case "ac":
      return (
        <MaterialCommunityIcons
          name="air-conditioner"
          size={28}
          color={color}
        />
      );

    default:
      return (
        <MaterialCommunityIcons
          name="home"
          size={28}
          color={color}
        />
      );
  }
};

  return (
    <ImageBackground
    //   source={living_room_bg}
    source={roomImage || living_room_bg}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />

      {/* DARK OVERLAY */}
      <LinearGradient
        colors={[
          "rgba(16,0,43,0.72)",
          "rgba(16,0,43,0.60)",
          "rgba(16,0,43,0.82)",
        ]}
        style={styles.overlay}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={24} color="white" />
          </TouchableOpacity>

          {/* <Text style={styles.headerTitle}>Living Room</Text> */}
          <Text style={styles.headerTitle}>{roomName}</Text>

          <TouchableOpacity style={styles.addCircle}>
            <PlusIcon size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* DEVICE LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 28,
            paddingBottom: 140,
          }}
        >
          {roomDevices.map((device) => (
            <View key={device.id}>
              <View style={styles.deviceRow}>
                {/* LEFT SECTION */}
                <View style={styles.leftSection}>
                  <View style={styles.iconContainer}>
                    {renderDeviceIcon(
                      device.icon,
                      device.active
                    )}
                  </View>

                  <View style={{ marginLeft: 15 }}>
                    <Text style={styles.deviceName}>
                      {device.name}
                    </Text>

                    <Text style={styles.deviceSub}>
                      {device.brand
                        ? `${device.brand} • ${device.status}`
                        : device.status}
                    </Text>
                  </View>
                </View>

                {/* RIGHT ACTIONS */}
                <View style={styles.rightSection}>
                  <TouchableOpacity>
                    <PowerIcon
                      size={21}
                      color={
                        device.active
                          ? "#C77DFF"
                          : "rgba(255,255,255,0.95)"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 15 }}>
                    <InformationCircleIcon
                      size={21}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 15 }}>
                    <PencilSquareIcon
                      size={21}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* DIVIDER */}
              <View style={styles.divider} />
            </View>
          ))}
        </ScrollView>

        {/* ADD DEVICE BUTTON */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.addButton}>
            <PlusIcon size={18} color="white" />

            <Text style={styles.addButtonText}>
              Add Device
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RoomDetailsScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  headerTitle: {
    color: "white",
    fontSize: 21,
    fontWeight: "700",
  },

  addCircle: {
    width: 34,
    height: 34,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  deviceName: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  deviceSub: {
    color: "rgba(255,255,255,0.72)",
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },

  addButton: {
    height: 58,
    borderRadius: 35,
    backgroundColor: "#6A1BBD",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});