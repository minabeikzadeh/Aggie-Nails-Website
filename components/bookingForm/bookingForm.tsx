import styles from "./bookingForm.module.css"
import Image from "next/image";

export default function BookingForm(){
    return(
        <>
        <section className={styles.bookingPage}>
        <div className={styles.bookingContainer}>
            <h1 className= {styles.title}>CHOOSE YOUR SERVICE</h1>
            <section className={styles.serviceGrid}>
                
                <div className={styles.serviceCard}>
                    <Image className={styles.essential_img}
                        src= "/images/IMG_4933.jpg"
                        alt= "Essential Nails"
                        width={300}
                        height={400}
                    /> 
                    <h3>ESSENTIAL</h3>
                    <p>solid color | french tip | chrome</p>
                </div>

                <div className={styles.serviceCard}>
                    <Image className={styles.signature_img}
                        src= "/images/fairy_green_nails_edited.png"
                        alt= "Signature Nails"
                        width={300}
                        height={400}
                    /> 
                    <h3>SIGNATURE</h3>
                </div>

                <div className={styles.serviceCard}>
                    <Image className={styles.statement_img}
                        src= "/images/IMG_6679.jpg"
                        alt= "Statement Nails"
                        width={300}
                        height={400}
                    /> 
                    <h3>STATEMENT</h3>
                </div>
                

            </section>
        </div>
        </section>
        </>
    );
}