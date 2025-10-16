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

    constructor() {
        makeAutoObservable(this);
    }

    async fetchShifts() {
        this.setLoading(true);
        this.setError(null);

        try {
            const response = await fetch(
                'https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=45.039268&longitude=38.987221',
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
        } catch {
            runInAction(() => {
                this.setError('Failed to fetch shifts');
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
}
