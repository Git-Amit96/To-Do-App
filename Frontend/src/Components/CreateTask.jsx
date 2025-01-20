import React, { useState, useEffect } from "react";
import DatePickerComponent from "../Utils/DatePickerComponent";
import { TextField, Box, Button, Chip, Typography } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
const apiUrl = import.meta.env.VITE_API_URL;

const CreateOrUpdate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sharedWith, setSharedWith] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [statusInfo, setStatusInfo] = useState("running");

  const params = useParams();
  const status = params.info;

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const taskData = useSelector((state) => state.task?.data?.data);

  useEffect(() => {
    if (status === "create") {
      setTitle("");
      setDescription("");
      setSharedWith([]);
      setEmailInput("");
      setDeadline(null);
      setStatusInfo("running"); // Reset status to default for new tasks
    }
  }, [status]);

  useEffect(() => {
    if (status === "update" && taskData) {
      const specificTask = taskData?.find((e) => e._id.toString() === id.toString());
      console.log(specificTask);
      if (specificTask) {
        setTitle(specificTask.title );
        setDescription(specificTask.description);
        setSharedWith(specificTask.sharedWith.map((e) => e.Email));
        //setDeadline(new Date(specificTask.deadline));

        const deadlineDate = new Date(specificTask.deadline);
        const dateDifference = deadlineDate.getTime() - Date.now();

        if (isChecked) {
          setStatusInfo("completed");
        } else if (dateDifference > 0) {
          setStatusInfo("running");
        } else if (dateDifference < 0) {
          setStatusInfo("delayed");
        }
      }
    }
  }, [id, taskData, isChecked]); // Add isChecked as a dependency

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    setStatusInfo(checked ? "completed" : "running"); // Update status based on checkbox
  };

  const handleAddEmail = () => {
    if (emailInput.trim() && !sharedWith.includes(emailInput)) {
      setSharedWith([...sharedWith, emailInput]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email) => {
    setSharedWith(sharedWith.filter((item) => item !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = deadline ? new Date(deadline).toISOString() : null;
    const taskData = {
      title,
      description,
      status: statusInfo, // Use updated statusInfo here
      sharedWith,
      deadline: formattedDate,
    };
    console.log(taskData);
    try {
      const response = await fetch(
        `${apiUrl}tasks/${status === "update" ? `update/${id}` : "create"}`,
        {
          method: status === "update" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.message);

        // Reset input fields to default values
        setTitle("");
        setDescription("");
        setSharedWith([]);
        setEmailInput("");
        setDeadline(null);
        setStatusInfo("running"); // Reset status
        setIsChecked(false); // Reset checkbox
      } else {
        throw new Error(data.message || "Task operation failed. Try again!");
      }
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        maxWidth: 360,
        margin: "auto",
        mt: 4,
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
        {`${status.toUpperCase()} TASK`}
      </Typography>

      <TextField
        label="Task Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
        fullWidth
      />

      <TextField
        label="Task Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        size="small"
        multiline
        rows={3}
        fullWidth
      />

      <Box>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          Shared With (Emails)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            size="small"
            placeholder="Enter email"
            fullWidth
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddEmail}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {sharedWith.map((email, index) => (
            <Chip
              key={index}
              label={email}
              onDelete={() => handleRemoveEmail(email)}
              size="small"
              color="primary"
            />
          ))}
        </Box>
      </Box>

      <DatePickerComponent
        label="Task Deadline"
        value={deadline}
        onChange={(newDate) => setDeadline(newDate)}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="taskCompleted"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-4 h-4"
        />
        <label htmlFor="taskCompleted" className="text-gray-700">
          Mark as Completed
        </label>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 2 }}
      >
        {status === "update" ? "Update Task" : "Create Task"}
      </Button>
    </Box>
  );
};

export default CreateOrUpdate;

