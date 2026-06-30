import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import CrearPasswordScreen from '../screens/CrearPasswordScreen';
import TramitesScreen from '../screens/TramitesScreen';
import DetalleTramiteScreen from '../screens/DetalleTramiteScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { cliente } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#3A241D', elevation: 0, shadowOpacity: 0 },
          headerTintColor: '#D4AF37',
          headerTitleStyle: { fontWeight: 'bold', color: '#F5F0E8' },
        }}
      >
        {cliente ? (
          // — Rutas autenticadas —
          <>
            <Stack.Screen
              name="Tramites"
              component={TramitesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetalleTramite"
              component={DetalleTramiteScreen}
              options={{ title: 'Detalle del Trámite' }}
            />
          </>
        ) : (
          // — Rutas públicas —
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CrearPassword"
              component={CrearPasswordScreen}
              options={{ title: '', headerTransparent: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
