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
  { id: "door", name: "Smart Doors", hasBrand: false },
  { id: "fridge", name: "Smart Fridge", hasBrand: false },
];

const raspberryPins = [
  "GPIO 2",
  "GPIO 3",
  "GPIO 4",
  "GPIO 14",
  "GPIO 15",
  "GPIO 17",
  "GPIO 18",
  "GPIO 27",
  "GPIO 22",
  "GPIO 23",
  "GPIO 24",
  "GPIO 25",
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

  const [showGatewayModal, setShowGatewayModal] = useState(false);

  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  /* ---------------- CAMERA & GALLERY ---------------- */

  const pickFromCamera = () => {
    launchCamera({ mediaType: "photo", quality: 0.8 }, (res) => {
      if (!res.didCancel && !res.errorCode && res.assets?.length > 0) {
        setRoomImage(res.assets[0]);
        setShowRoomPhotoModal(false);
      }
    });
  };

  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (res) => {
      if (!res.didCancel && !res.errorCode && res.assets?.length > 0) {
        setRoomImage(res.assets[0]);
        setShowRoomPhotoModal(false);
      }
    });
  };

  /* ---------------- ADD OR UPDATE DEVICE ---------------- */

  const addDeviceToRoom = () => {
    setAddedDevices((prev) => {
      const existingIndex = prev.findIndex(
        (d) =>
          d.name === selectedDevice.name &&
          d.brand === (selectedDevice.hasBrand ? selectedBrand : null)
      );

      // UPDATE EXISTING
      if (existingIndex !== -1) {
        const updated = [...prev];

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity,
        };

        return updated;
      }

      // ADD NEW
      return [
        ...prev,
        {
          id: Date.now(),
          name: selectedDevice.name,
          brand: selectedDevice.hasBrand ? selectedBrand : null,
          quantity,
        },
      ];
    });

    setSelectedBrand(null);
    setQuantity(1);
    setShowQuantityModal(false);
  };

  /* ---------------- VALIDATION ---------------- */

  const handleProceed = () => {
    if (addedDevices.length === 0) {
      Alert.alert("No Devices", "Please add at least one device.");
      return;
    }

    if (!roomImage) {
      Alert.alert("Room Photo Required", "Please add room photo.");
      return;
    }

    setShowGatewayModal(true);
  };

  return (
    <ImageBackground
      source={roomImage ? { uri: roomImage.uri } : addroom_bg}
      style={{ flex: 1 }}
    >
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

        {/* PIN DISPLAY */}
        {selectedPin && (
          <View style={styles.pinDisplay}>
            <Text style={styles.pinText}>
              Connected Port: {selectedPin}
            </Text>
          </View>
        )}

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
        <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
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
                      // Brand devices handled later
                      setQuantity(1);
                      setShowBrandModal(true);
                    } else {
                      // Non-brand devices
                      const existingDevice = addedDevices.find(
                        (d) => d.name === item.name
                      );

                      if (existingDevice) {
                        setQuantity(existingDevice.quantity);
                      } else {
                        setQuantity(1);
                      }

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

        {/* FIXED BUTTONS */}
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
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => {
            Alert.alert(
              "Close Brand Selection?",
              "Your current selection will be lost.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Close",
                  style: "destructive",
                  onPress: () => {
                    setShowBrandModal(false);
                    setSelectedBrand(null);
                    setQuantity(1);
                  },
                },
              ]
            );
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              Select {selectedDevice?.name} Brand
            </Text>

            <ScrollView>
              {selectedDevice?.brands?.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => {
                    setSelectedBrand(brand);

                    const existingDevice = addedDevices.find(
                      (d) =>
                        d.name === selectedDevice.name &&
                        d.brand === brand
                    );

                    if (existingDevice) {
                      setQuantity(existingDevice.quantity);
                    } else {
                      setQuantity(1);
                    }

                    setShowBrandModal(false);
                    setShowQuantityModal(true);
                  }}
                >
                  <Text style={styles.modalItem}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* QUANTITY MODAL */}
      <Modal visible={showQuantityModal} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => {
            Alert.alert(
              "Close Quantity Selection?",
              "Changes made here will not be saved.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Close",
                  style: "destructive",
                  onPress: () => {
                    setShowQuantityModal(false);
                    setQuantity(1);
                  },
                },
              ]
            );
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              How many {selectedDevice?.name}?
            </Text>

            {selectedBrand && (
              <Text style={styles.brandLabel}>
                Brand: {selectedBrand}
              </Text>
            )}

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

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={addDeviceToRoom}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {addedDevices.find(
                  (d) =>
                    d.name === selectedDevice?.name &&
                    d.brand ===
                      (selectedDevice?.hasBrand
                        ? selectedBrand
                        : null)
                )
                  ? "Update"
                  : "Add"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ROOM PHOTO MODAL */}
      {/* ROOM PHOTO MODAL */}
      <Modal visible={showRoomPhotoModal} transparent animationType="slide">
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => {
            Alert.alert(
              "Close Photo Selection?",
              "Your room photo changes may not be saved.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Close",
                  style: "destructive",
                  onPress: () => {
                    setShowRoomPhotoModal(false);
                  },
                },
              ]
            );
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Add Room Photo</Text>

            {roomImage && (
              <Image
                source={{ uri: roomImage.uri }}
                style={styles.previewImage}
              />
            )}

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={pickFromCamera}
            >
              <Text style={{ color: "white" }}>Snap Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, { marginTop: 10 }]}
              onPress={pickFromGallery}
            >
              <Text style={{ color: "white" }}>
                Upload from Gallery
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* GATEWAY MODAL */}
      <Modal visible={showGatewayModal} transparent animationType="fade">
        <View style={styles.gatewayOverlay}>
          <View style={styles.gatewayBox}>
            <View style={styles.gatewayTextContainer}>
              <Text style={styles.gatewayTitle}>
                Map To Connection Port Available
              </Text>

              <Text style={styles.gatewaySub}>
                Before adding device, connect port configuration
              </Text>
            </View>

            {/* CONFIGURE PORT */}
            <TouchableOpacity
              style={styles.gatewayActionBtn}
              onPress={() => {
                setShowGatewayModal(false);
                setShowPinModal(true);
              }}
            >
              <Text style={styles.gatewayActionText}>
                Configure Port (PIN)
              </Text>
            </TouchableOpacity>

            {/* EDIT ROOM */}
            <TouchableOpacity
              style={styles.gatewayActionBtn}
              onPress={() => setShowGatewayModal(false)}
            >
              <Text style={styles.gatewayActionText}>
                Edit Room Details
              </Text>
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity
              style={[
                styles.gatewayActionBtn,
                { borderBottomWidth: 0 },
              ]}
              onPress={() => setShowGatewayModal(false)}
            >
              <Text style={styles.gatewayCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PIN MODAL */}
      <Modal visible={showPinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Select Raspberry Pi GPIO Pin
            </Text>

            <ScrollView>
              {raspberryPins.map((pin) => (
                <TouchableOpacity
                  key={pin}
                  style={styles.pinItem}
                  onPress={() => {
                    setSelectedPin(pin);
                    setShowPinModal(false);

                    Alert.alert(
                      "Port Configured",
                      `${roomName} mapped to ${pin}`
                    );
                  }}
                >
                  <Text style={styles.modalItem}>{pin}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

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

  pinDisplay: {
    alignSelf: "center",
    backgroundColor: "#5A189A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },

  pinText: {
    color: "white",
    fontWeight: "600",
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
    opacity: 0.95,
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
    maxHeight: "70%",
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
    paddingVertical: 14,
  },

  pinItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#ffffff33",
  },

  brandLabel: {
    color: "#C77DFF",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
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

  gatewayOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  gatewayBox: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },

  gatewayTextContainer: {
    padding: 24,
    alignItems: "center",
  },

  gatewayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },

  gatewaySub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },

  gatewayActionBtn: {
    width: "100%",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    alignItems: "center",
  },

  gatewayActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  gatewayCancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7B2CBF",
  },
});