import Auth from "./Components/Auth";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import SideBar from "./Components/SideBar";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import CreateOrUpdate from "./Components/CreateTask";
import TaskData from "./Components/TaskData";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useSelector } from "react-redux";


const MainLayout = () => {
  return (
    <div className="max-w-[1600px] m-auto w-[100%] h-screen  flex ">
      <div className=" min:w-[26%] max-w-[350px]  ">
        <SideBar />
      </div>
      <div className=" overflow-y-scroll w-[100%]">
        <div className="sticky top-0 ">

          <Header />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  const isLoggedIn = useSelector((state) => state.profile.isLoggedIn);

  const appRouter = createBrowserRouter([

    {
      path: "/",
      element: <Auth />
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true, // Default child route
          element: <Dashboard />,
        },
        {
          path: "status/:info",
          element: <CreateOrUpdate />,
        },
        {
          path: "task/:id",
          element: <TaskData />,
        },
      ],
    },
  ])
  return <RouterProvider router={appRouter} />
}

export default App;
