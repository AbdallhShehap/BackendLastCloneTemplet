const express = require("express");
const router = express.Router();
const superadmin = require("../Controller/superadmin");

router.post('/signup', superadmin.signup);
router.post('/login', superadmin.login);
router.post('/logout', superadmin.logout);
router.get('/list', superadmin.getAllSuperadmins);
router.put('/update/:id', superadmin.updateSuperadmin);
router.delete('/delete/:id', superadmin.deleteSuperadmin);




module.exports = router;
