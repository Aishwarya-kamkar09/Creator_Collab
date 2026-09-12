import Collaboration from "../models/Collaboration.js";
import BrandProfile from "../models/BrandProfile.js";
import CreatorProfile from "../models/CreatorProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import checkCollaborationAccess from "../utils/checkCollaborationAccess.js";
import addTimelineEvent from "../utils/addTimelineEvent.js";
import createNotification from "../utils/createNotification.js";



export const getMyCollaborations = asyncHandler(async (req, res) => {

    let collaborations = [];

    if (req.user.role === "brand") {

        const brand = await BrandProfile.findOne({
            user: req.user._id
        });

        collaborations = await Collaboration.find({
            brand: brand._id
        })
        .populate("campaign")
        .populate({
            path: "creator",
            populate: {
                path: "user",
                select: "name email avatar"
            }
        });

    } else {

        const creator = await CreatorProfile.findOne({
            user: req.user._id
        });

        collaborations = await Collaboration.find({
            creator: creator._id
        })
        .populate("campaign")
        .populate({
            path: "brand",
            populate: {
                path: "user",
                select: "name email avatar"
            }
        });

    }

    return res.status(200).json(
        new ApiResponse(
            200,
            collaborations,
            "Collaborations fetched successfully."
        )
    );

});



export const getCollaborationById = asyncHandler(async (req, res) => {

    await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    const collaboration = await Collaboration.findById(req.params.id)

        .populate("campaign")

        .populate("application")

        .populate({
            path: "creator",
            populate: {
                path: "user",
                select: "name email avatar",
            },
        })

        .populate({
            path: "brand",
            populate: {
                path: "user",
                select: "name email avatar",
            },
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Collaboration fetched successfully."
        )
    );
});


export const updateStage = asyncHandler(async (req, res) => {

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    if (
        collaboration.status === "Completed" ||
        collaboration.status === "Cancelled"
    ) {
        throw new ApiError(
            400,
            "Project already closed."
        );
    }

    const validStages = [
        "Planning",
        "In Progress",
        "Review",
        "Completed",
        "Cancelled",
    ];

    const { stage } = req.body;

    if (!validStages.includes(stage)) {
        throw new ApiError(400, "Invalid stage");
    }

    collaboration.currentStage = stage;
    collaboration.progress.lastUpdated = new Date();

    await collaboration.save();

    // Timeline event 
    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Stage Updated",
        description: `Project moved to ${stage}.`,
        eventType:
            req.user.role === "creator"
                ? "Creator"
                : "Brand",
        metadata: {
            oldStage: collaboration.currentStage,
            newStage: stage,
        }
    });


    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Stage updated successfully."
        )
    );

});


export const cancelCollaboration = asyncHandler(async (req, res) => {

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    if (
        collaboration.status === "Completed" ||
        collaboration.status === "Cancelled"
    ) {
        throw new ApiError(
            400,
            "Project already closed."
        );
    }

    collaboration.status = "Cancelled";
    collaboration.currentStage = "Cancelled";
    collaboration.project.cancelledAt = new Date();

    await collaboration.save();

    //timeline event for collaboration cancelled
    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Collaboration Cancelled",
        description: "Project cancelled.",
        eventType: "System",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Collaboration cancelled successfully."
        )
    );

});

export const completeCollaboration = asyncHandler(async (req, res) => {

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    if (collaboration.status === "Completed") {
        throw new ApiError(
            400,
            "Project already completed."
        );
    }

    collaboration.status = "Completed";
    collaboration.currentStage = "Completed";
    collaboration.project.completedAt = new Date();

    await collaboration.save();

    //timeline event for collaboration completed
    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Project Completed",
        description: "All deliverables completed.",
        eventType: "System",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Project completed successfully."
        )
    );
});


//deliverbales

export const getDeliverables = asyncHandler(async (req, res) => {

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            collaboration.agreement.deliverables,

            "Deliverables fetched successfully."

        )

    );

});


export const submitDeliverable = asyncHandler(async (req, res) => {

    if (req.user.role !== "creator") {
        throw new ApiError(
            403,
            "Only creators can submit deliverables."
        );

    }

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    const deliverable =
        collaboration.agreement.deliverables.id(
            req.params.deliverableId
        );

    if (!deliverable) {

        throw new ApiError(
            404,
            "Deliverable not found."
        );

    }

    if (deliverable.completed) {
        throw new ApiError(
            400,
            "This deliverable has already been approved."
        );
    }

    const { url, fileType } = req.body;

    if (!url) {
        throw new ApiError(400, "Please provide a link to your work.");
    }

    deliverable.submittedLinks.push({
        url,
        fileType
    });
    deliverable.submittedBy = req.user._id;
    deliverable.submittedAt = new Date();
    collaboration.status = "Submitted";
    collaboration.currentStage = "Review";
    collaboration.progress.lastUpdated = new Date();

    await collaboration.save();

    //timeline event for deliverable submission
    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Deliverable Submitted",
        description: `${deliverable.title} submitted.`,
        eventType: "Deliverable",
        metadata: {
            deliverableId: deliverable._id,
        }
    });

    const brand = await BrandProfile.findById(collaboration.brand);

    await createNotification({
        receiver: brand.user,
        sender: req.user._id,
        title: "Deliverable Submitted",
        message: "The creator submitted a deliverable.",
        type: "Deliverable",
        referenceId: collaboration._id,
        referenceModel: "Collaboration",
    });

    return res.status(200).json(

        new ApiResponse(
            200,
            deliverable,
            "Deliverable submitted successfully."
        )
    );
});


