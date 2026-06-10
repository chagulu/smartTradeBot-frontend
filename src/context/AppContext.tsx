/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'; import type { ReactNode } from 'react';
import type { Strategy } from '../types';

interface AppContextType {
    userId: string | null;
    loggedIn: boolean;
    workerStatus: string;
    activeStrategies: Strategy[];
    setUserId: (id: string | null) => void;
    setLoggedIn: (status: boolean) => void;
    setWorkerStatus: (status: string) => void;
    setActiveStrategies: (strategies: Strategy[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId'));
    const [loggedIn, setLoggedIn] = useState<boolean>(() => localStorage.getItem('loggedIn') === 'true');
    const [workerStatus, setWorkerStatus] = useState<string>('Unknown');
    const [activeStrategies, setActiveStrategies] = useState<Strategy[]>([]);

    useEffect(() => {
        if (userId) localStorage.setItem('userId', userId);
        else localStorage.removeItem('userId');
        
        localStorage.setItem('loggedIn', String(loggedIn));
    }, [userId, loggedIn]);

    return (
        <AppContext.Provider value={{
            userId, loggedIn, workerStatus, activeStrategies,
            setUserId, setLoggedIn, setWorkerStatus, setActiveStrategies
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
