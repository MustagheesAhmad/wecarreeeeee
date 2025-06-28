import { completeDoctorSignup } from "@/api/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DoctorSignupScreen() {
  const router = useRouter();
  const { name, email, image } = useLocalSearchParams();

  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [license, setLicense] = useState("");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    qualification: "",
    specialization: "",
    license: "",
    hospital: "",
    phone: "",
  });

  const validateFields = () => {
    const newErrors = {
      qualification: qualification ? "" : "Qualification is required",
      specialization: specialization ? "" : "Specialization is required",
      license: license ? "" : "License number is required",
      hospital: hospital ? "" : "Hospital/Clinic name is required",
      phone: phone ? "" : "Phone number is required",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleDoctorSignup = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        role: "Doctor",
        image,
        qualification,
        specialization,
        licenseNumber: license,
        hospital,
        phone,
      };

      await completeDoctorSignup(payload);
      alert("Doctor signed up successfully!");
      router.replace("/login/Login");
    } catch (err: any) {
      console.error("Signup failed:", err);
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => router.push("/login/Login");
  const goToSignup = () => router.push("/SignupScreen");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToSignup}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up</Text>
        <View style={{ width: 24 }} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your Qualification"
        placeholderTextColor="#D6CBCB"
        value={qualification}
        onChangeText={(text) => {
          setQualification(text);
          if (errors.qualification)
            setErrors((prev) => ({ ...prev, qualification: "" }));
        }}
      />
      {errors.qualification ? (
        <Text style={styles.errorText}>{errors.qualification}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Enter your Specialization"
        placeholderTextColor="#D6CBCB"
        value={specialization}
        onChangeText={(text) => {
          setSpecialization(text);
          if (errors.specialization)
            setErrors((prev) => ({ ...prev, specialization: "" }));
        }}
      />
      {errors.specialization ? (
        <Text style={styles.errorText}>{errors.specialization}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Enter License Number"
        placeholderTextColor="#D6CBCB"
        value={license}
        onChangeText={(text) => {
          setLicense(text);
          if (errors.license)
            setErrors((prev) => ({ ...prev, license: "" }));
        }}
      />
      {errors.license ? (
        <Text style={styles.errorText}>{errors.license}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Enter Clinic/Hospital Name"
        placeholderTextColor="#D6CBCB"
        value={hospital}
        onChangeText={(text) => {
          setHospital(text);
          if (errors.hospital)
            setErrors((prev) => ({ ...prev, hospital: "" }));
        }}
      />
      {errors.hospital ? (
        <Text style={styles.errorText}>{errors.hospital}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#D6CBCB"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
        }}
      />
      {errors.phone ? (
        <Text style={styles.errorText}>{errors.phone}</Text>
      ) : null}

      <TouchableOpacity onPress={goToLogin}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleDoctorSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#ffcce5",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#8B347B",
    height: 70,
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    color: "#999",
    fontSize: 16,
    fontWeight: "400",
    marginHorizontal: 20,
    height: 55,
    fontFamily: "Bree Serif",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginHorizontal: 25,
  },
  button: {
    backgroundColor: "#8B347B",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 35,
    height: 58,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Bree Serif",
  },
  link: {
    color: "#8B347B",
    textAlign: "right",
    fontSize: 16,
    fontFamily: "Bree Serif",
    paddingRight: 20,
    textDecorationLine: "underline",
    marginTop: 10,
  },
});
