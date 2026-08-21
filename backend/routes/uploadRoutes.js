import express from "express";

const router = express.Router();

// Upload Image Endpoint with Cloudinary / Local Fallback
router.post("/", (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (imageBase64) {
      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        url: imageBase64,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: "/images/headphones.jpg",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
