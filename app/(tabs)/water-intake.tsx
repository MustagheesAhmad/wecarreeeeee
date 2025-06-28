import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function WaterIntakeTracker() {
  const navigation = useNavigation();
  const [goal, setGoal] = useState("1000");
  const [progress, setProgress] = useState(0);

  const parsedGoal = parseInt(goal);
  const percent =
    parsedGoal > 0 ? Math.round((progress / parsedGoal) * 100) : 0;

  const handleAddWater = () => {
    const newProgress = progress + 100;
    setProgress(Math.min(newProgress, parsedGoal));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with back and chatbot button only */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/ParentHome")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Water Intake Tracker</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Body */}
      <View style={styles.container}>
        <Text style={styles.subtext}>
          Ensure your baby stays hydrated{"\n"}with personalized tracking.
        </Text>

        <Text style={styles.label}>Set Daily Water Goal:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={goal}
          onChangeText={setGoal}
          placeholder="e.g. 1000 ml"
        />

        <TouchableOpacity style={styles.button} onPress={handleAddWater}>
          <View style={styles.buttonContent}>
            <Ionicons name="add" size={20} color="#FFD1EB" />
            <Text style={styles.buttonText}>Add Water Intake</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.historyRow}>
          <Text style={styles.historyLabel}>Daily History</Text>
          <TouchableOpacity>
            <Text style={styles.viewDetails}>View Details</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.progressLabel}>Today's Progress</Text>
        <Text style={styles.intakeText}>
          {progress} ml of {goal} ml
        </Text>

        <AnimatedCircularProgress
          size={150}
          width={12}
          fill={percent}
          tintColor="#8B347B"
          backgroundColor="#E0E0E0"
          style={{ alignSelf: "center", marginTop: 20 }}
        >
          {() => (
            <Text style={styles.percentText}>{`${percent}%`}</Text> 
          )}
        </AnimatedCircularProgress>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffcce5",
  },
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFD1EB",
  },
  subtext: {
    color: "#E91E63",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B347B",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  button: {
    backgroundColor: "#8B347B",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  historyLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#8B347B",
  },
  viewDetails: {
    color: "#333",
    fontWeight: "bold",
  },
  progressLabel: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
    color: "#8B347B",
  },
  intakeText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
  percentText: {
    fontSize: 22,
    color: "#8B347B",
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
  },
});
