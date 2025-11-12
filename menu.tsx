import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useMenu } from './MenuContext';
import { Meal, MenuShape } from './MenuContext'; 

export default function MenuPage({ navigation }: any) {
 const { menu } = useMenu();
const [filter, setFilter] = useState<'All' | keyof MenuShape>('All');
// Calculate total number of meals
const totalMeals =
menu.Starters.length + menu.Platters.length + menu['Main Course'].length + menu.Desserts.length;

  //  Function to calculate average price based on the current filter ---
  const calculateAveragePrice = (): string => {
    let mealsToAverage: Meal[] = [];

    
    if (filter === 'All') {
      // If 'All' is selected, combine all meals from all categories
      mealsToAverage = [
        ...menu.Starters,
        ...menu.Platters,
        ...menu['Main Course'],
        ...menu.Desserts,
      ];
    } else {
      // If a specific course is selected, use only meals from that category
      mealsToAverage = menu[filter];
    }

  
    const pricedMeals = mealsToAverage.filter(meal => meal.price !== undefined && meal.price > 0);

    if (pricedMeals.length === 0) {
      return '0.00';
    }

    // 3. Sum the prices
    const totalPrice = pricedMeals.reduce((sum, meal) => sum + (meal.price || 0), 0);
    
    // 4. Calculate and format the average
    const average = totalPrice / pricedMeals.length;
    return average.toFixed(2);
  };
  
  const averagePrice = calculateAveragePrice();

 return (
<View style={styles.container}>
<Text style={styles.title}>Restaurant Menu</Text>
<Text style={styles.countText}>Total meals: **{totalMeals}**</Text>
      {/* NEW: Display the average price */}
      <Text style={styles.averagePriceText}>
        Average Price ({filter}): **R {averagePrice}**
      </Text>


<View style={styles.filterRow}>
 {(['All', 'Starters', 'Platters', 'Main Course', 'Desserts'] as const).map(f => (
 <TouchableOpacity
 key={f}
 style={[styles.filterButton, filter === f && styles.filterButtonActive]}
 onPress={() => setFilter(f as any)}
>
 <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
 </TouchableOpacity>
 ))}
 </View>

 <ScrollView>
 {Object.entries(menu)
.filter(([type]) => filter === 'All' || type === filter)
 .map(([type, meals]) => (
 <View key={type} style={styles.section}>
 <Text style={styles.sectionTitle}>{type}</Text>
 {meals.map((meal, index) => (
<View key={index} style={styles.mealBox}>
 <Image source={meal.image} style={styles.mealImage} />
 <Text style={styles.mealName}>{meal.name}</Text>
 {meal.price !== undefined && (
 <Text style={styles.mealPrice}>R {meal.price.toFixed(2)}</Text>
 )}
 </View>
 ))}
 </View>
))}
 </ScrollView>


 </View>
 );
}

const styles = StyleSheet.create({
 container: {
 flex: 1,
 backgroundColor: '#fff3e0',
 padding: 10,
 },
 title: {
 fontSize: 26,
 fontWeight: 'bold',
 textAlign: 'center',
color: '#e65100',
 marginTop: 30,
 },
countText: {
 textAlign: 'center',
 color: '#333',
 marginBottom: 5, 
 },
  // NEW: Style for the average price display
  averagePriceText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#d84315', 
    marginBottom: 20, 
  },
 section: {
 marginBottom: 20,
 backgroundColor: '#ffe0b2',
 borderRadius: 10,
padding: 10,
 },
 sectionTitle: {
 fontSize: 20,
 fontWeight: 'bold',
color: '#bf360c',
 marginBottom: 10,
textAlign: 'center',
 },
 mealBox: {
alignItems: 'center',
 marginBottom: 10,
 backgroundColor: '#fff',
 borderRadius: 8,
 padding: 10,
 },
 mealImage: {
 width: 200,
height: 120,
 borderRadius: 8,
 },
 mealName: {
 marginTop: 5,
 fontSize: 16,
 fontWeight: '500',
 },
 mealPrice: {
 marginTop: 4,
 color: '#424242',
 fontWeight: '600',
 },
 button: {
 backgroundColor: '#ff9800',
 padding: 15,
 borderRadius: 30,
 alignItems: 'center',
 marginTop: 10,
 marginBottom: 20,
 },
 buttonText: {
 color: '#fff',
 fontSize: 16,
 },
 filterRow: {
 flexDirection: 'row',
 justifyContent: 'space-around',
  marginVertical: 10,
 },
 filterButton: {
 paddingVertical: 6,
 paddingHorizontal: 10,
 borderRadius: 20,
 backgroundColor: '#fff',
 borderWidth: 1,
 borderColor: '#ffcc80',
 },
filterButtonActive: {
 backgroundColor: '#ff9800',
 },
filterText: {
 color: '#bf360c',
 },
 filterTextActive: {
   color: '#fff',
 fontWeight: 'bold',
},
});