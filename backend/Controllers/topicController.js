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
module.exports = { givetopics };
