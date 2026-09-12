import Collaboration from "../models/Collaboration.js";
import BrandProfile from "../models/BrandProfile.js";
import CreatorProfile from "../models/CreatorProfile.js";
import ApiError from "./ApiError.js";

const checkCollaborationAccess = async (user, collaborationId) => {

    const collaboration = await Collaboration.findById(collaborationId);

    if (!collaboration) {
        throw new ApiError(404, "Collaboration not found");
    }

    if (user.role === "brand") {

        const brand = await BrandProfile.findOne({
            user: user._id,
        });

        if (!brand) {
            throw new ApiError(404, "Brand profile not found");
        }

        if (collaboration.brand.toString() !== brand._id.toString()) {
            throw new ApiError(403, "Unauthorized");
        }

    } else {

        const creator = await CreatorProfile.findOne({
            user: user._id,
        });

        if (!creator) {
            throw new ApiError(404, "Creator profile not found");
        }

        if (collaboration.creator.toString() !== creator._id.toString()) {
            throw new ApiError(403, "Unauthorized");
        }

    }

    return collaboration;
};

export default checkCollaborationAccess;