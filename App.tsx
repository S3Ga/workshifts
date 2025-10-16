import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

const RootStack = createNativeStackNavigator();

function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootStack.Navigator>
                    <Text>Hello world</Text>
                </RootStack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
