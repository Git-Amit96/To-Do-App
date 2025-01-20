import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { FaUserCircle } from "react-icons/fa";
import Activity from './Activity';
const apiUrl = import.meta.env.VITE_API_URL;

const TaskData = () => {
    const { id: taskId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.profile.id);
    const [taskInfo, setTaskInfo] = useState(null);
    const [tasksActivity, setTasksActivity] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [notPopUp, setNotPopUp] = useState(true);
    const username = useSelector((state) => state.profile?.name);
    const [newActivityText, setNewActivityText] = useState("");

    // Fetch task details
    const fetchTaskData = async () => {
        try {
            const response = await fetch(`${apiUrl}tasks/fetch/${taskId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const json = await response.json();
            if (json.success) {
                setTaskInfo(json.data);
            }
        } catch (error) {
            console.error('Error fetching task data:', error.message);
        }
    };

    // Fetch task activity
    const fetchTaskActivity = async () => {
        try {
            const response = await fetch(`${apiUrl}activity/get/${taskId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setTasksActivity(data.info);
            }
        } catch (error) {
            console.error('Error fetching task activity:', error.message);
        }
    };

    // Determine task status and styles
    const getStatusDetails = () => {
        const dateDifference = new Date(taskInfo?.deadline).getTime() - Date.now();
        if (taskInfo?.status === 'completed') {
            return { bgColor: 'bg-gray-700 text-gray-400', status: 'Completed' };
        } else if (dateDifference > 0) {
            return { bgColor: 'bg-green-100 text-green-800', status: 'Active' };
        } else {
            return { bgColor: 'bg-red-100 text-yellow-800', status: 'Delayed' };
        }
    };

    // Submition Handling
    const handleClick = async (data) => {
        if (!isUpdate && data === "Delete" && taskInfo) {

            try {
                const response = await fetch(`${apiUrl}tasks/delete/${taskId}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                const json = await response.json();
                if (json.success) {
                    alert("Task Deleted Successfully!")
                    //console.log("Delete Button clicked, isVisible value after clicked: ", !isVisible);
                    setIsUpdate(false);
                    navigate("/dashboard");
                }
                else {
                    alert("Deletion Failed. Try Again!")
                }
            } catch (err) {
                console.log(err.message);
            }

        }
        else if (isUpdate) {
           // console.log("Update clicked, isVisible value after clicked: ", isVisible);
            setIsUpdate(false);
            navigate(`/dashboard/status/update/?id=${taskId}`);
        }

    }

    const handleAddActivity = async () => {
        if (!newActivityText.trim()) {
            alert("Please enter some text!");
            return;
        }

        try {
            const newActivity = {
                owner: {
                    _id: 12121,
                    Name: username,
                },
                text: newActivityText,
                createdAt: new Date().toISOString(),
            };
            const body = {
                text: newActivityText,
            }

            // Send to the server
            const response = await fetch(`${apiUrl}activity/add/${taskId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {

                setTasksActivity([...tasksActivity, newActivity]);
                setNewActivityText("");
            } else {
                throw new Error("Failed to add activity.");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchTaskData();
        fetchTaskActivity();
    }, []);


    if (!taskInfo) {
        return (<div className="px-8 pb-8 mt-6">
            <p className="text-center text-gray-500">Loading....</p>

        </div>)
    }
    const { bgColor, status } = getStatusDetails();
    return (
        <div className="small:px-5   flex-col justify-center items-center transition-all duration-100">
            {isVisible ?
                <div className='flex justify-center items-center'>
                    <div className=' mx-auto border  border-gray-300 rounded-lg shadow-md bg-white p-4 '>
                        <div className="text-xl font-medium text-gray-800 mb-4">
                            {`Are you really want to ${isUpdate ? "update" : "delete"} this task`}
                        </div>
                        <div className='flex w-full justify-end gap-5'>

                            <div className='bg-gray-600 text-white px-6 py-2 transition active:scale-95 focus:outline-none rounded-sm hover:bg-gray-700 cursor-pointer'>
                                <button onClick={() => {return setIsVisible(!isVisible) }}>
                                    Cancel
                                </button>

                            </div>
                            <div className={`${isUpdate ? "bg-blue-400 hover:bg-blue-500" : "bg-red-400 hover:bg-red-500"} text-white px-6 py-2 transition active:scale-95 focus:outline-none rounded-sm hover:bg-red-500 cursor-pointer`}>
                                <button onClick={() => { handleClick(isUpdate ? "Update" : "Delete") }}>
                                    {isUpdate ? "Update" : "Delete"}
                                </button>

                            </div>
                        </div>

                    </div>
                </div> : <></>}

            {!isVisible && notPopUp ? (
                <div className="flex flex-col lg:flex-row mt-5">
                    {/* Task Card Section */}
                    <div className="lg:w-1/2 w-full  p-4">
                        <div className="border border-gray-300 rounded-lg shadow-md bg-white transition-all duration-200 overflow-hidden">
                            {/* Task Card Content */}
                            {(userId.toString() == taskInfo.owner._id) ?

                                <div className="justify-end w-full gap-3 flex px-4 py-2">
                                    <button
                                        className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 active:bg-red-200"
                                        onClick={() => {
                                            // console.log("Delete clicked, isVisible value after clicked: ", !isVisible); 
                                            setIsVisible(!isVisible);
                                            setIsUpdate(false);
                                        }}
                                    >
                                        <MdDelete size={24} />
                                    </button>
                                    <button
                                        className="p-2 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-100 active:bg-blue-200"
                                        onClick={() => {
                                            // console.log("Edit clicked, isVisible value after clicked: ", !isVisible);
                                            setIsVisible(!isVisible);
                                            setIsUpdate(true);
                                        }}
                                    >
                                        <MdEdit size={24} />
                                    </button>
                                </div> : <></>
                            }

                            <div className={`px-6 pb-4 sm:pb-6 ${(userId.toString() != taskInfo.owner._id) ? "mt-4" : ""}`}>
                                <div className="flex flex-col  justify-between items-start gap-4 mb-4">
                                    <h1
                                        className=" small:text-2xl text-xl sm:text-3xl lg:text-4xl font-bold text-gray-800  w-full"
                                        title={taskInfo?.title}
                                    >
                                        {taskInfo?.title}
                                    </h1>
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${bgColor}`}
                                    >
                                        {status}
                                    </span>
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 mb-4">
                                    {taskInfo?.description}
                                </p>
                                <div className="mb-4">
                                    <p className="font-semibold text-sm sm:text-base text-gray-600">
                                        <span className="font-bold">Owner:</span> {taskInfo?.owner?.Name}
                                    </p>
                                    {username === taskInfo?.owner?.Name && (
                                        <span className="text-xs w-fit font-semibold px-2 py-1 rounded-full uppercase bg-yellow-300 text-gray-600 mt-2 inline-block">
                                            Owner
                                        </span>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm sm:text-base text-gray-600 font-bold mb-2">
                                        Shared With:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(taskInfo?.sharedWith || []).map((member, index) => (
                                            <div
                                                key={index}
                                                className="w-fit px-2 py-1 rounded-md items-center justify-center bg-blue-100 text-blue-400 text-xs font-bold"
                                                title={member?.Name}
                                            >
                                                {member?.Name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-sm sm:text-base text-gray-500">
                                    <p className="mb-1">
                                        <span className="font-semibold">Created:</span>{" "}
                                        {formatDistanceToNow(new Date(taskInfo?.createdAt), { addSuffix: true })}
                                    </p>
                                    <p className="text-red-500">
                                        <span className="font-semibold">Deadline:</span>{" "}
                                        {format(new Date(taskInfo?.deadline), "MMM d, yyyy")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Section */}
                    <div className="lg:w-1/2 w-full max-h-[450px]  p-4 flex flex-col justify-between ">
                        <div className=" overflow-y-auto ">
                            <div className="p-4">
                                <div className="text-xl font-bold mb-2">Activity</div>
                                {tasksActivity ? (
                                    <div className="p-2">
                                        {tasksActivity.map((data) => (
                                            <Activity key={data._id} info={data} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center">No activity available.</p>
                                )}
                            </div>
                        </div>

                        {/* Add Activity Section */}
                        <div className="p-4 ">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <FaUserCircle size={36} className="text-gray-400" />
                                </div>
                                <div className="flex gap-2 justify-between w-full items-center">
                                    <textarea
                                        placeholder="Add an activity..."
                                        className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        rows="1"
                                        value={newActivityText}
                                        onChange={(e) => setNewActivityText(e.target.value)}
                                    ></textarea>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none"
                                        onClick={handleAddActivity}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <></>
            )}
        </div>
    );
};

export default TaskData;
