import { ScrollView, Text, View, Alert, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from 'expo-router';
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";

export default function index() {
    const [formData, setFormData] = useState({
        fridgeCode: "",
        password: "",
    });
    const [buttonText, setButtonText] = useState("Let's Go");

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    async function request() {
        setButtonText("Wait ...");

        const { fridgeCode, password } = formData;

        if (fridgeCode.trim().length === 0) {
            Alert.alert("Fridge Code is required");
            setButtonText("Let's Go");
            return;
        }

        if (password.trim().length < 8) {
            Alert.alert("Password must be between 8-20 letters");
            setButtonText("Let's Go");
            return;
        }

        let url = process.env.EXPO_PUBLIC_URL + "/Login";
        let data = { fridgeCode, password };

        try {
            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {

                console.log("response: ", response);

                // let obj = await response.json();
                // if (obj.success) {
                //     await AsyncStorage.setItem("user", JSON.stringify(obj.data.user));
                //     await AsyncStorage.setItem("profileImage", JSON.stringify(obj.data.profileImage));
                //     await AsyncStorage.setItem("profileAbout", JSON.stringify(obj.data.profileAbout));

                //     router.replace("/home");
                // } else {
                //     if (obj.data === "Please LogIn") {
                //         await AsyncStorage.removeItem("verified");
                //         await AsyncStorage.removeItem("user");
                //         router.replace("/");
                //     } else {
                //         Alert.alert(obj.data);
                //     }
                // }
            } else {
                Alert.alert("Please Try Again Later");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Something Went Wrong");
        } finally {
            setButtonText("Let's Go");
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.firstView}>
                        <Image source={logoIcon} style={styles.logo} />
                        <View style={styles.textView}>
                            <Text style={styles.text1}>LogIn</Text>
                            <Text style={styles.text2}>Welcome back to Smart Fridge</Text>
                            <Text style={[styles.text2, styles.text3]}> Let's get started !</Text>
                        </View>
                    </View>

                    <View style={styles.secondView}>
                        <View style={styles.fields}>
                            <InputField params={{ lableText: "Fridge Code", inputMode: "text", secureTextEntry: false, func: (value) => handleInputChange("fridgeCode", value) }} />
                            <InputField params={{ lableText: "Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("password", value) }} />
                            <Button text={buttonText} style={{ marginTop: 50, width: "100%" }} func={request} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        paddingHorizontal: 20,
    },
    firstView: {
        alignItems: 'center',
        marginVertical: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    textView: {
        alignItems: 'center',
    },
    text1: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text2: {
        fontSize: 16,
    },
    text3: {
        marginTop: 10,
    },
    secondView: {
        marginTop: 20,
    },
    fields: {
        alignItems: 'center',
    }
});