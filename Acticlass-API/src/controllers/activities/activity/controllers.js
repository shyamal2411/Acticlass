const { isEmpty, sortBy, cloneDeep } = require("lodash");
const { Roles, ACTIVITY_TYPES } = require("../../../common/constants");
const { ActivitySchema, UserSchema } = require("../../../database");
const moment = require("moment");
const activity = require("../../../database/schema/activity");

const parseActivity = (activity) => {
  return {
    type: activity.type,
    triggerFor: activity.triggerFor,
    triggerBy: activity.triggerBy,
    timestamp: activity.timestamp,
    points: activity.points
  }
}


const getActivities = async (req, res) => {
  const user = req.user;
  let { groupId, startDate, endDate } = req.body;

  if (!groupId || isEmpty(groupId)) {
    return res.status(400).json({ msg: "Group id is required." });
  }

  if (!startDate || !endDate)
    return res
      .status(400)
      .json({ message: "Start date and end date must be provided" });

  startDate = moment(startDate).startOf("day").toDate();
  endDate = moment(endDate).endOf("day").toDate();
  if (startDate > endDate) {
    return res
      .status(400)
      .json({ message: "Start date must be before end date" });
  }

  ActivitySchema.find({
    group: groupId,
    timestamp: {
      $gte: startDate,
      $lte: endDate,
    },
    type: {
      $in: [
        ACTIVITY_TYPES.REQUEST_ACCEPTED,
        ACTIVITY_TYPES.REQUEST_REJECTED,
        ACTIVITY_TYPES.ATTENDANCE,
      ],
    },
  })
    .populate({
      path: "triggerFor",
      populate: {
        path: "triggerBy",
        select: "name email",
      },
      select: "type timestamp points triggerBy",
    })
    .populate({
      path: "triggerBy",
      select: "name email",
    })
    .then(async (activities) => {
      if (!activities || isEmpty(activities)) {
        return res.status(200).json({ activities: [] });
      }
      let result = sortBy(activities);

      if (user.role == Roles.TEACHER) {
        let filteredData = [];
        for (const activity of result) {
          filteredData.push(parseActivity(activity));
        }
        return res.status(200).json({ activities: filteredData });
      } else {
        result = result.filter((activity) => {
          return (
            activity.triggerBy._id.equals(user._id) ||
            activity.triggerFor?.triggerBy._id.equals(user._id)
          );
        });
        result = result.map((activity) => parseActivity(activity));
        return res.status(200).json({ activities: result });
      }
    })
    .catch((err) => {
      console.error("Error getActivities: ", err);
      return res.status(500).json({ msg: "Something went wrong." });
    });
};

module.exports = {
  getActivities,
};
