import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../Assets/logo.svg";
import { setLoginState } from '../Utils/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

const apiUrl= import.meta.env.VITE_API_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isError, setIsError] = useState({ status: false, error: null });
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const isLogIn= useSelector((state)=>state.profile.isLoggedIn);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  

  useEffect(() => {
    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${apiUrl}user/isLoggedIn`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                dispatch(setLoginState(true));
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Error checking login status:", err);
        }
    };

    if (!isLogIn) {
        checkLoginStatus();
    }
}, [navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginToggle = () => {
    setIsLogin((prev) => !prev);
    setIsError({ status: false, error: null });
  };

  const handleSubmit = async () => {
    if ((isLogin && (!userData.email || !userData.password)) ||
        (!isLogin && (!userData.name || !userData.email || !userData.password))) {
      return setIsError({ status: true, error: "All fields are mandatory." });
    }

    const body = { ...userData, ...(isLogin ? {} : { name: userData.name }) };

    try {
      const response = await fetch(`${apiUrl}user/${isLogin ? "signIn" : "signUp"}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const data = await response.json();

      if (!data.success) {
        setIsError({ status: true, error: "Error occurred! Please try again." });
      } else {
        setUserData({ name: "", email: "", password: "" });
        setIsError({ status: false, error: null });
        if (isLogin) {
          dispatch(setLoginState(true));
          navigate('/dashboard')};
      }
    } catch(err) {
      setIsError({ status: true, error: err.message });
    }
  };

  const renderInput = (label, name, type = "text", placeholder) => (
    <div>
      <h3 className="mb-2 text-[17px]">{label}</h3>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="p-1 rounded-sm w-full border-2 border-slate-300 focus:outline-slate-400"
        value={userData[name]}
        onChange={handleInputChange}
      />
    </div>
  );

  return (
    <div className=" h-screen flex justify-center items-center border-4 bg-slate-200  ">
      <div className="rounded-md p-4 flex-col space-y-5 border-2 border-slate-300  bg-white w-[400px]  shadow-md">
        <div className="flex justify-center items-center mb-3">
          <img src={logo} alt="Logo" width={150} height={40} />
        </div>

        {isError.status && <div className="text-red-500 text-center">{isError.error}</div>}

        {!isLogin && renderInput("Name", "name", "text", "Enter your name")}
        {renderInput("Email Id", "email", "email", "Enter your email")}
        {renderInput("Password", "password", "password", "Enter your password")}

        <button
          className="rounded-md bg-slate-900 py-1 px-2 font-semibold text-[18px] text-white w-full"
          onClick={handleSubmit}
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>

        <div className="text-center mt-4">
          <p>
            {isLogin ? "New user? " : "Already registered? "}
            <span
              className="text-red-600 cursor-pointer"
              onClick={handleLoginToggle}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>{" "}here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;



