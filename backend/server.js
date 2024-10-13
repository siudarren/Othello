// Import required modules using ES6 syntax
import express from "express";
import path from "path";
import {fileURLToPath} from "url";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Example API route
app.get("/api/hello", (req, res) => {
    res.json({message: "Hello from the backend!"});
});

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend (after building the frontend)
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Catch-all handler to serve the React app for any unrecognized routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

// Set the port number
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
