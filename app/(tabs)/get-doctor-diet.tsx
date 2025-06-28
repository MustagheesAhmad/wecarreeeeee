import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import API from "../../utils/api";
// Example props type
interface Request {
  _id: string;
  doctorId: string;
  parentId: string;
  name: string;
  babyName: string;
  age: number;
  weight: number;
  height: number;
  createdAt: string;
}

interface Props {
  requests: Request[];
}

export const DoctorRequestCard: React.FC<Props> = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

   const getDoctorRequests = async (doctorId: string) => {
    try {
      const response = await API.get(`/dietplan/doctor-requests`, {
        params: {
          doctorId: doctorId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor requests:", error);
      throw error;
    }
  };
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = (await AsyncStorage.getItem("userId")) || "";
        const data = await getDoctorRequests(userId);
        setRequests(data.requests);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const renderItem = ({ item }: { item: Request }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Request ID: {item._id}</Text>
        <Text style={styles.field}>Doctor ID: {item.doctorId}</Text>
        <Text style={styles.field}>Parent ID: {item.parentId}</Text>
        <Text style={styles.field}>Parent Name: {item.name}</Text>
        <Text style={styles.field}>Baby Name: {item.babyName}</Text>
        <Text style={styles.field}>Age: {item.age} months</Text>
        <Text style={styles.field}>Weight: {item.weight} kg</Text>
        <Text style={styles.field}>Height: {item.height} ft</Text>
        <Text style={styles.date}>
          Created At: {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  field: {
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },
});

export default DoctorRequestCard;
