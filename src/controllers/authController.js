const {
  registration,
  login,
  addUserWish,
  addUserSantaFor,
  getUserWish,
} = require("../services/authService");

const registrationController = async (req, res) => {
  const { name, email, password } = req.body;
  const token = await registration(name, email, password);

  res.json({ status: "success", token, user: { name, email } });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const token = await login(email, password);

  res.json({ token });
};

const addUserWishController = async (req, res) => {
  const { wish } = req.body;
  const { _id } = req.user;

  const user = await addUserWish(_id, wish);

  res.json({ status: "Wish add successfully", user });
};

const addUserSantaForController = async (req, res) => {
  const { _id } = req.user;

  const santaFor = await addUserSantaFor(_id);

  res.json({ status: "Secret santa asign", santaFor });
};

const getUserWishController = async (req, res) => {
  const { _id } = req.user;

  const userWish = await getUserWish(_id);
  if (userWish) res.json({ status: "success", userWish });
  else res.json({ status: "user wish is empty" });
};

module.exports = {
  registrationController,
  loginController,
  addUserWishController,
  addUserSantaForController,
  getUserWishController,
};
