import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  PlusIcon,
  ArrowRightIcon,
} from "react-native-heroicons/outline";
import { useNavigation, useRoute } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import addroom_bg from "../assets/images/addbg.jpg";

const devices = [
  {
    id: "ac",
    name: "Air Conditioner",
    hasBrand: true,
    brands: ["Samsung", "LG", "Hisense", "Daikin", "Others"],
  },
  {
    id: "tv",
    name: "Television",
    hasBrand: true,
    brands: ["Samsung", "LG", "Sony", "TCL", "Others"],
  },
  { id: "light", name: "Smart Lights", hasBrand: false },
  { id: "plug", name: "Smart Plug", hasBrand: false },
  { id: "fan", name: "Smart Fans", hasBrand: false },
];

export default function AddRoomDevicesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomName } = route.params;

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [addedDevices, setAddedDevices] = useState([]);

  const [roomImage, setRoomImage] = useState(null);

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showRoomPhotoModal, setShowRoomPhotoModal] = useState(false);

  /* ---------------- CAMERA & GALLERY ---------------- */

  const pickFromCamera = () => {
    launchCamera({ mediaType: "photo", quality: 0.8 }, (res) => {
      if (!res.didCancel && !res.errorCode) {
        setRoomImage(res.assets[0]);
        setShowRoomPhotoModal(false);
      }
    });
  };

  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (res) => {
      if (!res.didCancel && !res.errorCode) {
        setRoomImage(res.assets[0]);
        setShowRoomPhotoModal(false);
      }
    });
  };

  /* ---------------- ADD DEVICE ---------------- */

  const addDeviceToRoom = () => {
    setAddedDevices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: selectedDevice.name,
        brand: selectedDevice.hasBrand ? selectedBrand : null,
        quantity,
      },
    ]);

    setSelectedBrand(null);
    setQuantity(1);
    setShowQuantityModal(false);
  };

  /* ---------------- VALIDATION BEFORE PROCEED ---------------- */

  const handleProceed = () => {
    if (addedDevices.length === 0) {
      Alert.alert("No Devices", "Please add at least one device to the room.");
      return;
    }

    if (!roomImage) {
      Alert.alert("Room Photo Required", "Please add a photo of the room.");
      return;
    }

    // ✅ Everything valid — continue
    Alert.alert("Success", "Room setup completed successfully!");

    // navigation.navigate("NextScreen", { roomData: ... });
  };

  return (
    <ImageBackground source={addroom_bg} style={{ flex: 1 }}>
      <View style={styles.overlay} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{roomName}</Text>
        </View>

        <Text style={styles.pageTitle}>Add Room Devices</Text>

        {/* ADDED DEVICES */}
        {addedDevices.length > 0 && (
          <View style={styles.addedContainer}>
            <Text style={styles.sectionTitle}>Added to Room</Text>

            {addedDevices.map((item) => (
              <View key={item.id} style={styles.addedRow}>
                <Text style={styles.addedItem}>
                  {item.quantity} × {item.name}
                  {item.brand ? ` (${item.brand})` : ""}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setAddedDevices((prev) =>
                      prev.filter((d) => d.id !== item.id)
                    )
                  }
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* DEVICE LIST */}
        <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
          {devices.map((item) => (
            <View key={item.id} style={styles.deviceItem}>
              <View style={styles.deviceRow}>
                <Text style={styles.deviceText}>{item.name}</Text>

                <TouchableOpacity
                  style={styles.plusBtn}
                  onPress={() => {
                    setSelectedDevice(item);
                    setSelectedBrand(null);

                    if (item.hasBrand) {
                      setShowBrandModal(true);
                    } else {
                      setShowQuantityModal(true);
                    }
                  }}
                >
                  <PlusIcon size={18} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.underline} />
            </View>
          ))}
        </ScrollView>

        {/* FIXED BUTTON */}
        <View style={styles.fixedBtn}>
          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={() => setShowRoomPhotoModal(true)}
          >
            <Text style={styles.proceedText}>
              {roomImage ? "Change Room Photo" : "Add Room Photo"}
            </Text>
            <ArrowRightIcon size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.proceedBtn, { marginTop: 10 }]}
            onPress={handleProceed}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* BRAND MODAL */}
      <Modal visible={showBrandModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Select {selectedDevice?.name} Brand
            </Text>

            <ScrollView>
              {selectedDevice?.brands?.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => {
                    setSelectedBrand(brand);
                    setShowBrandModal(false);
                    setShowQuantityModal(true);
                  }}
                >
                  <Text style={styles.modalItem}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* QUANTITY MODAL */}
      <Modal visible={showQuantityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              How many {selectedDevice?.name}?
            </Text>

            <View style={styles.counterRow}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.counterBtn}>−</Text>
              </TouchableOpacity>

              <Text style={styles.counterValue}>{quantity}</Text>

              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <Text style={styles.counterBtn}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={addDeviceToRoom}>
              <Text style={{ color: "white" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ROOM PHOTO MODAL + PREVIEW */}
      <Modal visible={showRoomPhotoModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Room Photo</Text>

            {roomImage && (
              <Image
                source={{ uri: roomImage.uri }}
                style={styles.previewImage}
              />
            )}

            <TouchableOpacity style={styles.confirmBtn} onPress={pickFromCamera}>
              <Text style={{ color: "white" }}>Snap Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, { marginTop: 10 }]}
              onPress={pickFromGallery}
            >
              <Text style={{ color: "white" }}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#10002B80",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
  },
  pageTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
  },
  addedContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  addedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  addedItem: {
    color: "white",
    opacity: 0.9,
  },
  removeText: {
    color: "#FF6B6B",
    fontSize: 14,
  },
  deviceItem: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceText: {
    color: "white",
    fontSize: 18,
  },
  plusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  underline: {
    height: 1,
    backgroundColor: "white",
    opacity: 0.3,
    marginTop: 10,
  },
  fixedBtn: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  proceedBtn: {
    backgroundColor: "#5A189A",
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  proceedText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1B0033",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  modalItem: {
    color: "white",
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ffffff33",
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  counterBtn: {
    fontSize: 32,
    color: "white",
    paddingHorizontal: 20,
  },
  counterValue: {
    fontSize: 32,
    color: "white",
    fontWeight: "700",
  },
  confirmBtn: {
    backgroundColor: "#5A189A",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
});
