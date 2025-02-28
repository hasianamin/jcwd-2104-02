require('../../../config/config.js');
const express = require('express');
const router = express.Router();
const { isFieldEmpties } = require('../../helpers');
const { hash } = require('../../lib/bcryptjs');
const { createToken, verifyToken } = require('../../lib/token');
const { users } = require('../../../models');
const { sendMail, sendResetPasswordMail } = require('../../lib/nodemailer');
const { Op } = require('sequelize');

const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const emptyFields = isFieldEmpties({
      name,
      email,
      password,
      phoneNumber,
    });
    if (emptyFields.length) {
      throw {
        code: 400,
        message: `Please enter correctly your :  ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

    const checkUser = await users.findOne({ where: { email } });
    if (checkUser) {
      if (checkUser.email == email) {
        throw {
          code: 400,
          message: 'Email already exist',
        };
      }
    }

    const checkedUser = await users.findOne({ where: { phoneNumber } });
    if (checkedUser) {
      if (checkedUser.phoneNumber == phoneNumber) {
        throw {
          code: 400,
          message: 'Phone Number already exist',
        };
      }
    }

    // hash password
    const encryptedPassword = hash(password);

    // create user
    const newUser = await users.create({
      name: name,
      email: email,
      avatar: '/public/profile-pict.png',
      password: encryptedPassword,
      phoneNumber: phoneNumber,
    });

    const userId = newUser.dataValues.user_id;

    const token = createToken({ user_id: newUser.dataValues.user_id });

    await users.update({ user_token: token }, { where: { user_id: userId } });

    await sendMail({ email, token });

    res.send({
      status: 'success',
      message: 'succsess create user and send verification',
      data: {
        result: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function sendResetPasswordMailController(req, res, next) {
  try {
    const { email } = req.body;

    const token = createToken({ email });

    sendResetPasswordMail({ email, token });

    res.send({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;

    const verifiedToken = verifyToken(token);

    const { email } = verifiedToken;

    const user = await users.findOne({ where: { email } });

    await user.update({ password: req.body.newPassword });

    const resUpdatePassword = await user.save();

    res.send({
      status: 'success',
      detail: resUpdatePassword,
    });
  } catch (error) {
    next(error);
  }
}

router.post('/sendResetPasswordMail', sendResetPasswordMailController);
router.post('/resetPassword/:token', resetPassword);
router.post('/register', registerUserController);

module.exports = router;
