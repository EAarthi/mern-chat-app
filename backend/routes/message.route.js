import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { getMessage } from '../controllers/message.controller.js';

const router = express.Router();

//The protectRoute is an middleware

router.get("/:id",protectRoute,getMessage); //Used for retreiveing the message
router.post("/send/:id",protectRoute,sendMessage); //Used for sending the message

export default router;