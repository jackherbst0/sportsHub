const express = require('express');
const app = express();

// Define a directory to serve static files (e.g., HTML, CSV)
app.use(express.static(__dirname));

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});