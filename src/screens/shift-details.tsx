import React, { useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ShiftDetailsRouteProp = RouteProp<RootStackParamList, 'ShiftDetails'>;

export const ShiftDetails = () => {
    const route = useRoute<ShiftDetailsRouteProp>();
    const { shift } = route.params;

    const { totalPrice, isFullyStaffed, workType } = useMemo(
        () => ({
            totalPrice: shift.priceWorker + shift.bonusPriceWorker,
            isFullyStaffed: shift.currentWorkers >= shift.planWorkers,
            workType: shift.workTypes[0]?.name || 'General',
        }),
        [shift],
    );

    const showBonus = useMemo(
        () => shift.bonusPriceWorker > 0,
        [shift.bonusPriceWorker],
    );
    const showPromotion = useMemo(
        () => shift.isPromotionEnabled,
        [shift.isPromotionEnabled],
    );

    const handleOpenMap = useCallback(() => {
        const url = `https://maps.google.com/?q=${shift.coordinates.latitude},${shift.coordinates.longitude}`;
        Linking.openURL(url);
    }, [shift.coordinates.latitude, shift.coordinates.longitude]);

    const InfoRow = useCallback(
        ({ label, value }: { label: string; value: string }) => (
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        ),
        [],
    );

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.companyName}>{shift.companyName}</Text>
                <Text style={styles.address}>{shift.address}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.date}>{shift.dateStartByCity}</Text>
                <Text style={styles.time}>
                    {shift.timeStartByCity} - {shift.timeEndByCity}
                </Text>
            </View>

            <View style={styles.section}>
                <InfoRow label="Work Type" value={workType} />
                <InfoRow
                    label="Staffing"
                    value={`${shift.currentWorkers}/${shift.planWorkers}`}
                />
                <InfoRow label="Rate" value={`$${totalPrice}`} />
                {showBonus && (
                    <InfoRow
                        label="Bonus"
                        value={`+$${shift.bonusPriceWorker}`}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
                <Text style={styles.mapText}>📍 Open in Maps</Text>
            </TouchableOpacity>

            <View style={styles.actions}>
                {!isFullyStaffed ? (
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            showPromotion && styles.promotionButton,
                        ]}
                    >
                        <Text style={styles.bookButtonText}>
                            {showPromotion ? 'Book Special' : 'Book Shift'}
                        </Text>
                        <Text style={styles.bookPrice}>${totalPrice}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.fullyStaffed}>
                        <Text style={styles.fullyStaffedText}>
                            Fully Staffed
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    companyName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    address: {
        fontSize: 16,
        color: '#666666',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    time: {
        fontSize: 16,
        color: '#666666',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666666',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
    },
    mapButton: {
        margin: 20,
        padding: 16,
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        alignItems: 'center',
    },
    mapText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    actions: {
        padding: 20,
    },
    bookButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    promotionButton: {
        backgroundColor: '#FF9500',
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    bookPrice: {
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.9,
    },
    fullyStaffed: {
        backgroundColor: '#8E8E93',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    fullyStaffedText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
