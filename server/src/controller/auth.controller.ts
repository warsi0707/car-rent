import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from "../models/admin.model.js";

const JWT_COOKIE_NAME = "admin_token";

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role } = req.body || {};

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ message: "email, name and pass are required" });
    }

    const existing = await AdminModel.findOne({email:email})
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      email,
      name,
      password: hashedPass,
      role,
    });
    return res.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup failed", error: String(error) });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "email and pass are required" });
    }

    const admin = await AdminModel.findOne({email:email});
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const jwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT secret is missing");
    }

    const token = jwt.sign(
      {
        id: admin._id,
      },
      jwtSecret,
    );
    res.cookie(JWT_COOKIE_NAME, token, getCookieOptions());

    return res.status(200).json({
      message: "Signin successful",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signin failed", error: String(error) });
  }
};

export const adminLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie(JWT_COOKIE_NAME, getCookieOptions());
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Logout failed", error: String(error) });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, name, pass, role } = req.body || {};

    if (!email || !name || !pass) {
      return res
        .status(400)
        .json({ message: "email, name and pass are required" });
    }

    const existing = await AdminModel.findOne(email).lean();
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    const admin = await AdminModel.create({
      email,
      name,
      password: hashedPass,
      role,
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Create admin failed", error: String(error) });
  }
};

