import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Pressable,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import {
  withAuthenticator,
  useAuthenticator,
} from "@aws-amplify/ui-react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const { user } = useAuthenticator();
  const { userEmail } = useAuthContext();
  const [email, setEmail] = useState(userEmail || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await Auth.signIn(email, password);

      if (rememberMe) {
        await SecureStore.setItemAsync("userPassword", password);
      } else {
        await SecureStore.deleteItemAsync("userPassword");
      }

      navigation.navigate("Home", { address: 0 });
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  const SignOutButton = () => {
    const { signOut } = useAuthenticator();
    return (
      <Pressable onPress={signOut} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>
          Hello, {user?.username}! Click here to sign out!
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View style={styles.container}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Enter your password"
          secureTextEntry={true}
        />
        <View style={styles.rememberMeContainer}>
          <Checkbox
            value={rememberMe}
            onValueChange={() => setRememberMe(!rememberMe)}
          />
          <Text style={styles.rememberMeLabel}>Remember Me</Text>
        </View>
        <Button title="Login" onPress={handleLogin} />
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginTop: 10,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rememberMeLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "green",
  },
});

export default LoginScreen;
