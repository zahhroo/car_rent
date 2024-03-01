import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import md5 from "md5" 
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient()

const createAdmin = async (request: Request, response: Response) => {
    try {
        const nama_admin = request.body.nama_admin
        const email = request.body.email
        const password = md5(request.body.password)
 
        const newData = await prisma.admin.create({
            data: {
                nama_admin: nama_admin,
                email: email,
                password: password
            }
        })

        return response.status(200).json({
            status: true, 
            message: `Admin has been created`,
            data: newData
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const readAdmin = async (request: Request, response: Response) => {
    try {
        const page = Number(request.query.page) || 1
        const qty = Number(request.query.qty) || 10
        const keyword = request.query.keyword?.toString() || ""

        const dataAdmin = await prisma.admin.findMany({
            take: qty, //mendefinisikan jml data yang diambil
            skip: (page - 1) * qty,
            where: {
                OR: [
                    { nama_admin: { contains: keyword } },
                    { email: { contains: keyword } }
                ]
            },
            orderBy: { nama_admin: "asc" }
        })
        return response.status(200).json({
            status: true,
            message: `Admin has been loaded`,
            data: dataAdmin
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const updateAdmin = async (request: Request, response: Response) => {
    try {
        const adminID = request.params.adminID
        const nama_admin = request.body.nama_admin
        const email = request.body.email
        const password = md5(request.body.password)

        const findAdmin = await prisma.admin.findFirst({
            where: { adminID: Number(adminID) }
        })

        if (!findAdmin) {
            return response.status(400).json({
                status: false,
                message: `Data admin not found`
            })
        }

        const dataAdmin = await prisma.admin.update({
            where: { adminID: Number(adminID) },
            data: {
                nama_admin: nama_admin || findAdmin.nama_admin,
                email: email || findAdmin.email,
                password: password || findAdmin.password
            }
        })

        return response.status(200).json({
            status: true,
            message: `Admin has been updated`,
            data: dataAdmin
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const deleteAdmin = async (request: Request, response: Response) => {
    try {
        const adminID = request.params.adminID

        const findAdmin = await prisma.admin.findFirst({
            where: { adminID: Number(adminID) }
        })

        if (!findAdmin) {
            return response.status(400).json({
                status: false,
                message: `Admin not found`
            })
        }

        const dataAdmin = await prisma.admin.delete({
            where: { adminID: Number(adminID) }
        })

        return response.status(200).json({
            status: true,
            message: `data admin has been deleted`
        })
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error
        })
    }
}

const login = async (request: Request, response: Response) => {
    try {
        const email = request.body.email
        const password = md5(request.body.password)
        const admin = await prisma.admin.findFirst(
            {
                where:{email: email, password: password}
            }
        )
        if (admin) {
            const payload = admin
            const secretkey = "co0kw3ll.5y"
            const token = sign(payload, secretkey)
            return response.status(200).json({
                status: true, message: "login berhasil", token: token
            })
        }
        else {
            return response.status(200).json({
                status: false, message: "gagal login"
            })
        }

    } catch (error) {
        return response.status(500).json({
                status: false, message: error
            })
    }
}


export {createAdmin, readAdmin, updateAdmin, deleteAdmin, login}