// src/screens/main/Home.tsx

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList, Hotel } from '../../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: 'https://via.placeholder.com/150',
    discount: '20% off',
    rating: 4.5,
    deliveryTime: '30 mins',
  },
  {
    id: '2',
    name: 'Burger Joint',
    image: 'https://via.placeholder.com/150',
    discount: '15% off',
    rating: 4.2,
    deliveryTime: '25 mins',
  },
  // Add more
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const renderHotel = ({ item }: { item: Hotel }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotelId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.discount}>{item.discount}</Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
        <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <FlatList
        data={mockHotels}
        renderItem={renderHotel}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hotelCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  hotelImage: {
    width: '100%',
    height: 100,
  },
  hotelInfo: {
    padding: 10,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discount: {
    color: 'green',
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;