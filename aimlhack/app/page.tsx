import Link from "next/link";
import styles from './home.module.css';  // Import the CSS module

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI ML HACKATHON 2024</h1>
      <Link href="/ps1" className={styles.link}>Problem Statement 1</Link>
      <Link href="/ps2" className={styles.link}>Problem Statement 2</Link>
    </div>
  );
}
