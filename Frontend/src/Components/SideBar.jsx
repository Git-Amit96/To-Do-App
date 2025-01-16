import { useState } from "react";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdAssignment,
  MdCreate,
  MdPendingActions,
  MdDone,
  MdNotifications,
  MdDarkMode,
  MdLogout,
} from "react-icons/md";
import logo from "../assets/Logo.svg";
import { clearProfile } from "../Utils/profileSlice";
import { clearTasks } from "../Utils/taskSlice";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch= useDispatch();
  const [activeMenu, setActiveMenu] = useState("Dashboard"); 

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:5000/to-do/user/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        dispatch(clearProfile());
        dispatch(clearTasks());
        navigate("/auth");
      } else {
        console.error("Logout failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during sign-out:", error.message);
    }
  };

  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: <MdDashboard size={24} /> },
    { id: "Assigned", label: "Assigned", icon: <MdAssignment size={24} /> },
    { id: "Created", label: "Created", icon: <MdCreate size={24} /> },
    { id: "Active", label: "Active", icon: <MdPendingActions size={24} /> },
    { id: "Completed", label: "Completed", icon: <MdDone size={24} /> },
    { id: "Notification", label: "Notification", icon: <MdNotifications size={24} /> },
    { id: "Dark", label: "Dark", icon: <MdDarkMode size={24} /> },
    { id: "Logout", label: "Logout", icon: <MdLogout size={24} />, action: handleSignOut },
  ];

  const handleMenuClick = (id, action) => {
    if (id === "Logout" && action) {
      action();
    }
    else if(id==="Dashboard"){
      setActiveMenu(id);
      navigate("/dashboard");
    }
    
    else {
      setActiveMenu(id);
    }
  };

 
  return (
    <div className="w-[30vw] max-w-[250px] h-full bg-slate-200 [min-width:100px]:spx-[1em] text-slate-700 border-x-2 border-gray-300">
      <div className="flex-col py-5 w-[100%]">
        <div className="flex justify-center items-center mb-10">
          <img src={logo} alt="My Icon" className="w-[90px] sm:w-[150px] h-auto" />
        </div>
        <div className="flex-col justify-center items-center m-auto space-y-5 w-fit">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-start space-x-5 py-2 px-2 rounded-sm cursor-pointer ${
                activeMenu === item.id ? "bg-gray-400 text-white" : "hover:bg-gray-300"
              }`}
              onClick={() => handleMenuClick(item.id, item.action)}
            >
              {item.icon}
              <span className="hidden sm:block text-[15px] font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

