import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://192.168.0.103:5000';


export const signupUser = async (formData: FormData) => {
  console.log('FormData content:');
  formData.forEach((value, key) => {
    console.log(key, value);
  });
  const res = await axios.post(`${BASE_URL}/api/auth/signup`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const completeDoctorSignup = async (payload: any) => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) throw new Error("User ID not found in AsyncStorage");

    const updatedPayload = { userId, ...payload };

    const res = await axios.post(`${BASE_URL}/api/auth/complete-doctor-signup`, updatedPayload);
    return res.data;
  } catch (error: any) {
    console.error("❌ Doctor signup failed:", error?.response?.data || error.message);
    throw error;
  }
};
