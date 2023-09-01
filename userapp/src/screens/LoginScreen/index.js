import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';



const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  
  const handleLogin = () => {
    // Here, you can add logic to check the entered email and navigate to the map screen
    if (email === 'carol@gmail.com') {
      navigation.navigate('Home', { address: 0 });
    } else if (email === 'gabriella@gmail.com') {
      navigation.navigate('Home', { address: 1 });
    } else {
      // Handle invalid email
      alert('Invalid email. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
