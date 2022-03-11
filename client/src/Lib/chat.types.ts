export interface IChatMessage extends Document {
  chatId: string;
  sentAt: Date;
  sentBy: string; // User Name
  message: string; // should maybe be sanitized
}

export interface IChat {
  id: string; // or number, need to figure out how to do this
  createdOn: Date;
}
