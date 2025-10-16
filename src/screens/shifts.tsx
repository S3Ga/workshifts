import React, { useCallback } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    VirtualizedList,
    Text,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useStore } from '../stores';
import { ShiftItem } from '../components/shift-item';
import { ShiftItemType } from '../stores/shifts-store';

type ShiftListNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ShiftList'
>;

const getItem = (data: ShiftItemType[], index: number) => data[index];
const getItemCount = (data: ShiftItemType[]) => data.length;
const keyExtractor = (item: ShiftItemType) => item.id;

export const ShiftList = observer(function ShiftList() {
    const { shiftsStore } = useStore();
    const navigation = useNavigation<ShiftListNavigationProp>();

    const handleShiftPress = useCallback(
        (shift: ShiftItemType) => {
            navigation.navigate('ShiftDetails', { shift });
        },
        [navigation],
    );

    const renderItem = useCallback(
        ({ item }: { item: ShiftItemType }) => (
            <ShiftItem item={item} onPress={handleShiftPress} />
        ),
        [handleShiftPress],
    );

    if (shiftsStore.loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading shifts...</Text>
            </View>
        );
    }

    if (shiftsStore.items.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>No shifts available</Text>
            </View>
        );
    }

    return (
        <VirtualizedList
            data={shiftsStore.items}
            getItem={getItem}
            getItemCount={getItemCount}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
        />
    );
});

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
    },
});
