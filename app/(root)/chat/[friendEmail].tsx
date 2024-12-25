import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend URL
const BASE_URL = "http://localhost:8080/api";

const ChatScreen = () => {
    const { friendEmail } = useLocalSearchParams(); // Get the dynamic friendEmail
    const [messages, setMessages] = useState([]); // List of messages
    const [newMessage, setNewMessage] = useState(""); // Input for new message

    // Fetch chat history between the logged-in user and the friend
    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem("jwtToken");
            const response = await axios.get(
                `${BASE_URL}/messages?sender=${encodeURIComponent(friendEmail)}&recipient=${encodeURIComponent(
                    friendEmail
                )}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch messages.");
        }
    };

    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) {
            Alert.alert("Error", "Message cannot be empty.");
            return;
        }
        try {
            const token = await AsyncStorage.getItem("jwtToken");
            const response = await axios.post(
                `${BASE_URL}/messages/send`,
                { sender: "your-email@example.com", recipient: friendEmail, content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, response.data]); // Add the new message to the list
            setNewMessage(""); // Clear the input field
        } catch (error) {
            Alert.alert("Error", "Failed to send message.");
        }
    };

    useEffect(() => {
        fetchMessages(); // Fetch messages on component mount
    }, []);

    return (
        <View className="flex-1 bg-gradient-to-b from-primary-200 to-primary-500 px-6">
            <Text className="text-3xl font-serif text-white mb-8 text-center">
                Chat with {friendEmail}
            </Text>

            {/* Messages List */}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View className="mb-4 bg-white bg-opacity-10 p-3 rounded-lg">
                        <Text className="text-white">{item.content}</Text>
                        <Text className="text-gray-400 text-xs">{item.timestamp}</Text>
                    </View>
                )}
            />

            {/* Message Input */}
            <View className="flex-row items-center mt-4">
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                    className="flex-1 bg-white bg-opacity-10 rounded-lg p-3 text-white"
                    placeholderTextColor="#ffffffaa"
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-blue-500 p-4 rounded-lg ml-2"
                >
                    <Text className="text-white">Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatScreen;
