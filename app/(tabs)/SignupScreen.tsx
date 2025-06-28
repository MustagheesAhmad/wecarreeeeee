import { signupUser } from '@/api/auth';
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';

export default function Signup() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(300))[0];
  const [fontsLoaded, setFontsLoaded] = useState(false);
    const [password, setPassword] = useState('');  // <-- Added password state
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '', 
    // image: '',
    role: '',
  });
const handleParentSignup = async () => {
  // Validate inputs
  const errors = {
    name: name.trim() ? '' : 'Name is required',
    email: email.trim() ? '' : 'Email is required',
    password: password.trim() ? '' : 'Password is required',
    // image: image ? '' : 'Profile photo is required',
    role: role === 'Parent' ? '' : 'Please select Parent role to continue',
  };

  setFormErrors(errors);
  const isValid = Object.values(errors).every((err) => err === '');
  if (!isValid) return;

  setLoading(true);
  setError('');

  try {
    const formData = new FormData();

    formData.append('fullName', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password', 'defaultPassword123');
    formData.append('role', 'parent');

    // Convert base64 image to blob
    const blob = await (await fetch(image!)).blob();
    formData.append('profilePhoto', {
      uri: image!,
      name: 'profile.jpg',
      type: blob.type || 'image/jpeg',
    } as any);

    // Log formData entries here
    console.log('FormData content:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Call API
    await signupUser(formData);

    // Show success notification
    if (Platform.OS === 'android') {
      ToastAndroid.show('Signup successful!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', 'Signup successful!');
    }
  } catch (err: any) {
    console.error('Signup error:', err.response?.data || err.message || err);
    setError(err.response?.data?.message || err.message || 'Signup failed');
  } finally {
    setLoading(false);
  }
};




  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // reduced quality for smaller base64 size
      base64: true,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      // Sometimes type can be undefined, fallback to jpeg
      const mimeType = pickedImage.type || 'image/jpeg';
      const base64Image = `data:${mimeType};base64,${pickedImage.base64}`;
      setImage(base64Image);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const selectRole = (selectedRole: string) => {
    setRole(selectedRole);
    closeModal();

    if (selectedRole === 'Doctor') {
      router.push({
        pathname: '/signup/DoctorSignup',
        params: { name, email, image },
      });
    }
  };

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Bree Serif': require('../../assets/fonts/BreeSerif-Regular.ttf'),
          'Poppins': require('../../assets/fonts/Poppins-Regular.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/WelcomeScreen')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sign up</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Image source={require('../../assets/images/profile-icon.png')} style={styles.profileIcon} />
          )}
        </View>
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileHeading}>Profile photo</Text>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.uploadText}>Click to upload profile photo</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Input Fields */}
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#D6CBCB"
        style={styles.input}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: '' }));
        }}
      />
      {formErrors.name ? <Text style={styles.errorText}>{formErrors.name}</Text> : null}

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#D6CBCB"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: '' }));
        }}
      />
      {formErrors.email ? <Text style={styles.errorText}>{formErrors.email}</Text> : null}
      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#D6CBCB"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: '' }));
        }}
      />
      {formErrors.password ? <Text style={styles.errorText}>{formErrors.password}</Text> : null}


      {/* Role Selector */}
      <TouchableOpacity style={styles.roleSelector} onPress={openModal}>
        <Text style={{
          color: role ? '#00000099' : '#D6CBCB',
          fontFamily: role ? 'Poppins' : 'Bree Serif',
        }}>
          {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Select your Role'}
        </Text>
      </TouchableOpacity>
      {formErrors.role ? <Text style={styles.errorText}>{formErrors.role}</Text> : null}


      {error ? <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text> : null}
      <TouchableOpacity onPress={()=>router.push('/login/Login')}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleParentSignup} disabled={loading || !name || !email || role !== 'Parent'}>
        <Text style={styles.buttonText}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>



      <Modal transparent visible={modalVisible} animationType="none">
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity onPress={() => selectRole('Doctor')} style={styles.modalItem}>
              <Text style={styles.modalText}>Doctor</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectRole('Parent')} style={styles.modalItem}>
              <Text style={styles.modalText}>Parent</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcce5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 30,
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
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileIcon: {
    width: 70,
    height: 70,
    tintColor: '#8B347B',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 25,
  },
  profileTextContainer: {
    marginLeft: 5,
  },
  profileHeading: {
    fontSize: 18,
    color: '#8B347B',
    fontWeight: '400',
    fontFamily: 'Bree Serif',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginHorizontal: 25,
  },
  uploadText: {
    fontSize: 14,
    paddingTop: 5,
    color: '#DE6ECF',
    fontWeight: '400',
    fontFamily: 'Bree Serif',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    color: '#999',
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 25, // Added horizontal margin
    height: 55,
    fontFamily: 'Bree Serif',
    marginBottom: 25,
  },
  roleSelector: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 25, // Added horizontal margin
    height: 55,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Bree Serif',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    height: 188,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#00000099',
    fontWeight: '400',
    fontFamily: 'Poppins',
  },
  button: {
    backgroundColor: '#8B347B',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 35,
    height: 58,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Bree Serif',
  },
  link: {
    color: '#8B347B',
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Bree Serif',
    paddingRight: 20,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
