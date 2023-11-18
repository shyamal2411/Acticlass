const { isEmpty, sortBy, cloneDeep } = require("lodash");
const { Roles, ACTIVITY_TYPES } = require("../../../common/constants");
const { ActivitySchema, UserSchema } = require("../../../database");
const moment = require("moment");

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
    .populate("triggerFor")
    .then(async (activities) => {
      if (!activities || isEmpty(activities)) {
        return res.status(200).json({ activities: [] });
      }
      let result = sortBy(activities);

      if (user.role == Roles.TEACHER) {
        let filterdData = [];
        let userIds = [];
        for (const activity of result) {
          if (activity.triggerFor) {
            let uid = activity.triggerFor.triggerBy.toString();
            userIds.push(uid);
          }
          filterdData.push(cloneDeep(activity));
        }

        UserSchema.find({ _id: { $in: userIds } })
          .then((users) => {
            if (!users) {
              return res.status(200).json({ activities: filterdData });
            }
            let results = [];
            for (let activity of filterdData) {
              for (let user of users) {
                if (activity.triggerFor) {
                  activity.triggerFor.triggerBy = user;
                }
              }
            }

            return res.status(200).json({ activities: filterdData });
          })
          .catch((err) => {
            console.error("Error getActivities: ", err);
            return res.status(500).json({ msg: "Something went wrong." });
          });
      } else {
        result = result.filter((activity) => {
          return (
            activity.triggerBy.equals(user._id) ||
            activity.triggerFor?.triggerBy.equals(user._id)
          );
        });
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
