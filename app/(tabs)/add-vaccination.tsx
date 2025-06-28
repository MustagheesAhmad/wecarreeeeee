import { useVaccinations } from '@/context/VaccinationContext';
import API from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddVaccinationScreen() {
    const router = useRouter();
    const [vaccinationName, setVaccinationName] = useState('');
    const [lastDate, setLastDate] = useState<Date | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);

    const [showLastPicker, setShowLastPicker] = useState(false);
    const [showDuePicker, setShowDuePicker] = useState(false);
    const { addVaccination } = useVaccinations();

    // Error states
    const [errors, setErrors] = useState({
        name: '',
        lastDate: '',
        dueDate: '',
    });

    const validate = () => {
        const newErrors = {
            name: vaccinationName ? '' : 'Vaccination name is required',
            lastDate: lastDate ? '' : 'Last vaccination date is required',
            dueDate: dueDate ? '' : 'Due date is required',
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSave = async () => {
        if (!validate()) return;
      
        try {
          const babyId = await AsyncStorage.getItem("babyId");
      
          if (!babyId) {
            Alert.alert("Error", "Baby ID not found in storage.");
            return;
          }
      
          const payload = {
            name: vaccinationName,
            lastVaccinationDate: lastDate?.toISOString(),  // Required format
            nextDueDate: dueDate?.toISOString(),   
          };
      
          const response = await API.post(`/vaccination/add/${babyId}`, payload);
           Alert.alert(
            "Success",
            "Vaccination added successfully!",
            [
                {
                    text: "OK",
                    onPress: () => router.push("/vaccination-tracker"),
                },
            ],
            { cancelable: false }
        );
        } catch (error: any) {
          console.error("❌ Error saving vaccination:", error.response?.data || error.message);
          Alert.alert("Error", "Failed to save vaccination.");
        }
      };
      

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/ParentHome')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Vaccination</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Vaccination Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Vaccination Name"
                    placeholderTextColor="#D6CBCB"
                    value={vaccinationName}
                    onChangeText={(text) => {
                        setVaccinationName(text);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                />
                {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                <Text style={styles.label}>Last Vaccination Date:</Text>
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowLastPicker(true)}
                >
                    <Text style={styles.dateText}>
                        {lastDate ? lastDate.toDateString() : 'Last Vaccination Date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#8B347B" />
                </TouchableOpacity>
                {errors.lastDate ? <Text style={styles.errorText}>{errors.lastDate}</Text> : null}

                <Text style={styles.label}>Next Due Date:</Text>
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDuePicker(true)}
                >
                    <Text style={styles.dateText}>
                        {dueDate ? dueDate.toDateString() : 'Next Due Date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#8B347B" />
                </TouchableOpacity>
                {errors.dueDate ? <Text style={styles.errorText}>{errors.dueDate}</Text> : null}

                {showLastPicker && (
                    <DateTimePicker
                        value={lastDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowLastPicker(false);
                            if (selectedDate) setLastDate(selectedDate);
                        }}
                    />
                )}

                {showDuePicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display={Platform.OS === 'android' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDuePicker(false);
                            if (selectedDate) setDueDate(selectedDate);
                        }}
                    />
                )}

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffd6e6',
    },
    header: {
        height: 70,
        backgroundColor: '#8B347B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B347B',
        marginTop: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        marginBottom: 5,
        color: '#000',
    },
    dateInput: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 14,
        color: '#999',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 5,
    },
    saveButton: {
        backgroundColor: '#8B347B',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 100,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
