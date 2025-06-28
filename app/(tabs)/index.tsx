import * as Font from 'expo-font'; // Import expo-font to load custom fonts
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'; // Reanimated v2 imports

export default function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();


  // Load the Italic font asynchronously
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Italianno': require('../../assets/fonts/Italianno-Regular.ttf'),  // Ensure correct font path
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
      }
    }

    loadFonts();
  }, []);  
  
  const imageOpacity = useSharedValue(0);
  const imageTranslateX = useSharedValue(-300);  // Start from left
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(100);  // Start from bottom
  const textBlur = useSharedValue(10);  // Blur effect

  // Trigger animations after fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      // Image: Moves from left to right
      imageOpacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
      imageTranslateX.value = withTiming(0, { duration: 1500, easing: Easing.ease });

      // Text: Comes from bottom with blur effect and slow motion
      textOpacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });
      textTranslateY.value = withTiming(0, { duration: 2000, easing: Easing.ease });
      textBlur.value = withTiming(0, { duration: 2500, easing: Easing.ease });
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/WelcomeScreen');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Create animated styles
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpacity.value,
      transform: [{ translateX: imageTranslateX.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
      blurRadius: textBlur.value,  // Apply the blur effect to text
    };
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;  // Show loading text until fonts are loaded
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/logo.png')}  // Static image
        style={[styles.img, animatedImageStyle]}
      />
      <Animated.Text
        style={[styles.title, animatedTextStyle]}
      >
        Welcome to Weecare
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 'auto',
    width: '100%',
    height: '100%',  // Ensure full screen height
    alignItems: 'center',  // Center the items horizontally
    justifyContent: 'center',  // Center the items vertically
    position: 'relative',
    backgroundColor: '#FFDBE8',
  },
  img: {
    height: 269,
    width: 342,
  },
  title: {
    fontSize: 48,
    textAlign: 'center',
    color: '#8B347B',
    fontFamily: 'Italianno',  // Apply the custom Italiana font here
    fontWeight: '600',  // Optional: You can adjust font weight for style
    marginTop: 20,  // Add some space between the image and text
  },
});
