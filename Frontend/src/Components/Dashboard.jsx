import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoginState, setProfile } from "../Utils/profileSlice";
import { addTasks } from "../Utils/taskSlice";
import { useNavigate } from "react-router-dom";
import TaskCards from "./TaskCards";
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.profile.isLoggedIn);
    const profileName = useSelector((state) => state.profile.name);
    const [page, setPage] = useState("Dashboard");
    const pageInfo = useSelector((state) => state.profile.pageInfo);
    const tasks = useSelector((state) => state.task.data);
    const [mainList, setMainList] = useState([]);

    // Redirect to login page if not logged in
    useEffect(() => {
        if (!isLoggedIn) navigate("/auth");
    }, [isLoggedIn, navigate]);

    // Fetch tasks and profile data
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${apiUrl}tasks/get`, {
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
            const response = await fetch(`${apiUrl}profile/view`, {
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
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchTasks();
    }, [dispatch]);

    // Update `mainList` based on the selected page
    useEffect(() => {
        if (tasks?.data) {
            let filteredList = [];
            switch (page) {
                case "Assigned":
                    filteredList = tasks.data.filter((e) =>
                        e.sharedWith.some((info) => info.Name === profileName)
                    );
                    break;
                case "Active":
                    filteredList = tasks.data.filter((e) => e.status === "running");
                    break;
                case "Completed":
                    filteredList = tasks.data.filter((e) => e.status === "completed");
                    break;
                case "Dashboard":
                    filteredList = tasks.data;
                    break;
                case "Created":
                    filteredList = tasks.data.filter((e) => e.owner.Name === profileName);
                    break;
                default:
                    filteredList = tasks.data;
                    break;
            }
            setMainList(filteredList);
        }
    }, [tasks, page, profileName]);

    // Update `page` when `pageInfo` changes
    useEffect(() => {
        setPage(pageInfo);
    }, [pageInfo]);

    if (!isLoggedIn) return <p>Login Please...</p>;
    if (!tasks || !tasks.data) return <p>Loading...</p>;

    return (
        <div className="px-8 py-4">
            <div className="text-3xl font-bold">
                <h1 className="mb-3 text-gray-700">Tasks</h1>
            </div>
            <div className="text-3 font-bold flex flex-wrap gap-6 justify-start mt-4 ">
                {mainList.length > 0 ? (
                    mainList.map((task) => (
                        <TaskCards key={task._id} data={task} username={profileName} />
                    ))
                ) : (
                    <p className="text-gray-400">No tasks available</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

