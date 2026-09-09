"use client";

import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function NavBar(){

    const pathname = usePathname();

    return(
        <nav className={styles.navbar}>
            <div className={styles.links}>
                <a 
                href="/"
                className={pathname === "/" ? styles.active : ""}
                >Home
                </a>
                <a 
                href="/gallery"
                className={pathname === "/gallery" ? styles.active : ""}
                >Gallery
                </a>
                <a 
                href="/about"
                className={pathname === "/about" ? styles.active : ""}
                >About
                </a>
                <a 
                href="/faq"
                className={pathname === "/faq" ? styles.active : ""}
                >FAQ
                </a>
            </div>
            <Link 
            href="/book" 
            className={pathname === "/book" ? styles.active : ""}
            >
                <button className={styles.boldedElements} >Book Now</button>
            </Link>

        </nav>
    );
}
