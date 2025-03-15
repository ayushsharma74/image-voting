import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware";
import { createImageUpload } from "../utils/upload";
import { createTaskInput } from "../types";
const router = Router();

const prismaClient = new PrismaClient();

const JWT_SECRET = "hfjfhskdjfhkh";
router.post("/task", async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const body = req.body;

  const parsedData = createTaskInput.safeParse(body);

  if (!parsedData.success) {
    res.status(411).json(parsedData.error);
    return;
  }
  let response = await prismaClient.$transaction(async (prisma) => {
    const task = await prisma.task.create({
      data: {
        title: parsedData.data.title ?? "Anonymous",
        amount: "1",
        payment_signature: parsedData.data.signature,
        user: userId,
      },
    });

    await prisma.option.createMany({
      data: parsedData.data.options.map((option) => ({
        image_url: option.imageUrl,
        task_id: task.id,
      })),
    });
    return task;
  });

  res.json({
    id: response.id,
  });
});

router.get("/pre-signed-url", async (req, res) => {
  const { timestamp, signature } = await createImageUpload();

  res.json({ timestamp, signature });
});

router.post("/signin", async (req, res) => {
  // TODO: ADD SIGN VERIFICATION
  const address = "fsjhdfidhuiehsoijfpojfpwojpaojpw";

  const existingUser = await prismaClient.user.findFirst({
    where: {
      address,
    },
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      JWT_SECRET
    );
    res.json({ token });
  } else {
    const user = await prismaClient.user.create({
      data: {
        address,
      },
    });
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );
    res.json({ token });
  }
});

export default router;
