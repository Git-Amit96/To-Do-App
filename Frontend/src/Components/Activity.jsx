import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const Activity = ({ info }) => {
    const { owner, text, createdAt } = info;

    return (
        <div className="flex flex-col p-4 border-b border-gray-300">
            {/* Profile Icon */}
            <div className="flex gap-3 ">
                <FaUserCircle
                    size={36}
                    className="text-gray-400  sm:mx-0"
                />
                {/* Owner Name and Date */}
                <div className="flex flex-wrap justify-between items-center w-full gap-2 mb-1 text-center sm:text-left">
                    <span className="font-semibold text-gray-800">{owner?.Name}</span>
                    <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </span>
                </div>
            </div>

            {/* Comment Content */}
            <div className="">

                {/* Comment Text */}
                <p className="text-gray-700 break-words  pl-10 text-start sm:text-left">
                    {text}
                </p>
            </div>
        </div>

    );
};

export default Activity;
