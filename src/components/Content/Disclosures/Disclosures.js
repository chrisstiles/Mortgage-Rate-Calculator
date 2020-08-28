import React from 'react';
import styles from './Disclosures.module.scss';

export default function Disclosures() {
  return (
    <div className={styles.wrapper}>
      <p>
        Loan data is for informational purposes only, and is based on
        owner occupied single-family homes only. The actual fees,
        costs and monthly payment on your specific loan transaction
        may be higher or lower than those quoted based on your
        information, which may be determined after you apply. This is
        not a credit decision or a commitment to lend. Loan interest
        rates are based on current market rates, are subject to
        pricing adjustments related to several factors including, but
        not limited to, property type and location, loan amount, loan
        type, loan-to-value, occupancy type, borrower credit history.
        Mortgage insurance may be required if loan-to-value (LTV) is
        higher than 80% which could increase the monthly payment and
        APR.
      </p>

      <p>
        1. The annual percentage rate (APR), is the cost of credit
        over the term of the loan expressed as an annual rate. The APR
        above based on interest rate, loan origination fees and
        applicable closing costs and does not take into account other
        loan specific finance charges you may be required to pay.
        Actual rate will be determined after receipt of completed
        application and prior to execution of loan documents. Rate
        lock may not be available until final loan approval; fee may
        apply.
      </p>

      <p>
        2. No Closing Cost loans are subject to terms and conditions
        of Fremont Bank's Application Fee Agreement, which lists the
        specific costs and fees the borrower will not pay. An
        application fee may be required after a loan application is
        submitted, which will be refunded as a credit on your Closing
        Disclosure statement.{' '}
        <strong>Application fee is non-refundable</strong> if your
        loan is denied, withdrawn or does not close for any reason.
        Borrower is responsible for paying all fees and charges
        imposed by brokers or an existing third party lender (for
        example, payoff demand statement fee and/or a reconveyance
        fee) as well as any prepayment penalty imposed by any third
        party lender or Fremont Bank. Loans with lower nominal
        interest rates may be available to borrower willing to pay
        points and fees.
      </p>

      <p>
        3. Closing costs, also known as settlement costs, are the fees
        you pay when obtaining your loan. Closing costs are typically
        about 2-5% of your loan amount and are usually paid at
        closing.
      </p>

      <p>
        Loans available for properties located in CA or NV. Rates may
        not be available in all areas. Actual rates may vary. Loans
        subject to credit qualifications and underwriting
        requirements. Property type and other restrictions may apply.
        Loans with lower nominal interest rates may be available to
        borrower willing to pay points and fees. Other loan programs
        available. Call for details.
      </p>
    </div>
  );
}
