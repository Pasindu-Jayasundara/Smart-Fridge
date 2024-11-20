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

    const b1tref = useRef("Ok")
    const [getButton1Text, setButton1Text] = useState(b1tref.current);
    const b2tref = useRef("Yes")
    const [getButton2Text, setButton2Text] = useState(b2tref.current);
    const bctref = useRef(1)
    const [getAlertButtonCount, setAlertButtonCount] = useState(bctref.current);

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
        newPassword: ""
    });

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    async function updatePassword() {

        setButtonText("Wait ...");

        const { password, reTypePassword, newPassword } = formData;

        if (getCode == null) {
            let code = await AsyncStorage.getItem("fridgeCode");
            coderef.current = code
            setCode(code)
        }

        if (coderef.current.trim().length === 0 || coderef.current == null) {

            setCustomAlertText("Fridge Code is required");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");

            setAlertButtonCount(1)
            setButton1Text("Ok")
            setShowCustomAlert(true);

            return;
        }

        if (password.trim().length < 8) {

            setCustomAlertText("Password must be between 8-20 letters");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");

            setAlertButtonCount(1)
            setButton1Text("Ok")
            setShowCustomAlert(true);

            return;
        }

        if (reTypePassword.trim().length < 8) {

            setCustomAlertText("Re-Typed Password must be between 8-20 letters");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");

            setAlertButtonCount(1)
            setButton1Text("Ok")
            setShowCustomAlert(true);

            return;
        }

        if (newPassword.trim() != reTypePassword.trim()) {

            setCustomAlertText("Password and Re-Typed Password must be same");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");

            setAlertButtonCount(1)
            setButton1Text("Ok")
            setShowCustomAlert(true);

            return;
        }

        if (newPassword.trim() == password.trim()) {

            setCustomAlertText("Old Password and New Password Cannot be same");
            setCustomAlertIcon("❗");

            setButtonText("Update Password");

            setAlertButtonCount(1)
            setButton1Text("Ok")
            setShowCustomAlert(true);

            return;
        }

        let url = process.env.EXPO_PUBLIC_URL + "/UpdatePassword";
        let data = {
            fridgeCode: JSON.parse(coderef.current),
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

                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("✅");
                    setButtonText("Update Password");

                    setAlertButtonCount(1)
                    setButton1Text("Ok")
                    setShowCustomAlert(true);

                    setFormData({
                        password: "",
                        reTypePassword: "",
                        newPassword: ""
                    })

                } else {
                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("❗");
                    setButtonText("Update Password");

                    setAlertButtonCount(1)
                    setButton1Text("Ok")

                    setShowCustomAlert(true);

                }


            } else {
                setCustomAlertText("Please Try Again Later");
                setCustomAlertIcon("❗");

                setAlertButtonCount(1)
                setButton1Text("Ok")
                setShowCustomAlert(true);

            }
        } catch (error) {
            console.log(error);
            setCustomAlertText("Something Went Wrong");
            setCustomAlertIcon("❗");

            setAlertButtonCount(1)
            setButton1Text("Ok")
            setShowCustomAlert(true);

        } finally {
            setButtonText("Update Password");
            bctref.current = 2
            b1tref.current = "No"
            b2tref.current = "Yes"
        }

    }

    function logout() {

        setShowCustomAlert(true);
        setCustomAlertText("Are you sure you want to log out?");
        setCustomAlertIcon("❗");

        setAlertButtonCount(2)
        setButton1Text("No")
        setButton2Text("Yes")

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
                        buttonCount: bctref.current,
                        button1Color: "black",
                        button1Text: b1tref.current,
                        button2Color: "red",
                        button2Text: b2tref.current,
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
                <InputField params={{ lableText: "New Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("newPassword", value) }} />
                <InputField params={{ lableText: "Re-type Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("reTypePassword", value) }} />

                <Button text={getButtonText} style={{ marginTop: 30, width: "100%", backgroundColor: "#0d5e18" }} func={updatePassword} />

            </Accordion>

            <Button text={"Log out"} style={{ marginTop: 40, width: "97%", backgroundColor: "#ba0606", borderRadius: 10, alignSelf: "center" }} func={logout} />

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