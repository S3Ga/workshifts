import React, { useCallback, useMemo } from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    VirtualizedList,
    Text,
    RefreshControl,
    TouchableOpacity,
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

const getItem = (data: ShiftItemType[], index: number): ShiftItemType =>
    data[index];
const getItemCount = (data: ShiftItemType[]): number => data.length;
const keyExtractor = (item: ShiftItemType): string => item.id;

export const ShiftList = observer(function ShiftList() {
    const { shiftsStore } = useStore();
    const navigation = useNavigation<ShiftListNavigationProp>();

    const handleShiftPress = useCallback(
        (shift: ShiftItemType) => {
            navigation.navigate('ShiftDetails', { shift });
        },
        [navigation],
    );

    const handleRefresh = useCallback(() => {
        shiftsStore.fetchShifts();
    }, [shiftsStore]);

    const virtualizedListProps = useMemo(
        () => ({
            initialNumToRender: 8,
            maxToRenderPerBatch: 10,
            windowSize: 5,
            removeClippedSubviews: true,
            updateCellsBatchingPeriod: 50,
        }),
        [],
    );

    const renderItem = useCallback(
        ({ item }: { item: ShiftItemType }) => (
            <ShiftItem item={item} onPress={handleShiftPress} />
        ),
        [handleShiftPress],
    );

    if (shiftsStore.loading && shiftsStore.items.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading shifts...</Text>
            </View>
        );
    }

    if (shiftsStore.error && shiftsStore.items.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{shiftsStore.error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={handleRefresh}
                >
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <VirtualizedList
                data={shiftsStore.items}
                getItem={getItem}
                getItemCount={getItemCount}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                refreshControl={
                    <RefreshControl
                        refreshing={
                            shiftsStore.loading && shiftsStore.items.length > 0
                        }
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                        tintColor="#007AFF"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>
                            No shifts available
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Check back later for new opportunities
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    shiftsStore.items.length > 0 ? (
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                {shiftsStore.items.length} shift
                                {shiftsStore.items.length !== 1 ? 's' : ''}{' '}
                                found
                            </Text>
                        </View>
                    ) : null
                }
                contentContainerStyle={
                    shiftsStore.items.length === 0
                        ? styles.emptyListContent
                        : undefined
                }
                {...virtualizedListProps}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
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
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});
