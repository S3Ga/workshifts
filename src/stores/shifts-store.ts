import Geolocation from '@react-native-community/geolocation';
import { makeAutoObservable, runInAction } from 'mobx';

export type ShiftItemType = {
    id: string;
    logo: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
    address: string;
    companyName: string;
    dateStartByCity: string;
    timeStartByCity: string;
    timeEndByCity: string;
    currentWorkers: number;
    planWorkers: number;
    workTypes: {
        id: number;
        name: string;
        nameGt5: string;
        nameLt5: string;
        nameOne: string;
    }[];
    priceWorker: number;
    bonusPriceWorker: number;
    customerFeedbacksCount: string;
    customerRating: number | null;
    isPromotionEnabled: boolean;
};

export class ShiftsStore {
    items: ShiftItemType[] = [];
    loading = false;
    error: string | null = null;
    location: { latitude: number; longitude: number } | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchShifts() {
        this.setLoading(true);
        this.setError(null);

        try {
            const location = await this.getCurrentPosition();

            runInAction(() => {
                this.location = location;
            });

            const response = await fetch(
                `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${location.latitude}&longitude=${location.longitude}`,
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = (await response.json()) as {
                data: ShiftItemType[];
                status: number;
            };

            runInAction(() => {
                this.items = data.data;
            });
        } catch (error) {
            runInAction(() => {
                if (error instanceof Error) {
                    this.error = error.message;
                } else {
                    this.error = 'Failed to fetch shifts';
                }

                console.error('Fetch shifts error:', error);
            });
        } finally {
            runInAction(() => {
                this.setLoading(false);
                this.setError('Failed to fetch shifts');
            });
        }
    }

    private setLoading(loading: boolean) {
        this.loading = loading;
    }

    private setError(error: string | null) {
        this.error = error;
    }

    private getCurrentPosition() {
        return new Promise<{
            latitude: number;
            longitude: number;
        }>((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                error => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                },
            );
        });
    }
}
