const express = require("express")
const blogsValidation = require("../Validations/blogs.schema")
const sendResponse = require("../Utils/send-response")
const blogsSchema = require("../Models/blogs-model")
const cloudinary = require("cloudinary").v2
// const writeBlog = async (req, res) => {
//   const blogsSafeVal = blogsValidation.safeParse(req.body)
//   if (!blogsSafeVal) {
//     return sendResponse(
//       res,
//       400,
//       false,
//       "Please Validate your input.",
//       null,
//       blogsSafeVal.error.issues.map((err) => err?.message)
//     )
//   }

//   try {
//     const userId = req.body?.userId
//     const subtopicId = req.body?.subtopicId
//     const topicId = req.body?.topicId
//     const createdAt = req.body?.createdAt
//     const title = req.body?.title
//     const content = req.body?.content
//     const image = req.files?.image
//     const status = req.body?.status
//     console.log("The body we got:", {
//       userId,
//       subtopicId,
//       topicId,
//       title,
//       content,
//       createdAt,
//       status,
//     })
//     console.log("The image we got is:", image)
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return sendResponse(res, 400, false, "Sorry no images found.")
//     }
//     const allowed_formats = ["image/png", "image/jpeg"]
//     if (!allowed_formats.includes(image.mimetype)) {
//       return sendResponse(res, 400, false, "No Metho Allowed.")
//     }
//     const uploadResult = cloudinary.uploader.upload(image.tempFilePath)
//     if (!uploadResult || uploadResult.error) {
//       return sendResponse(res, 400, false, "Sorry cannot upload the images.")
//     }
//     if (
//       !userId ||
//       !subtopicId ||
//       !topicId ||
//       !title ||
//       !createdAt ||
//       !content ||
//       !status
//     ) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "Sorry did not receive complete input."
//       )
//     }

//     const alread_Blog = await blogsSchema.findOne({
//       title,
//     })
//     if (alread_Blog) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "A Blog with this title laready exist, Please Choose another title."
//       )
//     }
//     const payload = {
//       title,
//       content,
//       user_id: userId,
//       subtopic_id: subtopicId,
//       topic_id: topicId,
//       created_at: createdAt || new Date(),
//       status,
//       image: {
//         public_id: (await uploadResult).public_id,
//         url: (await uploadResult).url,
//       },
//     }

//     const new_Blogs = new blogsSchema(payload)
//     await new_Blogs.save()
//     sendResponse(res, 200, true, "Blog Written Successfully", new_Blogs)
//   } catch (error) {
//     console.log("There is an error while writing the blog", error)
//     return sendResponse(res, 500, false, [error?.message])
//   }
// }

const writeDraftBlog = async (req, res) => {
  const parseResult = blogsValidation.pick({ userId: true }).safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Complete the input",
      parseResult.error.issues.map((err) => err?.message)
    )
  }

  try {
    const { userId } = req.body
    if (!userId) {
      return sendResponse(res, 400, false, "userId is not given.")
    }
    const draftBlod = new blogsSchema({
      user_id: userId,
      title: "",
      content: "",
      createdAt: "",
      topic_id: req.body.topic_id || null,
      subtopicId: req.body.subtopicId || null,
      status: "draft",
    })
    await draftBlod.save()
    return sendResponse(res, 200, true, "Your Blog saved in Drafts")
  } catch (error) {
    console.log("There is an error while saving the draft blog", error)
    sendResponse(res, 500, false, "Internal Server error", [error?.message])
  }
}

const completeBlog = async (req, res) => {
  const parseResult = blogsValidation.partial().safeParse(req.body)
  if (!parseResult) {
    return sendResponse(
      res,
      400,
      false,
      "Please complete input.",
      parseResult.error.issues.map((err) => err?.message)
    )
  }
  try {
    const { blog_id } = req.query
    const { title, content, topic_id, subtopic_id, createdAt, status } =
      req.body
    const image = req.files.image
    if (!req.files || Object.keys(req.files).length === 0) {
      return sendResponse(res, 400, false, "Sorry no images found")
    }
    const allowed_formats = ["image/png", "image/jpeg"]
    if (!allowed_formats.includes(image.mimetype)) {
      return sendResponse(res, 400, false, "Sorry this format is not al")
    }
    const uploadResult = cloudinary.uploader.upload(image.tempFilePath)
    if (!uploadResult || uploadResult.error) {
      return sendResponse(res, 400, false, "Sorry cannot upload image,")
    }
    let updatedData = { ...req.body }
    let updateddData = { ...updatedData, ...parseResult.data }
    console.log("The updated data we got is:", updatedData)
    updatedData.image = {
      public_id: (await uploadResult).public_id,
      url: (await uploadResult).url,
    }

    const completed_Blog = await blogsSchema.findByIdAndUpdate(
      blog_id,
      updateddData,
      { new: true }
    )
    return sendResponse(
      res,
      200,
      true,
      "Blog Completed Successfully",
      completed_Blog
    )
  } catch (error) {
    console.log("There is an error while completing the blog", error)
    return sendResponse(res, 500, false, "Error while completing the Blog", [
      error?.message,
    ])
  }
}

const publishBlog = async (req, res) => {
  const parseResult = blogsValidation.pick({ status: true }).safeParse(req.body)

  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Invalid Input",
      parseResult.error.issues.map((err) => err?.message)
    )
  }
  try {
    const { blog_id } = req.query
    const { status } = req.body

    if (!blog_id) {
      return sendResponse(res, 400, false, "No Blog id Provided.")
    }
    const updated_Blog = await blogsSchema.findByIdAndUpdate(
      blog_id,
      {
        status,
      },
      { new: true, runValidators: true }
    )

    if (!updated_Blog) {
      return sendResponse(res, 400, false, "No Blog found with this blogId")
    }
    return sendResponse(res, 200, true, "Blog Status Updated to Published.")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "There is an issue", [error?.message])
  }
}

module.exports = { writeDraftBlog, completeBlog, publishBlog }
