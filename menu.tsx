import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useMenu } from './MenuContext';

export default function MenuPage({ navigation }: any) {
  const { menu, removeMeal, getAverage } = useMenu();
  const [filter, setFilter] = useState<'All' | keyof typeof menu>('All');

  const totalMeals =
    menu.Starters.length +
    menu.Platters.length +
    menu['Main Course'].length +
    menu.Desserts.length;

  const average = getAverage(filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Menu</Text>
      <Text style={styles.countText}>Total meals: {totalMeals}</Text>
      <Text style={styles.countText}>Average Price: R {average}</Text>

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
                  {/* Remove button */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMeal(type as keyof typeof menu, meal.name)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
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
    marginBottom: 10,
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
  removeButton: {
    marginTop: 8,
    backgroundColor: '#e65100',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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