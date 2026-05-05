// src/screens/main/Billing.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { useCart } from '../../context/CartContext';

type BillingScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Billing'>;

const DELIVERY_CHARGE = 2.99;

const BillingScreen = () => {
  const navigation = useNavigation<BillingScreenNavigationProp>();
  const { cart, clearCart } = useCart();

  const itemTotal = cart.total;
  const deliveryCharge = DELIVERY_CHARGE;
  const grandTotal = itemTotal + deliveryCharge;

  const handlePlaceOrder = () => {
    Alert.alert('Order Placed', 'Your order has been placed successfully!', [
      {
        text: 'OK',
        onPress: () => {
          clearCart();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Billing</Text>
      <View style={styles.breakdown}>
        <View style={styles.row}>
          <Text style={styles.label}>Item Total:</Text>
          <Text style={styles.value}>${itemTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Charge:</Text>
          <Text style={styles.value}>${deliveryCharge.toFixed(2)}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.grandTotalLabel}>Grand Total:</Text>
          <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  breakdown: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff7e8b',
  },
  placeOrderButton: {
    backgroundColor: '#ff7e8b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillingScreen;