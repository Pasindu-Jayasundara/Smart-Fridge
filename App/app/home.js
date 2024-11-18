import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../components/CustomAlert";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import Header from "../components/Header";
import Tempreature from "../components/Tempreature";
import PowerUsage from "../components/PowerUsage";
import Weight from "../components/Weight";
import DoorStatus from "../components/DoorStatus";
import FoodStatus from "../components/FoodStatus";
import Humidity from "../components/Humidity";

export default function home() {

    const data = useGlobalSearchParams();
    const jsonData = JSON.stringify(data);

    const [getShowCustomAlert, setShowCustomAlert] = useState(false);
    const [getCustomAlertText, setCustomAlertText] = useState("");
    const [getCustomAlertIcon, setCustomAlertIcon] = useState("");

    const [getTempreature, setTempreature] = useState("");

    const coderef = useRef(null)
    const [getCode, setCode] = useState(coderef.current);

    useEffect(() => {

        if (jsonData === "{}") {
            loadData()
        } else {
            // setTimeout(() => {
            //     loadData()
            // }, 10000);
        }

    }, []);

    async function loadData() {

        if (getCode == null) {
            let code = await AsyncStorage.getItem("fridgeCode");
            coderef.current = code
            setCode(code)
        }

        let url = process.env.EXPO_PUBLIC_URL + "/LoadProfile";
        let data = {
            fridgeCode: JSON.parse(coderef.current)
        };

        try {
            let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                let obj = await response.json();

                if (obj.isSuccess) {

                    console.log(obj.data)
                    setTempreature(obj.data.tempreature.tempreature)

                } else {
                    setShowCustomAlert(true);
                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("❗");
                }
            }

            // setTimeout(() => {
            //     loadData()
            // }, 10000);
        } catch (error) {
            setShowCustomAlert(true);
            setCustomAlertText("Something Went Wrong");
            setCustomAlertIcon("❗");
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
                        button1Text: "Update",
                        button2Color: "green",
                        button2Text: "OK",
                        button1Func: () => { setShowCustomAlert(false) },
                        button2Func: () => { Alert.alert("2") }
                    }
                } />
            ) : null}

            <Header fridgeCode={getCode} func={()=>{router.push("/profile")}}/>

            <View style={styles.dashboard}>

                <View style={styles.line1}>
                    <View style={[styles.dashboardItem, { paddingBlock: 4 }]}>
                        <Tempreature temp={getTempreature} />
                    </View>

                    <View style={styles.second}>
                        <View style={[styles.dashboardItem, { width: "100%" }]}>
                            <PowerUsage usage={20} date={"2024/12/11"} />
                        </View>

                        <View style={[styles.dashboardItem, { width: "100%" }]}>
                            <Weight weight={20} />
                        </View>
                    </View>
                </View>

                <View style={[styles.dashboardItem, { width: "96%" }]}>
                    <Humidity humidity={"50"} />
                </View>

                <View style={[styles.second, { flexDirection: "row", width: "100%", justifyContent: "space-evenly" }]}>
                    <View style={[styles.dashboardItem, { width: "45%" }]}>
                        <DoorStatus status={"Close"} />
                    </View>

                    <View style={[styles.dashboardItem, { width: "45%" }]}>
                        <FoodStatus status={"Middle"} />
                    </View>
                </View>

                <Button text={"Turn OFF"} style={{height:70, width: "96%", backgroundColor: "#961a02",marginTop:50 }} func={() => { loadData() }} />
            </View>

        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    line1: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    second: {
        gap: 15,
    },
    dashboard: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        marginTop: 30,
    },
    safeAreaView: {
        flex: 1,
    },
    dashboardItem: {
        width: "45%",
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
});