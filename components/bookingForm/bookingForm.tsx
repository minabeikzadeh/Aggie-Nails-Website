import styles from "./bookingForm.module.css"
import Image from "next/image";

export default function BookingForm(){
    return(
        <>
        <section className={styles.bookingPage}>
        <div className={styles.bookingContainer}>


            <h1 className= {styles.title}>Select a Service</h1>


            <section className={styles.serviceGrid}>

                
                <div className={styles.serviceCard}>

                    <Image className={styles.essential_img}
                        src= "/images/IMG_4933.jpg"
                        alt= "Essential Nails"
                        width={300}
                        height={400}
                    /> 

                    <div className={styles.serviceInfo}>
                        <h2>Essential</h2>
                        <ul><li>Solid color</li><li>French tip</li><li>Chrome</li></ul>
                        <h3 className={styles.price}>$75</h3>
                    </div>
                    
                </div>


                <div className={styles.serviceCard}>

                    <Image className={styles.signature_img}
                        src= "/images/fairy_green_nails_edited.png"
                        alt= "Signature Nails"
                        width={300}
                        height={400}
                    /> 

                    <div className={styles.serviceInfo}>
                        <h2>Signature</h2>
                        <ul><li>3D Art</li><li>Charms and Gems</li><li>Simple Nail Art</li></ul>
                        <h3 className={styles.price}>$95</h3>
                    </div>

                </div>


                <div className={styles.serviceCard}>
                    <Image className={styles.statement_img}
                        src= "/images/IMG_6679.jpg"
                        alt= "Statement Nails"
                        width={300}
                        height={400}
                    /> 

                    <div className={styles.serviceInfo}>
                        <h2>Statement</h2>
                        <ul><li>Advanced Nail Art</li><li>Complex 3D Sculpting </li><li>Fully Customized Designs</li></ul>
                        <p>Custom quote through DM</p>
                    </div>

                </div>
                

            </section>


        </div>
        </section>
        </>
    );
}