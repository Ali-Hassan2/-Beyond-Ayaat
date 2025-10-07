const express = require("express")
const blogsValidation = require("../Validations/blogs.schema")
const sendResponse = require("../Utils/send-response")
const blogsSchema = require("../Models/blogs-model")
const commentsValidation = require("../Validations/comment.schema")
const commentSchema = require("../Models/comment-model")
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
  try {
    const { id } = req.userid
    console.log("The userIIDDDD is:", id)
    if (!id) {
      return sendResponse(
        res,
        400,
        false,
        "Only Authenticated User can write Blog."
      )
    }
    const draftBlod = new blogsSchema({
      user_id: id,
      title: "",
      content: "",
      createdAt: "",
      topic_id: req.body.topic_id || null,
      subtopicId: req.body.subtopicId || null,
      status: "draft",
    })
    await draftBlod.save()
    return sendResponse(res, 200, true, "Your Blog saved in Drafts", draftBlod)
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
    const image = req.files.image
    if (!req.files || Object.keys(req.files).length === 0) {
      return sendResponse(res, 400, false, "Sorry no images found")
    }
    const allowed_formats = ["image/png", "image/jpeg"]
    if (!allowed_formats.includes(image.mimetype)) {
      return sendResponse(res, 400, false, "Sorry this format is not al")
    }
    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath)
    if (!uploadResult || uploadResult.error) {
      return sendResponse(res, 400, false, "Sorry cannot upload image,")
    }
    let updatedData = { ...req.body }
    let updateddData = {
      ...updatedData,
      ...parseResult.data,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.url,
      },
    }
    const completed_Blog = await blogsSchema
      .findByIdAndUpdate(blog_id, updateddData, { new: true })
      .populate("user_id", "first_name last_name")
      .populate("topic_id", "title description")
      .populate("subtopic_id", "title description")
      .populate("comments.user_id", "first_name last_name")
    if (!completed_Blog) {
      return sendResponse(res, 400, false, "No Blog found.")
    }
    const formattedBlogData = {
      _id: completed_Blog._id,
      title: completed_Blog.title,
      content: completed_Blog.content,
      image: completed_Blog.image,
      status: completed_Blog.status,
      user: {
        _id: completed_Blog.user_id._id,
        first_name: completed_Blog.user_id?.first_name,
        last_name: completed_Blog.user_id?.last_name,
      },
      topic: completed_Blog.topic_id
        ? {
            _id: completed_Blog.topic_id._id,
            name: completed_Blog.topic_id?.title,
            description: completed_Blog.topic_id?.description,
            subtopic: completed_Blog.subtopic_id
              ? {
                  _id: completed_Blog.subtopic_id._id,
                  name: completed_Blog.subtopic_id?.title,
                  description: completed_Blog.subtopic_id?.description,
                }
              : null,
          }
        : null,
      comments: completed_Blog.comments.map((cmt) => ({
        _id: cmt._id,
        content: cmt.content,
        createdAt: cmt.createdAt,
        user: {
          id: cmt.user_id.id,
          first_name: cmt.user_id?.first_name,
          last_name: cmt.user_id?.last_name,
        },
      })),
    }
    return sendResponse(
      res,
      200,
      true,
      "Blog Completed Successfully",
      formattedBlogData
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

const giveComment = async (req, res) => {
  const parseResult = commentsValidation.safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the input",
      parseResult.error.issues.map((err) => err?.message)
    )
  }
  try {
    const { blog_id } = req.query
    const { content, createdAt } = parseResult.data
    const { id } = req.userid
    if (!id) {
      return sendResponse(
        res,
        400,
        false,
        "You need to login to the system to give a comment."
      )
    }
    const finded_blog = await blogsSchema
      .findById(blog_id)
      .populate("user_id", "first_name last_name")
    if (!finded_blog) {
      return sendResponse(res, 400, false, "No blog found.")
    }
    finded_blog.comments.push({ user_id: id, content, createdAt })
    await finded_blog.save()
    const lastComment = finded_blog.comments[finded_blog.comments.length - 1]
    const formatted_Comment = {
      _id: lastComment._id,
      content: lastComment.content,
      createdAt: lastComment.createdAt,
      User: {
        _id: finded_blog.user_id?._id,
        first_name: finded_blog.user_id?.first_name,
        last_name: finded_blog.user_id?.last_name,
      },
    }

    return sendResponse(res, 200, true, "Comment Added.", formatted_Comment)
  } catch (error) {
    console.log("There is an error while writing comment", error)
    return sendResponse(res, 500, false, "There is an issue", [error?.message])
  }
}

