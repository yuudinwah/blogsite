'use client'
// context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '@/utils/firebase';

interface UserData {
    id: string;
    name: string;
    email: string;
    // ... other user fields
}

interface UserContextType {
    userData: UserData | null;
    loading: boolean;
    error: string | null;
    refetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        if (!user?.uid) {
            setUserData(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const usersref = collection(db, 'users');
            const q = query(
                usersref,
                where('accounts.uuid', 'array-contains', user.uid),
                limit(1)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                const doc = querySnapshot.docs[0];
                setUserData({
                    id: doc.id,
                    ...doc.data()
                } as UserData);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();

        const interval = setInterval(fetchUserData, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user?.uid]);

    return (
        <UserContext.Provider
            value={{
                userData,
                loading,
                error,
                refetchUserData: fetchUserData
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
