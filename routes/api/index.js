const router = require("express").Router();
const usersController = require("../../controllers/usersController");
// we're inside /api

// "/api/users"
router.route("/")
  .get(usersController.findAll)
  .post(usersController.create);

router.route("/buy")
  .post(usersController.buyButton);

// "/api/currentUser"
router.get('/currentUser', (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

// "/api/logout"
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Matches with "/api/books/:id"
// router
//   .route("/:id")
//   .get(booksController.findById)
//   .put(booksController.update)
//   .delete(booksController.remove);

module.exports = router;
