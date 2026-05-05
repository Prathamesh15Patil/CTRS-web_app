import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { useLogger } from '../../context/LogContext';
import { Keyboard } from 'react-native';

type RatingScreenRouteProp = RouteProp<MainStackParamList, 'Rating'>;
type RatingScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Rating'>;

const RatingScreen = () => {
  const route = useRoute<RatingScreenRouteProp>();
  const navigation = useNavigation<RatingScreenNavigationProp>();
  const { hotelId, hotelName } = route.params;
  const { logAction } = useLogger();
  
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');

  // Log when screen opens
  React.useEffect(() => {
    logAction('Rating screen displayed');
  }, []);

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Please select a rating', 'Tap the stars to rate your experience.');
      return;
    }
    
    logAction(`submitted rating: ${rating} stars for hotel ${hotelName} with message: "${message}"`);
    
    Alert.alert('Thank You!', 'Your feedback helps us improve.', [
      {
        text: 'Back to Home',
        onPress: () => navigation.replace('Home'),
      },
    ]);
  };

  return (
    
    <SafeAreaView style={styles.container} >
      <TouchableOpacity onPress={()=>Keyboard.dismiss()}>
      <View style={styles.card}>
        <Text style={styles.title}>How was your food?</Text>
        <Text style={styles.subtitle}>Rate your experience with Hotel {hotelName}</Text>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[styles.star, rating >= star ? styles.starSelected : styles.starUnselected]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Tell us what you liked (optional)"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
      
    </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#696969',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
  },
  starSelected: {
    color: '#F4B400',
  },
  starUnselected: {
    color: '#E0E0E0',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    backgroundColor: '#E23744',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RatingScreen;
