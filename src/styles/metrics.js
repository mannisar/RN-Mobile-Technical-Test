import { Dimensions } from "react-native";

export default {
    padding: {
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
    },
    margin: {
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
    },
    fonts: {
        sm: 12,
        md: 18,
        lg: 28
    },
    dimensions: {
        fullWidth: Dimensions.get('window').width,
        fullHeight: Dimensions.get('window').height
    }
}