import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Svg, Circle, Text as SvgText } from 'react-native-svg';

export default function Tempreature({temp}) {
    const radius = 70;
    const strokeWidth = 15;
    const size = radius * 2 + strokeWidth * 2;
    const circumference = 2 * Math.PI * radius;
    // const percentage = 20; // Current value (50 out of 100)

    const strokeDashoffset = circumference - (temp / 100) * circumference;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Temperature</Text>

            <Svg height={size} width={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke= {temp < 50?"#5BE12C":"#E12C2C"}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    fill="none"
                />
                <SvgText
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fontSize="24"
                    fill={temp < 50?"#42c8e3":"red"}
                    dy=".3em"
                >
                    {`${temp} °C`}
                </SvgText>
            </Svg>
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
    },
});
