const { userprofileSchema } = require("../Models/user-profile-model")
const sendResponse = require("../helpers/send-response")
const userProfileValidation = require("../Validations/user-profile.schema")
const User = require("../Models/user-model")

const customizeProfile = async (req, res) => {
  const parseResult = userProfileValidation.safeParse(req.body)
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
    const { id } = req.userid
    console.log("The user id we got is:", id)

    if (!id) {
      return sendResponse(res, 400, false, "Please login first.")
    }

    const profileData = parseResult.data
    console.log("The data we got is:", profileData)

    const isExist = await User.findById(id)
    if (!isExist) {
      return sendResponse(res, 400, false, "No user found with this id.")
    }

    const payload = {
      bio: profileData.bio,
      location: profileData.location,
      contactNumber: profileData.contactNumber,
      profession: profileData.profession,
      education: profileData.education,
      status: profileData.status,
      socialMediaLinks: profileData.socialMediaLinks,
    }

    const newProfile = new userprofileSchema({
      user_id: id,
      ...payload,
    })

    await newProfile.save()
    return sendResponse(res, 200, true, "Profile established Successfully.")
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Internal Server Error", [
      error?.message,
    ])
  }
}

const getUserProfile = async (req, res) => {
  const { id: user_id } = req.userid
  if (!user_id) {
    return sendResponse(res, 400, false, "You need to login.")
  }

  try {
    const isUser = await User.findById(user_id)
    if (!isUser) {
      return sendResponse(res, 400, false, "No User found.")
    }
    const userProfileDetails = await userprofileSchema
      .findOne({ user_id })
      .populate("user_id", "first_name last_name")
    const result = userProfileDetails.toObject()
    if (result.socialMediaLinks instanceof Map) {
      result.socialMediaLinks = Object.fromEntries(result.socialMediaLinks)
    }

    return sendResponse(res, 200, true, "User Profile Reterived", result)
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "There is an Error", [error?.message])
  }
}

const updateTheProfile = async (req, res) => {
  try {
    const { id } = req.params
    const { id: user_id } = req.userid
    if (!id) {
      return sendResponse(res, 400, false, "Please provide the profile ID.")
    }
    if (!user_id) {
      return sendResponse(
        res,
        403,
        false,
        "Only a logged-in user can do this operation."
      )
    }
    const {
      bio,
      location,
      contactNumber,
      status,
      profession,
      education,
      socialMediaLinks,
    } = req.body
    const existingProfile = await userprofileSchema.findById(id)
    if (!existingProfile) {
      return sendResponse(res, 404, false, "User profile not found.")
    }
    const isSameData =
      existingProfile.bio === bio &&
      existingProfile.location === location &&
      existingProfile.contactNumber === contactNumber &&
      existingProfile.education === education &&
      existingProfile.profession === profession &&
      existingProfile.status === status &&
      JSON.stringify(existingProfile.socialMediaLinks) ===
        JSON.stringify(socialMediaLinks)
    if (isSameData) {
      return sendResponse(
        res,
        400,
        false,
        "No changes detected. Please update something."
      )
    }
    const payload = {
      bio,
      location,
      contactNumber,
      education,
      profession,
      status,
      socialMediaLinks,
    }
    const updatedProfile = await userprofileSchema.findByIdAndUpdate(
      id,
      payload,
      { new: true }
    )
    return sendResponse(
      res,
      200,
      true,
      "User profile updated successfully.",
      updatedProfile
    )
  } catch (error) {
    console.error("There is an error", error)
    return sendResponse(res, 500, false, "Internal Server Error", [
      error.message,
    ])
  }
}

module.exports = { customizeProfile, getUserProfile, updateTheProfile }
