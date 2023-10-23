const { isEmpty } = require("lodash");
const { Roles, DEFAULT_RADIUS, ATTENDANCE_FREQUENCY } = require("../../../common/constants");
const { GroupSchema } = require("../../../database");


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
    data.members = [user._id];

    GroupSchema(data).save().then((group) => {
        return res.status(201).json({ msg: 'Group created successfully.' });
    }).catch((error) => {
        console.error("Error creating group: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
};

const getGroups = async (req, res) => {
    const user = req.user;
    GroupSchema.find({ members: user._id })
        .then((groups) => {
            const groupsData = groups.map((group) => {
                const { _id, name, institute, members, createdBy, radius, passingPoints, attendanceFrequency, attendanceReward, penalty } = group;
                return { id: _id, name, institute, members, createdBy, radius, passingPoints, attendanceFrequency, attendanceReward, penalty };
            });
            return res.status(200).json({ groups: groupsData });
        }).catch((error) => {
            console.error("Error getting groups: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
};

const getGroupById = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    GroupSchema.findOne({ _id: groupId, members: user._id })
        .then((group) => {
            if (!group) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            const { _id, name, institute, members, createdBy, radius, passingPoints, attendanceFrequency, attendanceReward, penalty } = group;
            return res.status(200).json({ group: { id: _id, name, institute, members, createdBy, radius, passingPoints, attendanceFrequency, attendanceReward, penalty } });
        }).catch((error) => {
            console.error("Error getting a group: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
};

const updateGroupById = async (req, res) => {
    const user = req.user;
    if (user.role !== Roles.TEACHER) {
        return res.status(400).json({ msg: 'Only teachers can update groups.' });
    }
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    const { name, institute, radius, passingPoints, attendanceFrequency, attendanceReward, penalty } = req.body;
    if (name && isEmpty(name)) {
        return res.status(400).json({ msg: 'Group name should be a string.' });
    }
    if (institute && isEmpty(institute)) {
        return res.status(400).json({ msg: 'Institute should be a string.' });
    }
    if (radius && (isNaN(radius) || radius < DEFAULT_RADIUS)) {
        return res.status(400).json({ msg: 'Group radius should be positive number and greater than ' + DEFAULT_RADIUS });
    }
    if (passingPoints && (isNaN(passingPoints) || passingPoints <= 0)) {
        return res.status(400).json({ msg: 'Passing points should be positive number' });
    }
    if (attendanceFrequency && (isNaN(attendanceFrequency) || !ATTENDANCE_FREQUENCY.includes(attendanceFrequency))) {
        return res.status(400).json({ msg: 'Attendance frequency should be one of ' + ATTENDANCE_FREQUENCY });
    }
    if (attendanceReward && (isNaN(attendanceReward) || attendanceReward <= 0)) {
        return res.status(400).json({ msg: 'Attendance reward should be positive number' });
    }
    if (penalty && (isNaN(penalty) || penalty <= 0)) {
        return res.status(400).json({ msg: 'Penalty should be positive number' });
    }

    GroupSchema.findOne({ _id: groupId, members: user._id })
        .then((group) => {
            if (!group) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            if (!group.createdBy._id.equals(user._id)) {
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
            group.save().then(() => {
                // TODO: Send notification to all members of the group
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
    GroupSchema.findOne({ _id: groupId, members: user._id }).then((group) => {
        if (!group) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        if (!group.createdBy._id.equals(user._id)) {
            return res.status(400).json({ msg: 'Only group creator can delete the group.' });
        }
        GroupSchema.deleteOne({ _id: groupId }).then(() => {
            //TODO: Send notification to all members of the group
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
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    GroupSchema.findOne({ _id: groupId }).then((group) => {
        if (!group) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        group.members.push(user._id);
        group.save().then(() => {
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

const leaveGroupById = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    GroupSchema.findOne({ _id: groupId, members: user._id }).then((group) => {
        if (!group) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        if (group.createdBy._id.equals(user._id)) {
            return res.status(400).json({ msg: 'Group creator cannot leave the group.' });
        }
        group.members = group.members.filter((member) => !member.equals(user._id));
        group.save().then(() => {
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

    GroupSchema.findOne({ _id: groupId, members: user._id }).then((group) => {
        if (!group) {
            return res.status(404).json({ msg: 'Group not found.' });
        }
        if (!group.createdBy._id.equals(user._id)) {
            return res.status(400).json({ msg: 'Only group creator can kick a user.' });
        }
        if (group.createdBy._id.toString() === userId) {
            return res.status(400).json({ msg: 'Group creator cannot kick himself.' });
        }
        group.members = group.members.filter((member) => member.toString() !== userId);
        group.save().then(() => {
            return res.status(200).json({ msg: 'User kicked successfully.' });
        }).catch((error) => {
            console.error("Error kicking user: ", error);
            return res.status(500).json({ msg: 'Something went wrong.' });
        });
    }).catch((error) => {
        console.error("Error kicking a user: ", error);
        return res.status(500).json({ msg: 'Something went wrong.' });
    });
}

const getGroupMembers = async (req, res) => {
    const user = req.user;
    const groupId = req.params.id;
    if (!groupId || isEmpty(groupId)) {
        return res.status(400).json({ msg: 'Group id is required.' });
    }
    GroupSchema.findOne({ _id: groupId, members: user._id }).populate('members')
        .then((group) => {
            if (!group) {
                return res.status(404).json({ msg: 'Group not found.' });
            }
            const members = group.members.map((member) => {
                const { _id, name, email, role, institute } = member;
                return { id: _id, name, email, role, institute };
            });
            return res.status(200).json({ members });
        }).catch((error) => {
            console.error("Error getting group members: ", error);
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
    kickUserById
};
