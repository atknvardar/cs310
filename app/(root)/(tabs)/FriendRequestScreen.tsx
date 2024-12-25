import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend URL
const BASE_URL = "http://localhost:8080/api";

const FriendRequestsScreen: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState(""); // Search input for adding a friend
    const [friendRequests, setFriendRequests] = useState<string[]>([]); // List of pending requests

    // Fetch friend requests
    const fetchFriendRequests = async () => {
        try {
            const token = await AsyncStorage.getItem("jwtToken"); // Retrieve JWT token
            const response = await axios.get(`${BASE_URL}/friends`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFriendRequests(response.data);
        } catch (error) {
            Alert.alert("Error", "Unable to fetch friend requests.");
        }
    };

    // Send a friend request
    const sendFriendRequest = async () => {
        try {
            const token = await AsyncStorage.getItem("jwtToken");
            const response = await axios.post(
                `${BASE_URL}/friends/add`,
                { receiverEmail: email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Success", response.data.message || "Friend request sent!");
            setEmail(""); // Clear the input field
            fetchFriendRequests(); // Refresh the friend requests
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to send friend request.");
        }
    };

    // Accept a friend request
    const acceptFriendRequest = async (senderEmail: string) => {
        try {
            const token = await AsyncStorage.getItem("jwtToken");
            const response = await axios.post(
                `${BASE_URL}/friends/accept`,
                { senderEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert("Success", response.data.message || "Friend request accepted!");
            fetchFriendRequests(); // Refresh the friend requests
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to accept friend request.");
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    return (
        <View className="flex-1 bg-gradient-to-b from-primary-200 to-primary-500 px-6">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Text className="text-3xl font-serif text-white mb-8 text-center">Friend Requests</Text>

            {/* Friend Request Input */}
            <View className="mb-6">
                <Text className="text-white mb-2">Add a Friend</Text>
                <TextInput
                    placeholder="Enter friend's email"
                    placeholderTextColor="#ffffffaa"
                    value={email}
                    onChangeText={setEmail}
                    className="w-full bg-white bg-opacity-10 rounded-lg p-3 text-white"
                />
                <TouchableOpacity
                    onPress={sendFriendRequest}
                    className="w-full bg-white bg-opacity-20 rounded-lg p-4 mt-2 shadow-md flex-row items-center justify-center"
                >
                    <Text className="text-white text-lg font-semibold">Send Friend Request</Text>
                </TouchableOpacity>
            </View>

            {/* Pending Friend Requests */}
            <Text className="text-white text-lg mb-4">Pending Friend Requests:</Text>
            <FlatList
                data={friendRequests}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center mb-4 bg-white bg-opacity-10 p-3 rounded-lg">
                        <Text className="text-white">{item}</Text>
                        <TouchableOpacity
                            onPress={() => acceptFriendRequest(item)}
                            className="bg-white bg-opacity-20 p-2 rounded-lg"
                        >
                            <Text className="text-white text-sm">Accept</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default FriendRequestsScreen;
