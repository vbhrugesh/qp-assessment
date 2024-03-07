// Load environment variables from the .env file
import "dotenv/config"

// Import the App class from the app module
import App from "./App"
// Import various controllers for the application

/**
 * Creates a new instance of the application.
 * @param {Controller[]} controllers - An array of controllers.
 * @param {number} port - The port on which to listen for incoming requests.
 */
const app = new App([], Number(process.env.PORT))

/**
 * Starts the server and listens for incoming requests.
 */
app.listen()
