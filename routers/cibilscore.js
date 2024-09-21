const express = require("express");
const router = new express.Router();

/**
 * @swagger
 * tags:
 *   name: CIBIL Score
 *   description: API to generate random CIBIL scores
 */

/**
 * @swagger
 * /cibil-score:
 *   get:
 *     summary: Get a random CIBIL score
 *     tags: [CIBIL Score]
 *     responses:
 *       200:
 *         description: Successfully generated CIBIL score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                   example: 720
 *                 category:
 *                   type: string
 *                   example: "Very Good"
 *                 message:
 *                   type: string
 *                   example: "Your CIBIL score is 720, which is categorized as Very Good."
 */


const generateRandomCIBILScore = () => {
  return Math.floor(Math.random() * (900 - 300 + 1)) + 300;
};

// Function to categorize the score
const categorizeScore = (score) => {
  if (score >= 750 && score <= 900) return "Excellent";
  else if (score >= 700 && score < 750) return "Very Good";
  else if (score >= 650 && score < 700) return "Good";
  else if (score >= 550 && score < 650) return "Fair";
  else return "Poor";
};

// API endpoint
router.get('/', (req, res) => {
  const score = generateRandomCIBILScore();
  const category = categorizeScore(score);

  res.json({
    score: score,
    category: category,
    message: `Your CIBIL score is ${score}, which is categorized as ${category}.`
  });
});

module.exports=router;
