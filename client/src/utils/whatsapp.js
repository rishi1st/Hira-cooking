// Builds the pre-filled WhatsApp enquiry message and opens WhatsApp with it.
// Hindi is the default business-critical language per the client's requirement.

export const buildWhatsappMessage = ({ name, mobile, address, people, foods, language }) => {
  const isHindi = language !== "en";

  const foodLines = foods
    .map((f, i) => `${i + 1}. ${isHindi ? f.hindiName : f.englishName}`)
    .join("\n");

  if (isHindi) {
    return [
      "नमस्ते, मुझे कैटरिंग के लिए जानकारी चाहिए।",
      "",
      `ग्राहक का नाम: ${name}`,
      `मोबाइल नंबर: ${mobile}`,
      `पता: ${address}`,
      `लोगों की संख्या: ${people}`,
      "",
      "चुने गए व्यंजन:",
      "",
      foodLines,
      "",
      "कृपया इन व्यंजनों के लिए कैटरिंग की कीमत और अन्य जानकारी बताएं।",
    ].join("\n");
  }

  return [
    "Hello, I would like information about catering services.",
    "",
    `Customer Name: ${name}`,
    `Mobile Number: ${mobile}`,
    `Address: ${address}`,
    `Number of People: ${people}`,
    "",
    "Selected Dishes:",
    "",
    foodLines,
    "",
    "Please share the pricing and further details for these dishes.",
  ].join("\n");
};

export const openWhatsappEnquiry = ({ whatsappNumber, name, mobile, address, people, foods, language }) => {
  const message = buildWhatsappMessage({ name, mobile, address, people, foods, language });
  const encoded = encodeURIComponent(message);
  const cleanNumber = (whatsappNumber || "").replace(/\D/g, "");
  const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
};
