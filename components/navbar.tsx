import styles from "./navbar.module.css";

export default function NavBar(){
    return(
        <nav className={styles.navbar}>
            <h1>Aggie Nails</h1>
            <div className={styles.links}>
                <a href="/">Home</a>
                <a href="/gallery">Gallery</a>
                <a href="/about">About</a>
                <a href="/faq">FAQ</a>
            </div>

            <button>Book Now</button>
        </nav>
    );
}