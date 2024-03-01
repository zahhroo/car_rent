import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

const createRent = async (request: Request, response: Response) => {
    try {
        const carID = Number(request.body.carID)
        const nama_penyewa = request.body.nama_penyewa
        const tanggal = new Date(request.body.tanggal).toISOString()
        const lama_sewa = Number(request.body.lama_sewa)

        const car = await prisma.car.findFirst({ where: { carID: carID } })
        if (!car) {
            return response.status(400).json({
                status: false,
                message: ` Data car not found`
            })
        }
        const total_bayar = car.harga_perhari * lama_sewa

        const newData = await prisma.rent.create({
            data: {
                carID: carID,
                nama_penyewa: nama_penyewa,
                tanggal: tanggal,
                lama_sewa: lama_sewa,
                total_bayar: total_bayar
            }
        })

        return response.status(200).json({
            status: true,
            message: `Rent has been created`,
            data: newData
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const readRent = async (request: Request, response: Response) => {
    try {
        const dataRent = await prisma.rent.findMany()
        return response.status(200).json({
            status: true,
            message: `Rent has been loaded`,
            data: dataRent
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const updateRent = async (request: Request, response: Response) => {
    try {
        const rentID = request.params.rentID

        const carID = Number(request.body.carID)
        const nama_penyewa = request.body.nama_penyewa
        const tanggal = new Date(request.body.tanggal).toISOString()
        const lama_sewa = Number(request.body.lama_sewa)

        const car = await prisma.car.findFirst({ where: { carID: carID } })
        if (!car) {
            return response.status(400).json({
                status: false,
                message: `Data car not found`
            })
        }
        const total_bayar = car.harga_perhari*lama_sewa

        const findRent = await prisma.rent.findFirst({
            where: { rentID: Number(rentID) }
        })

        if (!findRent) {
            return response.status(400).json({
                status: false,
                message: `Rent car not found`
            })
        }

        const dataRent = await prisma.rent.update({
            where: { rentID: Number(rentID) },
            data: {
                carID: carID || findRent.carID,
                nama_penyewa: nama_penyewa || findRent.nama_penyewa,
                tanggal: tanggal || findRent.tanggal,
                lama_sewa: lama_sewa || findRent.lama_sewa,
                total_bayar: total_bayar || findRent.total_bayar
            }
        })

        return response.status(200).json({
            status: true,
            message: `Rent has been updated`,
            data: dataRent
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const deleteRent = async (request: Request, response: Response) => {
    try {
        const rentID = request.params.rentID
        
        const findRent = await prisma.rent.findFirst({
            where: { rentID: Number(rentID) }
        })

        if (!findRent) {
            return response.status(400).json({
                status: false,
                message: `Rent not found`
            })
        }

        const dataRent = await prisma.rent.delete({
            where: { rentID: Number(rentID) }
        })

        return response.status(200).json({
            status: true,
            message: `data rent has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

export { createRent, readRent, updateRent, deleteRent }