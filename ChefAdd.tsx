import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Image, TouchableOpacity, ScrollView } from 'react-native';
import { useMenu } from './MenuContext';

type MealItem = { name: string; image?: any; price?: number };

export default function ChefAdd({ navigation }: any) {
  const { addMeal, addMealsBulk } = useMenu();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'Starters' | 'Platters' | 'Main Course' | 'Desserts'>('Starters');

  // Predefined meals the chef can add (examples)
  const newMeals: Record<string, MealItem[]> = {
    Starters: [
      { name: 'Bruschetta', image: require('./assets/bruschetta.jpg'), price: 55 },
      { name: 'Mini Spring Rolls', image: require('./assets/springRoll.jpg'), price: 50 },
    ],
    Platters: [{ name: 'Sushi Platter', image: require('./assets/sushi.jpg'), price: 300 }],
    'Main Course': [
      { name: 'Lasagna', image: require('./assets/lasagna.jpg'), price: 160 },
      { name: 'Beef Burger', image: require('./assets/burger.jpg'), price: 140 },
    ],
    Desserts: [{ name: 'Cheese Cake', image: require('./assets/CheeseCake.jpeg'), price: 95 }],
  };

  // Track which meals are checked (category -> set of names)
  const [checked, setChecked] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {};
    Object.keys(newMeals).forEach(k => (init[k] = new Set()));
    return init;
  });

  const toggle = (category: string, name: string) => {
    setChecked(prev => {
      const copy: Record<string, Set<string>> = { ...prev };
      const set = new Set(copy[category]);
      if (set.has(name)) set.delete(name);
      else set.add(name);
      copy[category] = set;
      return copy;
    });
  };

  const addSelected = () => {
    // Build bulk object
    const bulk: Partial<Record<keyof typeof newMeals, MealItem[]>> = {};
    (Object.keys(newMeals) as Array<keyof typeof newMeals>).forEach(cat => {
      const names = Array.from(checked[cat] || []);
      if (names.length) {
        bulk[cat] = newMeals[cat].filter(m => names.includes(m.name));
      }
    });

    if (Object.keys(bulk).length === 0) {
      Alert.alert('No selection', 'Please select at least one meal to add.');
      return;
    }

    // Use addMealsBulk from context
    addMealsBulk(bulk as any);
    Alert.alert('Success', 'Selected meals added to the menu.');
    navigation.navigate('Menu');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef Add Screen</Text>
      <Text style={styles.subtitle}>Select meals to add to the menu:</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4caf50', marginBottom: 10 }]}
        onPress={() => setShowNew(s => !s)}
      >
        <Text style={styles.buttonText}>New Dish</Text>
      </TouchableOpacity>

      {showNew && (
        <View style={{ marginBottom: 12 }}>
          <TextInput placeholder="Dish name" style={styles.input} value={newName} onChangeText={setNewName} />
          <TextInput
            placeholder="Description"
            style={[styles.input, { height: 80 }]}
            value={newDesc}
            onChangeText={setNewDesc}
            multiline
          />
          <TextInput placeholder="Price (numbers only)" style={styles.input} value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            {(['Starters', 'Platters', 'Main Course', 'Desserts'] as const).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterButton,
                  newCategory === cat && styles.filterButtonActive,
                  { paddingVertical: 8, paddingHorizontal: 12 },
                ]}
                onPress={() => setNewCategory(cat)}
              >
                <Text style={[styles.filterText, newCategory === cat && styles.filterTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4caf50', flex: 1, marginRight: 8 }]}
              onPress={() => {
                const priceNum = parseFloat(newPrice) || 0;
                if (!newName.trim()) return Alert.alert('Missing name', 'Please enter a dish name');
                addMeal(newCategory, { name: newName.trim(), description: newDesc.trim(), price: priceNum });
                setNewName('');
                setNewDesc('');
                setNewPrice('');
                setShowNew(false);
                navigation.navigate('Menu');
              }}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#9e9e9e', flex: 1 }]} onPress={() => setShowNew(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView>
        {Object.entries(newMeals).map(([type, meals]) => (
          <View key={type} style={styles.section}>
            <Text style={styles.sectionTitle}>{type}</Text>
            {meals.map((meal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mealBox}
                onPress={() => toggle(type, meal.name)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={[
                      styles.checkbox,
                      { backgroundColor: checked[type]?.has(meal.name) ? '#e65100' : '#fff' },
                    ]}
                  />
                  <Image source={meal.image} style={styles.mealImage} />
                  <Text style={styles.mealName}>{meal.name}</Text>
                  {meal.price !== undefined && (
                    <Text style={styles.mealPrice}>R {meal.price.toFixed(2)}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={addSelected}>
        <Text style={styles.buttonText}>Add Selected Meals to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff3e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e65100',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#bf360c',
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d84315',
    marginBottom: 6,
  },
  mealBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  mealName: {
    fontSize: 16,
    color: '#5d4037',
  },
  mealPrice: {
    marginLeft: 8,
    color: '#424242',
    fontWeight: '600',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffcc80',
    marginRight: 6,
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  button: {
    backgroundColor: '#e65100',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});
