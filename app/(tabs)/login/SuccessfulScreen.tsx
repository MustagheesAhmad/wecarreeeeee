import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginSuccessScreen() {
    const router = useRouter();

    const selectRole = (role: string) => {
        if (role === 'Doctor') {
            router.push('/signup/DoctorSignup');
        } else if (role === 'Parent') {
            router.push('/ParentHome'); 
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Image
                        source={require('../../../assets/images/success.png')}
                        style={styles.successImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.successText}>Login Successful!</Text>
                </View>

                <Text style={styles.subText}>Please select your role</Text>

                <View style={styles.roleContainer}>
                    <TouchableOpacity style={styles.roleOption} onPress={() => selectRole('Doctor')}>
                        <View style={styles.imgbox}>
                            <Image
                                source={require('../../../assets/images/doctor.png')}
                                style={styles.roleImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.roleText}>Doctor</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.roleOption} onPress={() => selectRole('Parent')}>
                        <View style={styles.imgbox}>
                            <Image
                                source={require('../../../assets/images/mama.png')}
                                style={styles.roleImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.roleText}>Parent</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffcce5',
    },
    scrollContent: {
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    content: {
        marginVertical: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    successText: {
        fontSize: 36,
        fontWeight: '400',
        color: '#8B347B',
        fontFamily: 'Bree Serif',
        textAlign: 'center',
    },
    imgbox: {
        backgroundColor: '#8B347B',
        width: 130,
        height: 130,
        padding:5,
    },
    subText: {
        fontSize: 24,
        color: '#8B347B',
        marginBottom: 10,
        fontWeight: '400',
        fontFamily: 'Bree Serif',
        textAlign: 'left',
        padding: 10,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    roleOption: {
        alignItems: 'center',
        flex: 1,
        height: 130,
        width: 130,
    },
    roleImage: {
        width: 115,
        height: 115,
        marginBottom: 10,

    },
    roleText: {
        fontSize: 24,
        color: '#8B347B',
        fontFamily: 'Bree Serif',
    },
});
