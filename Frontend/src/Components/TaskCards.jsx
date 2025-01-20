import React, { useEffect, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";

const TaskCards = ({ data, username }) => {
  const navigate = useNavigate();
  const { title, owner, sharedWith, createdAt, deadline, status, description, _id } = data;
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (owner.Name === username) {
      setIsOwner(true);
    }
  }, [owner.Name, username]);

  let bgColor = "";
  let newStatus = "";
  let dateDifference = new Date(deadline).getTime() - Date.now();

  if (status === "completed") {
    bgColor = "bg-gray-700 text-white";
    newStatus = "Completed";
  } else if (dateDifference > 0) {
    bgColor = "bg-green-700 text-white";
    newStatus = "Active";
  } else if (dateDifference < 0) {
    bgColor = "bg-red-600 text-white";
    newStatus = "Delayed";
  }


  const showTasks = () => {
    navigate(`/dashboard/task/${_id}`);
  }

  return (
    <div className=" p-6 w-[100%] lg:w-[49%]  border border-gray-300 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]" onClick={showTasks}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg small:text-xl font-bold text-gray-800  mr-2" title={title}>
          {title}
        </h1>
        <span
          className={`text-xs font-semibold px-2 py-2 rounded-full ${bgColor}`}
        >
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {description.length > 100 ? description.slice(0, 97) + "..." : description}
      </p>

      {/* Owner */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Owner:</span> {owner.Name}
        </p>
        {isOwner && (
          <span className="text-xs w-fit font-semibold px-2 py-1 rounded-full uppercase bg-yellow-300 text-gray-600 mt-3 inline-block">
            Owner
          </span>
        )}
      </div>

      {/* Shared With */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 font-semibold mb-2">Shared With:</p>
        <div className="flex space-x-2">
          {sharedWith.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold"
              title={member.Name}
            >
              {member.Name.charAt(0)}
            </div>
          ))}
          {sharedWith.length > 3 && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-800 text-xs font-bold"
              title={`${sharedWith.length - 3} more`}
            >
              +{sharedWith.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Created At and Deadline */}
      <div className="text-sm text-gray-500">
        <p className="mb-1">
          <span className="font-semibold">Created:</span> {" "}
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
        <p>
          <span className="font-semibold">Deadline:</span> {" "}
          {format(new Date(deadline), "MMM d, yyyy")}
        </p>
      </div>
    </div>
  );
};

export default TaskCards;

