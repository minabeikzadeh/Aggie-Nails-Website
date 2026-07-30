import styles from "./hero.module.css";

export default function Hero(){
    return(
        <section className={styles.hero}>
            <h1>AGGIE NAILS</h1>
            <p>Gel-X Nails at UC Davis</p>
            <button>BOOK NOW</button>
        </section>
    );
}