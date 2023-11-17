const { isEmpty } = require("lodash");
const { Roles, ACTIVITY_TYPES } = require("../../../common/constants");
const { ActivitySchema } = require("../../../database");

const getActivities = async (req, res) => {
  const user = req.user;
  const date = req.params.date ? req.params.date : new Date();
  const startDateTime = new Date(date);
  startDateTime.setHours(0, 0, 0, 0);
  const endDateTime = new Date(date);
  endDateTime.setHours(23, 59, 59, 999);

  if (user.role === Roles.TEACHER) {
    const response = await ActivitySchema.find({
      timestamp: { $gte: startDateTime, $lte: endDateTime },
    })
      .populate("triggerBy")
      .populate("triggerFor");
    res.status(200).json({ response });
  } else if (user.role === Roles.STUDENT) {
    await ActivitySchema.find({
      timestamp: { $gte: startDateTime, $lte: endDateTime },
    })
      .populate("triggerBy")
      .populate("triggerFor")
      .populate("group")
      .then((activities) => {
        const response = activities.filter((activity) => {
          return (
            activity.triggerBy._id.equals(user._id) ||
            (activity.triggerBy._id.equals(activity.group.createdBy) &&
              activity?.triggerFor?.triggerBy.equals(user._id)) ||
            (activity.triggerBy._id.equals(activity.group.createdBy) &&
              [
                ACTIVITY_TYPES.SESSION_ENDED,
                ACTIVITY_TYPES.SESSION_STARTED,
              ].includes(activity.type))
          );
        });
        return res.status(200).json({ response });
      });
  }
};

const getActivitiesByGroupAndRange = async (req, res) => {
  const user = req.user;
  const { groupId, startDate, endDate } = req.params;
  if (startDate > endDate)
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  if (!startDate || !endDate)
    return res
      .status(400)
      .json({ message: "Start date and end date must be provided" });
  if (!groupId || isEmpty(groupId)) {
    return res.status(400).json({ msg: "Group id is required." });
  }
  let start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  let end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  if (user.role === Roles.STUDENT) {
    console.log("dadadad", user._id);
    const activities = await ActivitySchema.find({
      group: groupId,
      timestamp: {
        $gte: start,
        $lte: end,
      },
      triggerBy: user._id,
    })
      .populate("triggerBy")
      .populate("triggerFor")
      .populate("group")
      .then((activities) => {
        const response = activities.filter((activity) => {
          return (
            activity.triggerBy._id.equals(user._id) ||
            (activity.triggerBy._id.equals(activity.group.createdBy) &&
              activity?.triggerFor?.triggerBy.equals(user._id)) ||
            (activity.triggerBy._id.equals(activity.group.createdBy) &&
              [
                ACTIVITY_TYPES.SESSION_ENDED,
                ACTIVITY_TYPES.SESSION_STARTED,
              ].includes(activity.type))
          );
        });
        return res.status(200).json({ response });
      });
  } else if (user.role === Roles.TEACHER) {
    const response = await ActivitySchema.find({
      group: groupId,
      timestamp: {
        $gte: start,
        $lte: end,
      },
    })
      .populate("triggerBy")
      .populate("triggerFor");
    res.status(200).json({ response });
  }
};

module.exports = {
  getActivities,
  getActivitiesByGroupAndRange,
};
