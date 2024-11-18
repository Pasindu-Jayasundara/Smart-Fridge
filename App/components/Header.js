import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { Image } from "expo-image";
import { router } from "expo-router";

const settingIcon = require("../assets/setting.png");

export default function Header({ fridgeCode ,func }) {

    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>ID: {JSON.parse(fridgeCode)}</Text>
            <Pressable onPress={() => func()}>
                <Image source={settingIcon} width={25} height={25} />
            </Pressable>
        </View>
    )

}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 17,
        paddingHorizontal: 30,
        backgroundColor: "#054a18",
    },
    headerText: {
        color: "white",
        fontSize: 15,
    },
});