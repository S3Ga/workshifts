import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { RootStackParamList } from '../../App';

type ShiftDetailsProps = NativeStackScreenProps<
    RootStackParamList,
    'ShiftDetails'
>;

export const ShiftDetails = observer(({ route }: ShiftDetailsProps) => {
    const { shift } = route.params;

    const isFullyStaffed = shift.currentWorkers >= shift.planWorkers;
    const availableSpots = shift.planWorkers - shift.currentWorkers;
    const totalPrice = shift.priceWorker + shift.bonusPriceWorker;

    const handleOpenMap = () => {
        const url = `https://maps.google.com/?q=${shift.coordinates.latitude},${shift.coordinates.longitude}`;
        Linking.openURL(url);
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const formatWorkTypes = () => {
        return shift.workTypes.map(workType => workType.name).join(', ');
    };

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.companyInfo}>
                    {shift.logo ? (
                        <Image
                            source={{ uri: shift.logo }}
                            style={styles.logo}
                        />
                    ) : (
                        <View style={[styles.logo, styles.logoPlaceholder]}>
                            <Text style={styles.logoText}>
                                {shift.companyName?.charAt(0) || 'C'}
                            </Text>
                        </View>
                    )}
                    <View style={styles.companyText}>
                        <Text style={styles.companyName}>
                            {shift.companyName}
                        </Text>
                        <Text style={styles.address}>{shift.address}</Text>
                    </View>
                </View>

                {shift.customerRating && (
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                            ⭐ {shift.customerRating}
                        </Text>
                        <Text style={styles.feedbackCount}>
                            ({shift.customerFeedbacksCount})
                        </Text>
                    </View>
                )}
            </View>

            {/* Date & Time Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date & Time</Text>
                <View style={styles.datetimeCard}>
                    <Text style={styles.date}>{shift.dateStartByCity}</Text>
                    <Text style={styles.time}>
                        {shift.timeStartByCity} - {shift.timeEndByCity}
                    </Text>
                </View>
            </View>

            {/* Work Details Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Details</Text>
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Work Types</Text>
                        <Text style={styles.detailValue}>
                            {formatWorkTypes()}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Staffing</Text>
                        <Text style={styles.detailValue}>
                            {shift.currentWorkers}/{shift.planWorkers} workers
                            {!isFullyStaffed && (
                                <Text style={styles.availableText}>
                                    {' '}
                                    ({availableSpots} available)
                                </Text>
                            )}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Base Rate</Text>
                        <Text style={styles.detailValue}>
                            ${shift.priceWorker}
                        </Text>
                    </View>
                    {shift.bonusPriceWorker > 0 && (
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Bonus</Text>
                            <Text
                                style={[styles.detailValue, styles.bonusText]}
                            >
                                +${shift.bonusPriceWorker}
                            </Text>
                        </View>
                    )}
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Total Rate</Text>
                        <Text style={[styles.detailValue, styles.totalPrice]}>
                            ${totalPrice}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Location Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <TouchableOpacity
                    style={styles.locationCard}
                    onPress={handleOpenMap}
                >
                    <Text style={styles.addressText}>{shift.address}</Text>
                    <Text style={styles.mapLink}>Open in Maps →</Text>
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                {!isFullyStaffed ? (
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            shift.isPromotionEnabled && styles.promotionButton,
                        ]}
                    >
                        <Text style={styles.bookButtonText}>
                            {shift.isPromotionEnabled
                                ? 'Book Special Offer'
                                : 'Book This Shift'}
                        </Text>
                        <Text style={styles.priceText}>
                            ${totalPrice}/worker
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.fullyStaffedButton}>
                        <Text style={styles.fullyStaffedText}>
                            Fully Staffed
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    companyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
    },
    logoPlaceholder: {
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    companyText: {
        flex: 1,
    },
    companyName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        color: '#718096',
    },
    ratingBadge: {
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
    },
    feedbackCount: {
        fontSize: 12,
        color: '#718096',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 15,
    },
    datetimeCard: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 5,
    },
    time: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    detailsGrid: {
        gap: 15,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    detailLabel: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'right',
        flex: 1,
        marginLeft: 10,
    },
    availableText: {
        color: '#38A169',
        fontWeight: '500',
    },
    bonusText: {
        color: '#D69E2E',
    },
    totalPrice: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '700',
    },
    locationCard: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    addressText: {
        fontSize: 14,
        color: '#2D3748',
        marginBottom: 5,
    },
    mapLink: {
        fontSize: 14,
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
        backgroundColor: '#FF9800',
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    priceText: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.9,
    },
    fullyStaffedButton: {
        backgroundColor: '#A0AEC0',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    fullyStaffedText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
