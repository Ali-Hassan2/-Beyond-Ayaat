const { reportSchema } = require("../Models/report-model")
const sendResponse = require("../Utils/send-response")
const reportValidation = require("../Validations/report.schema")
const User = require("../Models/user-model")
const { userprofileSchema } = require("../Models/user-profile-model")
const { ATRISKUSERS } = require("../constants/constants")
const makereport = async (req, res) => {
  const parseResult = reportValidation.safeParse(req.body)
  if (!parseResult.success) {
    return sendResponse(
      res,
      400,
      false,
      "Please validate the input.",
      parseResult.error.issues.map((err) => err?.message)
    )
  }

  try {
    const { id: user_id } = req.userid
    console.log("The user id:", user_id)
    if (!user_id) {
      return sendResponse(res, 401, false, "Unauthorized Access.")
    }

    const target_user = req.params.id
    const { reason } = parseResult.data
    console.log("The target is:", target_user)
    console.log("The reason is:", reason)
    const isTargetExist = await User.findById(target_user)
    if (!isTargetExist) {
      return sendResponse(res, 404, false, "Sorry, user not found.")
    }

    const countReports = await reportSchema.countDocuments({ target_user })
    if (countReports >= 2 && countReports < 3) {
      await userprofileSchema.findOneAndUpdate(
        { user_id: target_user },
        { atRiskUsers: ATRISKUSERS.WARNING },
        { new: true }
      )
    } else if (countReports >= 3) {
      await userprofileSchema.findOneAndUpdate(
        { user_id: target_user },
        { atRiskUsers: ATRISKUSERS.DANGER },
        { new: true }
      )
    }

    const new_Report = await reportSchema.create({
      reported_by: user_id,
      reason,
      target_user,
    })

    await User.findByIdAndUpdate(user_id, {
      $push: { reports: new_Report._id },
    })
    await User.findByIdAndUpdate(target_user, {
      $push: { reports: new_Report._id },
    })

    const returning_report = await reportSchema
      .findById(new_Report._id)
      .populate("reported_by", "first_name last_name email")
      .populate("target_user", "first_name last_name email")

    return sendResponse(
      res,
      201,
      true,
      "Report created successfully",
      returning_report
    )
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Internal Server Error", [
      error?.message,
    ])
  }
}

const getallreportsbyme = async (req, res) => {
  const { id: user_id } = req.userid
  if (!user_id) {
    return sendResponse(res, 400, false, "Unauthorized Access.")
  }
  try {
    const Reports = await reportSchema
      .find({ reported_by: user_id })
      .populate("reported_by", "first_name last_name")
      .populate("target_user", "first_name last_name")
      .lean()

    const count = await reportSchema.countDocuments({ reported_by: user_id })
    if (count === 0) {
      return sendResponse(res, 400, false, "No Reports found.")
    }
    const formattedReports = Reports.map((rp) => ({
      _id: rp._id,
      count: count,
      reason: rp.reason,
      reported_by: {
        id: rp.reported_by._id,
        name: `${rp.reported_by?.first_name || ""} ${rp.reported_by?.last_name || ""}`,
      },
      target_user: {
        id: rp.target_user._id,
        name: `${rp.target_user?.first_name || ""} ${rp.target_user.last_name || ""}`,
      },
      createdAt: rp.createdAt,
    }))

    return sendResponse(
      res,
      200,
      true,
      "Reports reterived successfully",
      formattedReports
    )
  } catch (error) {
    console.log("There is an error,", error)
    return sendResponse(res, 500, false, "Internal Server Error", [
      error?.message,
    ])
  }
}

const getallreportsagainstme = async (req, res) => {
  const user_id = req.userid?.id
  if (!user_id) {
    return sendResponse(res, 401, false, "Unauthorized Access.")
  }

  try {
    const Reports = await reportSchema
      .find({ target_user: user_id })
      .populate("reported_by", "first_name last_name email")
      .populate("target_user", "first_name last_name email")
      .lean()

    const count = await reportSchema.countDocuments({ target_user: user_id })

    if (count === 0) {
      return sendResponse(res, 404, false, "No reports found against you.")
    }

    const formattedReports = Reports.map((r) => ({
      id: r._id,
      reason: r.reason,
      reportedBy: {
        id: r.reported_by?._id,
        name: `${r.reported_by?.first_name || ""} ${r.reported_by?.last_name || ""}`.trim(),
        email: r.reported_by?.email,
      },
      targetUser: {
        id: r.target_user?._id,
        name: `${r.target_user?.first_name || ""} ${r.target_user?.last_name || ""}`.trim(),
        email: r.target_user?.email,
      },
      createdAt: r.createdAt,
    }))

    return sendResponse(res, 200, true, "Reports against you retrieved", {
      totalReports: count,
      reports: formattedReports,
    })
  } catch (error) {
    console.log("There is an error", error)
    return sendResponse(res, 500, false, "Internal Server Error.")
  }
}

module.exports = { makereport, getallreportsagainstme, getallreportsbyme }
