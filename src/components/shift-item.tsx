import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShiftItemType } from '../stores/shifts-store';

interface ShiftItemProps {
    item: ShiftItemType;
    onPress: (item: ShiftItemType) => void;
}

const ShiftItemComponent = ({ item, onPress }: ShiftItemProps) => {
    const handlePress = useCallback(() => onPress(item), [item, onPress]);

    const { totalPrice, isFullyStaffed, availableSpots } = useMemo(
        () => ({
            totalPrice: item.priceWorker + item.bonusPriceWorker,
            isFullyStaffed: item.currentWorkers >= item.planWorkers,
            availableSpots: item.planWorkers - item.currentWorkers,
        }),
        [
            item.priceWorker,
            item.bonusPriceWorker,
            item.currentWorkers,
            item.planWorkers,
        ],
    );

    const showPromotion = useMemo(
        () => item.isPromotionEnabled,
        [item.isPromotionEnabled],
    );

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isFullyStaffed ? styles.fullyStaffed : styles.available,
            ]}
            onPress={handlePress}
        >
            <View style={styles.mainInfo}>
                <Text style={styles.companyName} numberOfLines={1}>
                    {item.companyName}
                </Text>
                <Text style={styles.address} numberOfLines={1}>
                    {item.address}
                </Text>
            </View>

            <View style={styles.timeInfo}>
                <Text style={styles.date}>{item.dateStartByCity}</Text>
                <Text style={styles.time}>
                    {item.timeStartByCity} - {item.timeEndByCity}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.status}>
                    <Text style={styles.price}>${totalPrice}</Text>
                    {!isFullyStaffed && (
                        <Text style={styles.spots}>
                            {availableSpots} spot
                            {availableSpots !== 1 ? 's' : ''}
                        </Text>
                    )}
                </View>

                {showPromotion && (
                    <Text style={styles.promotion}>🔥 Special</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

export const ShiftItem = memo(ShiftItemComponent);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    available: {
        borderLeftColor: '#007AFF',
    },
    fullyStaffed: {
        borderLeftColor: '#8E8E93',
        opacity: 0.7,
    },
    mainInfo: {
        marginBottom: 12,
    },
    companyName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: '#666666',
    },
    timeInfo: {
        marginBottom: 12,
    },
    date: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 2,
    },
    time: {
        fontSize: 14,
        color: '#666666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#007AFF',
    },
    spots: {
        fontSize: 14,
        color: '#34C759',
        fontWeight: '500',
    },
    promotion: {
        fontSize: 12,
        color: '#FF9500',
        fontWeight: '600',
    },
});
