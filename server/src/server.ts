import { app } from "./app.js";
import connectDB from "./utils/db.js";
import "dotenv/config";

// create a server using the express app
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});
