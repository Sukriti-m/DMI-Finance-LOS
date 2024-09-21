const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management APIs
 */

/**
 * @swagger
 * /register/:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rajesh Kumar"
 *               email:
 *                 type: string
 *                 example: "rajesh.kumar22@example.com"
 *               aadharNum:
 *                 type: number
 *                 example: 987654321098
 *               mobileNum:
 *                 type: number
 *                 example: 9123456780
 *               panNum:
 *                 type: string
 *                 example: "XYZPQ6789A"
 *               password:
 *                 type: string
 *                 example: "SecurePass456"
 *               gender:
 *                 type: string
 *                 example: "Male"
 *               salary:
 *                 type: number
 *                 example: 550000
 *               address:
 *                 type: string
 *                 example: "45 Sector 12, Noida, Uttar Pradesh, India"
 *               isKyc:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: User Successfully Registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Successfully Registered"
 *                 id:
 *                   type: string
 *                   example: "66eeaa61a06e295739cd6297"
 *       406:
 *         description: User already exists
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /register/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   aadharNum:
 *                     type: number
 *                   mobileNum:
 *                     type: number
 *                   panNum:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   salary:
 *                     type: number
 *                   address:
 *                     type: string
 *       400:
 *         description: Error fetching users
 */

/**
 * @swagger
 * /register/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: User not found
 */

/**
 * @swagger
 * /register/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted
 *       400:
 *         description: This user id doesn't exist
 */

/**
 * @swagger
 * /register/user/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [User]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Account got updated
 *       400:
 *         description: Error updating account
 */


router.post("/", async (req, res) => {
  try { 
    const {
      name,
      email,
      aadharNum,
      mobileNum,
      panNum,
      password,
      gender,
      salary,
      address,
      isKyc
    } = req.body;
    const userExist = await User.findOne({
      $or: [{ email}, { mobileNum }, { aadharNum }, { panNum}],
    });

    if (userExist) {
      return res.status(406).send({ msg: "User already exists" });
    }

    const userCreate = new User({
      name,
      email,
      aadharNum,
      mobileNum,
      panNum,
      password,
      gender,
      salary,
      address,
      isKyc
    });

    // bcrypt password
    const salt = await bcrypt.genSalt(10);
    userCreate.password = await bcrypt.hash(userCreate.password, salt);

    const saveUser = await userCreate.save();
    res.status(201).send({
      message: "User Successfully Registered",
      id: saveUser._id,
    });
  } catch (error) {
    res.status(400).json({error});
  }
});

router.get("/users", async (req, res) => {
  try { await new Promise(resolve => setTimeout(resolve, process.env.DELAY_SEC));
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
//getting user
router.get("/user/:id", async (req, res) => {
  try { await new Promise(resolve => setTimeout(resolve, process.env.DELAY_SEC));
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// delete a user
router.delete("/user/:id", async (req, res) => {
  try { await new Promise(resolve => setTimeout(resolve, process.env.DELAY_SEC));
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This user id doesn't exist",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Account deleted",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

// Update a user
router.patch("/user/:id", async (req, res) => {
  try { await new Promise(resolve => setTimeout(resolve, process.env.DELAY_SEC));
    await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account got updated");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

module.exports = router;