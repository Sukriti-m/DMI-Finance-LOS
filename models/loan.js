const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoanBookingSchema = new Schema(
  {
    borrower: {
      type: Schema.Types.ObjectId,  
      ref: 'User',                 
    },
    loanDetails: {
      loanType: {
        type: String,
        enum: ['Personal Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Business Loan'],
      },
      loanAmount: { type: Number },
      interestRate: { type: Number}, 
      tenure: { type: Number }, 
      loanStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Disbursed', 'Closed', 'Rejected'],
        default: 'Pending',
      },
      disbursalDate: { type: Date },
    },
    repaymentDetails: {
      emiAmount: { type: Number },
    //   emiStartDate: { type: Date },
    //   nextEmiDueDate: { type: Date },
    //   totalEmiPaid: { type: Number, default: 0 },
      totalOutstanding: { type: Number }, 
    }  
},
  { timestamps: true }
);

// Create LoanBooking model
const LoanBooking = mongoose.model('LoanBooking', LoanBookingSchema);
module.exports = LoanBooking;
