import React from 'react';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native'
import { ThemeProvider } from 'styled-components'

import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme'
//Screens
import { Dashboard } from './src/screens/Dashboard';



export default function App() {
    const [fontsLoads] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold
    })

    if (!fontsLoads) {
        return <AppLoading />
    }

    return (
        <ThemeProvider theme={theme}>
            <StatusBar
                backgroundColor="transparent"
                translucent
                barStyle="light-content"
            />
            <Dashboard />
        </ThemeProvider>
    );
}
