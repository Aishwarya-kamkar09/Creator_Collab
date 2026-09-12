import express from "express";
const router = express.Router();
import { protect } from "../middlewares/auth.middleware.js";
import {
    getMyCollaborations,
    getCollaborationById,
    updateStage,
    cancelCollaboration,
    completeCollaboration,
    getDeliverables,
    submitDeliverable,
    approveDeliverable,
    requestRevision,
    resolveRevision,
    getRevisions

} from "../controllers/collaboration.controller.js";



router.get(
    "/me",
    protect,
    getMyCollaborations
);

router.get(
    "/:id",
    protect,
    getCollaborationById
);

router.patch(
    "/:id/stage",
    protect,
    updateStage
);

router.patch(
    "/:id/cancel",
    protect,
    cancelCollaboration
);

router.patch(
    "/:id/complete",
    protect,
    completeCollaboration
);

// Deliverables routes

router.get(
    "/:id/deliverables",
    protect,
    getDeliverables
);

router.patch(
    "/:id/deliverables/:deliverableId/submit",
    protect,
    submitDeliverable
);

router.patch(
    "/:id/deliverables/:deliverableId/approve",
    protect,
    approveDeliverable
);


// Revision Requests routes

router.patch(
    "/:id/deliverables/:deliverableId/revision",
    protect,
    // authorize("brand"),
    requestRevision
);

router.patch(
    "/:id/revisions/:revisionId/resolve",
    protect,
    // authorize("creator"),
    resolveRevision
);

router.get(
    "/:id/revisions",
    protect,
    getRevisions
);


export default router;