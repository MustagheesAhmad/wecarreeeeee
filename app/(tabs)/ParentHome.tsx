import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MotherHomeScreen() {
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showDietPlanModal, setShowDietPlanModal] = useState(false);

  const iconData = [
    {
      label: "Vaccination",
      source: require("../../assets/images/vaccination.png"),
      route: "/add-vaccination",
    },
    {
      label: "Diet Plan",
      source: require("../../assets/images/dietplan.png"),
      route: "/NewRemedy",
    },
    {
      label: "Milestones",
      source: require("../../assets/images/milestone.png"),
      route: "/add-milestone",
    },
    {
      label: "Motivational Quotes",
      source: require("../../assets/images/quote.png"),
      route: "/add-quote",
    },
    {
      label: "Activities",
      source: require("../../assets/images/activity.png"),
      route: "/water-intake",
    },
    {
      label: "Remedies",
      source: require("../../assets/images/remedie.png"),
      route: "/NewRemedy",
    },
  ] as const;

  const handlePlusPress = () => {
    const selected = iconData.find((item) => item.label === selectedFeature);
    if (selected) {
      if (selected.label === "Diet Plan") {
        setShowDietPlanModal(true); // Show modal for Diet Plan
      } else {
        router.push(selected.route as any);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/login/SuccessfulScreen")}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.grid}>
          {iconData.map((item, index) => {
            const isSelected = selectedFeature === item.label;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.gridItemWrapper,
                  isSelected && styles.selectedWrapper,
                ]}
                onPress={() => setSelectedFeature(item.label)}
              >
                <View
                  style={[
                    styles.gridItem,
                    isSelected && styles.selectedGridItem,
                  ]}
                >
                  <Image
                    source={item.source}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.iconLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.footerText}>Your health, our priority</Text>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.floatingPlus}
            onPress={handlePlusPress}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={showDietPlanModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Choose Diet Plan</Text>

              <TouchableOpacity
  style={styles.modalButton}
  onPress={() => {
    setShowDietPlanModal(false);
    router.push({
      pathname: "/choose-doctor",
      params: { planType: "mother" },
    });
  }}
>
  <Text style={styles.modalButtonText}>Mother Diet Plan</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.modalButton}
  onPress={() => {
    setShowDietPlanModal(false);
    router.push({
      pathname: "/choose-doctor",
      params: { planType: "child" },
    });
  }}
>
  <Text style={styles.modalButtonText}>Child Diet Plan</Text>
</TouchableOpacity>


              <TouchableOpacity
                onPress={() => setShowDietPlanModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcce5",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    marginBottom: 30,
    backgroundColor: "#8B347B",
    height: 80,
  },
  backText: {
    fontSize: 24,
    color: "#fff",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  gridItemWrapper: {
    width: "48%",
    alignItems: "center",
    marginBottom: 20,
  },
  selectedWrapper: {
    borderColor: "#8B347B",
  },
  gridItem: {
    backgroundColor: "#8B347B",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 145,
    height: 154,
  },
  selectedGridItem: {
    backgroundColor: "#b052a3",
  },
  icon: {
    width: 110,
    height: 110,
  },
  iconLabel: {
    color: "#8B347B",
    fontSize: 16,
    fontFamily: "Bree Serif",
    marginTop: 8,
  },
  footerText: {
    fontSize: 16,
    color: "#8B347B",
    fontFamily: "Bree Serif",
    textAlign: "center",
    marginVertical: 10,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    zIndex: 1,
    paddingTop: 5,
  },

  floatingPlus: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#ffcce5",
    borderWidth: 4,
    borderColor: "#8B347B",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  plusText: {
    color: "#8B347B",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B347B",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#ffcce5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8B347B",
  },
  modalButtonText: {
    color: "#8B347B",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#999",
    fontSize: 14,
  },
});
