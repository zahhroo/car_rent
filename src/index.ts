import express, { Request,Response } from "express"
import admin from "./route/admin_r"
import car from "./route/car_r"
import rent from "./route/rent_r"

const app = express()

app.use(express.json())

const PORT = 8000 

app.use(admin, car, rent)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
})