import {Navigate } from "react-router-dom";
import Main from "../Main";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const token = Cookies.get("jwt_token");
  
  return token ? <Main/> : <Navigate to="/login" />;
};

export default ProtectedRoute;
