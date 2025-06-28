import { useRemedies } from '@/context/RemedyContext';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import uuid from 'react-native-uuid';

export default function AddRemedyScreen() {
    const router = useRouter();
    const [remedyText, setRemedyText] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const { addRemedy } = useRemedies();
    const [errors, setErrors] = useState<{ remedy?: string }>({});
    const pickProfileImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const pickRemedyImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'android' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.push('/ParentHome')}>
                                <Text style={styles.backText}>←</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Add a new Remedy</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        {/* Profile Section */}
                        <View style={styles.profileContainer}>
                            <TouchableOpacity onPress={pickProfileImage}>
                                <Image
                                    source={
                                        profileImage
                                            ? { uri: profileImage }
                                            : require('../../assets/images/profile-icon.png')
                                    }
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.profileName}>Zarmeena Gull</Text>
                        </View>

                        {/* Remedy Text Input */}
                        <TextInput
                            style={styles.textInput}
                            placeholder="I tried a new remedy that increased energy level..."
                            multiline
                            value={remedyText}
                            onChangeText={(text) => {
                                setRemedyText(text);
                                if (errors.remedy) setErrors({});
                            }}
                            placeholderTextColor="#999"
                        />


                        {/* Remedy Image Upload */}
                        {/* Remedy Image Upload */}
                        <Text style={styles.addImageLabel}>Add an image/images</Text>
                        <View style={styles.imageRowWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    pickRemedyImage().then(() => {
                                        if (errors.remedy) setErrors({});
                                    });
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.imageRow}>
                                    <Image
                                        source={require('../../assets/images/upload.png')}
                                        style={styles.iconImage}
                                    />
                                </View>
                            </TouchableOpacity>

                            {imageUri && (
                                <View style={styles.uploadedImg}>
                                    <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                                </View>
                            )}
                        </View>
                        {errors.remedy && !remedyText && !imageUri ? (
                            <Text style={styles.errorText}>{errors.remedy}</Text>
                        ) : null}


                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => {
                                if (!remedyText && !imageUri) {
                                    setErrors({ remedy: 'Please enter remedy text or upload an image.' });
                                    return;
                                }

                                const newRemedy = {
                                    id: uuid.v4() as string,
                                    profileImage: profileImage || null,
                                    userName: 'Zarmeena Gull',
                                    remedyImage: imageUri || '',
                                    remedyText: remedyText,
                                };

                                addRemedy(newRemedy);
                                setRemedyText('');
                                setImageUri(null);
                                setProfileImage(null);
                                setErrors({});
                                router.push('/RemedyHome');
                            }}

                        >
                            <Text style={styles.addButtonText}>Add Remedy</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback >
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
    profileContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8B347B',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        height: 140,
        textAlignVertical: 'top',
        fontSize: 14,
        margin: 20,
    },
    addImageLabel: {
        color: '#8B347B',
        fontSize: 16,
        marginHorizontal: 24,
        fontWeight: '600',
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        borderRadius: 20,
        padding: 18,
    },
    uploadedImg: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#fff',
        width: 60,
        height: 60,
        borderRadius: 20,
        padding: 5,


    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginHorizontal: 20,
        marginBottom: 10,
    },
    
    imageRowWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    iconImage: {
        width: 25,
        height: 25,
    },
    uploadedImage: {
        width: 50,
        height: 50,
        borderRadius: 8,

    },
    addButton: {
        backgroundColor: '#8B347B',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 25,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',

    },
});




