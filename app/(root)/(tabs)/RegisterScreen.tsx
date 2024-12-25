import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Backend URL
const BASE_URL = "http://localhost:8080/api";

// Validation schema using Yup
const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

const RegisterScreen: React.FC = () => {
    const router = useRouter();

    const handleRegister = async (values: {
        name: string;
        lastName: string;
        email: string;
        password: string;
    }) => {
        try {
            const response = await axios.post(`${BASE_URL}/register`, values);
            if (response.status === 200) {
                Alert.alert("Success", "User registered successfully!");
                router.push("/LoginScreen"); // Navigate to Login Screen
            }
        } catch (error: any) {
            if (error.response) {
                Alert.alert("Error", error.response.data.message || "Registration failed.");
            } else {
                Alert.alert("Error", "Something went wrong.");
            }
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-primary-200 to-primary-500 px-6 justify-center">
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <Text className="text-3xl font-serif text-white mb-8 text-center">Register</Text>

            <Formik
                initialValues={{
                    name: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                }}
                validationSchema={RegisterSchema}
                onSubmit={(values) => {
                    const { confirmPassword, ...rest } = values; // Exclude confirmPassword
                    handleRegister(rest);
                }}
            >
                {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                  }) => (
                    <>
                        {/* Name Input */}
                        <TextInput
                            placeholder="Name"
                            value={values.name}
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
                        />
                        {errors.name && touched.name && <Text>{errors.name}</Text>}

                        {/* Last Name Input */}
                        <TextInput
                            placeholder="Last Name"
                            value={values.lastName}
                            onChangeText={handleChange("lastName")}
                            onBlur={handleBlur("lastName")}
                            style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
                        />
                        {errors.lastName && touched.lastName && <Text>{errors.lastName}</Text>}

                        {/* Email Input */}
                        <TextInput
                            placeholder="Email"
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            keyboardType="email-address"
                            style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
                        />
                        {errors.email && touched.email && <Text>{errors.email}</Text>}

                        {/* Password Input */}
                        <TextInput
                            placeholder="Password"
                            value={values.password}
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            secureTextEntry
                            style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
                        />
                        {errors.password && touched.password && <Text>{errors.password}</Text>}

                        {/* Confirm Password Input */}
                        <TextInput
                            placeholder="Confirm Password"
                            value={values.confirmPassword}
                            onChangeText={handleChange("confirmPassword")}
                            onBlur={handleBlur("confirmPassword")}
                            secureTextEntry
                            style={{ backgroundColor: "#fff", marginBottom: 8, padding: 10 }}
                        />
                        {errors.confirmPassword && touched.confirmPassword && <Text>{errors.confirmPassword}</Text>}

                        {/* Register Button */}
                        <TouchableOpacity onPress={handleSubmit as () => void} style={{ backgroundColor: "#007BFF", padding: 10 }}>
                            <Text style={{ color: "#fff" }}>Register</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </View>
    );
};

export default RegisterScreen;
