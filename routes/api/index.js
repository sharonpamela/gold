const router = require("express").Router();
const usersRoutes = require("./users");

// Users routes
router.use("/users", usersRoutes);

module.exports = router;
