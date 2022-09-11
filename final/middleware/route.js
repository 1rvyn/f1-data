// Routes
const { adminAuth } = require("../middleware/auth")
// Update User (Requires Admin Authentication)
router.route("/update").put(adminAuth, update)
// Delete User (Requires Admin Authentication)
router.route("/deleteUser").delete(adminAuth, deleteUser)
