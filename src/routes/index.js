import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppTheme from "../styles";
import Transaction from "../screen/Transaction";
import TransactionDetail from "../screen/TransactionDetail";

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <>
            {/** STATUS BAR */}
            <StatusBar barStyle="dark-content" backgroundColor={AppTheme.colors.white} />
            {/** NAVIGATION STACK */}
            <NavigationContainer>
                <Stack.Navigator headerMode="none">
                    <Stack.Screen name="Transaction" component={Transaction} />
                    <Stack.Screen name="Transaction Detail" component={TransactionDetail} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}

export default Routes;