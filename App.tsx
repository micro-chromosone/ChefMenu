import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChefAdd from './ChefAdd';
import MenuPage from './menu';
import { MenuProvider } from './MenuContext';

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChefAdd')}>
        <Text style={styles.buttonText}>Chef</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.buttonText}>Visitor</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Stack.Screen name="ChefAdd" component={ChefAdd} options={{ title: 'Add Meal' }} />
          <Stack.Screen name="Menu" component={MenuPage} options={{ title: 'Menu' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
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
});
