import styles from "./hero.module.css";
import Link from "next/link";

export default function Hero(){
    return(
        <section className={styles.hero}>
            <h1 className={styles.title}>AGGIE NAILS</h1>
            <p className={styles.slogan}>Nails made to last, art made to remember</p>
            <Link href="/book">
                <button className={styles.button}>BOOK NOW</button>
            </Link>
        </section>
    );
}