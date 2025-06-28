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
  const res = await axios.post(`${BASE_URL}/api/auth/complete-doctor-signup`, payload);
  return res.data;
};
