import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList, Hotel } from '../../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const mockHotels: Hotel[] = [
  { id: '1', name: 'Pizza Palace', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop', discount: '₹125 OFF', rating: 4.5, deliveryTime: '30 min' },
  { id: '2', name: 'The Burger Joint', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop', discount: 'FREE Delivery', rating: 4.2, deliveryTime: '25 min' },
  { id: '3', name: 'Niyaaz Restaurant', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop', discount: '10% OFF', rating: 4.4, deliveryTime: '35 min' },
  { id: '4', name: 'Ajanta Cafe', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000&auto=format&fit=crop', discount: '₹50 OFF', rating: 4.1, deliveryTime: '20 min' },
  { id: '5', name: 'Mister Chefs', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop', discount: '20% OFF', rating: 4.3, deliveryTime: '25 min' },
];

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search Logic
  const filteredHotels = mockHotels.filter((hotel) => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHotel = ({ item }: { item: Hotel }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotelId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.hotelImage} />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </View>
      
      <View style={styles.hotelInfo}>
        <View style={styles.row}>
          <Text style={styles.hotelName}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating} ★</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.subText}>North Indian • Fast Food • ₹200 for one</Text>
          <Text style={styles.subText}>{item.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- ZOMATO HEADER START --- */}
      <View style={styles.headerContainer}>
        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <Text style={styles.locationPin}>📍</Text>
            <View>
              <View style={styles.homeRow}>
                <Text style={styles.homeLabel}>Home</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </View>
              <Text style={styles.fullAddress} numberOfLines={1}>
                Sunshine Apartments, Sector 45...
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Text style={styles.profileInitial}>G</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput 
            placeholder="Restaurant name or a dish..." 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <View style={styles.verticalDivider} />
          <Text style={styles.micIcon}>🎙️</Text>
        </View>
      </View>
      {/* --- ZOMATO HEADER END --- */}

      <FlatList
        data={filteredHotels}
        renderItem={renderHotel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No restaurants found matching "{searchQuery}"</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationPin: {
    fontSize: 20,
    color: '#E23744', // Zomato Red
    marginRight: 8,
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1C1C1C',
  },
  dropdownArrow: {
    fontSize: 10,
    marginLeft: 5,
    color: '#1C1C1C',
  },
  fullAddress: {
    fontSize: 12,
    color: '#696969',
    width: 200,
  },
  profileCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#ff7e8b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    // Shadow for iOS/Android
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 16,
    color: '#E23744',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 14,
    color: '#1C1C1C',
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 10,
  },
  micIcon: {
    fontSize: 18,
  },
  listContent: {
    padding: 15,
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    backgroundColor: '#256fef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  hotelInfo: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  ratingBadge: {
    backgroundColor: '#267E3E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subText: {
    fontSize: 13,
    color: '#696969',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#696969',
    fontSize: 16,
  }
});

export default HomeScreen;