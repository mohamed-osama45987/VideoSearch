import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import videoRouter from "./routes/Video.router";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()
const app = express();
const port = process.env.DEFAULT_PORT || 8000;
app.use(express.json());
app.use(cors());
app.use('/api/video', videoRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
