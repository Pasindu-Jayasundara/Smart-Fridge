import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from 'project-react-accordion';
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import CustomAlert from "../components/CustomAlert";

export default function Profile() {

    const coderef = useRef(null)
    const [getCode, setCode] = useState(coderef.current);

    const dateref = useRef(null)
    const [getDate, setDate] = useState(dateref.current);

    const [getShowCustomAlert, setShowCustomAlert] = useState(false);
    const [getCustomAlertText, setCustomAlertText] = useState("");
    const [getCustomAlertIcon, setCustomAlertIcon] = useState("");

    const [getButtonText, setButtonText] = useState("Update Password");

    useEffect(() => {

        (async () => {
            if (getCode == null) {
                let code = await AsyncStorage.getItem("fridgeCode");
                coderef.current = code
                setCode(code)
            }
            if (getDate == null) {
                let date = await AsyncStorage.getItem("registered");
                dateref.current = date
                setDate(date)
            }
        })()


    }, []);

    const [formData, setFormData] = useState({
        password: "",
        reTypePassword: "",
    });

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    async function updatePassword() {

        setButtonText("Wait ...");

        const { reTypePassword, password } = formData;

        if (coderef.current.trim().length === 0) {

            setShowCustomAlert(true);
            setCustomAlertText("Fridge Code is required");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");
            return;
        }

        if (password.trim().length < 8) {

            setShowCustomAlert(true);
            setCustomAlertText("Password must be between 8-20 letters");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");
            return;
        }

        if (reTypePassword.trim().length < 8) {

            setShowCustomAlert(true);
            setCustomAlertText("Re-Typed Password must be between 8-20 letters");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");
            return;
        }

        if (password.trim() != reTypePassword.trim()) {

            setShowCustomAlert(true);
            setCustomAlertText("Password and Re-Typed Password must be same");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");
            return;
        }

        let url = process.env.EXPO_PUBLIC_URL + "/UpdatePassword";
        let data = {
            fridgeCode: coderef.current,
            newPassword: reTypePassword,
            oldPassword: password
        };

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

                let obj = await response.json();
                if (obj.isSuccess) {

                    setShowCustomAlert(true);
                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("✅");
                    setButtonText("Update Password");

                } else {
                    setShowCustomAlert(true);
                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("❗");
                    setButtonText("Register");
                }


            } else {
                setShowCustomAlert(true);
                setCustomAlertText("Please Try Again Later");
                setCustomAlertIcon("❗");
            }
        } catch (error) {
            console.log(error);
            setShowCustomAlert(true);
            setCustomAlertText("Something Went Wrong");
            setCustomAlertIcon("❗");
        } finally {
            setButtonText("Update Password");
        }

    }

    function logout() {

        setShowCustomAlert(true);
        setCustomAlertText("Are you sure you want to log out?");
        setCustomAlertIcon("❗");

    }

    async function logoutapproved() {
        try {
            await AsyncStorage.removeItem("fridgeCode");
            await AsyncStorage.removeItem("registered");
            router.replace("/");
        } catch {
            setShowCustomAlert(true);
            setCustomAlertText("PLease Try Again Later !");
            setCustomAlertIcon("❗");
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            {getShowCustomAlert ? (
                <CustomAlert params={
                    {
                        icon: getCustomAlertIcon,
                        iconType: "text",
                        message: getCustomAlertText,
                        iconBgColor: "white",
                        buttonCount: 2,
                        button1Color: "black",
                        button1Text: "No",
                        button2Color: "red",
                        button2Text: "Yes",
                        button1Func: () => { setShowCustomAlert(false) },
                        button2Func: logoutapproved
                    }
                } />
            ) : null}

            <Text style={styles.name}>Account</Text>
            <Text style={styles.email}>Fridge Code      : {JSON.parse(coderef.current)}</Text>
            <Text style={styles.email}>Registered On  : {JSON.parse(dateref.current)}</Text>

            <Accordion title={"Change Password"} style={
                {
                    accordion: { marginTop: 60 },
                    heading: {
                        backgroundColor: "#7dad8a",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        alignItems: "center",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    },
                    list: {
                        backgroundColor: "#f0f0f0",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        padding: 20,
                        marginTop: 5,
                        gap: 20,
                    }
                }
            } open="one" duration="150" visible={true} arrow={false} >

                <InputField params={{ lableText: "Old Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("password", value) }} />
                <InputField params={{ lableText: "New Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("reTypePassword", value) }} />

                <Button text={getButtonText} style={{ marginTop: 30, width: "100%", backgroundColor: "#0d5e18" }} func={updatePassword} />

            </Accordion>

            <Button text={"Log out"} style={{ marginTop: 100, width: "100%", backgroundColor: "#ba0606", borderRadius: 10 }} func={logout} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        padding: 20,
    },
    profileContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 20,
        color: "#0d5e18"
    },
    email: {
        fontSize: 16,
        color: 'gray',
    },
});