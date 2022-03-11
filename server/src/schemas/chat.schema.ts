import mongoose from "mongoose";
const { Schema } = mongoose;
import { IChat, IChatMessage } from "../lib/types";

export const chatMessageSchema = new Schema<IChatMessage>(
  {
    chatId: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: String, required: true },
    message: { type: String, required: true },
  },
  { collection: "messages" }
);

export const chatSchema = new Schema<IChat>({
  id: { type: String, required: true },
  createdOn: { type: Date, required: false, default: Date.now },
});
