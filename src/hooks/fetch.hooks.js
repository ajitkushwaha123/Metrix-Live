import axios from "axios";
import { useEffect, useState } from "react";
import { getUserByEmail, getUsername } from "../helper/helper";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
    networkError: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        const { username, email } = await getUsername();

        console.log("username", username);
        console.log("email", email);

        let finalUsername = username;

        if (!username && email) {
          const { data } = await getUserByEmail(email);
          finalUsername = data.username;
          console.log("usernameFound", finalUsername);
        }

        console.log("userrrrrrrrname", finalUsername);

        const { data, status } = !query
          ? await axios.get(`/api/user/${finalUsername}`)
          : await axios.get(`/api${query}`);

        if (status === 200) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            apiData: data,
            status,
          }));
        } else {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            serverError: "Failed to fetch data",
          }));
        }
      } catch (error) {
        setData((prev) => ({ ...prev, isLoading: false, networkError: error }));
      }
    };

    fetchData();
  }, [query]);

  return [getData, setData];
}
