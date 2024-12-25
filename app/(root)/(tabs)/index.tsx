import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Index() {
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-xl mb-4">Welcome to the App</Text>

            {/* Login Button */}
            <Link href="/LoginScreen" asChild>
                <TouchableOpacity className="bg-blue-500 p-3 rounded-lg mb-2">
                    <Text className="text-white">Go to Login</Text>
                </TouchableOpacity>
            </Link>

            {/* Register Button */}
            <Link href="/RegisterScreen" asChild>
                <TouchableOpacity className="bg-green-500 p-3 rounded-lg mb-2">
                    <Text className="text-white">Go to Register</Text>
                </TouchableOpacity>
            </Link>

            {/* Friend Requests Button */}
            <Link href="/FriendRequestScreen" asChild>
                <TouchableOpacity className="bg-purple-500 p-3 rounded-lg">
                    <Text className="text-white">Friend Requests</Text>
                </TouchableOpacity>
            </Link>

            <Link href="/ShowFriendsListScreen" asChild>
                <TouchableOpacity className="bg-purple-500 p-3 rounded-lg">
                    <Text className="text-white">Friends List</Text>
                </TouchableOpacity>
            </Link>


        </View>

    );
}
