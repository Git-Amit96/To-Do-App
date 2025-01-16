import React, { useState } from "react";
import DatePickerComponent from "../Utils/DatePickerComponent";
import { TextField, Box, Button, Chip, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const params= useParams();
  const [description, setDescription] = useState("");
  const [sharedWith, setSharedWith] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [deadline, setDeadline] = useState(null);
  const status= params.info;

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
    const formattedDate = new Date(deadline).toISOString();
  
    const taskData = {
      title,
      description,
      status: "running",
      sharedWith,
      deadline: formattedDate,
    };
  
    try {
      console.log(taskData);
      const response = await fetch("http://localhost:5000/to-do/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
        credentials: "include",
      });
  
      const data = await response.json();
      if (data.success) {
        alert(data.message);
  
        // Reset input fields to default values
        setTitle("");
        setDescription("");
        setSharedWith([]);
        setEmailInput("");
        setDeadline(null);
      } else {
        throw new Error("Task creation failed. Try Again!");
      }
    } catch (err) {
      console.log(err.message);
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

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Task
      </Button>
    </Box>
  );
};

export default CreateTask;

