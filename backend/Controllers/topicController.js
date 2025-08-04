const sendResponse = require("../Utils/send-response");
const Topics = require("../Models/topic-model");
const givetopics = async (req, res) => {
  try {
    const topics = await Topics.find({});
    if (!topics || topics.length === 0) {
      return sendResponse(res, 404, false, "No topics found", []);
    }
    return sendResponse(res, 200, true, "Topics fetched Successfully", topics);
  } catch (error) {
    console.log("The error is:", error);
    return sendResponse(res, 500, false, "Internal Server Error", error);
  }
};

const singletopicget = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return sendResponse(res, 404, false, "No id provided");
  }
  try {
    const topic = await Topics.findById(id);
    if (!topic) {
      return sendResponse(res, 404, false, "No Topic with this id Found.");
    }
    return sendResponse(res, 200, true, "Topic found,", topic);
  } catch (error) {
    console.log(`There is an error: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
module.exports = { givetopics, singletopicget };
