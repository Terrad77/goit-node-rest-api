import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());

// вар.1, midleware express для репарсеру req.body, тут оголошена глобально та спрацьовує на кожний http запит хоча потрібна лише для POST, PUT, PATCH
// app.use(express.json());

// вар.2,  bestpractic - використовуавти як локальну midleware в роутах, передаючи в параметри jsonParser перед (req, res) або перед викликом функції з (req, res) у contactsRouter.js
// const jsonParser = express.json();

app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
