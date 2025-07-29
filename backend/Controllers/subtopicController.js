const Topic = require("../Models/topic-model");
const Subtopic = require("../Models/subtopics-model");
const subtopicvalidation = require("../Validations/subtopicvalidation");
const cloudinary = require("cloudinary").v2;
const sendResponse = require("../Utils/send-response");
const creatingsubtopic = async (req, res) => {
  const subtopicval = subtopicvalidation.safeParse(req.body);
  if (!subtopicval.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the input",
      null,
      subtopicval.error.issues.map((err) => err?.message)
    );
  }

  try {
    const title = req.body?.title;
    const description = req.body?.description;
    const topic_id = req.body?.topic_id;
    const summary = req.body?.summary;
    const image = req.files?.image;

    if (!req.files || Object.keys(req.files).length === 0) {
      return sendResponse(res, 400, false, "Sorry no images found");
    }

    const allowed_formats = ["image/png", "image/jpeg"];
    if (!allowed_formats.includes(image.mimetype)) {
      return res.status(400).send({
        success: false,
        message: "Sorry this format is not allowed for images.",
      });
    }

    const uploadResult = cloudinary.uploader.upload(image.tempFilePath);
    if (!uploadResult || uploadResult.error) {
      return res.status(400).json({
        success: false,
        message: "Sorry cannot upload images",
      });
    }

    if (!title || !description || !topic_id || !summary) {
      return sendResponse(res, 400, false, "Please complete the input");
    }

    const adminid = req.adminid;
    if (!adminid) {
      return sendResponse(res, 400, false, "Only admin can create subtopics");
    }

    const topic = await Topic.findById(topic_id);
    if (!topic) sendResponse(res, 400, false, "Topic not found!");

    const payload = {
      title: title,
      description: description,
      topic_id: topic_id,
      summary: summary,
    };
    const newSubTopic = new Subtopic(payload);
    await newSubTopic.save();
    sendResponse(res, 200, true, "Subtopic created successfully", newSubTopic);
  } catch (error) {
    console.log("There is an error while creating the subtopic", error);
    sendResponse(res, 500, false, [error?.message]);
  }
};

const gettingsubtopics = async (req, res) => {};

const deletingsubtopic = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      sendResponse(res, 400, false, "Please provide an id to delete.");
    }

    const subtopic = await Subtopic.findById(id);
    if (!subtopic) {
      return res.status(404).send({
        success: false,
        message: "Cannot found Subtopic",
      });
    }

    if (subtopic.image?.public_id) {
      await cloudinary.uploader.destroy(subtopic.image.public_id);
    }

    await Subtopic.findByIdAndDelete(id);
    sendResponse(res, 200, true, "Subtopic delete successfully.");
  } catch (error) {
    console.log("There is an error while deleting the subtopic");
    sendResponse(res, 500, false, [error?.message]);
  }
};

module.exports = { gettingsubtopics, creatingsubtopic, deletingsubtopic };
