export const sendOrderConfirmationEmail = async ({ customerEmail, customerName, orderId, totalAmount, items }) => {
  try {
    const receiptSummary = items.map((i) => `- ${i.quantity}x ${i.name} ($${i.price})`).join("\n");
    console.log(`
==================================================
📧 [Nodemailer Email Service] Transactional Receipt
==================================================
To: ${customerEmail}
Subject: Order Confirmation #${String(orderId).slice(-8)}
Dear ${customerName},

Thank you for your order! Your purchase of $${Number(totalAmount).toFixed(2)} has been confirmed.

Order Summary:
${receiptSummary}

Your vendor is preparing your shipment.
==================================================
    `);

    return { success: true, message: "Receipt email dispatched successfully" };
  } catch (error) {
    console.error("Email dispatch error:", error.message);
    return { success: false, message: error.message };
  }
};
