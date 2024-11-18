import { FancyAlert } from 'react-native-expo-fancy-alerts';

export default function CustomAlert() {
    return (
        <FancyAlert
            visible={true}
            icon={<View style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
                borderRadius: 50,
                width: '100%',
            }}><Text>🤓</Text></View>}
            style={{ backgroundColor: 'white' }}
        >
            <Text style={{ marginTop: -16, marginBottom: 32 }}>Hello there</Text>
        </FancyAlert>
    );
}