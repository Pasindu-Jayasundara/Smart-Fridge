import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row, Rows } from 'react-native-table-component';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert';

SplashScreen.preventAutoHideAsync();

export default function doorUsage() {

    const [getNowDoor, setNowDoor] = useState(true)

    const coderef = useRef(null)
    const [getCode, setCode] = useState(coderef.current);

    const [getShowCustomAlert, setShowCustomAlert] = useState(false);
    const [getCustomAlertText, setCustomAlertText] = useState("");
    const [getCustomAlertIcon, setCustomAlertIcon] = useState("");

    const [getTableData, setTableData] = useState([])
    const [getGraphHeaders, setGraphHeaders] = useState([""])
    const [getGraphData, setGraphData] = useState([0])

    const tableHead = ['Date', 'Times'];

    useEffect(() => {

        loadData()
    }, [])

    async function loadData() {

        if (getCode == null) {
            let code = await AsyncStorage.getItem("fridgeCode");
            coderef.current = code
            setCode(code)
        }

        let url = process.env.EXPO_PUBLIC_URL + "/LoadDoorHistory";
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

                    setTableData(obj.data.array)

                    let headerArr = []
                    let dataArr = []
                    obj.data.array.forEach(element => {
                        headerArr.push(element[0])
                        dataArr.push(element[1])
                    });

                    setGraphData(dataArr)
                    setGraphHeaders(headerArr)

                } else {
                    setShowCustomAlert(true);
                    setCustomAlertText(obj.data);
                    setCustomAlertIcon("❗");
                }
            }

            setTimeout(() => {
                loadData()
            }, 20000);
        } finally {
            SplashScreen.hideAsync();
        }

    }

    return (
        <SafeAreaView style={styles.container}>

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

            <Text style={styles.title}>Door Open History</Text>
            <LineChart
                data={{
                    labels: getGraphHeaders,
                    datasets: [
                        {
                            data: getGraphData
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
                {getNowDoor == true ? <Text style={[styles.label2, { color: "red" }]}>  Open</Text> : <Text style={[styles.label2, { color: "#5BE12C" }]}>  Closed</Text>}
            </Text>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }} style={styles.table}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            </Table>

            <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }} style={styles.table}>

                    <Rows data={getTableData} textStyle={styles.text} />
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