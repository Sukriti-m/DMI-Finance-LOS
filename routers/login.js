require("dotenv").config();
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = new express.Router();


/**
 * @swagger
 * tags:
 *   name: Login
 *   description: User login APIs
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aadharNum:
 *                 type: number
 *                 example: 987654321098
 *               password:
 *                 type: string
 *                 example: "SecurePass456"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *       401:
 *         description: User not registered or wrong password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User not registered"
 *       400:
 *         description: Validation error
 */



// login route
router.post("/", async (req, res) => {
  try { await new Promise(resolve => setTimeout(resolve, process.env.DELAY_SEC));

    const { password, aadharNum } = req.body;

    const userCheck = await User.findOne({ aadharNum: aadharNum });
    if (!userCheck) {
      return res.status(401).send({ msg: "User not registered" });
    }

    const matchPassword = await bcrypt.compare(
      password,
      userCheck.password
    );

    // const payload = { _id: userCheck._id };
    // const cookie_token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY);
    // //add cookie
    // res.cookie("jwt_csi", cookie_token, {
    //   secure: true,
    //   expires: new Date(Date.now() + 10800),
    //   httpOnly: false,
    // });

    if (!matchPassword) {
      return res.status(401).send({ msg: "Wrong Password" });
    }
    res.status(200).send({
      message: "User logged in successfully"
    });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

module.exports = router;