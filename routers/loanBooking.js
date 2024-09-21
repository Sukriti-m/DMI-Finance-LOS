const express = require('express');
const router = express.Router();
const LoanBooking = require('../models/loan');
const User = require('../models/user');

/**
 * @swagger
 * tags:
 *   name: Loan Booking
 *   description: APIs for managing loan bookings
 */

/**
 * @swagger
 * /loans/create:
 *   post:
 *     summary: Create a new loan booking
 *     tags: [Loan Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowerId:
 *                 type: string
 *                 example: "60c72b2f9b1e8e6d2f1f2c3d"
 *               loanType:
 *                 type: string
 *                 example: "Personal"
 *               loanAmount:
 *                 type: number
 *                 example: 50000
 *               interestRate:
 *                 type: number
 *                 example: 10
 *               tenure:
 *                 type: number
 *                 example: 24
 *     responses:
 *       201:
 *         description: Loan booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan booking created successfully"
 *                 loan:
 *                   type: object
 *                   additionalProperties: true
 *       400:
 *         description: Validation error or tenure not greater than zero
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tenure must be greater than zero"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */

/**
 * @swagger
 * /loans:
 *   get:
 *     summary: Fetch all loan bookings
 *     tags: [Loan Booking]
 *     responses:
 *       200:
 *         description: Successfully fetched loan bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 additionalProperties: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /loans/{id}:
 *   get:
 *     summary: Fetch a single loan booking by ID
 *     tags: [Loan Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the loan booking
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched loan booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       404:
 *         description: Loan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /loans/{id}/update:
 *   put:
 *     summary: Update a loan status
 *     tags: [Loan Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the loan booking
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanStatus:
 *                 type: string
 *                 example: "Approved"
 *     responses:
 *       200:
 *         description: Loan status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan status updated"
 *       404:
 *         description: Loan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

/**
 * @swagger
 * /loans/{id}/delete:
 *   delete:
 *     summary: Delete a loan booking
 *     tags: [Loan Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the loan booking
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loan booking deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan booking deleted successfully"
 *       404:
 *         description: Loan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */

// Route to create a new loan booking
router.post('/create', async (req, res) => {
  try {
    const { borrowerId, loanType, loanAmount, interestRate, tenure } = req.body;

    const borrower = await User.findById(borrowerId);
    if (!borrower) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure that tenure is not zero to avoid division by zero
    if (tenure <= 0) {
      return res.status(400).json({ message: 'Tenure must be greater than zero' });
    }

    let emi = loanAmount / tenure; // Simplified EMI calculation

    // Create a new loan booking
    const newLoan = new LoanBooking({
      borrower: borrowerId,
      loanDetails: {
        loanType: loanType,
        loanAmount: loanAmount,
        interestRate: interestRate,
        tenure: tenure,
        loanStatus: 'Pending', // Default status is Pending
      },
      repaymentDetails: {
        emiAmount: emi, // Simplified EMI calculation
        totalOutstanding: loanAmount,
      },
    });

    // Save the loan booking and handle potential validation errors
    await newLoan.save().catch(err => {
      console.error('Save error:', err);
      return res.status(400).json({ message: 'Validation error', error: err });
    });

    res.status(201).json({ message: 'Loan booking created successfully', loan: newLoan });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to fetch all loan bookings
router.get('/', async (req, res) => {
  try {
    const loans = await LoanBooking.find().populate('borrower');
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to fetch a single loan booking by ID
router.get('/:id', async (req, res) => {
  try {
    const loan = await LoanBooking.findById(req.params.id).populate('borrower');
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to update a loan status
router.put('/:id/update', async (req, res) => {
  try {
    const loan = await LoanBooking.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const { loanStatus } = req.body;
    loan.loanDetails.loanStatus = loanStatus;
    await loan.save();

    res.status(200).json({ message: 'Loan status updated', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to delete a loan booking
router.delete('/:id/delete', async (req, res) => {
  try {
    const loan = await LoanBooking.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.status(200).json({ message: 'Loan booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
