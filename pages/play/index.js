import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import stylesCustom from "../../styles/custom.module.css";
import { useRouter } from "next/router";

export default function HomePlay({ allPostsData }) {
  const router = useRouter();

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        {/* <button type="button" className="btn btn-primary">Warning</button> */}
        <h2>Pilih Kategori Benda</h2>
        <br></br>

        <div className={styles.grid}>
          <a
            href="#"
            onClick={() =>
              router.push({
                pathname: "/play/start",
                query: { kategori: "buah"},
              })
            }
            className={stylesCustom.card_menu}
          >
            <h2>Buah &rarr;</h2>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Hewan &rarr;</h2>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
