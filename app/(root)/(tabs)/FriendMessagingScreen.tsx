import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
}

const FriendMessagingScreen = ({ route }: { route: any }) => {
    const { friendId, friendName } = route.params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch chat history
    const fetchChatHistory = async () => {
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("jwtToken");

            const response = await fetch(`https://api.example.com/chat/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(data.messages || []);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch chat history.");
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setLoading(false);
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

            const response = await fetch(`https://api.example.com/chat/${friendId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newMessage }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages((prevMessages) => [...prevMessages, data.message]);
                setNewMessage("");
            } else {
                Alert.alert("Error", data.message || "Failed to send message.");
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-gradient-to-b from-primary-200 to-primary-400"
        >
            <View className="flex-1 px-4 pt-10">
                <Text className="text-2xl font-bold text-white text-center mb-4">
                    Chat with {friendName}
                </Text>

                <FlatList<Message>
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            className={`flex-row ${
                                item.senderId === "current_user_id" ? "justify-end" : "justify-start"
                            } mb-2`}
                        >
                            <View
                                className={`rounded-lg p-3 ${
                                    item.senderId === "current_user_id"
                                        ? "bg-blue-500"
                                        : "bg-gray-500"
                                }`}
                            >
                                <Text className="text-white">{item.content}</Text>
                                <Text className="text-xs text-white mt-1">
                                    {new Date(item.timestamp).toLocaleTimeString()}
                                </Text>
                            </View>
                        </View>
                    )}
                    inverted
                />
            </View>

            <View className="px-4 py-2 bg-white flex-row items-center">
                <TextInput
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                    className="flex-1 bg-gray-200 rounded-lg px-3 py-2"
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    className="ml-3 bg-blue-500 rounded-full p-3"
                >
                    <Text className="text-white">Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default FriendMessagingScreen;
