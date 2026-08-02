import styles from "./navbar.module.css";
import Link from "next/link";

export default function NavBar(){
    return(
        <nav className={styles.navbar}>
            <h1 className={styles.boldedElements}>Aggie Nails</h1>
            <div className={styles.links}>
                <a href="/">Home</a>
                <a href="/gallery">Gallery</a>
                <a href="/about">About</a>
                <a href="/faq">FAQ</a>
            </div>
            <Link href="/book" >
                <button className={styles.boldedElements} >Book Now</button>
            </Link>

        </nav>
    );
}