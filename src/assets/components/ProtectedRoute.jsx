import { Navigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { ClockLoader } from "react-spinners";


function ProtectedRoute({ children }) {

  const { session, loading } = useAppContext()

  if (loading) {
    return (
      <div className='d-flex justify-content-center my-5'>
        <ClockLoader />
      </div>
    )
  }

  if (!session?.user) {
    // 🚨 Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in → show the protected page
  return children;
}

export default ProtectedRoute;
