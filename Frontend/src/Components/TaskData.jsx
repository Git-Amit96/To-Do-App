import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { FaUserCircle } from "react-icons/fa";
import Activity from './Activity';

const TaskData = () => {
    const { id: taskId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.profile.id);
    const [taskInfo, setTaskInfo] = useState(null);
    const [tasksActivity, setTasksActivity] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const username = useSelector((state) => state.profile?.name);
    const [newActivityText, setNewActivityText] = useState("");

    // Fetch task details
    const fetchTaskData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/to-do/tasks/fetch/${taskId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setTaskInfo(data.data);
            }
        } catch (error) {
            console.error('Error fetching task data:', error.message);
        }
    };

    // Fetch task activity
    const fetchTaskActivity = async () => {
        try {
            const response = await fetch(`http://localhost:5000/to-do/activity/get/${taskId}`, {
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

    const handleClick = async (data) => {
        if (data === "Delete") {
            if (userId.toString() !== taskInfo._id.toString()) {
                alert("Only Owner of this task is allowed to delete it");
                setIsVisible(!isVisible);
            }
            else {
                try {
                    const response = await fetch(`http://localhost:5000/to-do/tasks/delete/${taskId}`,
                        {
                            method: "DELETE",
                            credentials: "include",
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                    const json = await response.json();
                    if (json.success) {
                        alert("Task Deleted Successfully!")
                        setIsVisible(!isVisible);
                        setIsUpdate(false);
                        window.location.reload();
                    }
                    else {
                        alert("Deletion Failed. Try Again!")
                    }
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
        else if (isUpdate) {
            navigate('/dashboard/status/update')
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
            console.log("Text", newActivityText);
            console.log("body", newActivity);
            // Send to the server
            const response = await fetch(`http://localhost:5000/to-do/activity/add/${taskId}`, {
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
            <p className="text-center text-gray-500">Nothing to show here. Go back to Dashboard Page</p>;

        </div>)
    }
    const { bgColor, status } = getStatusDetails();
    return (
        <div className="sm:px-8 py-5 mt-6 flex-col justify-center items-center transition-all duration-100">
            {!isVisible ?
                <div className='sm:absolute top-0 bottom-0 flex justify-center items-center'>
                    <div className=' mx-auto border  border-gray-300 rounded-lg shadow-md bg-white p-4 '>
                        <div className="text-xl font-medium text-gray-800 mb-4">
                            Are you really want to delete this task?
                        </div>
                        <div className='flex w-full justify-end gap-5'>

                            <div className='bg-gray-600 text-white px-6 py-2 transition active:scale-95 focus:outline-none rounded-sm hover:bg-gray-700 cursor-pointer'>
                                <button className="" onClick={() => { setIsVisible(!isVisible) }}>
                                    Cancel
                                </button>

                            </div>
                            <div className='bg-red-400 text-white px-6 py-2 transition active:scale-95 focus:outline-none rounded-sm hover:bg-red-500 cursor-pointer'>
                                <button className="" onClick={() => { handleClick("Delete") }}>
                                    Delete
                                </button>

                            </div>
                        </div>

                    </div>
                </div> : <></>}

            {isVisible ? (
                    <div className="flex flex-col lg:flex-row  bg-gray-100">
                        {/* Task Card Section */}
                        <div className="lg:w-1/2 w-full p-4">
                            <div className="border border-gray-300 rounded-lg shadow-md bg-white transition-all duration-200 overflow-hidden">
                                {/* Task Card Content */}
                                <div className="justify-end w-full gap-3 flex px-4 py-2">
                                    <button
                                        className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 active:bg-red-200"
                                        onClick={() => {
                                            setIsVisible(!isVisible);
                                            setIsUpdate(false);
                                        }}
                                    >
                                        <MdDelete size={24} />
                                    </button>
                                    <button
                                        className="p-2 rounded-full text-blue-500 hover:text-blue-700 hover:bg-blue-100 active:bg-blue-200"
                                        onClick={() => {
                                            setIsVisible(!isVisible);
                                            setIsUpdate(true);
                                        }}
                                    >
                                        <MdEdit size={24} />
                                    </button>
                                </div>

                                <div className="px-6 pb-4 sm:pb-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                        <h1
                                            className="text-4xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate w-full"
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
                                                    className="w-fit px-2 py-1 rounded-md items-center justify-center bg-blue-500 text-white text-xs font-bold"
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
                        <div className="lg:w-1/2 w-full max-h-[450px] h-fit p-4 flex flex-col">
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
                                        <p className="text-gray-500 text-center mt-4">No activity available.</p>
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
                                            className="p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
