import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/messages.model.js";
import user from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filterUsers = await user
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password");
    res.status(200).json(filterUsers);
  } catch (err) {
    console.log("error in getUsersForSideBar", err.message);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.log("error in getMessages", err.message);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || "",
    });
    await newMessage.save()
    const receiverSocketId =getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    res.status(201).json(newMessage)
  } catch (err) {
    console.log("error in sendMessages controller ", err.message);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};
