import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function PowerUsage({usage,date}) {

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Power Usage <Icon name="info-circle" size={15} color="grey" /></Text>
            <Text style={styles.label2}>{parseFloat(usage).toFixed(2)} W</Text>
        </View>
    );
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
        width:"100%",
    },
    label2: {
        fontSize: 30,
        fontWeight: 'bold',
        width:"100%",
        color:"red"
    },
});
