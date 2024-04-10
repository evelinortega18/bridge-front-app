import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Platform } from "react-native";


const ios = Platform.OS == 'ios';
export default function HomeHeader(){
    const {top} = useSafeAreaInsets()
    return(
        <View style={{ paddingTop: ios? top:top + 10}}> 
            <Text>HomeHeader</Text>
        </View>
    )
}