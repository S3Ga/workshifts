import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ShiftList } from './src/screens/shifts';
import { ShiftDetails } from './src/screens/shift-details';
import { rootStore, StoreProvider } from './src/stores';
import { ShiftItemType } from './src/stores/shifts-store';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    ShiftList: undefined;
    ShiftDetails: { shift: ShiftItemType };
};

function App() {
    return (
        <SafeAreaProvider>
            <StoreProvider value={rootStore}>
                <NavigationContainer>
                    <RootStack.Navigator initialRouteName="ShiftList">
                        <RootStack.Screen
                            name="ShiftList"
                            component={ShiftList}
                            options={{ title: 'Work shifts' }}
                        />
                        <RootStack.Screen
                            name="ShiftDetails"
                            component={ShiftDetails}
                            options={{ title: 'Shift Details' }}
                        />
                    </RootStack.Navigator>
                </NavigationContainer>
            </StoreProvider>
        </SafeAreaProvider>
    );
}

export default App;
