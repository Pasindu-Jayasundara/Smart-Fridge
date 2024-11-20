import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';

export default function doorUsage() {

    const [getNowDoor, setNowDoor] = useState(true)

    const tableHead = ['Date', 'Times'];
    const tableData = [
        ['1', '2'],
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Door Open History</Text>
            <LineChart
                data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                    datasets: [
                        {
                            data: [10, 45, 28, 80, 99, 43]
                        }
                    ]
                }}
                width={Dimensions.get('window').width - 40} // from react-native
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    // backgroundColor: 'red',
                    backgroundGradientFrom: '#7dad8a',
                    backgroundGradientTo: '#7dad8a',
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: 'red'
                    }
                }}
                bezier
                style={styles.chart}
            />
            <Text style={styles.text2}>Now:
                {getNowDoor == true ? <Text style={[styles.label2, { color: "red" }]}>  Closed</Text> : <Text style={[styles.label2, { color: "#5BE12C" }]}>  Open</Text>}
            </Text>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }} style={styles.table}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            </Table>

            <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }} style={styles.table}>

                    <Rows data={tableData} textStyle={styles.text} />
                </Table>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text2: {
        margin: 6,
        fontWeight: "bold"
    },
    dataWrapper: {
        maxHeight: Dimensions.get('window').width,
        marginTop: -20,
        zIndex: -1
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: "flex-start",
        color: "#0d5e18",
        marginBottom: 20,
        marginTop: 20
    },
    chart: {
        marginVertical: 20,
        borderRadius: 5,
    },
    table: {
        marginTop: 20,
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    text: {
        margin: 6,
        textAlign: 'center',
    },
});