import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Div, ThemeProvider} from 'react-native-magnus';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import {darkTheme, lightTheme} from './src/theme';
import {MainStackNavigator} from './src/screens/navigation';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <SafeAreaView style={{flex: 0, backgroundColor: theme.colors.surface}} />
      <SafeAreaView
        style={{flex: 1, backgroundColor: theme.colors.surfaceHighlight}}>
        <Div flex={1} bg="surface">
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </Div>
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
