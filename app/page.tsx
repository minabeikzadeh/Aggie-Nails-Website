import styles from "./page.module.css";
import NavBar from "@/components/navbar/navbar";
import Hero from "@/components/hero/hero";

export default function Home() {
  return (
    <main className={styles.home}>
      <NavBar />
      <Hero />
    </main>
  );
}