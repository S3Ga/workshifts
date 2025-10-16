import { createContext, useContext } from 'react';
import { ShiftsStore } from './shifts-store';

export class RootStore {
    shiftsStore: ShiftsStore;

    constructor() {
        this.shiftsStore = new ShiftsStore();
    }
}

export const rootStore = new RootStore();

export const StoreContext = createContext(rootStore);
export const StoreProvider = StoreContext.Provider;
export const useStore = () => useContext(StoreContext);
