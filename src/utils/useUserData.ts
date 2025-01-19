// hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface UserData {
    id: string;
    name: string;
    email: string;
}

export const useUserData = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        if (!user?.uid) return;

        try {
            const usersRef = collection(db, 'posts');
            const q = query(
                usersRef,
                where('accounts.uuid', 'array-contains', user.uid),
            );

            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length>0) {
                const doc = querySnapshot.docs[0]
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

        // Set interval untuk update setiap 15 menit
        const interval = setInterval(fetchUserData, 15 * 60 * 1000);

        // Cleanup interval
        return () => clearInterval(interval);
    }, [user?.uid]);

    return { userData, loading, error, refetch: fetchUserData };
};
