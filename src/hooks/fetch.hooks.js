import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = "https://metrix-backend.onrender.com";

export default function useFetch(query) {
    const [getData, setData] = useState({
        isLoading: false,
        apiData: undefined,
        status: null,
        serverError: null,
        networkError: null, // Add this state property
    });

    useEffect(() => {
 
        const fetchData = async () => {
            try {
                setData((prev) => ({ ...prev, isLoading: true }));

                const {username} = await getUsername();
                const { data, status } = !query ? await axios.get(`/api/user/${username}`) :  await axios.get(`/api${query}`);

                if (status === 200) { // Check for 200 status
                    setData((prev) => ({ ...prev, isLoading: false, apiData: data, status }));
                }

                setData((prev) => ({ ...prev, isLoading: false }));
            } catch (error) {
                setData((prev) => ({ ...prev, isLoading: false, networkError: error })); // Handle network errors
            }
        };

        fetchData();
    }, []); 
    
    return [getData, setData];
}
