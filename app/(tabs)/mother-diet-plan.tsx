import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const mealTimes = [
  "Breakfast",
  "Mid-Morning Snack",
  "Lunch",
  "Evening Snack",
  "Dinner",
];

export default function MotherDietPlanScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mealInputs, setMealInputs] = useState<{
    [key: string]: { food?: string; portion?: string };
  }>({});
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const toggleExpand = (meal: string) => {
    setExpanded(expanded === meal ? null : meal);
  };

  const handleInputChange = (
    meal: string,
    field: "food" | "portion",
    value: string
  ) => {
    setMealInputs((prev) => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value,
      },
    }));
  };

  const handleRequestDiet = () => {
    router.push("/Payment");
  };

  // const handleMakePayment = () => {
  //   router.push('/Payment');
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/ParentHome")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mother Diet Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Customize Meal Plan:</Text>

        {mealTimes.map((meal) => (
          <View key={meal} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleExpand(meal)}
            >
              <Text style={styles.cardTitle}>{meal}</Text>
              <AntDesign
                name={expanded === meal ? "minuscircleo" : "pluscircleo"}
                size={20}
                color="#8e3e63"
              />
            </TouchableOpacity>

            {expanded === meal && (
              <View style={styles.inputs}>
                <Text style={styles.label}>Food Item:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Boiled egg"
                  value={mealInputs[meal]?.food || ""}
                  onChangeText={(text) => handleInputChange(meal, "food", text)}
                />

                <Text style={styles.label}>Portion Size:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2 pieces, 1 bowl"
                  value={mealInputs[meal]?.portion || ""}
                  onChangeText={(text) =>
                    handleInputChange(meal, "portion", text)
                  }
                />
              </View>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => router.push("/chat-bot")}
        >
          <Ionicons name="chatbubbles" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRequestDiet}>
          <Text style={styles.buttonText}>Request Diet Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFD1EB",
  },
  header: {
    backgroundColor: "#8B347B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7A007A",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6a1b4d",
  },
  inputs: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7A007A",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#8B347B",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
    width: 230,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  chatbotButton: {
    position: "absolute",
    bottom: 20,
    right: 30,
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
