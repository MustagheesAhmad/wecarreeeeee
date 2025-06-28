import API from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddBabyScreen() {
    const [babyName, setBabyName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [showDobPicker, setShowDobPicker] = useState(false);
    const [touched, setTouched] = useState(false);

    const [errors, setErrors] = useState({
        babyName: '',
        dob: '',
        gender: '',
        weight: '',
        height: '',
    });

    const validateFields = () => {
        const newErrors = {
            babyName: babyName.trim() ? '' : 'Baby name is required',
            dob: dob.trim() ? '' : 'Date of birth is required',
            gender: gender.trim() ? '' : 'Gender is required',
            weight: weight.trim() ? '' : 'Weight is required',
            height: height.trim() ? '' : 'Height is required',
            image: image ? '' : 'Profile photo is required',
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const formatDate = (date: Date) => {
        let d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const onDobChange = (event: any, selectedDate?: Date) => {
        setShowDobPicker(false);
        if (selectedDate) {
            const formatted = formatDate(selectedDate);
            setDob(formatted);
            if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
        }
    };

    const handleAddBaby = async () => {
        setTouched(true);
      
        if (!validateFields()) return;
      
        try {
          const userId = await AsyncStorage.getItem("userId");
          if (!userId) {
            alert("User ID not found in AsyncStorage");
            return;
          }
      
          const formData = new FormData();
      
          formData.append("babyName", babyName);
          formData.append("userId", userId);
          formData.append("dob", dob);
          formData.append("weight", weight);
          formData.append("height", height);
          formData.append("gender", gender);
      
          if (image) {
            const filename = image.split('/').pop();
            const fileType = filename?.split('.').pop();
      
            formData.append("profilePhoto", {
              uri: image,
              name: filename,
              type: `image/${fileType}`,
            } as any);
          }
      
          const response = await API.post(
            "/auth/complete-parent-signup",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
      
          console.log("✅ Baby added:", response.data);
          const babies = response.data?.user?.parentDetails?.babies;
const latestBaby = babies[babies.length - 1];
const babyId = latestBaby._id;
await AsyncStorage.setItem("babyId", babyId);

          alert("Baby added successfully!");
          router.push("/login/Login");
        } catch (error: any) {
          console.error("❌ API error:", error.response?.data || error.message);
          alert("Failed to add baby");
        }
      };
      


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('/SignupScreen')}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>   
                     <Text style={styles.headerTitle}>Add baby details</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Profile Image */}
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
                style={styles.input}
                placeholder="Enter baby name"
                placeholderTextColor="#D6CBCB"
                value={babyName}
                onChangeText={(text) => {
                    setBabyName(text);
                    if (errors.babyName) setErrors(prev => ({ ...prev, babyName: '' }));
                }}
            />
            {errors.babyName ? <Text style={styles.errorText}>{errors.babyName}</Text> : null}

            <TouchableOpacity
                style={[styles.input, styles.dobInputContainer]}
                onPress={() => setShowDobPicker(true)}
                activeOpacity={0.7}
            >
                <Text style={{ color: dob ? '#000' : '#D6CBCB', fontSize: 14, flex: 1 }}>
                    {dob || "Enter baby D.o.b"}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#8B347B" />
            </TouchableOpacity>

            {showDobPicker && (
                <DateTimePicker
                    value={dob ? new Date(dob) : new Date()}
                    mode="date"
                    display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                    maximumDate={new Date()}
                    onChange={onDobChange}
                />
            )}

            {touched && errors.dob ? (
                <Text style={styles.errorText}>{errors.dob}</Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Enter baby gender"
                placeholderTextColor="#D6CBCB"
                value={gender}
                onChangeText={(text) => {
                    setGender(text);
                    if (errors.gender) setErrors(prev => ({ ...prev, gender: '' }));
                }}
            />
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Enter baby weight"
                placeholderTextColor="#D6CBCB"
                value={weight}
                onChangeText={(text) => {
                    setWeight(text);
                    if (errors.weight) setErrors(prev => ({ ...prev, weight: '' }));
                }}
            />
            {errors.weight ? <Text style={styles.errorText}>{errors.weight}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Enter baby height"
                placeholderTextColor="#D6CBCB"
                value={height}
                onChangeText={(text) => {
                    setHeight(text);
                    if (errors.height) setErrors(prev => ({ ...prev, height: '' }));
                }}
            />
            {errors.height ? <Text style={styles.errorText}>{errors.height}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleAddBaby}>
                <Text style={styles.buttonText}>Add Baby</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffcce5',
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#8B347B',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    backText: {
        fontSize: 24,
        color: '#fff',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 25,
    },
    profileTextContainer: {
        marginLeft: 5,
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
        marginHorizontal: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        marginVertical: 8,
        color: '#999'
    },

    button: {
        backgroundColor: '#8B347B',
        marginHorizontal: 35,
        marginTop: 25,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dobInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
      },      
});
