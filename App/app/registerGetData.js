import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

const logoIcon = require("../assets/fr.png");

export default function registerGetData() {
    const [formData, setFormData] = useState({
        fridgeCode: "",
        password: "",
        reTypePassword: "",
    });

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    async function request() {
        const { fridgeCode, password, reTypePassword } = formData;

        if (fridgeCode.trim().length == 0) {
            Alert.alert("Missing Fridge Code");
        } else if (password.trim().length < 8) {
            Alert.alert("Password must be between 8-20 letters");
        } else if (reTypePassword.trim().length < 8) {
            Alert.alert("Password must be between 8-20 letters");
        } else {
            let url = process.env.EXPO_PUBLIC_URL + "/Register";
            let data = { fridgeCode, password, reTypePassword };

            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                let obj = await response.json();
                if (obj.success) {
                    try {
                        await AsyncStorage.setItem("user", obj.data);
                        router.push("/");
                    } catch (error) {
                        Alert.alert("Something Went Wrong");
                        console.log(error);
                    }
                } else {
                    Alert.alert(obj.data);
                    console.log(obj.data);
                }
            } else {
                Alert.alert("Please Try Again Later");
                console.log(response);
            }
        }
    }

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrolView}>
                <View style={styles.container}>
                    <Image source={logoIcon} style={styles.logo} />

                    <Text style={styles.title}>Setup Your Fridge</Text>

                    <InputField params={{ lableText: "Fridge Code", inputMode: "text", secureTextEntry: false, func: (value) => handleInputChange("mobile", value) }} />
                    <InputField params={{ lableText: "Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("password", value) }} />
                    <InputField params={{ lableText: "Re-type Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("reTypePassword", value) }} />

                    <Button text={"Next"} style={{ marginTop: 50, width: "100%", backgroundColor: "#0d5e18" }} func={request} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20
    },
    container: {
        flex: 1,
        alignItems: "center",
        width: "80%",
        rowGap: 22,
        justifyContent: "center",
    },
    title: {
        color: "#0d5e18",
        fontSize: 23,
        fontWeight: "bold",
        paddingVertical: 10,
        alignSelf: "flex-start"
    },
    safearea: {
        flex: 1
    },
    scrolView: {
        flexGrow: 1,
        justifyContent: "center",
        paddingTop: 30,
        alignItems: "center",
    }
});