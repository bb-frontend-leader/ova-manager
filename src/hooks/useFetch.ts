import { useEffect, useState } from "react";



export const useFetch = async (url: string) => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setError(null); // Reset error state before fetching
        try {
            setLoading(true);
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await res.json();
            setData(data);
            return data;
        } catch (error) {
            console.error(error);
            setError("Failed to fetch data");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData };
}