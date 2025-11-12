import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useMenu, MenuShape, Meal } from './MenuContext'; 

type MealItem = Meal;


const predefinedNewMeals: Record<string, MealItem[]> = {
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


const getCombinedMeals = (currentMenu: MenuShape): MenuShape => {
  const combined: MenuShape = JSON.parse(JSON.stringify(currentMenu)); // Deep copy current menu

  (Object.keys(predefinedNewMeals) as Array<keyof MenuShape>).forEach(cat => {
    const existingNames = new Set(combined[cat].map(m => m.name));

    predefinedNewMeals[cat].forEach(newMeal => {
      // Add the new meal only if a meal with the same name doesn't exist
      if (!existingNames.has(newMeal.name)) {
        combined[cat].push(newMeal);
      }
    });
  });
  return combined;
};


export default function ChefAdd({ navigation }: any) {
  // Use the new setMenu function
  const { menu, addMeal, setMenu } = useMenu(); 
  
  // Create a single list of ALL possible meals to display
  const combinedMeals = getCombinedMeals(menu); 

  // --- State Initialization ---
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<'Starters' | 'Platters' | 'Main Course' | 'Desserts'>('Starters');

  // Initialize 'checked' state: All meals CURRENTLY IN THE MENU must be checked by default.
  const [checked, setChecked] = useState<Record<string, Set<string>>>(() => {
    const init: Record<string, Set<string>> = {};
    (Object.keys(combinedMeals) as Array<keyof MenuShape>).forEach(k => {
      // Start with only meals currently in the menu checked
      init[k] = new Set(menu[k].map(m => m.name)); 
    });
    return init;
  });
  
  
  
  const toggle = (category: keyof MenuShape, name: string) => {
    setChecked(prev => {
      const copy: Record<string, Set<string>> = { ...prev };
      const set = new Set(copy[category]);
      if (set.has(name)) set.delete(name); // Remove if checked
      else set.add(name); // Add if unchecked
      copy[category] = set;
      return copy;
    });
  };

  /** Replaces the entire menu with only the items currently checked/selected. */
  const saveMenuConfiguration = () => {
    const finalMenu: MenuShape = { Starters: [], Platters: [], 'Main Course': [], Desserts: [] };
    let selectedCount = 0;

    (Object.keys(combinedMeals) as Array<keyof MenuShape>).forEach(cat => {
      const selectedNames = checked[cat] || new Set();
      
      // Filter the combined list (all potential meals) to include only the meals marked as selected
      const selectedMeals = combinedMeals[cat].filter(meal => selectedNames.has(meal.name));
      finalMenu[cat] = selectedMeals;
      selectedCount += selectedMeals.length;
    });

    if (selectedCount === 0) {
      Alert.alert('Empty Menu', 'The menu cannot be empty. Please select at least one meal.');
      return;
    }

 
    setMenu(finalMenu); 
    Alert.alert('Success', 'Menu successfully updated.');
    navigation.navigate('Menu');
  };

  // The logic for adding a new dish is updated to use the context addMeal, but 
  // the final menu is still saved 
  const handleSaveNewDish = () => {
      const priceNum = parseFloat(newPrice) || 0;
      if (!newName.trim()) return Alert.alert('Missing name', 'Please enter a dish name');
      
      // 1. Add the new meal to the context menu 
      const newDish = { name: newName.trim(), description: newDesc.trim(), price: priceNum };
      addMeal(newCategory, newDish);
      
      
      setChecked(prev => {
          const copy: Record<string, Set<string>> = { ...prev };
          const set = new Set(copy[newCategory]);
          set.add(newDish.name); 
          copy[newCategory] = set;
          return copy;
      });
      
      // 3. Reset state
      setNewName('');
      setNewDesc('');
      setNewPrice('');
      setShowNew(false);
     
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef Menu Configuration</Text>
      <Text style={styles.subtitle}>Check items to add, uncheck items to remove.</Text>

      
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
              style={[styles.button, { backgroundColor: '#4caf50', flex: 1, marginRight: 8, marginTop: 0 }]}
              onPress={handleSaveNewDish}
            >
              <Text style={styles.buttonText}>Save & Select</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#9e9e9e', flex: 1, marginTop: 0 }]} onPress={() => setShowNew(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      
      <ScrollView>
      
        {Object.entries(combinedMeals).map(([type, meals]) => (
          <View key={type} style={styles.section}>
            <Text style={styles.sectionTitle}>{type}</Text>
            {meals.map((meal, index) => (
              <TouchableOpacity
                key={index}
                style={styles.mealBox}
                onPress={() => toggle(type as keyof MenuShape, meal.name)} 
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

      
      <TouchableOpacity style={styles.button} onPress={saveMenuConfiguration}>
        <Text style={styles.buttonText}>Save Menu Configuration</Text>
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
 title: { fontSize: 20, 
  fontWeight: 'bold', 
  color: '#e65100', 
  marginBottom: 12, 
  textAlign: 'center', 
}, 
 subtitle: { fontSize: 16, 
  color: '#bf360c', 
  marginBottom: 8, 
  textAlign: 'center', }, 
 section: { marginBottom: 12, }, 
 sectionTitle: { fontSize: 18, 
  fontWeight: '600', 
  color: '#d84315', 
  marginBottom: 6, }, 
 mealBox: { flexDirection: 'row',
   alignItems: 'center', 
   marginBottom: 8, 
  }, 
 mealImage: { width: 60, 
  height: 60, 
  borderRadius: 6,
   marginRight: 10, 
  }, 
 mealName: { fontSize: 16, 
  color: '#5d4037', 
}, 
 mealPrice: { marginLeft: 8,
   color: '#424242', 
   fontWeight: '600', 
  }, 
 filterButton: { paddingVertical: 6, 
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
 filterTextActive: { color: '#fff', 
  fontWeight: 'bold',
 }, 
 checkbox: { width: 20, 
  height: 20, 
  borderRadius: 4, 
  borderWidth: 1, 
  borderColor: '#ccc',
   marginRight: 8,
   }, 
 button: { backgroundColor: '#e65100', 
  padding: 12, 
  borderRadius: 8, 
  alignItems: 'center', 
  marginTop: 12, 
}, 
 buttonText: { color: '#fff', 
  fontWeight: 'bold', 
}, 
 input: { borderWidth: 1, 
  borderColor: '#ccc', 
  padding: 10, 
  borderRadius: 6, 
  marginBottom: 12, 
  backgroundColor: '#fff', 
},
});