const getRandomBlogs = async (req, res) => {
  try {
    const { limit = 5 } = req.query

    // applying aggregation
    const blogs = await blogsSchema
      .find({ status: "published" })
      .populate("user_id", "first_name last_name")
      .populate("topic_id", "title description")
      .populate("subtopic_id", "title description")
      .populate("comments.user_id", "first_name last_name")
      .limit(Number(limit))
      .sort({ $natural: -1 })

    const formattedBlogData = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      status: blog.status,
      user: blog.user_id
        ? {
            _id: blog.user_id._id,
            first_name: blog.user_id.first_name,
            last_name: blog.user_id.last_name,
          }
        : null,
      topic: blog.topic_id
        ? {
            _id: blog.topic_id._id,
            title: blog.topic_id.title,
            description: blog.topic_id.description,
            subtopic: blog.subtopic_id
              ? {
                  _id: blog.subtopic_id._id,
                  title: blog.subtopic_id.title,
                  description: blog.subtopic_id.description,
                }
              : null,
          }
        : null,
      comments:
        blog.comments?.map((cmt) => ({
          _id: cmt._id,
          content: cmt.content,
          createdAt: cmt.createdAt,
          user: cmt.user_id
            ? {
                _id: cmt.user_id._id,
                first_name: cmt.user_id.first_name,
                last_name: cmt.user_id.last_name,
              }
            : null,
        })) || [],
    }))
    return sendResponse(
      res,
      200,
      true,
      "Blogs Reterived Successfully",
      formattedBlogData
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Internal Server error", [
      error?.message,
    ])
  }
}

const editBlog = async (req, res) => {
  const parseResult = blogsValidation.partial().safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate your input",
      parseResult.error.issues.map((err) => err?.message)
    )
  }
  try {
    const updating_data = { ...parseResult.data, status: "published" }
    console.log("The data we got is:", updating_data)
    const { blog_id } = req.query
    const isExist = await blogsSchema.findById(blog_id)
    if (!isExist) {
      return sendResponse(res, 400, false, "No blog found with this id.")
    }
    const target = await blogsSchema.findByIdAndUpdate(blog_id, updating_data, {
      new: true,
    })
    return sendResponse(res, 200, true, "Blog updated successfully.")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "There is an error", [error?.issue])
  }
}

const removeBlog = async (req, res) => {
  const { blog_id } = req.query
  if (!blog_id) {
    return sendResponse(res, 400, false, "Please provide blog id")
  }
  try {
    const isdeleted = await blogsSchema.findByIdAndDelete(blog_id)
    if (!isdeleted) {
      return sendResponse(res, 400, false, "No Blog found with this id.")
    }
    return sendResponse(res, 200, true, "Blog deleted successfully.")
  } catch (error) {
    console.log("There is an error ", error)
    return sendResponse(res, 500, false, "Internal Server Error", [
      error?.message,
    ])
  }
}

const deleteComment = async (req, res) => {
  const { comment_id, blog_id } = req.query
  if (!comment_id || !blog_id) {
    return sendResponse(res, 400, false, "Please provide comment id.")
  }
  try {
    const updatedBlog = await blogsSchema.findByIdAndUpdate(
      blog_id,
      { $pull: { comments: { _id: comment_id } } },
      { new: true }
    )
    if (!updatedBlog) {
      return sendResponse(res, 400, false, "Blog or comment not found")
    }
    return sendResponse(
      res,
      200,
      true,
      "Comment deleted successfully",
      updatedBlog
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Internal Servere error", [
      error?.message,
    ])
  }
}

const getsingleblog = async (req, res) => {
  const { blog_id } = req.query

  if (!blog_id) {
    return sendResponse(res, 400, false, "No Blog id provided")
  }
  try {
    const isBlogExist = await blogsSchema
      .findById(blog_id)
      .populate("user_id", "first_name last_name")
      .populate("topic_id", "title description")
      .populate("subtopic_id", "title description")
      .populate("comments.user_id", "first_name last_name")

    if (!isBlogExist) {
      return sendResponse(res, 400, false, "Sorry cannot find the blog.")
    }
    console.log("Kya horha hai ")
    const formattedBlogData = {
      _id: isBlogExist._id,
      title: isBlogExist.title,
      content: isBlogExist.content,
      image: isBlogExist.image,
      status: isBlogExist.status,
      user: isBlogExist.user_id
        ? {
            _id: isBlogExist.user_id._id,
            first_name: isBlogExist.user_id.first_name,
            last_name: isBlogExist.user_id.last_name,
          }
        : null,
      topic: isBlogExist.topic_id
        ? {
            _id: isBlogExist.topic_id._id,
            title: isBlogExist.topic_id.title,
            description: isBlogExist.topic_id.description,
            subtopic: isBlogExist.subtopic_id
              ? {
                  _id: isBlogExist.subtopic_id._id,
                  title: isBlogExist.subtopic_id.title,
                  description: isBlogExist.subtopic_id.description,
                }
              : null,
          }
        : null,
      comments:
        isBlogExist.comments?.map((cmt) => ({
          _id: cmt._id,
          content: cmt.content,
          createdAt: cmt.createdAt,
          user: cmt.user_id
            ? {
                _id: cmt.user_id._id,
                first_name: cmt.user_id.first_name,
                last_name: cmt.user_id.last_name,
              }
            : null,
        })) || [],
    }
    return sendResponse(
      res,
      200,
      true,
      "Blog data reterived",
      formattedBlogData
    )
  } catch (error) {}
}

module.exports = {
  writeDraftBlog,
  completeBlog,
  publishBlog,
  giveComment,
  getRandomBlogs,
  editBlog,
  removeBlog,
  deleteComment,
  getsingleblog,
}
