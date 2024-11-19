import { StyleSheet, Text, View } from "react-native";

export default function Weight({weight}) {

    return(
        <View style={styles.container}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.label2}>{parseFloat(weight).toFixed(2)} Kg</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        marginBottom: 15,
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        width:"100%"
    },
    label2: {
        fontSize: 30,
        fontWeight: 'bold',
        width:"100%",
        color:"#9573c9"
    },
});