import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ✅ Replace this with your actual local IP address (keep it consistent with your backend)
const API_URL = 'http://192.168.0.103:5000/api/chatbot/ask';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatbotScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }), // ✅ Key corrected to 'prompt'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chatbot response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: data.reply || 'Sorry, no response',
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Error: Could not get response from chatbot',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chatbot Assistant</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Chat Area */}
      {messages.length === 0 ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello</Text>
          <Text style={styles.mairaText}>PARENT</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
        />
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={(text) => setInput(text)}
          editable={!loading}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#8B347B" style={{ marginLeft: 10 }} />
        ) : (
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={24} color="#8B347B" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 70,
    backgroundColor: '#8B347B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  welcomeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#8B347B' },
  mairaText: { fontSize: 20, fontWeight: '600', color: '#C36BA0' },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#8B347B',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botBubble: {
    backgroundColor: '#E8D5EB',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#8B347B',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 45,
  },
});
