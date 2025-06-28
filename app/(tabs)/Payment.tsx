import { router } from 'expo-router';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/child-diet-plan')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Icon */}
      <View style={styles.iconWrapper}>
        <Image
          source={require('../../assets/images/payment.png')} 
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      {/* Form */}
      <View style={styles.container}>
        <Text style={styles.title}>Card Payment Details</Text>

        <TextInput style={styles.input} placeholder="Card Holder Name" placeholderTextColor="#D6CBCB" />
        <TextInput style={styles.input} placeholder="Card Number" placeholderTextColor="#D6CBCB" keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="MM/YY" placeholderTextColor="#D6CBCB" />
        <TextInput style={styles.input} placeholder="CVV" placeholderTextColor="#D6CBCB" keyboardType="numeric" secureTextEntry />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.push('/SecondScreen')}
          >
            <Text style={styles.cancelText}>Cancel Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => alert('Payment confirmed!')}
          >
            <Text style={styles.confirmText}>Yes, Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  iconWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  icon: {
    width: 120,
    height: 120,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B347B',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    borderColor: '#D6CBCB',
    borderWidth: 1,
    fontSize: 14,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#8B347B',
    padding: 12,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
