import API from "@/utils/api";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import defaultProfileImage from "../../assets/images/profile-icon.png";

interface Doctor {
  _id: string;
  fullName: string;
  role: string;
  email: string;
  profilePhoto: string | null;
}

export default function RequestDietPlanScreen() {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { planType } = useLocalSearchParams(); // 👈 get planType

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get("/auth/get-all-doctors");
        console.log("📥 Doctors fetched:", response.data.doctors);
        setDoctors(response.data.doctors || []);
      } catch (error) {
        console.error("❌ Failed to fetch doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/ParentHome")}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Diet Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.list}>
        {doctors.map((item) => (
          <View key={item._id} style={styles.card}>
            <Image
              source={item.profilePhoto ? { uri: item.profilePhoto } : defaultProfileImage}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.specialization}>Nutritionist</Text>
              <Text style={styles.fee}>Fee: Rs 2000</Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.viewProfile}>
                <Text style={styles.buttonText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
  style={styles.requestButton}
  onPress={() => {
    const routePath =
      planType === "mother" ? "/mother-diet-plan" : "/child-diet-plan";
    router.push({
      pathname: routePath,
      params: {
        doctorId: item._id,
        planType,
      },
    });
  }}
>
  <Text style={styles.buttonText}>Request Diet Plan</Text>
</TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => {
          router.push("/child-diet-plan");
        }}
      >
        <Text style={styles.bottomButtonText}>Request Diet Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffcce5" },
  header: {
    backgroundColor: "#8B347B",
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  backText: { fontSize: 24, color: "#fff" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  list: { flex: 1 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  image: { width: 60, height: 60, borderRadius: 30, marginRight: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  specialization: { fontSize: 12, color: "#777" },
  fee: { marginTop: 4, fontWeight: "500" },
  buttons: { justifyContent: "space-between", alignItems: "flex-end", gap: 5 },
  viewProfile: {
    backgroundColor: "#fff",
    borderColor: "#952D93",
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
  },
  requestButton: {
    backgroundColor: "#8B347B",
    borderRadius: 6,
    padding: 6,
  },
  buttonText: { color: "#fff", fontSize: 12 },
  bottomButton: {
    backgroundColor: "#8B347B",
    padding: 16,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
  },
  bottomButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
