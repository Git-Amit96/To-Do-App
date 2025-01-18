import Auth from "./Components/Auth";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import SideBar from "./Components/SideBar";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import CreateOrUpdate from "./Components/CreateTask";
import TaskData from "./Components/TaskData";


const MainLayout = () => {
  return (
    <div className="max-w-[1600px] flex flex-nowrap box-border  bg-gray-100  h-full min-h-screen">
      <div className="">
      <SideBar />

      </div>

      <div className="w-[100%]  box-border bg-gray-100 ">
        <Header/>
        <div className="">
        <Outlet />

        </div>
      </div>
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/auth"} replace/>
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/dashboard/status/:info",
        element: <CreateOrUpdate/>
      },
      {
        path: "/dashboard/task/:id",
        element: <TaskData/>
      }
    ]
  }
])

const App = () => {
  return <RouterProvider router={appRouter} />
}

export default App;
