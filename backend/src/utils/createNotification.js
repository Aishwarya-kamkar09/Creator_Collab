import Notification from "../models/Notification.js";

const createNotification = async ({
    receiver,
    sender = null,
    title,
    message,
    type,
    referenceId = null,
    referenceModel = null,
}) => {
    return await Notification.create({
        receiver,
        sender,
        title,
        message,
        type,
        referenceId,
        referenceModel,
    });
};



export default createNotification;