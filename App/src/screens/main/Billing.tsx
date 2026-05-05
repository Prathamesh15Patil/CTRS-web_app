import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,  
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { useCart } from '../../context/CartContext';
import { useLogger } from '../../context/LogContext';
import { useEffect } from 'react';

type BillingScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Billing'>;

const BillingScreen = () => {
  const navigation = useNavigation<BillingScreenNavigationProp>();
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const { logAction } = useLogger();

  useEffect(() => {
    logAction('Address selection screen displayed');
    logAction('Selected address: Home, Belagavi');
    logAction('Delivery time displayed: 35 mins');
    logAction('Payment options displayed (UPI, Card, Cash)');
  }, []);

  const itemTotal = cart.total;
  const deliveryCharge = 40;
  const platformFee = 5;
  const grandTotal = itemTotal + deliveryCharge + platformFee;

  const handlePlaceOrder = () => {
    logAction(`Payment successful via ${paymentMethod}`);
    logAction('Order placed successfully');
    logAction(`Order ID generated: ZMT${Math.floor(Math.random() * 100000000)}`);
    logAction('Order status: Preparing food');

    Alert.alert('Order Placed!', 'Your delicious meal is on the way.', [
      {
        text: 'Track Order',
        onPress: () => {
          clearCart();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Delivery Address Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery at Home</Text>
            <TouchableOpacity><Text style={styles.changeText}>CHANGE</Text></TouchableOpacity>
          </View>
          <Text style={styles.addressText}>
            Flat 402, Sunshine Apartments, Sector 45, Gurgaon, Haryana - 122003
          </Text>
          <Text style={styles.deliveryTimeText}>⏱ 25-30 mins</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'UPI' && styles.selectedOption]} 
            onPress={() => {
              logAction('selected UPI payment');
              setPaymentMethod('UPI');
            }}
          >
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentIcon}>📱</Text>
              <Text style={styles.paymentLabel}>Google Pay / PhonePe</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'UPI' && styles.radioSelected]} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'COD' && styles.selectedOption]} 
            onPress={() => {
              logAction('selected Cash payment');
              setPaymentMethod('COD');
            }}
          >
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={styles.paymentLabel}>Cash on Delivery</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'COD' && styles.radioSelected]} />
          </TouchableOpacity>
        </View>

        {/* Summary Breakdown */}
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Item Total</Text>
                <Text style={styles.value}>₹{itemTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Delivery Charge</Text>
                <Text style={styles.value}>₹{deliveryCharge}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Platform Fee</Text>
                <Text style={styles.value}>₹{platformFee}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
                <Text style={styles.grandTotalLabel}>Amount to Pay</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>
        </View>
      </ScrollView>

      {/* Secure Checkout Button */}
      <View style={styles.footer}>
        <View>
            <Text style={styles.footerPrice}>₹{grandTotal.toFixed(2)}</Text>
            <Text style={styles.footerSecure}>TOTAL SECURE PAYMENT</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  changeText: {
    color: '#E23744',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#505050',
    lineHeight: 20,
  },
  deliveryTimeText: {
    fontSize: 13,
    color: '#267E3E',
    fontWeight: '600',
    marginTop: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  selectedOption: {
    backgroundColor: '#FFF1F2',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 15,
    color: '#2D2D2D',
    fontWeight: '500',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CCC',
  },
  radioSelected: {
    borderColor: '#E23744',
    backgroundColor: '#E23744',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#606060',
  },
  value: {
    fontSize: 14,
    color: '#1C1C1C',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  footerSecure: {
    fontSize: 9,
    color: '#888',
    letterSpacing: 1,
  },
  placeOrderButton: {
    backgroundColor: '#E23744',
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 8,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillingScreen;