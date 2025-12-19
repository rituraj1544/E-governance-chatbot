const ChatHistory = require("../models/ChatHistory");
const FAQ = require("../models/FAQ");
const Scheme = require("../models/Scheme");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalChats, faqs, schemes] = await Promise.all([
      ChatHistory.countDocuments(),
      FAQ.countDocuments(),      // ✅ FIXED
      Scheme.countDocuments(),   // ✅ FIXED
    ]);

    return res.json({
      totalChats,
      faqs,
      schemes,
      avgResponse: "< 2s",
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};
