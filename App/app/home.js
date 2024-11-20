import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function home() {

    const data = useGlobalSearchParams();
    const jsonData = JSON.stringify(data);

    const [getShowCustomAlert, setShowCustomAlert] = useState(false);
    const [getCustomAlertText, setCustomAlertText] = useState("");
    const [getCustomAlertIcon, setCustomAlertIcon] = useState("");

    const [getTempreature, setTempreature] = useState("00.00");
    const [getHumidity, setHumidity] = useState("00.00");
    const [getWeight, setWeight] = useState("00.00");
    const [getPowerUsage, setPowerUsage] = useState("00.00");
    const [getFoodStatus, setFoodStatus] = useState("00.00");
    const [getFridgeStatus, setFridgeStatus] = useState("00.00");

    const [getButtonText, setButtonText] = useState("Turn ON");

    const coderef = useRef(null)
    const [getCode, setCode] = useState(coderef.current);

    const doorref = useRef(false)
    const [getDoorStatus, setDoorStatus] = useState(doorref.current);

    useEffect(() => {

        if (jsonData === "{}") {
            loadData()
        } else {
            setTimeout(() => {
                loadData()
            }, 10000);
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

                    // console.log(obj.data)
                    setTempreature(obj.data.tempreature.tempreature)
                    doorref.current = obj.data.doorStatus.isNowOpen
                    // console.log(obj.data.doorStatus.isNowOpen)
                    setFoodStatus(obj.data.foodStatus.foodStatus)
                    setHumidity(obj.data.humidity.humidity)
                    setPowerUsage(obj.data.powerConsumption.power)
                    setWeight(obj.data.rackWeight.rackOne.weight)

                    setFridgeStatus(obj.data.fridgeStatus)
                    setButtonText(obj.data.fridgeStatus == 1 ? "Turn OFF" : "Turn ON")

                } else {
                    setShowCustomAlert(true);
                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("❗");
                }
            }

            setTimeout(() => {
                loadData()
            }, 10000);
        } catch (error) {
            setShowCustomAlert(true);
            setCustomAlertText("Something Went Wrong");
            setCustomAlertIcon("❗");
        }finally{
            SplashScreen.hideAsync();
        }

    }

    async function changeFridgeStatus() {

        let url = process.env.EXPO_PUBLIC_URL + "/UpdateFridgeStatus";
        let data = {
            fridgeCode: getCode,
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

                    setShowCustomAlert(true);
                    setCustomAlertText("Fridge Status Updated");
                    setCustomAlertIcon("✅");

                    setFridgeStatus(!getFridgeStatus)
                    setButtonText(!getFridgeStatus ? "Turn OFF" : "Turn ON")

                } else {
                    setShowCustomAlert(true);
                    setCustomAlertText("Something Went Wrong");
                    setCustomAlertIcon("❗");
                }
            }

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
                        button1Color: "black",
                        button1Text: "OK",
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
                        <Pressable style={[styles.dashboardItem, { width: "100%" }]} onPress={()=>{router.push("/powerUsage")}}>
                            <PowerUsage usage={getPowerUsage} date={"2024/12/11"} />
                        </Pressable>

                        <View style={[styles.dashboardItem, { width: "100%" }]}>
                            <Weight weight={getWeight} />
                        </View>
                    </View>
                </View>

                <View style={[styles.dashboardItem, { width: "96%" }]}>
                    <Humidity humidity={getHumidity} />
                </View>

                <View style={[styles.second, { flexDirection: "row", width: "100%", justifyContent: "space-evenly" }]}>
                    <Pressable style={[styles.dashboardItem, { width: "45%" }]} onPress={()=>{router.push("/doorUsage")}}>
                        <DoorStatus status={doorref.current} />
                    </Pressable>

                    <View style={[styles.dashboardItem, { width: "45%" }]}>
                        <FoodStatus status={getFoodStatus} />
                    </View>
                </View>

                <Button text={getButtonText} style={{height:70, width: "96%", backgroundColor: "#961a02",marginTop:50 }} func={changeFridgeStatus} />
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