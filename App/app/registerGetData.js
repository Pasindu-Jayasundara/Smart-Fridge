import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { router } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import CustomAlert from "../components/CustomAlert";

const logoIcon = require("../assets/fr.png");

export default function registerGetData() {
    const [formData, setFormData] = useState({
        fridgeCode: "",
        password: "",
        reTypePassword: "",
    });
    const [buttonText, setButtonText] = useState("Register");

    const [getShowCustomAlert, setShowCustomAlert] = useState(false);
    const [getCustomAlertText, setCustomAlertText] = useState("");
    const [getCustomAlertIcon, setCustomAlertIcon] = useState("");
    const [getButtonCount, setButtonCount] = useState(1);

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    async function request() {
        const { fridgeCode, password, reTypePassword } = formData;

        setButtonText("Registering ...");

        if (fridgeCode.trim().length == 0) {

            setShowCustomAlert(true);
            setCustomAlertText("Fridge Code is required");
            setCustomAlertIcon("❗");
            setButtonText("Register");

            return;

        }
        if (password.trim().length < 8) {

            setShowCustomAlert(true);
            setCustomAlertText("Password must be between 8-20 letters");
            setCustomAlertIcon("❗");
            setButtonText("Register");
            return;

        }
        if (reTypePassword.trim().length < 8) {

            setShowCustomAlert(true);
            setCustomAlertText("Re-type Password must be between 8-20 letters");
            setCustomAlertIcon("❗");
            setButtonText("Register");

            return;

        }

        if (reTypePassword.trim() != password.trim()) {

            setShowCustomAlert(true);
            setCustomAlertText("Passwords Must be Same");
            setCustomAlertIcon("❗");
            setButtonText("Register");

            return;

        }

        try {
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
                
                if(obj.isSuccess){
                    setButtonCount(2);
                }
                setShowCustomAlert(true);
                setCustomAlertText(obj.data);
                setCustomAlertIcon("❗");
                setButtonText("Register");

            } else {
                setShowCustomAlert(true);
                setCustomAlertText("Please Try Again Later");
                setCustomAlertIcon("❗");
                setButtonText("Register");
            }
        } catch (error) {
            setShowCustomAlert(true);
            setCustomAlertText("Something Went Wrong");
            setCustomAlertIcon("❗");
            setButtonText("Register");
        } finally {
            setButtonText("Register");
        }
    }

    return (
        <SafeAreaView style={styles.safearea}>
            {getShowCustomAlert ? (
                <CustomAlert params={
                    {
                        icon: getCustomAlertIcon,
                        iconType: "text",
                        message: getCustomAlertText,
                        iconBgColor: "white",
                        buttonCount: getButtonCount,
                        button1Color: "orange",
                        button1Text: "OK",
                        button2Color: "green",
                        button2Text: "LogIn",
                        button1Func: () => { setShowCustomAlert(false) },
                        button2Func: () => { router.replace("/"); }
                    }
                } />
            ) : null}
            <ScrollView contentContainerStyle={styles.scrolView}>
                <View style={styles.container}>
                    <Image source={logoIcon} style={styles.logo} />

                    <Text style={styles.title}>Setup Your Fridge</Text>

                    <InputField params={{ lableText: "Fridge Code", inputMode: "text", secureTextEntry: false, func: (value) => handleInputChange("fridgeCode", value) }} />
                    <InputField params={{ lableText: "Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("password", value) }} />
                    <InputField params={{ lableText: "Re-type Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("reTypePassword", value) }} />

                    <Button text={buttonText} style={{ marginTop: 50, width: "100%", backgroundColor: "#0d5e18" }} func={request} />
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