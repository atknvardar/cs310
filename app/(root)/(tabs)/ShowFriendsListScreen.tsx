import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Backend URL
const BASE_URL = "http://localhost:8080/api";

const FriendsListScreen: React.FC = () => {
    const [friends, setFriends] = useState<string[]>([]); // Friends list
    const router = useRouter(); // For navigation

    // Fetch friends from the backend
    const fetchFriends = async () => {
        try {
            const token = await AsyncStorage.getItem("jwtToken"); // Get JWT token
            const response = await axios.get(`${BASE_URL}/friends`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriends(response.data); // Set friends list
        } catch (error) {
            Alert.alert("Error", "Failed to fetch friends.");
        }
    };

    useEffect(() => {
        fetchFriends(); // Fetch friends on component mount
    }, []);

    return (
        <View className="flex-1 bg-gradient-to-b from-primary-200 to-primary-500 px-6">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Text className="text-3xl font-serif text-white mb-8 text-center">Friends</Text>

            {/* Display friends in a list */}
            <FlatList
                data={friends}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center mb-4 bg-white bg-opacity-10 p-3 rounded-lg">
                        <Text className="text-white">{item}</Text>
                        <TouchableOpacity
                            onPress={() => router.push(`/chat/${item}`)} // Navigate to chat screen
                            className="bg-blue-500 p-2 rounded-lg"
                        >
                            <Text className="text-white">Chat</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default FriendsListScreen;
