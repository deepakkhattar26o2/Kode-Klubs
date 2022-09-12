import { User, Profile } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../prismaClient";
import { sendMail } from "../Tools/nodemailer";
import { authDetails, CurrentUser } from "./authController";
const randomString = require("randomstring");
const bcr = require("bcrypt");

interface updatePasswordRequestBody {
  password: string;
}
const updatePassword = (req: Request, res: Response) => {
  const body: updatePasswordRequestBody = req.body;
  const User: CurrentUser = authDetails(req);
  bcr.hash(body.password, 10, (err: Error, hash: string) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    prisma.user
      .update({
        where: {
          id: User.id,
        },
        data: {
          password: hash,
        },
      })
      .then((doc) => {
        return res.status(200).json(User);
      })
      .catch((err: Error) => {
        return res.status(200).json({ message: err.message });
      });
  });
};

interface updateProfileRequestBody {
  userName?: string;
  bio?: string;
}

const updateProfile = (req: Request, res: Response) => {
  const User: CurrentUser = authDetails(req);
  const body: updateProfileRequestBody = req.body;
  prisma.profile
    .update({
      where: {
        userId: User.id,
      },
      data: body,
    })
    .then((doc: Profile) => {
      return res.status(200).json(doc);
    })
    .catch((err: Error) => {
      return res.status(500).json({ message: err.message });
    });
};

const forgotPassword = (req : Request, res : Response)=>{}
export { updatePassword, updateProfile };
