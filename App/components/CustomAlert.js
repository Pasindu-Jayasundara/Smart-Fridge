import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View,Image } from 'react-native';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Button } from './Button';

export default function CustomAlert({ params }) {

    const [getIcon, setIcon] = useState("");
    const [getIconType, setIconType] = useState("text");

    const [getMessage, setMessage] = useState("");
    const [getIconBgColor, setIconBgColor] = useState("red");
    const [getButtonCount, setButtonCount] = useState(2);

    const [getButton1Color, setButton1Color] = useState("green");
    const [getButton2Color, setButton2Color] = useState("black");

    const [getButton1Text, setButton1Text] = useState("OK");
    const [getButton2Text, setButton2Text] = useState("Cancel");

    useEffect(() => {

        setIconType(params.iconType);
        if(params.iconType =='image'){
            setIcon(<Image source={params.icon } style={{ width: 40, height: 40 }} />);
        }else{
            setIcon(params.icon);
        }

        setMessage(params.message);
        setIconBgColor(params.iconBgColor);
        setButtonCount(params.buttonCount);

        setButton1Color(params.button1Color);
        setButton1Text(params.button1Text);

        if (params.buttonCount == 2) {
            setButton2Color(params.button2Color);
            setButton2Text(params.button2Text);
        }

    }, [params]);

    return (
        <FancyAlert
            visible={true}
            icon={
                <View style={[{ backgroundColor: getIconBgColor },styles.icon]}>
                    {getIconType=='text'?(
                        <Text style={{fontSize:30}}>{getIcon}</Text>
                    ):(getIcon)}
                </View>
            }
            style={{ backgroundColor: 'white' }}
        >
            <>
                <Text style={{ marginTop: -16, marginBottom: 32 }}>{getMessage}</Text>
                <View style={{ marginBottom: 8, flexDirection: "row", gap: 8 }}>
                    <Button text={getButton1Text} func={params.button1Func} style={{ marginTop: 10, width: getButtonCount == 2 ? "48%" : "100%", backgroundColor: getButton1Color, borderRadius: 12 }} />
                    {getButtonCount == 2 ? (
                        <Button text={getButton2Text} func={params.button2Func} style={{ marginTop: 10, width: "48%", backgroundColor: getButton2Color, borderRadius: 12 }} />
                    ) : null}
                </View>
            </>
        </FancyAlert>
    );
}

const styles = StyleSheet.create({

    icon: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: '100%',
    }

});