import styles from "./page.module.css";

export default function BookingSuccess() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.checkmark}>✓</div>

        <p className={styles.smallTitle}>AGGY NAILS</p>

        <h1>Booking Confirmed!</h1>

        <p className={styles.message}>
          Your $20 deposit has been received and your appointment is officially
          confirmed.
        </p>

        <div className={styles.details}>
          <div>
            <span>Deposit paid</span>
            <strong>$20.00</strong>
          </div>

          <div>
            <span>Confirmation</span>
            <strong>Sent to your email</strong>
          </div>
        </div>

        <p className={styles.emailMessage}>
          Your appointment details and important booking information have been
          sent to your email. Please keep that email for your records.
        </p>

        <a href="/" className={styles.homeButton}>
          Back to Home
        </a>
      </div>
    </main>
  );
}