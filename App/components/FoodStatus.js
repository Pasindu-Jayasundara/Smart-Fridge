import { StyleSheet, Text, View } from "react-native";

export default function FoodStatus({status}) {

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Food : </Text>
            {status < 45 && status < 90 ? (
                <Text style={[styles.label2, { color: "orange" }]}>{status}</Text>
            ) : status > 90 ? (
                <Text style={[styles.label2, { color: "red" }]}>{status}</Text>
            ) : (
                <Text style={[styles.label2, { color: "#5BE12C" }]}>{status}</Text>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingBlock: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label2: {
        fontSize: 20,
        fontWeight: 'bold',
        color:"#9573c9"
    },
});