import { RouterProvider, createHashRouter, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../components/Login";
import AdminElections from '../components/AdminElections';
import ElectionDetails from '../components/ElectionDetails';
import RegisterElection from '../components/RegisterElection';

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/vote/:id",
      element: <ElectionDetails />,
    },
		{
			path: "/*",
			element: <Navigate to="/login" />,
		}
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/admin",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/admin/elections",
          element: <AdminElections />,
        },
        {
          path: "/admin/elections/new",
          element: <RegisterElection />,
        },
        {
          path: "/admin/elections/:id",
          element: <ElectionDetails />,
        }
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
			path: "/login",
			element: <Login />,
    },
    {
      path: "/register",
      element: < Login/>,
    }
  ];

//   <Route path="/raffles/:id/admin" element={<RaffleAdmin />} />
//     <Route path="/raffles/:id/register" element={<RaffleParticipantRegister />} />
//     <Route path="/raffles/:id/see" element={<RaffleSeeParticipantDraw />} />
    // <Route path="/*" element={<Navigate to="/raffles" />}/>

  // Combine and conditionally include routes based on authentication status
  const router = createHashRouter([
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    ...routesForPublic,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;