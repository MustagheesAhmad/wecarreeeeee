import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const quotes = [
  "You are doing better than you think.",
  "There is no way to be a perfect parent, but a million ways to be a good one.",
  "Believe in yourself. You are your child’s hero.",
  "Parenting is not a job. It’s a journey full of love, learning, and growth.",
  "Every day may not be perfect, but there is something good in every day.",
  "Your love means more than any perfection.",
  "It’s okay to ask for help — strong parents know when to recharge.",
  "You are the calm in your child’s storm. Keep going.",
  "Small moments create big memories.",
  "Your presence is the best gift you can give your child.",
];

export default function MotivationalQuotesScreen() {
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    // Random daily quote (you can later fetch this from backend)
    const random = Math.floor(Math.random() * quotes.length);
    setDailyQuote(quotes[random]);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/ParentHome')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Motivational Quotes</Text>
        <View style={{ width: 24 }} />
      </View>

      <Animatable.Text
        animation="fadeInDown"
        duration={1000}
        style={styles.todayHeading}
      >
        🌟 Today's Motivation 🌟
      </Animatable.Text>

      <View style={styles.quoteList}>
        <Animatable.View animation="zoomIn" delay={200} style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{dailyQuote}"</Text>
        </Animatable.View>

        <Text style={styles.sectionTitle}>More Inspirations</Text>

        {quotes
          .filter((quote) => quote !== dailyQuote)
          .map((quote, index) => (
            <View key={index} style={styles.quoteCard}>
              <Text style={styles.quoteText}>"{quote}"</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcce5',
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
  todayHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6A1B9A',
    marginTop: 20,
  },
  quoteList: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    color: '#8B347B',
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    color: '#6A1B9A',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
