import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { useCart } from '../../context/CartContext';
import { useLogger } from '../../context/LogContext';
import { useEffect } from 'react';

type CartScreenRouteProp = RouteProp<MainStackParamList, 'Cart'>;
type CartScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Cart'>;

const CartScreen = () => {
  const route = useRoute<CartScreenRouteProp>();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { hotelId, discount, deliveryTime, hotelName } = route.params || { hotelId: '1', discount: 'Free delivery', deliveryTime: '35 mins', hotelName: 'Veg Hotel' }; // Fallback for safety
  const { cart, updateQuantity } = useCart();
  const { logAction } = useLogger();

  useEffect(() => {
    logAction('opened cart');
    if (cart.items.length > 0) {
      logAction(`Offer section displayed in cart:\n                     - ${discount}`);
    }
  }, []);

  // Helper for delivery fee & taxes
  const deliveryFee = 40;
  const platformFee = 5;
  const grandTotal = cart.total + deliveryFee + platformFee;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <View style={styles.vegIcon}><View style={styles.vegDot} /></View>
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.itemName}>{item.foodItem.name}</Text>
          <Text style={styles.itemPrice}>₹{item.foodItem.price}</Text>
        </View>
      </View>

      <View style={styles.quantityWrapper}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => {
              logAction(`decreased quantity of ${item.foodItem.name}`);
              updateQuantity(item.foodItem.id, item.quantity - 1);
            }}
          >
            <Text style={styles.quantityBtnText}>–</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => {
              logAction(`increased quantity of ${item.foodItem.name}`);
              updateQuantity(item.foodItem.id, item.quantity + 1);
            }}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemTotalAmount}>₹{item.foodItem.price * item.quantity}</Text>
      </View>
    </View>
  );

  if (cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty!</Text>
        <TouchableOpacity 
          style={styles.browseBtn} 
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.browseBtnText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Item List Section */}
        <View style={styles.sectionCard}>
          <FlatList
            data={cart.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.foodItem.id}
            scrollEnabled={false} // List is inside ScrollView
          />
          
          <TouchableOpacity style={styles.instructionBtn}>
            <Text style={styles.instructionText}>✍️ Add cooking instructions</Text>
          </TouchableOpacity>
        </View>

        {/* Bill Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Total</Text>
            <Text style={styles.billValue}>₹{cart.total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Fee | 2.5 km</Text>
            <Text style={styles.billValue}>₹{deliveryFee}</Text>
          </View>
          
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform fee</Text>
            <Text style={styles.billValue}>₹{platformFee}</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.billRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Policy Note */}
        <View style={styles.policyCard}>
            <Text style={styles.policyText}>Orders cannot be cancelled once packed. Regular cancellation policy applies.</Text>
        </View>
      </ScrollView>

      {/* Bottom Sticky Checkout */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₹{grandTotal.toFixed(2)}</Text>
          <Text style={styles.footerSub}>VIEW DETAILED BILL</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            logAction('tapped "Proceed to Checkout"');
            navigation.navigate('Billing', { hotelId, deliveryTime, hotelName });
          }}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  sectionCard: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  vegIcon: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#267E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#267E3E',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D2D2D',
  },
  itemPrice: {
    fontSize: 13,
    color: '#505050',
    marginTop: 2,
  },
  quantityWrapper: {
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#E23744',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityBtn: {
    paddingHorizontal: 8,
  },
  quantityBtnText: {
    color: '#E23744',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E23744',
    marginHorizontal: 8,
  },
  itemTotalAmount: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    color: '#2D2D2D',
  },
  instructionBtn: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    paddingTop: 15,
  },
  instructionText: {
    color: '#505050',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C',
    marginBottom: 15,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
    color: '#505050',
  },
  billValue: {
    fontSize: 14,
    color: '#1C1C1C',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  policyCard: {
    padding: 15,
    marginBottom: 100,
  },
  policyText: {
    fontSize: 12,
    color: '#828282',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
  },
  footerPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  footerSub: {
    fontSize: 10,
    color: '#E23744',
    fontWeight: 'bold',
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: '#E23744',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: '#E23744',
    padding: 15,
    borderRadius: 8,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CartScreen;