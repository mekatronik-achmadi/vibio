import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import stylesCustom from "../../styles/custom.module.css";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

import { getLocale } from "../../utils/getLocaleText";
import { FooterLogo } from "../../components/general";

//TODO : Atur Category Card agar kalau jumlah itemnya 6, bagus keliatanya
//TODO : Fit Screen No Scroll untuk pad dan Laptop

export default function Petunjuk(props) {
  const router = useRouter();
  const localeGeneral = props.localeData?.general;
  const pentunjuk_now = parseInt(router.query.petunjuk_number);

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <motion.div
          className={styles.main}
          animate={"open"}
          variants={{
            open: { opacity: 1, x: 0 },
            closed: { opacity: 0, x: "-100%" },
          }}
        >
          <h2 className={stylesCustom.menu_subtitle_font}>{localeGeneral.petunjuk_title1}</h2>
          <h4>{localeGeneral.play_subtitle2}</h4>
          <br></br>
          <div className={stylesCustom.container_card_jenis_permainan}>
            <div className={stylesCustom.card_menu_wImage}>
              <p style={{ textAlign: "center", wordWrap: "break-word", marginTop: "10px" }}>Judul Topik</p>
              <video controls src={`/video-petunjuk/${pentunjuk_now}.mp4`} style={{ width: "100%", height: "100%" }} />
              <div className={stylesCustom.finish_play_container}>
                {pentunjuk_now != 1 ? (
                  <div
                    className={stylesCustom.mini_card_vertical}
                    onClick={() => {
                      router.push(`/petunjuk-terapi/${pentunjuk_now - 1}`);
                    }}
                  >
                    <h4 style={{ marginBottom: "0px", color: "green" }}>Sebelumnya</h4>
                  </div>
                ) : null}

                <div
                  className={stylesCustom.mini_card_vertical}
                  onClick={() => {
                    router.push(`/petunjuk-terapi/${pentunjuk_now + 1}`);
                  }}
                >
                  <h4 style={{ marginBottom: "0px", color: "red" }}>Selanjutnya</h4>
                </div>
              </div>
            </div>
          </div>
          <FooterLogo></FooterLogo>
        </motion.div>
      </main>
      <div style={{ position: "absolute", top: "5vh", left: "5vh", cursor: "pointer" }} onClick={() => router.push("/home")}>
        <div className={stylesCustom.button_card}>
          <h4 style={{ marginBottom: "0px", color: "green" }}>Home</h4>
        </div>
      </div>
      <audio controls loop autoPlay src={"/assets/music/bg-music1.wav"} style={{ display: "none" }}></audio>
    </div>
  );
}

// export async function getStaticProps(context) {

//   return {
//     props: {
//       localeData: {
//         general: localeDataGeneral,
//       },
//     },
//   };
// }

export async function getStaticPaths() {
  var arrayPath = [];
  arrayPath.push({ params: { petunjuk_number: "1" } });
  arrayPath.push({ params: { petunjuk_number: "2" } });
  arrayPath.push({ params: { petunjuk_number: "3" } });
  return {
    paths: arrayPath,
    fallback: true,
  };
}
export const getStaticProps = async (context) => {
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
};
