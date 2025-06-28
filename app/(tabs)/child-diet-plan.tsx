import API from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomizeDietPlanScreen() {
  const [form, setForm] = useState({
    name: "",
    babyName: "",
    age: "",
    weight: "",
    height: "",
    concerns: "",
    foods: "",
  });
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();


  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.babyName.trim()) newErrors.babyName = "Baby name is required";
    if (!form.age.trim()) newErrors.age = "Age is required";
    if (!form.weight.trim()) newErrors.weight = "Weight is required";
    if (!form.height.trim()) newErrors.height = "Height is required";
    if (!form.concerns.trim()) newErrors.concerns = "Dietary concerns required";
    if (!form.foods.trim()) newErrors.foods = "Preferred foods are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }
  
    try {
      const parentId = await AsyncStorage.getItem("userId");
      if (!parentId) {
        Alert.alert("Error", "Parent ID not found in storage.");
        return;
      }
  
      const payload = {
        ...form,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        doctorId,
        parentId,
      };
  
      const response = await API.post("/dietplan/submit", payload);
  
      console.log("✅ Submitted:", response.data);
  
      router.push("/choose-doctor");
  
      setTimeout(() => {
        Alert.alert("Success", "Diet plan submitted successfully");
      }, 100);
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Server Error:", error.response.data);
      } else {
        console.error("❌ Error:", error.message);
      }
      Alert.alert("Error", "Failed to submit diet plan");
    }
  };
  
  

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/ParentHome")}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customize Diet Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.label}>Your Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#D6CBCB"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Text style={styles.label}>Baby Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter baby name"
        placeholderTextColor="#D6CBCB"
        value={form.babyName}
        onChangeText={(text) => handleChange("babyName", text)}
      />
      {errors.babyName && <Text style={styles.error}>{errors.babyName}</Text>}

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Enter Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Baby's age"
            placeholderTextColor="#D6CBCB"
            value={form.age}
            onChangeText={(text) => handleChange("age", text)}
            keyboardType="numeric"
          />
          {errors.age && <Text style={styles.error}>{errors.age}</Text>}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Enter Weight:</Text>
          <TextInput
            style={styles.input}
            placeholder="Baby's weight"
            placeholderTextColor="#D6CBCB"
            value={form.weight}
            onChangeText={(text) => handleChange("weight", text)}
            keyboardType="numeric"
          />
          {errors.weight && <Text style={styles.error}>{errors.weight}</Text>}
        </View>
      </View>

      <Text style={styles.label}>Enter Height:</Text>
      <TextInput
        style={styles.input}
        placeholder="Baby's height"
        placeholderTextColor="#D6CBCB"
        value={form.height}
        onChangeText={(text) => handleChange("height", text)}
        keyboardType="numeric"
      />
      {errors.height && <Text style={styles.error}>{errors.height}</Text>}

      <Text style={styles.label}>Enter Dietary Concerns:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., allergies, dietary needs"
        placeholderTextColor="#D6CBCB"
        value={form.concerns}
        onChangeText={(text) => handleChange("concerns", text)}
        multiline
      />
      {errors.concerns && <Text style={styles.error}>{errors.concerns}</Text>}

      <Text style={styles.label}>Preferred Foods:</Text>
      <TextInput
        style={styles.input}
        placeholder="List any preferred foods"
        placeholderTextColor="#D6CBCB"
        value={form.foods}
        onChangeText={(text) => handleChange("foods", text)}
        multiline
      />
      {errors.foods && <Text style={styles.error}>{errors.foods}</Text>}
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => router.push("/chat-bot")}
      >
        <Ionicons name="chatbubbles" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
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
  backText: {
    fontSize: 24,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8B347B",
    marginVertical: 5,
    marginHorizontal: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 5,
    color: "#000",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  continueButton: {
    backgroundColor: "#952D93",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    marginRight: 70,
    marginLeft:10,
    marginBottom: 30,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  chatbotButton: {
    position: "absolute",
    bottom: 30,
    right: 10,
    backgroundColor: "#8B347B",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
