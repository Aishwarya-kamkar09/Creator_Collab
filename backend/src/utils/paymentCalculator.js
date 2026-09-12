export const calculatePayment = (amount) => {

    const platformFee = Math.round(amount * 0.10);

    return {
        totalAmount: amount,
        platformFee,
        creatorAmount: amount - platformFee,
    };
};

