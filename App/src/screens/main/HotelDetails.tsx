import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList, FoodItem } from '../../navigation/types';
import { useCart } from '../../context/CartContext';
import { useLogger } from '../../context/LogContext';
import { useEffect } from 'react';

type HotelDetailsRouteProp = RouteProp<MainStackParamList, 'HotelDetails'>;
type HotelDetailsNavigationProp = StackNavigationProp<MainStackParamList, 'HotelDetails'>;

// Mock database grouped by hotelId
const ALL_MENUS: Record<string, FoodItem[]> = {
  '1': [ // Pizza Palace
    { id: 'p1', name: 'Margherita Pizza', price: 399, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400', description: 'Classic delight with 100% real mozzarella cheese' },
    { id: 'p2', name: 'Farmhouse Pizza', price: 450, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400', description: 'Onion, capsicum, tomato & mushroom' },
    { id: 'p3', name: 'Peppy Paneer', price: 499, image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=400', description: 'Paneer, capsicum and spicy red pepper' },
    { id: 'p4', name: 'Veggie Paradise', price: 425, image: 'https://images.unsplash.com/photo-1511528234734-5e17b8996424?auto=format&fit=crop&w=400', description: 'Goldern corn, black olives, capsicum & red paprika' },
    { id: 'p5', name: 'Garlic Breadsticks', price: 149, image: 'https://images.unsplash.com/photo-1549590143-d5855148a9d5?auto=format&fit=crop&w=400', description: 'Freshly baked with a hint of garlic and butter' },
    { id: 'p6', name: 'Stuffed Garlic Bread', price: 199, image: 'https://images.unsplash.com/photo-1619531043552-32386926f8ed?auto=format&fit=crop&w=400', description: 'Stuffed with sweet corn and melting cheese' },
    { id: 'p7', name: 'Paneer Zingy Parcel', price: 89, image: 'https://images.unsplash.com/photo-1626074283791-713537b60c70?auto=format&fit=crop&w=400', description: 'Creamy paneer wrapped in a crispy pastry' },
    { id: 'p8', name: 'Tandoori Paneer Pizza', price: 549, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400', description: 'Spiced paneer with tandoori sauce and onions' },
    { id: 'p9', name: 'Choco Lava Cake', price: 110, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=400', description: 'Chocolate cake with a gooey liquid chocolate center' },
    { id: 'p10', name: 'Coke (500ml)', price: 60, image: 'https://images.unsplash.com/photo-1622483767028-3f66f344556c?auto=format&fit=crop&w=400', description: 'Refreshing 500ml cold drink' },
  ],
  '2': [ // The Burger Joint
    { id: 'b1', name: 'Crispy Veg Burger', price: 199, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400', description: 'Our best-selling burger with crispy veg patty' },
    { id: 'b2', name: 'Cheese Melt Burger', price: 250, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=400', description: 'Loaded with liquid cheese and jalapenos' },
    { id: 'b3', name: 'Aloo Tikki Burger', price: 99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400', description: 'The classic Indian street-style potato burger' },
    { id: 'b4', name: 'Peri Peri Fries', price: 120, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400', description: 'Golden fries tossed in spicy peri peri mix' },
    { id: 'b5', name: 'Paneer King Burger', price: 299, image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=400', description: 'Thick paneer patty with creamy mayo' },
    { id: 'b6', name: 'Veg Maharaja Mac', price: 350, image: 'https://images.unsplash.com/photo-1510739859534-5ba584432223?auto=format&fit=crop&w=400', description: 'Double decker burger with extra veggies and cheese' },
    { id: 'b7', name: 'Pizza Puff', price: 45, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400', description: 'Crispy pastry filled with pizza sauce and veggies' },
    { id: 'b8', name: 'Cheesy Nuggets', price: 150, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400', description: 'Bite-sized nuggets filled with molten cheese' },
    { id: 'b9', name: 'Vanilla Shake', price: 180, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400', description: 'Thick and creamy classic vanilla shake' },
    { id: 'b10', name: 'Cold Coffee', price: 160, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=400', description: 'Perfectly brewed coffee served chilled' },
  ],
  '3': [ // Niyaaz Restaurant
    { id: 'n1', name: 'Chicken Dum Biryani', price: 349, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=400', description: 'Signature Belgaum style dum biryani' },
    { id: 'n2', name: 'Mutton Biryani', price: 499, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400', description: 'Tender mutton pieces with fragrant basmati rice' },
    { id: 'n3', name: 'Chicken Lollipop (6 Pcs)', price: 290, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400', description: 'Crispy fried chicken wings in spicy batter' },
    { id: 'n4', name: 'Butter Chicken', price: 380, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400', description: 'Rich creamy tomato gravy with grilled chicken' },
    { id: 'n5', name: 'Butter Naan', price: 45, image: 'https://images.unsplash.com/photo-1601303584126-269425eb79e5?auto=format&fit=crop&w=400', description: 'Soft leavened bread cooked in tandoor' },
    { id: 'n6', name: 'Paneer Tikka Masala', price: 310, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400', description: 'Roasted paneer cubes in a spiced gravy' },
    { id: 'n7', name: 'Chicken Tikka', price: 320, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400', description: 'Boneless chicken marinated in yogurt and spices' },
    { id: 'n8', name: 'Dal Tadka', price: 210, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=400', description: 'Yellow lentils tempered with ghee and cumin' },
    { id: 'n9', name: 'Jeera Rice', price: 180, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=400', description: 'Basmati rice tempered with cumin seeds' },
    { id: 'n10', name: 'Gulab Jamun (2 Pcs)', price: 70, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=400', description: 'Hot fried dumplings soaked in sugar syrup' },
  ],
  '4': [ // Ajanta Cafe
    { id: 'a1', name: 'Masala Dosa', price: 110, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400', description: 'Crispy crepe filled with potato masala' },
    { id: 'a2', name: 'Idli Sambar (2 Pcs)', price: 70, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400', description: 'Steamed rice cakes served with spicy lentil soup' },
    { id: 'a3', name: 'Medu Vada', price: 85, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=400', description: 'Savory fried donuts made from black lentils' },
    { id: 'a4', name: 'Filter Coffee', price: 40, image: 'https://images.unsplash.com/photo-1594914785202-726459345c90?auto=format&fit=crop&w=400', description: 'Authentic South Indian decoction coffee' },
    { id: 'a5', name: 'Onion Uttapam', price: 120, image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc3a2?auto=format&fit=crop&w=400', description: 'Thick pancake topped with chopped onions' },
    { id: 'a6', name: 'Upma', price: 65, image: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&w=400', description: 'Savory semolina porridge with veggies' },
    { id: 'a7', name: 'Sheera (Kesari)', price: 75, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400', description: 'Sweet semolina dessert with saffron' },
    { id: 'a8', name: 'Paneer Chilly', price: 210, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400', description: 'Indo-Chinese style cottage cheese toss' },
    { id: 'a9', name: 'Veg Grilled Sandwich', price: 140, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400', description: 'Vegetable filling between grilled bread slices' },
    { id: 'a10', name: 'Fruit Salad', price: 120, image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=400', description: 'Seasonal mixed fruits with vanilla ice cream' },
  ],
  '5': [ // Mister Chefs
    { id: 'm1', name: 'Veg Hakka Noodles', price: 180, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400', description: 'Classic stir-fried noodles with veggies' },
    { id: 'm2', name: 'Manchurian Gravy', price: 190, image: 'https://images.unsplash.com/photo-1637968832329-4a5878f7ff13?auto=format&fit=crop&w=400', description: 'Veg balls in spicy soy-based sauce' },
    { id: 'm3', name: 'Triple Schezwan Rice', price: 260, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400', description: 'Combination of rice, noodles and spicy gravy' },
    { id: 'm4', name: 'Spring Rolls (4 Pcs)', price: 150, image: 'https://images.unsplash.com/photo-1544333346-64e3fe13b32d?auto=format&fit=crop&w=400', description: 'Crispy rolls filled with sautéed vegetables' },
    { id: 'm5', name: 'Honey Chilly Potato', price: 170, image: 'https://images.unsplash.com/photo-1614750521870-793d3d440026?auto=format&fit=crop&w=400', description: 'Crispy potato fingers in sweet and spicy sauce' },
    { id: 'm6', name: 'Veg Momos Steamed', price: 120, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&w=400', description: 'Healthy steamed dumplings with veg filling' },
    { id: 'm7', name: 'Fried Rice', price: 170, image: 'https://images.unsplash.com/photo-1603131839084-38842f59f9ef?auto=format&fit=crop&w=400', description: 'Fragrant rice tossed with mixed vegetables' },
    { id: 'm8', name: 'Pasta Arrabbiata', price: 230, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=400', description: 'Red sauce pasta with olives and herbs' },
    { id: 'm9', name: 'Cheese Corn Balls', price: 210, image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=400', description: 'Deep fried balls with sweet corn and cheese' },
    { id: 'm10', name: 'Virgin Mojito', price: 130, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400', description: 'Refreshing mint and lime summer drink' },
  ],
};

const HotelDetailsScreen = () => {
  const route = useRoute<HotelDetailsRouteProp>();
  const navigation = useNavigation<HotelDetailsNavigationProp>();
  const { hotelId } = route.params;
  const { addToCart, cart } = useCart(); // Assuming cart is available in context
  const { logAction } = useLogger();

  useEffect(() => {
    logAction('Restaurant page opened');
    logAction('Restaurant details displayed:\n                     - Rating: 4.3\n                     - Delivery Time: 30–35 mins\n                     - Cost for two: ₹400');
    
    const topDishes = (ALL_MENUS[hotelId] || []).slice(0, 3).map(item => item.name).join(', ');
    logAction(`Menu items displayed (${topDishes})`);
  }, []);

  // Filter menu based on hotelId
  const menuItems = useMemo(() => ALL_MENUS[hotelId] || [], [hotelId]);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        {/* Veg/Non-Veg Icon placeholder */}
        <View style={styles.vegIcon}><View style={styles.vegDot} /></View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.imageSection}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={() => {
            logAction(`added "${item.name}" to cart`);
            addToCart(item);
          }}
        >
          <Text style={styles.addButtonText}>ADD</Text>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          logAction('navigated back to menu');
          navigation.goBack();
        }}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Cart Bar - Classic Zomato style */}
      {cart.total > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => navigation.navigate('Cart')}
        >
          <View>
            <Text style={styles.cartItemsCount}>{cart.items.length} ITEM{cart.total > 1 ? 'S' : ''}</Text>
            <Text style={styles.cartSubtotal}>Extra charges may apply</Text>
          </View>
          <View style={styles.viewCartAction}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Text style={styles.viewCartArrow}>❯</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  backButton: {
    fontSize: 24,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    minHeight: 150,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 10,
  },
  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#267E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#267E3E',
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginVertical: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  imageSection: {
    width: 120,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: '#FFF1F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E23744',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#E23744',
    fontWeight: 'bold',
    fontSize: 14,
  },
  plusIcon: {
    color: '#E23744',
    fontSize: 12,
    marginLeft: 4,
    position: 'absolute',
    right: 5,
    top: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F2F2',
    marginHorizontal: 16,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: '#E23744',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
  },
  cartItemsCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cartSubtotal: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.8,
  },
  viewCartAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  viewCartArrow: {
    color: '#fff',
    fontSize: 12,
  },
});

export default HotelDetailsScreen;