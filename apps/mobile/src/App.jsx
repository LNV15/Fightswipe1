
import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';

const API = (Constants.expoConfig?.extra?.apiBase) || "http://localhost:8000";

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(API + "/health").then(r => r.json()).then(setHealth).catch(() => setHealth({error:true}));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color:'#fff', fontSize: 24, marginBottom: 12 }}>Fightswipe</Text>
        <Text style={{ color:'#9aa0a6' }}>API Health: {health ? JSON.stringify(health) : '…'}</Text>
      </View>
    </SafeAreaView>
  );
}
