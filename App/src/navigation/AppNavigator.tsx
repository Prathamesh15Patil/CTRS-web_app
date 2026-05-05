// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { RootStackParamList, AuthStackParamList, MainStackParamList } from './types';

// Auth Screens
import LoginScreen from '../screens/auth/Login';

// Main Screens
import HomeScreen from '../screens/main/Home';
import HotelDetailsScreen from '../screens/main/HotelDetails';
import CartScreen from '../screens/main/Cart';
import BillingScreen from '../screens/main/Billing';

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: true }}>
    <MainStack.Screen name="Home" component={HomeScreen} />
    <MainStack.Screen name="HotelDetails" component={HotelDetailsScreen} />
    <MainStack.Screen name="Cart" component={CartScreen} />
    <MainStack.Screen name="Billing" component={BillingScreen} />
  </MainStack.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default () => (
  <AuthProvider>
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  </AuthProvider>
);