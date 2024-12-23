import { ScrollView, Text, View, Alert, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from 'expo-router';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import CustomAlert from "../components/CustomAlert";
import * as SplashScreen from 'expo-splash-screen';

const logoIcon = require("../assets/fridge.png");

SplashScreen.preventAutoHideAsync();

export default function index() {
    const [formData, setFormData] = useState({
        fridgeCode: "",
        password: "",
    });
    const [buttonText, setButtonText] = useState("Let's Go");

    const [getShowCustomAlert, setShowCustomAlert] = useState(false);
    const [getCustomAlertText, setCustomAlertText] = useState("");
    const [getCustomAlertIcon, setCustomAlertIcon] = useState("");

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const check = async () => {
            let fridgeCode = await AsyncStorage.getItem("fridgeCode");
            if (fridgeCode) {
                router.replace("/home");
                SplashScreen.hideAsync();
            }else{
                SplashScreen.hideAsync();
            }
        };
        check();
    }, []);

    async function request() {

        setButtonText("Wait ...");

        const { fridgeCode, password } = formData;

        if (fridgeCode.trim().length === 0) {

            setShowCustomAlert(true);
            setCustomAlertText("Fridge Code is required");
            setCustomAlertIcon("❗");

            setButtonText("Let's Go");
            return;
        }

        if (password.trim().length < 8) {

            setShowCustomAlert(true);
            setCustomAlertText("Password must be between 8-20 letters");
            setCustomAlertIcon("❗");

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

                let obj = await response.json();
                if (obj.isSuccess) {
                    await AsyncStorage.setItem("fridgeCode", JSON.stringify(fridgeCode));
                    await AsyncStorage.setItem("registered", JSON.stringify(obj.data.registered));

                    router.replace("/home",{
                        state: JSON.stringify(obj.data)
                    });
                } else {
                    setShowCustomAlert(true);
                    setCustomAlertText(obj.data.msg);
                    setCustomAlertIcon("❗");
                    setButtonText("Register");
                }


            } else {
                setShowCustomAlert(true);
                setCustomAlertText("Please Try Again Later");
                setCustomAlertIcon("❗");
            }
        } catch (error) {
            setShowCustomAlert(true);
            setCustomAlertText("Something Went Wrong");
            setCustomAlertIcon("❗");
        } finally {
            setButtonText("Let's Go");
        }
    }

    return (

        <SafeAreaView style={styles.safeAreaView}>

            {getShowCustomAlert ? (
                <CustomAlert params={
                    {
                        icon: getCustomAlertIcon,
                        iconType: "text",
                        message: getCustomAlertText,
                        iconBgColor: "white",
                        buttonCount: 1,
                        button1Color: "orange",
                        button1Text: "Update Details",
                        button2Color: "green",
                        button2Text: "OK",
                        button1Func: () => { setShowCustomAlert(false) },
                        button2Func: () => { Alert.alert("2") }
                    }
                } />
            ) : null}

            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.firstView}>
                        <Image source={logoIcon} style={styles.logo} />
                        <View style={styles.textView}>
                            <Text style={styles.text1}>LogIn</Text>
                            <Text style={styles.text2}>Welcome back to Smart Fridge</Text>
                            <Text style={styles.text2}> Let's get started !</Text>
                        </View>
                    </View>

                    <View style={styles.secondView}>
                        <View style={styles.fields}>
                            <InputField params={{ lableText: "Fridge Code", inputMode: "text", secureTextEntry: false, func: (value) => handleInputChange("fridgeCode", value) }} />
                            <InputField params={{ lableText: "Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("password", value) }} />
                            <Button text={buttonText} style={{ marginTop: 50, width: "100%", backgroundColor: "#0d5e18" }} func={request} />

                            <Text style={styles.linkText}>
                                New to ZapChat?
                                <Link href={"/register"} style={styles.link}> Register Now</Link>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    link: {
        color: "#0d5e18",
    },
    linkText: {
        color: "black",
        alignSelf: "center"
    },
    safeAreaView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 20,
    },
    text1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    text2: {
        fontSize: 16,
        color: "#0d5e18"
    },
    secondView: {
        marginTop: 20,
    },
    fields: {
        alignItems: 'center',
        gap: 20,
    }
});