export const approveDeliverable = asyncHandler(async (req, res) => {

    if (req.user.role !== "brand") {

        throw new ApiError(
            403,
            "Only brands can approve deliverables."
        );

    }

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    const deliverable =
        collaboration.agreement.deliverables.id(
            req.params.deliverableId
        );

    if (!deliverable) {

        throw new ApiError(
            404,
            "Deliverable not found."
        );

    }

    deliverable.completed = true;
    deliverable.approved = true;
    deliverable.approvedAt = new Date();
    collaboration.progress.completedDeliverables++;
    collaboration.progress.totalDeliverables =
        collaboration.agreement.deliverables.length;

    collaboration.progress.percentage =
        Math.round(
            collaboration.progress.completedDeliverables *
            100 /
            collaboration.progress.totalDeliverables
        );

    collaboration.currentStage = "In Progress";

    if (
        collaboration.progress.completedDeliverables ===
        collaboration.progress.totalDeliverables
    ) {
        collaboration.currentStage = "Completed";
    }

    await collaboration.save();

    // Timeline event 
    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Deliverable Approved",
        description: `${deliverable.title} approved.`,
        eventType: "Deliverable",
        metadata: {
            deliverableId: deliverable._id,
        }
    });


    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Deliverable approved."
        )
    );

});



//revision request
export const requestRevision = asyncHandler(async (req, res) => {
    if (req.user.role !== "brand") {
        throw new ApiError(
            403,
            "Only brands can request revisions."
        );
    }

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    const deliverable =
        collaboration.agreement.deliverables.id(
            req.params.deliverableId
        );

    if (!deliverable) {
        throw new ApiError(
            404,
            "Deliverable not found."
        );
    }

    if (deliverable.status !== "Submitted") {
        throw new ApiError(
            400,
            "Deliverable is not waiting for review."
        );
    }
    if (
        collaboration.revision.used >=
        collaboration.revision.freeAllowed
    ) {
        throw new ApiError(
            400,
            "No free revisions remaining."
        );
    }

    const revisionNumber =
        collaboration.revision.used + 1;

    collaboration.revision.requests.push({
        requestedBy: req.user._id,
        deliverableId: deliverable._id,
        revisionNumber,
        comment: req.body.comment,
        status: "Pending"
    });

    collaboration.revision.used++;
    deliverable.status = "Revision Requested";
    collaboration.status = "Revision Requested";
    collaboration.currentStage = "Review";
    collaboration.progress.lastUpdated = new Date();
    await collaboration.save();

    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Revision Requested",
        description:
            req.body.comment
                ? `Revision #${revisionNumber} requested for "${deliverable.title}": ${req.body.comment}`
                : `Revision #${revisionNumber} requested for "${deliverable.title}".`,
        eventType: "Revision",
        metadata: {
            deliverableId: deliverable._id,
            revisionNumber
        }
    });

    const creator = await CreatorProfile.findById(collaboration.creator);

    await createNotification({
        receiver: creator.user,
        sender: req.user._id,
        title: "Revision Requested",
        message: "The brand requested changes.",
        type: "Revision",
        referenceId: collaboration._id,
        referenceModel: "Collaboration",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Revision requested successfully."
        )
    );
});


export const resolveRevision = asyncHandler(async (req, res) => {
    if (req.user.role !== "creator") {
        throw new ApiError(
            403,
            "Only creators can resolve revisions."
        );
    }

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    const revision = collaboration.revision.requests.id(
        req.params.revisionId
    );

    if (!revision) {
        throw new ApiError(
            404,
            "Revision request not found."
        );
    }

    if (revision.status === "Resolved") {
        throw new ApiError(
            400,
            "Revision already resolved."
        );
    }

    const deliverable =
        collaboration.agreement.deliverables.id(
            revision.deliverableId
        );

    if (!deliverable) {
        throw new ApiError(
            404,
            "Deliverable not found."
        );
    }

    const { submittedLinks } = req.body;

    if (!submittedLinks || submittedLinks.length === 0) {
        throw new ApiError(
            400,
            "Please upload revised files."
        );
    }

    deliverable.submittedLinks = submittedLinks;
    deliverable.submittedBy = req.user._id;
    deliverable.submittedAt = new Date();

    deliverable.status = "Submitted";

    revision.status = "Resolved";
    revision.resolvedAt = new Date();

    collaboration.status = "Submitted";
    collaboration.currentStage = "Review";
    collaboration.progress.lastUpdated = new Date();

    await collaboration.save();

    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Revision Submitted",
        description:
            `Revision #${revision.revisionNumber} submitted.`,
        eventType: "Revision",
        metadata: {
            revisionId: revision._id,
            deliverableId: deliverable._id,
            revisionNumber: revision.revisionNumber
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            collaboration,
            "Revision submitted successfully."
        )
    );
});


export const getRevisions = asyncHandler(async (req, res) => {

    const collaboration = await checkCollaborationAccess(
        req.user,
        req.params.id
    );

    const revisions = collaboration.revision.requests
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        );

    return res.status(200).json(

        new ApiResponse(

            200,

            revisions,

            "Revision history fetched successfully."

        )

    );

});


