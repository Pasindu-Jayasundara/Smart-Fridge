import { StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Humidity({ humidity }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Humidity</Text>

            <View style={styles.row}>
                <Icon name="tint" size={60} color="#175aeb" style={styles.icon} />
                <Text style={styles.label2}>{humidity} %</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'column',
    },
    icon: {
        marginRight: 10,
    },
    label: {
        marginBottom: 15,
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        width: "100%",
    },
    label2: {
        fontSize:20,
        color: "#175aeb",
        fontWeight: 'bold',
    },
});