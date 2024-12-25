import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend URL
const BASE_URL = "http://localhost:8080/api";

const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            if (response.status === 200) {
                const token = response.data.token;
                await AsyncStorage.setItem("jwtToken", token); // Store JWT token
                Alert.alert("Success", "Login successful!");
                router.push("/FriendRequestScreen"); // Navigate to Friend Requests Screen
            }
        } catch (error: any) {
            if (error.response) {
                Alert.alert("Error", error.response.data.message || "Login failed.");
            } else {
                Alert.alert("Error", "Something went wrong.");
            }
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-secondary-200 to-secondary-500 px-6 justify-center">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Text className="text-3xl font-serif text-white mb-8 text-center">Login</Text>

            {/* Email Input */}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
            />

            {/* Password Input */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
            />

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "#007BFF", padding: 10 }}>
                <Text style={{ color: "#fff" }}>Login</Text>
            </TouchableOpacity>

            {/* Navigate to Register Screen */}
            <TouchableOpacity onPress={() => router.push("/RegisterScreen")} style={{ marginTop: 10 }}>
                <Text style={{ color: "#007BFF" }}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
