import { useVaccinations } from "@/context/VaccinationContext";
import API from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VaccinationTrackerScreen() {
  const { vaccinations, updateStatus, deleteVaccination } = useVaccinations();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [vaccinationsData, setVaccinationsData] = useState([]);
const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const openModal = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };
  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const babyId = await AsyncStorage.getItem("babyId");
        if (!babyId) return;
  
        const response = await API.get(`/vaccination/all/${babyId}`);
        setVaccinationsData(response.data?.vaccinations || []);
      } catch (error) {
        console.error("❌ Error fetching vaccinations:", error?.response?.data || error?.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVaccinations();
  }, []);
  const handleDeleteVaccination = async (vaccinationId: string) => {
    try {
      const babyId = await AsyncStorage.getItem("babyId");
      if (!babyId) return;
  
      await API.delete(`/vaccination/delete/${babyId}/${vaccinationId}`);
  
      // Filter out the deleted vaccination
      setVaccinationsData(prev =>
        prev.filter(vaccination => vaccination._id !== vaccinationId)
      );
    } catch (error) {
      console.error("❌ Error deleting vaccination:", error?.response?.data || error?.message);
    }
  };
  
  

  const handleStatusUpdate = () => {
    if (selectedId) updateStatus(selectedId, "Completed");
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/ParentHome")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vaccination Tracker</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={vaccinationsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isCompleted = item.status === "Completed";

          return (
            <View style={styles.card}>
              <Ionicons name="medkit" size={24} color="#8B347B" />

              <View style={styles.cardText}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{item.name}</Text>

                  {/* Make status badge clickable to open modal */}
                  <TouchableOpacity
                    onPress={() => openModal(item.id)}
                    disabled={isCompleted} // Disable if already completed
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.statusBadge,
                        isCompleted && styles.statusCompleted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isCompleted && styles.statusTextCompleted,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={styles.date}>Due: {new Date(item.nextDueDate).toLocaleDateString()}</Text>
                <Text style={styles.date}>Last: {new Date(item.lastVaccinationDate).toLocaleDateString()}</Text>
              </View>

              {/* Ellipsis & Delete */}
              <View style={styles.menuWrapper}>
                <TouchableOpacity
                  onPress={() =>
                    setMenuOpenId((prev) => (prev === item.id ? null : item.id))
                  }
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={18}
                    color="#8B347B"
                  />
                </TouchableOpacity>

                {menuOpenId === item.id && (
                  <TouchableOpacity
                    style={styles.deleteBox}
                    onPress={() => {
                      handleDeleteVaccination(item._id);
                      setMenuOpenId(null);
                    }}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          router.push("/add-vaccination");
        }}
      >
        <Text style={styles.addButtonText}>Add Vaccination</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="none">
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.modalText}>
              Did you complete your child’s vaccination?
            </Text>
            <TouchableOpacity
              onPress={handleStatusUpdate}
              style={styles.modalItem}
            >
              <Text style={styles.modalText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalItem}>
              <Text style={styles.modalText}>No</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffcce5" },
  header: {
    height: 70,
    backgroundColor: "#8B347B",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 15,
    alignItems: "flex-start",
    position: "relative",
  },
  cardText: {
    marginLeft: 12,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#E8D5EB",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    right:20,
  },
  statusCompleted: {
    backgroundColor: "#D0F0D7",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8B347B",
  },
  statusTextCompleted: {
    color: "#2E7D32",
  },
  addButton: {
    backgroundColor: "#8B347B",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 135,
    marginHorizontal: 15,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#8B347B",
  },
  menuWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "flex-end",
    zIndex: 10,
  },
  deleteBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d33",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  deleteText: {
    color: "#d33",
    fontWeight: "bold",
    fontSize: 13,
  },
});
