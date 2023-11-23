const express = require("express");
const router = express.Router();
const userRoutes = require("../controllers/users/index.routes");
const groupRoutes = require("../controllers/groups/index.routes");
const activityRoutes = require("../controllers/activities/index.routes");

router.use("/users", userRoutes);
router.use(require("../middleware/index"));
router.use("/groups", groupRoutes);
router.use("/activities", activityRoutes);

module.exports = router;
