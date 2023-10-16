# Match2Voice Backend

The Match2Voice backend serves as the primary API for the frontend application, providing necessary voice data, celebrity information, and managing the leaderboard scores for users.

## Overview

The backend is built with Express.js, a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. The project is structured to read voice and score data from JSON files, allowing for easy additions or changes to the dataset.

## Technologies Used

- **Express.js**: The primary web server for handling API requests.
- **Node.js**: The runtime that allows executing JavaScript on the server side.
- **FS Module**: For reading and writing to the file system.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing, essential for the frontend to make requests.

## API Endpoints

### Voices

- `GET /voices/gender/:gender`: Fetches voices based on gender.
- `GET /voices/occupation/:occupation`: Fetches voices by occupation.
- `GET /voices/id/:id`: Retrieves a specific voice by its ID.
- `GET /voices/random`: Provides a random voice selection.

### Leaderboard

- `GET /display/leaderboard`: Fetches the current leaderboard.
- `POST /savescore`: Saves a user's score to the leaderboard.

## Setup and Running

To set up and run the Match2Voice backend locally, follow these steps:

### Clone the Repository

git clone https://github.com/SimonKu22/match2voice-server
cd match2voice-server

### Install Dependencies

Ensure you have Node.js and npm installed on your machine.

npm install

### Run the Backend Server

node index.js

The backend server will be up and running at `http://localhost:8080`.