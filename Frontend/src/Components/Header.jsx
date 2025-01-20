import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate= useNavigate();
  const handleClick=()=>{
    navigate("/dashboard/status/create");
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="  p-4 flex items-center justify-end bg-slate-200 z-50 ">
  
  {/* Create Button */}
  <button
    className="ml-3 px-2 py-1 bg-slate-600 text-white rounded-sm hover:bg-slate-700 transition active:scale-95 focus:outline-none"
    onClick={handleClick}
  >
    Add Task
  </button>

  {/* Profile Icon */}
  <div className="relative ml-4">
    <button
      onClick={toggleDropdown}
      className="flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
    >
      <FaUserCircle size={32} />
    </button>

    {/* Dropdown Menu */}
    {isDropdownOpen && (
      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-30">
        <ul className="py-2">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
        </ul>
      </div>
    )}
  </div>
</header>

  );
};

export default Header;

