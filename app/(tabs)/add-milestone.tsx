import { useMilestones } from '@/context/MilestoneContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import uuid from 'react-native-uuid';

export default function AddMilestoneScreen() {
    const router = useRouter();
    const { addMilestone } = useMilestones();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isOngoing, setIsOngoing] = useState(false);
    const [achievedDate, setAchievedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        achievedDate: '',
    });

    const validate = () => {
        const newErrors = {
            name: name.trim() ? '' : 'Milestone name is required',
            description: description.trim() ? '' : 'Description is required',
            achievedDate: !isOngoing && !achievedDate ? 'Achievement date is required' : '',
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSave = async () => {
        if (!validate()) return;
    
        const milestone = {
            id: uuid.v4() as string,
            name,
            description,
            isOngoing,
            achievedDate: achievedDate ? achievedDate.toISOString() : null,
        };
    
        console.log('📤 Submitting milestone:', milestone);
    
        try {
            const response = await axios.post('YOUR_API_URL_HERE', milestone); // Replace with actual URL
            console.log('✅ Milestone saved successfully:', response.data);
    
            addMilestone(milestone);
            router.push('/milestone-tracker');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('❌ Axios error:', error.response?.data || error.message);
            } else {
                console.error('❌ Unexpected error:', error);
            }
        }
    };
    
    
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push('/ParentHome')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Milestone</Text>
                <View style={{ width: 24 }} />
            </View>

            <Text style={styles.label}>Milestone Name:</Text>
            <TextInput
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Name"
                placeholderTextColor="#D6CBCB"
                style={styles.input}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

            <Text style={styles.label}>Description:</Text>
            <TextInput
                value={description}
                onChangeText={(text) => {
                    setDescription(text);
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="Description"
                placeholderTextColor="#D6CBCB"
                multiline
                numberOfLines={3}
                style={[styles.input, styles.multilineInput]}
            />
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

            <View style={styles.switchRow}>
                <Text style={styles.label}>Is Ongoing?</Text>
                <Switch value={isOngoing} onValueChange={(val) => {
                    setIsOngoing(val);
                    if (val) setErrors(prev => ({ ...prev, achievedDate: '' }));
                }} />
            </View>

            {!isOngoing && (
                <>
                    <Text style={styles.label}>Achievement Date:</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.datePicker}
                    >
                        <Text style={styles.dateText}>
                            {achievedDate ? achievedDate.toDateString() : 'Select Date'}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color="#8B347B" />
                    </TouchableOpacity>
                    {errors.achievedDate ? <Text style={styles.errorText}>{errors.achievedDate}</Text> : null}

                    {showDatePicker && (
                        <DateTimePicker
                            value={achievedDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'android' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setAchievedDate(selectedDate);
                            }}
                        />
                    )}
                </>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
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
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B347B',
        marginVertical: 10,
        marginHorizontal: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        marginBottom: 5,
        marginHorizontal: 15,
        color: '#000',
    },
    multilineInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginVertical: 10,
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 15,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 14,
        color: '#999',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    saveButton: {
        backgroundColor: '#8B347B',
        padding: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 70,
        marginHorizontal: 15,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
