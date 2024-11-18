import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export function InputField({ params }) {

    const [getLable, setLable] = useState("");
    const [getSecureTextEntry, setSecureTextEntry] = useState(false);
    const [getInputMode, setInputMode] = useState("text");
    const [getMaxLength, setMaxLength] = useState(10);
    const [getTextColor, setTextColor] = useState("black");

    useEffect(() => {
        setLable(params.lableText)
        setSecureTextEntry(params.secureTextEntry)
        setInputMode(params.inputMode)
        setMaxLength(params.maxLength)
        setTextColor(params.textColor)
    }, [params])

    const handleInputChange = (value) => {
        if (params.func) {
            params.func(value);
        }
    };


    return (
        <View style={styles.view}>
            <Text style={[styles.label,{color:getTextColor}]}>{getLable}</Text>
            <TextInput
                value={params.getFunc}
                onChangeText={text=>handleInputChange(text)}
                maxLength={getMaxLength}
                style={styles.input}
                cursorColor={"#ff5b6b"}
                secureTextEntry={getSecureTextEntry}
                inputMode={getInputMode}></TextInput>
        </View>
    );

}

const styles = StyleSheet.create({
    view: {
        width: '100%',
    },
    input: {
        width: '100%',
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        color: "black"
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
});
