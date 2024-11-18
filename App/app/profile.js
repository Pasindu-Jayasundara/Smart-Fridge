import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from 'project-react-accordion';
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { useState } from "react";

export default function Profile() {

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

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.name}>Account</Text>
            <Text style={styles.email}>Fridge Code      : gfdxbgfdgb</Text>
            <Text style={styles.email}>Registered On  : john.doe@example.com</Text>

            <Accordion title={"Change Password"} key={Math.random()} style={
                {
                    accordion:{marginTop:60},
                    heading: {
                        backgroundColor:"#7dad8a",
                        borderTopLeftRadius:10,
                        borderTopRightRadius:10,
                        borderBottomLeftRadius:10,
                        borderBottomRightRadius:10,
                        alignItems:"center",
                        paddingHorizontal:20,
                        paddingVertical:10,
                    },
                    list: {
                        backgroundColor:"#f0f0f0",
                        borderTopLeftRadius:10,
                        borderTopRightRadius:10,
                        borderBottomLeftRadius:10,
                        borderBottomRightRadius:10,
                        padding:20,
                        marginTop:5,
                        gap:20,
                    }
                }
            } open="one" duration="150" visible={true} arrow={false} >
                
                    <InputField params={{ lableText: "Old Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("password", value) }} />
                    <InputField params={{ lableText: "New Password", inputMode: "text", secureTextEntry: true, func: (value) => handleInputChange("reTypePassword", value) }} />

                    <Button text={"Update Password"} style={{ marginTop: 30, width: "100%", backgroundColor: "#0d5e18" }} />
                
            </Accordion>

            <Button text={"Log out"} style={{ marginTop: 100, width: "100%", backgroundColor: "#ba0606",borderRadius:10 }} />

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
        color:"#0d5e18"
    },
    email: {
        fontSize: 16,
        color: 'gray',
    },
});