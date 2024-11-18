import { StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DoorStatus({status}) {

    return(
        <View style={styles.container}>
            <Icon name="info-circle" size={15} color="grey" style={{marginTop:-40,marginLeft:-20,marginRight:10}}/>

            <Text style={styles.label}>Door : </Text>
            {status === "Open" ? <Text style={[styles.label2,{color:"red"}]}>{status}</Text> : <Text style={[styles.label2,{color:"#5BE12C"}]}>{status}</Text>}
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