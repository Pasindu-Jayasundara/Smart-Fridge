import { StyleSheet, Text, View } from "react-native";

export default function FoodStatus({status}) {

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Food : </Text>
            {status > 1800 && status < 2300 ? (
                <Text style={[styles.label2, { color: "orange" }]}>Middle</Text>
            ) : status > 2300 ? (//90
                <Text style={[styles.label2, { color: "red" }]}>Bad</Text>
            ) : (
                <Text style={[styles.label2, { color: "#5BE12C" }]}>Good</Text>
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