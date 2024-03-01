import express from "express";
import { createRent, deleteRent, readRent, updateRent } from "../controller/rent_c";

const app = express()

app.use(express.json())

app.post(`/rent`, createRent)
app.get(`/rent`, readRent)
app.put(`/rent/:rentID`, updateRent)
app.delete(`/rent/:rentID`, deleteRent)

export default app