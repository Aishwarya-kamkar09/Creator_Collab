import Timeline from "../models/Timeline.js";

const addTimelineEvent = async ({
    collaboration,
    createdBy,
    title,
    description,
    eventType,
    metadata = {},

}) => {

    await Timeline.create({
        collaboration,
        createdBy,
        title,
        description,
        eventType,
        metadata,

    });

};

export default addTimelineEvent;