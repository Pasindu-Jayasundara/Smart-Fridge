import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function index() {

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.scrollView}>

                <View style={styles.container}>

                    <View style={styles.firstView}>
                        <Image source={logoIcon} style={styles.logo} />
                        <View style={styles.textView}>
                            <Text style={styles.text1}>LogIn</Text>
                            <Text style={styles.text2}>Welcome back to ZapChat</Text>
                            <Text style={[styles.text2, styles.text3]}> Let's connect together !</Text>
                        </View>
                    </View>

                    <View style={styles.secondView}>
                        <View style={styles.fields}>
                            <InputField params={{ lableText: "Mobile", inputMode: "tel", secureTextEntry: false, func: setMobile }} />
                            <InputField params={{ lableText: "Password", inputMode: "text", secureTextEntry: true, func: setPassword }} />
                            <Button text={ref.current} style={{ marginTop: 18 }} func={request} />
                            <Text style={styles.linkText}>
                                New to ZapChat?
                                <Link href={"/register"} style={styles.link}> Register Now</Link>
                            </Text>
                        </View>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    link: {
        color: "#ff5b6b"
    },
    linkText: {
        color: "#919190",
        alignSelf: "center"
    },
    fields: {
        width: "75%",
        rowGap: 15,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    logo: {
        width: 150,
        height: 150
    },
    text3: {
        marginTop: -25,
        fontSize: 17,
        color: "#ff5b6b"
    },
    text2: {
        fontSize: 19,
        textAlign: "center"
    },
    text1: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 25
    },
    textView: {
        justifyContent: "center",
        alignItems: "center",
        rowGap: 30,
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: "white",
    },
    firstView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    secondView: {
        flex: 1,
        marginTop: 60,
        alignItems: "center"
    }
});