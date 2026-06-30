import "dotenv/config";

import "./utils/cloudinary.js";
import { app } from "./app.js";
import connectDB from "./utils/db.js";

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  await connectDB();
});

