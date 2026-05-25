import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TextInput } from "react-native";
// import {  } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, LinkIcon, PlusIcon } from "react-native-heroicons/outline";
import { ChevronLeftIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import ceo_office_img from "../assets/images/ceo_office.jpeg";
import coding_class_img from "../assets/images/coding_class.jpeg";
import reception_img from "../assets/images/reception.jpeg";
import corridor_img from "../assets/images/corridor.jpeg";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const rooms = [
  {
    name: "CEO Office",
    devices: "12 Devices",
    image: ceo_office_img,
  },
  {
    name: "Coding Class",
    devices: "13 Devices",
    image: coding_class_img,
  },
  {
    name: "Reception",
    devices: "13 Devices",
    image: reception_img,
  },
  {
    name: "Passage",
    devices: "13 Devices",
    image: corridor_img,
  },
  
];

const AddRoomScreen = () => {

    const navigation = useNavigation();

    const [showModal, setShowModal] = React.useState(false);
    const [roomName, setRoomName] = React.useState("");

  
  return (
    <SafeAreaView className="flex-1 bg-[#10002B] pt-3">

      {/* SCROLL CONTENT */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }} // important!
      >

        {/* HEADER */}
        <View className="flex-row items-center justify-between p-5 mt-2">

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={28} color="white" />
          </TouchableOpacity>

          <Text
            className="text-white text-xl font-bold text-center"
          >
            My Rooms
          </Text>

          <TouchableOpacity>
            {/* <PlusIcon 
              size={28} 
              color="white"
              style={{
                backgroundColor: "#B259FF",
                borderRadius: 100,
                padding: 10,
              }}
            /> */}
          </TouchableOpacity>
        </View>


        {/* ROOM LIST */}
        <View className="px-5 mt-6">
          {rooms.map((room, index) => (
            <TouchableOpacity key={index} className="mb-5 rounded-2xl overflow-hidden">
              <Image
                source={room.image}
                className="w-full h-40"
                style={{ borderRadius: 16 }}
              />

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "70%",
                  borderRadius: 16,
                }}
              />


              <View 
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 15,
                }}
              >
                <Text className="text-white text-xl font-bold">{room.name}</Text>
                <Text className="text-white text-sm opacity-80">{room.devices}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* FIXED FOOTER BUTTONS */}
      {!showModal &&
        (<View
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
          }}
        >
          {/* ADD ROOM BUTTON */}
          <TouchableOpacity onPress={()=>setShowModal(true)} className="bg-[#5A189A] py-4 rounded-full flex-row items-center justify-center mb-3">
            <PlusCircleIcon size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Add Room
            </Text>
          </TouchableOpacity>

          {/* CONNECT TO SMART GEN */}
          <TouchableOpacity className="border border-[#5A189A] py-4 mt-5 rounded-full flex-row items-center justify-center">
            {/* <ConnectionIcon></ConnectionIcon> */}
            <LinkIcon size={24} color="#5A189A" />
            <Text className="text-[#5A189A] text-lg font-semibold mx-2">
              Connect to Smart Gen
            </Text>
          </TouchableOpacity>
        </View>)
      }




      {/* ADD ROOM MODAL */}
      <Modal
      transparent
      animationType="fade"
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      {/* DARK BACKDROP */}
      <View className="flex-1 bg-black/40 justify-center items-center px-6">

        {/* WHITE CARD */}
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: 18,
            paddingVertical: 25,
            paddingHorizontal: 22,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          {/* TITLE */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 25,
              color: "#000",
            }}
          >
            Set name for new room
          </Text>

          {/* TEXT INPUT (Underline only) */}
          <TextInput
            value={roomName}
            onChangeText={setRoomName}
            placeholder="Enter room name..."
            placeholderTextColor="#777"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#C6C6C6",
              fontSize: 17,
              paddingVertical: 6,
              marginBottom: 35,
            }}
          />

          {/* BUTTON ROW */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* CANCEL */}
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "600" }}>
                Cancel
              </Text>
            </TouchableOpacity>

            {/* MAKE ROOM */}
            <TouchableOpacity
              onPress={() => {
                if (!roomName.trim()) return;

                navigation.navigate("AddRoomDevices", {
                  roomName: roomName.trim(),
                });

                setShowModal(false);
                setRoomName("");
              }}
              style={{
                backgroundColor: "#7209B7",
                paddingVertical: 10,
                paddingHorizontal: 22,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
                Create room
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>


    </SafeAreaView>
  );
};

export default AddRoomScreen;
