const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../db/userModel");
const { NotAuthorizedError } = require("../helpers/errors");

const registration = async (name, email, password) => {
  const user = new User({ name, email, password });
  await user.save();

  const token = jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET
  );

  return token;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotAuthorizedError(`No user with email: '${email}'  found`);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorizedError(`Wrong password`);
  }

  const token = jwt.sign(
    {
      _id: user._id,
      createdAt: user.createdAt,
    },
    process.env.JWT_SECRET
  );

  return token;
};

const addUserWish = async (id, wish) => {
  const editedUser = await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: { wish },
    },
    { new: true, omitUndefined: true }
  );
  return editedUser;
};

function randomNumber(min, max) {
  if (!max) {
    max = min;
    min = 0;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

const addUserSantaFor = async (id) => {
  const currentUser = await User.findById(id);
  let users = await User.find({});

  let arrOfNames = [];
  users.forEach((user) => {
    users.forEach((element) => {
      if (user.santaFor === element.name) {
        arrOfNames.push(element.name);
      }
    });
  });
  users = users.filter(
    (user) => !arrOfNames.includes(user.name) && user.name !== currentUser.name
  );

  const randomUser = users[randomNumber(0, users.length - 1)];
  const santaFor = randomUser.name;

  await User.findByIdAndUpdate(id, {
    $set: { santaFor },
  });
  return santaFor;
};

const getUserWish = async (id) => {
  const currentUser = await User.findById(id);
  if (currentUser.santaFor) {
    const santaForUser = await User.findOne({ name: currentUser.santaFor });
    return santaForUser.wish;
  }
};

module.exports = {
  registration,
  login,
  addUserWish,
  addUserSantaFor,
  getUserWish,
};
