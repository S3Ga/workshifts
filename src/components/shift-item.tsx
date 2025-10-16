import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ShiftItemType } from '../stores/shifts-store';

interface ShiftItemProps {
    item: ShiftItemType;
    onPress: (item: ShiftItemType) => void;
}

export const ShiftItem = ({ item, onPress }: ShiftItemProps) => {
    const handlePress = useCallback(() => {
        onPress(item);
    }, [item, onPress]);

    const {
        isFullyStaffed,
        availableSpots,
        totalPrice,
        statusStyle,
        statusText,
        formattedWorkTypes,
    } = useMemo(() => {
        const fullyStaffed = item.currentWorkers >= item.planWorkers;
        const spots = item.planWorkers - item.currentWorkers;
        const total = item.priceWorker + item.bonusPriceWorker;

        const getStatusStyle = () => {
            if (fullyStaffed) return styles.fullyStaffed;
            if (item.isPromotionEnabled) return styles.promotion;
            return styles.available;
        };

        const getStatusText = () => {
            if (fullyStaffed) return 'Fully Staffed';
            if (item.isPromotionEnabled) return 'Promotion';
            return 'Available';
        };

        const formatWorkTypes = () => {
            return item.workTypes.map(workType => workType.name).join(', ');
        };

        return {
            isFullyStaffed: fullyStaffed,
            availableSpots: spots,
            totalPrice: total,
            statusStyle: getStatusStyle(),
            statusText: getStatusText(),
            formattedWorkTypes: formatWorkTypes(),
        };
    }, [item]);

    const renderLogo = useMemo(() => {
        if (item.logo) {
            return (
                <Image
                    source={{ uri: item.logo }}
                    style={styles.logo}
                    resizeMode="cover"
                    defaultSource={require('../assets/placeholder.png')} // Fallback image
                />
            );
        }

        return (
            <View style={[styles.logo, styles.logoPlaceholder]}>
                <Text style={styles.logoText}>
                    {item.companyName?.charAt(0) || 'C'}
                </Text>
            </View>
        );
    }, [item.logo, item.companyName]);

    const renderRating = useMemo(() => {
        if (!item.customerRating) return null;

        return (
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>⭐ {item.customerRating}</Text>
                <Text style={styles.feedbackText}>
                    ({item.customerFeedbacksCount})
                </Text>
            </View>
        );
    }, [item.customerRating, item.customerFeedbacksCount]);

    const renderStaffingInfo = useMemo(() => {
        if (isFullyStaffed) {
            return (
                <View style={styles.staffingItem}>
                    <Text style={styles.staffingLabel}>Staffed</Text>
                    <Text style={styles.staffingValue}>
                        {item.currentWorkers}/{item.planWorkers}
                    </Text>
                </View>
            );
        }

        return (
            <>
                <View style={styles.staffingItem}>
                    <Text style={styles.staffingLabel}>Available</Text>
                    <Text style={styles.staffingValue}>
                        {availableSpots}/{item.planWorkers}
                    </Text>
                </View>
                <View style={styles.availableSpots}>
                    <Text style={styles.availableSpotsText}>
                        {availableSpots} spot{availableSpots !== 1 ? 's' : ''}
                    </Text>
                </View>
            </>
        );
    }, [isFullyStaffed, availableSpots, item.planWorkers, item.currentWorkers]);

    return (
        <TouchableOpacity
            style={[styles.container, statusStyle]}
            activeOpacity={0.7}
            onPress={handlePress}
            accessibilityLabel={`Shift at ${item.companyName}`}
            accessibilityRole="button"
        >
            <View style={styles.header}>
                <View style={styles.companyInfo}>
                    {renderLogo}
                    <View style={styles.companyText}>
                        <Text
                            style={styles.companyName}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.companyName}
                        </Text>
                        <Text
                            style={styles.address}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.address}
                        </Text>
                    </View>
                </View>

                <View style={[styles.statusBadge, statusStyle]}>
                    <Text style={styles.statusText}>{statusText}</Text>
                </View>
            </View>

            <View style={styles.datetimeContainer}>
                <Text style={styles.date}>{item.dateStartByCity}</Text>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>
                        {item.timeStartByCity} - {item.timeEndByCity}
                    </Text>
                </View>
            </View>

            <View style={styles.workTypesContainer}>
                <Text
                    style={styles.workTypesText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {formattedWorkTypes}
                </Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.staffingContainer}>
                    {renderStaffingInfo}
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Rate</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${totalPrice}</Text>
                        {item.bonusPriceWorker > 0 && (
                            <Text style={styles.bonusPrice}>
                                +${item.bonusPriceWorker}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                {renderRating}

                {!isFullyStaffed && (
                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            item.isPromotionEnabled && styles.promotionButton,
                        ]}
                        onPress={handlePress}
                    >
                        <Text style={styles.bookButtonText}>
                            {item.isPromotionEnabled
                                ? 'Special Offer'
                                : 'View Details'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderLeftWidth: 4,
    },
    available: {
        borderLeftColor: '#2196F3',
    },
    fullyStaffed: {
        borderLeftColor: '#9E9E9E',
        opacity: 0.7,
    },
    promotion: {
        borderLeftColor: '#FF9800',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    companyInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
    },
    logoPlaceholder: {
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#718096',
    },
    companyText: {
        flex: 1,
    },
    companyName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 2,
    },
    address: {
        fontSize: 14,
        color: '#718096',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    datetimeContainer: {
        marginBottom: 12,
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    workTypesContainer: {
        marginBottom: 12,
    },
    workTypesText: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 18,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
    },
    staffingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    staffingItem: {
        alignItems: 'center',
    },
    staffingLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#718096',
        marginBottom: 2,
    },
    staffingValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D3748',
    },
    staffingSeparator: {
        marginHorizontal: 8,
    },
    staffingSeparatorText: {
        fontSize: 16,
        color: '#CBD5E0',
        fontWeight: 'bold',
    },
    availableSpots: {
        marginLeft: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#E6FFFA',
        borderRadius: 6,
    },
    availableSpotsText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#234E52',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#718096',
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2D3748',
        marginRight: 4,
    },
    bonusPrice: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D69E2E',
    },
    priceSubtext: {
        fontSize: 10,
        color: '#718096',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginRight: 4,
    },
    feedbackText: {
        fontSize: 12,
        color: '#718096',
    },
    bookButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    promotionButton: {
        backgroundColor: '#FF9800',
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
