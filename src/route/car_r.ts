import express from "express";
import { createCar, deleteCar, readCar, updateCar } from "../controller/car_c";

const app = express()

app.use(express.json())

app.post(`/car`, createCar)
app.get(`/car`, readCar)
app.put(`/car/:carID`, updateCar)
app.delete(`/car/:carID`, deleteCar)

export default app