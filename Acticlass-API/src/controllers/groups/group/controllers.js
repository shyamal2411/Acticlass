const { isEmpty, isEqual } = require("lodash");
const { Roles, DEFAULT_RADIUS, ATTENDANCE_FREQUENCY } = require("../../../common/constants");
const { GroupSchema, PointBucketSchema, ActivitySchema } = require("../../../database");


const createGroup = async (req, res) => {
    const user = req.user;
    if (user.role !== Roles.TEACHER) {
        return res.status(400).json({ msg: 'Only teachers can create groups.' });
    }

    const { name, institute = user.institute, radius = DEFAULT_RADIUS, passingPoints = 0, attendanceFrequency = 0, attendanceReward = 0, penalty = 0 } = req.body;

    if (!name || isEmpty(name)) {
        return res.status(400).json({ msg: 'Group name is required.' });
    }
    if (!institute || isEmpty(institute)) {
        return res.status(400).json({ msg: 'Institute is required.' });
    }

    const data = { name, institute, radius, passingPoints, attendanceFrequency, attendanceReward, penalty };
    data.createdBy = user._id;

    await GroupSchema(data).save().then((group) => {
        return res.status(201).json({ msg: 'Group created successfully.' });
    }).catch((error) => {
        console.error("Error creating group: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
};

const parseGroupResponse = (group, extraData = {}) => {
    const { _id, name, institute, createdBy, radius, passingPoints, attendanceFrequency, attendanceReward, penalty } = group;
    return { id: _id, name, institute, createdBy, radius, passingPoints, attendanceFrequency, attendanceReward, penalty, ...extraData };
}

const getGroups = async (req, res) => {
    const user = req.user;
    if (user.role === Roles.TEACHER) {
        await GroupSchema.find({ createdBy: user._id })
            .then((groups) => {
                const groupsData = groups.map((group) => {
                    return parseGroupResponse(group);
                });
                return res.status(200).json({ groups: groupsData });
            }).catch((error) => {
                console.error("Error getting groups: ", error);
                return res.status(500).json({ msg: 'Something went wrong.' });
            });
    }
    if (user.role === Roles.STUDENT) {
        await PointBucketSchema.find({ user: user._id, isActive: true }).populate('group')
            .then((pointBuckets) => {
                const groupsData = pointBuckets.map((pointBucket) => {
                    const { group, points } = pointBucket;
                    return parseGroupResponse(group, { points });
                });
                return res.status(200).json({ groups: groupsData });
            }).catch((error) => {
                console.error("Error getting groups: ", error);
                return res.status(500).json({ msg: 'Something went wrong.' });
            });
    }
};

const getGroupById = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    if (user.role === Roles.STUDENT) {
        await PointBucketSchema.findOne({ user: user._id, group: groupId, isActive: true }).populate('group')
            .then((pointBucket) => {
                if (!pointBucket) {
                    return res.status(404).json({ msg: 'Group not found.' });
                }
                const { group, points } = pointBucket;
                return res.status(200).json({ group: { ...parseGroupResponse(group), points } });
            }).catch((error) => {
                console.error("Error getting a group: ", error);
                return res.status(500).json({ msg: 'Something went wrong.' });
            });
    }
    if (user.role === Roles.TEACHER) {
        await GroupSchema.findOne({ _id: groupId, createdBy: user._id })
            .then((group) => {
                if (!group) {
                    return res.status(404).json({ msg: 'Group not found.' });
                }
                return res.status(200).json({ group: parseGroupResponse(group) });
            }).catch((error) => {
                console.error("Error getting a group: ", error);
                return res.status(500).json({ msg: 'Something went wrong.' });
            });
    }
}

const updateGroupById = async (req, res) => {
    const user = req.user;
    if (user.role !== Roles.TEACHER) {
        return res.status(400).json({ msg: 'Only teachers can update groups.' });
    }
    const groupId = req.params.id;
    const { name, institute, radius, passingPoints, attendanceFrequency, attendanceReward, penalty } = req.body;
    let msg = '';
    if (!groupId || isEmpty(groupId)) {
        msg = 'Group id is required.';
    } else if (name && isEmpty(name)) {
        msg = 'Group name is required.';
    } else if (institute && isEmpty(institute)) {
        msg = 'Institute is required.';
    } else if (radius && (isNaN(radius) || radius < DEFAULT_RADIUS)) {
        msg = 'Group radius should be positive number and greater than ' + DEFAULT_RADIUS;
    } else if (passingPoints && (isNaN(passingPoints) || passingPoints <= 0)) {
        msg = 'Passing points should be positive number';
    } else if (attendanceFrequency && (isNaN(attendanceFrequency) || !ATTENDANCE_FREQUENCY.includes(attendanceFrequency))) {
        msg = 'Attendance frequency should be one of ' + ATTENDANCE_FREQUENCY;
    } else if (attendanceReward && (isNaN(attendanceReward) || attendanceReward <= 0)) {
        msg = 'Attendance reward should be positive number';
    } else if (penalty && (isNaN(penalty) || penalty <= 0)) {
        msg = 'Penalty should be positive number';
    }
    if (msg) {
        return res.status(400).json({ msg });
    }
    await GroupSchema.findOne({ _id: groupId })
        .then(async (group) => {
            if (!group) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            if (!isEqual(group.createdBy._id, user._id)) {
                return res.status(400).json({ msg: 'Only group creator can update the group.' });
            }
            if (name) {
                group.name = name;
            }
            if (institute) {
                group.institute = institute;
            }
            if (radius) {
                group.radius = radius;
            }
            if (passingPoints) {
                group.passingPoints = passingPoints;
            }
            if (attendanceFrequency) {
                group.attendanceFrequency = attendanceFrequency;
            }
            if (attendanceReward) {
                group.attendanceReward = attendanceReward;
            }
            if (penalty) {
                group.penalty = penalty;
            }
            await group.save().then(() => {
                return res.status(200).json({ msg: 'Group updated successfully.', group });
            }).catch((error) => {
                console.error("Error updating group: ", error);
                return res.status(500).json({ msg: 'Something went wrong.' });
            });
        }).catch((error) => {
            console.error("Error updating a group: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
};

const deleteGroupById = async (req, res) => {
    const user = req.user;
    if (user.role !== Roles.TEACHER) {
        return res.status(400).json({ msg: 'Only teachers can delete groups.' });
    }
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    await GroupSchema.findOne({ _id: groupId }).then(async (group) => {
        if (!group) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        if (!isEqual(group.createdBy._id, user._id)) {
            return res.status(400).json({ msg: 'Only group creator can delete the group.' });
        }
        await GroupSchema.deleteOne({ _id: groupId }).then(() => {
            return res.status(200).json({ msg: 'Group deleted successfully.' });
        }).catch((error) => {
            console.error("Error deleting group: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
    }).catch((error) => {
        console.error("Error deleting a group: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
}

const joinGroupById = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (user.role !== Roles.STUDENT) {
        return res.status(400).json({ msg: 'Only students can join groups.' });
    }

    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }

    await PointBucketSchema.findOne({ user: user._id, group: groupId }).populate('group').
        then(async (pointBucket) => {
            if (pointBucket && !pointBucket.group) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            if (pointBucket && pointBucket.isActive) {
                return res.status(400).json({ msg: 'User already joined the group.' });
            }
            if (pointBucket && !pointBucket.isActive) {
                pointBucket.isActive = true;
                await pointBucket.save().then(() => {
                    return res.status(200).json({ msg: 'User joined successfully.' });
                }).catch((error) => {
                    console.error("Error joining group: ", error);
                    return res.status(500).json({ msg: 'Something went wrong.' });
                });
            }
            if (!pointBucket) {
                await GroupSchema.findOne({ _id: groupId }).then(async (group) => {
                    if (!group) {
                        return res.status(404).json({ msg: 'Group not found.' });
                    }
                    await PointBucketSchema({ user: user._id, group: groupId }).save().then(() => {
                        return res.status(200).json({ msg: 'User joined successfully.' });
                    }).catch((error) => {
                        console.error("Error joining group: ", error);
                        return res.status(500).json({ msg: 'Something went wrong.' });
                    });
                }).catch((error) => {
                    console.error("Error joining a group: ", error);
                    return res.status(500).json({ msg: 'Something went wrong.' });
                });

            }
        }).catch((error) => {
            console.error("Error joining a group: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
}

const leaveGroupById = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    if (user.role === Roles.TEACHER) {
        return res.status(400).json({ msg: 'Teachers cannot leave groups.' });
    }

    await PointBucketSchema.findOne({ user: user._id, group: groupId }).then(async (pointBucket) => {
        if (!pointBucket) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        if (!pointBucket.isActive) {
            return res.status(400).json({ msg: 'User already left the group.' });
        }
        pointBucket.isActive = false;
        await pointBucket.save().then(() => {
            return res.status(200).json({ msg: 'User left successfully.' });
        }).catch((error) => {
            console.error("Error leaving group: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
    }).catch((error) => {
        console.error("Error leaving a group: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
}

const kickUserById = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    const { userId } = req.body;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    if (!userId || isEmpty(userId)) {
        return res.status(400).json({ msg: 'User id is required.' });
    }
    if (user.role !== Roles.TEACHER) {
        return res.status(400).json({ msg: 'Only teachers can kick users.' });
    }

    await PointBucketSchema.deleteOne({ user: userId, group: groupId }).then(() => {
        return res.status(200).json({ msg: 'User kicked successfully.' });
    }).catch((error) => {
        console.error("Error kicking user: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
}

const getGroupMembers = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }

    await PointBucketSchema.find({ group: groupId, isActive: true }).populate('user').then((pointBuckets) => {
        const members = pointBuckets.map((pointBucket) => {
            const { user, points } = pointBucket;
            const { _id, name, email, role, institute } = user;
            return { id: _id, name, email, role, institute, points };
        });
        return res.status(200).json({ members });
    }).catch((error) => {
        console.error("Error getting group members: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
}

const getMemberDetails = async (req, res) => {
    const { activityId } = req.body;
    if (!activityId || isEmpty(activityId)) {
        return res.status(400).json({ msg: 'Activity id is required.' });
    }
    await ActivitySchema.findOne({ _id: activityId }).then(async (activity) => {
        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found.' });
        }

        await PointBucketSchema.findOne({ user: activity.triggerBy, group: activity.group }).populate('user').then((pointBucket) => {
            if (!pointBucket) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            const { user, points } = pointBucket;
            const { _id, name, email, role, institute } = user;
            return res.status(200).json({ id: _id, name, email, role, institute, points });
        }).catch((error) => {
            console.error("Error getting group member details: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });

    }).catch((error) => {
        console.error("Error getting member details: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
}

// Export the controller functions
module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    getGroupMembers,
    updateGroupById,
    deleteGroupById,
    joinGroupById,
    leaveGroupById,
    getMemberDetails,
    kickUserById
};
