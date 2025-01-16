import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoginState, setProfile } from "../Utils/profileSlice";
import { addTasks } from "../Utils/taskSlice";
import { useNavigate } from "react-router-dom";
import TaskCards from "./TaskCards";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.profile.isLoggedIn);
    const profileName = useSelector((state) => state.profile.name);
    const tasks = useSelector((state) => state.task.data);
    
    const [delayedTasks, setDelayedTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [createdTasks, setCreatedTasks] = useState([]);

    useEffect(() => {
        if (!isLoggedIn) navigate("/auth");
    }, [isLoggedIn, navigate]);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:5000/to-do/tasks/get", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const tasksData = await response.json();
            dispatch(addTasks(tasksData));
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await fetch("http://localhost:5000/to-do/profile/view", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const profileData = await response.json();
            dispatch(
                setProfile({
                    id: profileData.profile._id,
                    name: profileData.profile.Name,
                    email: profileData.profile.Email,
                })
            );
            dispatch(setLoginState(true));
            // console.log(profileName);
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchTasks();
    }, []);

    useEffect(() => {
        if (tasks && tasks.data) {
          const delayedFilterList = tasks.data.filter((e) => e.status === "delayed");
          setDelayedTasks(delayedFilterList);
    
          const completedFilterList = tasks.data.filter((e) => e.status === "completed");
          setCompletedTasks(completedFilterList);
          
          const createdFilterList = tasks.data.filter((e) => e.owner.Name === profileName);
          setCreatedTasks(createdFilterList);

          const assignedFilterList = tasks.data.filter((e) => e.sharedWith.map(info=>info.Name==profileName));
          setAssignedTasks(assignedFilterList);
        }
      }, [tasks]); 

    if (!isLoggedIn) return <p>Login Please...</p>;

    return (
        <div className="px-8 py-4">
            <div className="text-3xl font-bold ">
                <h1>To-Do</h1>
            </div>
            <div className=" flex flex-wrap gap-6 justify-start mt-4">

            {tasks?.data ? 
                tasks.data.map((task) => (
                    <TaskCards key={task._id} data={task} username={profileName}/>
                )): (
                <p>No tasks available.</p>
            )}
            </div>
        </div>
    );
};

export default Dashboard;
