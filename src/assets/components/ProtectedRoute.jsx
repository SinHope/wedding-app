import { Navigate } from "react-router-dom";
import { useAppContext } from "./AppContext";


function ProtectedRoute({ children }) {

  const {session} = useAppContext()

  if (!session?.user) {
    // 🚨 Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in → show the protected page
  return children;
}

export default ProtectedRoute;
