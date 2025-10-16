import { rootStore, StoreProvider, useStore } from '../stores';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    VirtualizedList,
    Text,
} from 'react-native';
import { useEffect } from 'react';
import { ShiftItem } from '../components/shift-item';
import { ShiftItemType } from '../stores/shifts-store';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type ShiftListNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ShiftList'
>;

const getItem = (data: ShiftItemType[], index: number) => {
    return data[index];
};

const getItemLayout = (data: ShiftItemType[] | null, index: number) => ({
    length: 50,
    offset: 50 * index,
    index,
});

export const ShiftList = observer(() => {
    const { shiftsStore } = useStore();
    const navigation = useNavigation<ShiftListNavigationProp>();

    useEffect(() => {
        shiftsStore.fetchShifts();
    }, []);

    if (shiftsStore.loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (shiftsStore.items.length > 0) {
        return (
            <VirtualizedList
                data={shiftsStore.items}
                getItem={getItem}
                getItemLayout={getItemLayout}
                getItemCount={(items: ShiftItemType[]) => items.length}
                renderItem={data => (
                    <ShiftItem
                        item={data.item}
                        onPress={() =>
                            navigation.navigate('ShiftDetails', {
                                shift: data.item,
                            })
                        }
                    />
                )}
                keyExtractor={item => item.id}
                initialNumToRender={10}
                windowSize={5}
            />
        );
    }

    return (
        <View style={styles.empty}>
            <Text>No shifts available</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
