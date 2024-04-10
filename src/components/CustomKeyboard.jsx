import { Platform } from "react-native";
import { KeyboardAvoidingView, ScrollView } from "react-native-web";

const ios = Platform.OS == 'ios';
export default function CustomKeyboard({children}) {
    return(
        <KeyboardAvoidingView
            behavior = {ios? 'padding' : 'height'}
            style = {{flex: 1}}
        >
            <ScrollView
                style = {{flex: 1}}
                bounces = {false}
                showVerticalScrollIndicators = {false}
            >
                {
                    children
                }
            </ScrollView>
        </KeyboardAvoidingView>
    )
}