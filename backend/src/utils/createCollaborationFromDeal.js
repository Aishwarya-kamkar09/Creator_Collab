import Collaboration from "../models/Collaboration.js";

const createCollaborationFromDeal = async (deal) => {

    const deliverables = (deal.deliverables || []).map((d) => ({
        title: d.title,
        quantity: d.quantity || 1,
    }));

    const collaboration = await Collaboration.create({
        campaign: deal.campaign,
        brand: deal.brand,
        creator: deal.creator,
        application: deal.application,
        agreement: {
            finalAmount: deal.finalAmount,
            deadline: deal.deadline,
            deliverables,
        },
        revision: {
            freeAllowed: deal.freeRevisions || 1,
        },
        progress: {
            totalDeliverables: deliverables.length,
        },
    });

    return collaboration;

};

export default createCollaborationFromDeal;
