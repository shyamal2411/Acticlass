const express = require('express');
const router = express.Router();
const controller = require('./controllers');

// Group routes
router.post('/create', controller.createGroup);
router.get('/get-all', controller.getGroups);
router.get('/get/:id', controller.getGroupById);
router.get('/get-members/:id', controller.getGroupMembers);
router.post('/update/:id', controller.updateGroupById);
router.delete('/delete/:id', controller.deleteGroupById);
router.post('/join/:id', controller.joinGroupById);
router.post('/leave/:id', controller.leaveGroupById);
router.post('/kick/:id', controller.kickUserById);
router.post('/get-member-details', controller.getMemberDetails);

module.exports = router;