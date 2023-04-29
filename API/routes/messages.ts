import express from "express";
const router = express.Router();

let messages: string[] = [];

router.get("/", (req, res) => {
    res.send(messages);
});

router.post("/", (req, res) => {
    const message = req.body.message;
    messages.push(message);
    res.sendStatus(200);
});

export default router;