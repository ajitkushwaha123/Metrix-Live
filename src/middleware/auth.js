import { useNavigate , Navigate } from "react-router-dom";

export const AuthorizeUser = ({ Children }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate(); // Add this line

    if (!token) {
        return navigate('/login');
    }

    return Children;
};
