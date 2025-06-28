import API from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('bino@example.com');
  const [password, setPassword] = useState('securepassword');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const goToSignup = () => {
    router.push('/signup/DoctorSignup');
  };

  const handleLogin = async () => {
  const newErrors = {
    email: email.trim() ? '' : 'Email is required',
    password: password ? '' : 'Password is required',
  };
  console.log("🚀 ~ handleLogin ~ newErrors.password:", password)
  console.log("🚀 ~ handleLogin ~ newErrors.email:", email)

  setErrors(newErrors);
  if (newErrors.email || newErrors.password) return;

  try {
    const response = await API.post('/auth/login', {
      email,
      password,
    });

    const token = response.data.token; // get JWT from backend
    const userId=response.data?.user?._id;
    await AsyncStorage.setItem('userId',userId)
    // Store token in AsyncStorage
    await AsyncStorage.setItem('token', token);
    if(token){
      await AsyncStorage.setItem('token', token);
      router.push('/login/SuccessfulScreen');

    }
    

    console.log('✅ Login successful! Token saved.');

  } catch (error) {
    console.error('❌ Login error:', error);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToSignup}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Centered Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.image}
        />
      </View>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }}
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        }}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity onPress={goToSignup}>
        <Text style={styles.bottomLink}>
          Don't have an account? <Text style={styles.text}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffcce5',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#8B347B',
    height: 70,
  },
  backText: {
    fontSize: 24,
    color: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  image: {
    width: 203,
    height: 168,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    color: '#000',
    fontSize: 16,
    marginHorizontal: 20,
    height: 55,
    fontFamily: 'Bree Serif',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginHorizontal: 25,
  },
  button: {
    backgroundColor: '#8B347B',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 35,
    height: 58,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Bree Serif',
  },
  link: {
    color: '#8B347B',
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Bree Serif',
    paddingRight: 20,
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  bottomLink: {
    color: '#8B347B',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Bree Serif',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  text: {
    color: '#D39494',
  },
});
