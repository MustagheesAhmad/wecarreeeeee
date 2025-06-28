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

export default function WelcomeScreen() {
  const router = useRouter();

  const goToSignup = () => {
    router.push('/SignupScreen');
  };

  const goToLogin = () => {
    router.push('/login/Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Welcome to Weecare</Text>

        <Image
          source={require('../../assets/images/welcome-pic.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.paragraph}>
          Let’s grow together! 🌟{'\n'}
          Your partner in precious moments—supporting every baby step and mom moment with love. 💕
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goToSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={goToLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffcce5',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 48,
    textAlign: 'center',
    color: '#8B347B',
    fontFamily: 'Italianno',  // Apply the custom Italiana font here
    fontWeight: '600',  // Optional: You can adjust font weight for style
    marginTop: 20, 
  },
  image: {
    width: 230,
    height: 230,
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 18,
    color: '#8B347B',
    textAlign: 'justify',
    marginBottom: 15,
    fontFamily: 'Bree Serif',
    marginHorizontal:25,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8B347B',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Bree Serif',
  },
});
