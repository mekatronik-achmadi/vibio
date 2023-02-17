import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import stylesCustom from "../styles/custom.module.css";
import { useRouter } from "next/router";
import { useAppContext } from "../context/state";
import React, { useState, useEffect, useRef } from "react";

import { getLocale } from "../utils/getLocaleText";
import { FooterLogo } from "../components/general";

import { ModalAnnaouncement } from "../components/modal";

export default function Home({ localeData }) {
  const router = useRouter();
  const { userdata, setUserdata } = useAppContext();
  const localeGeneral = localeData.general;
  const AudioSoundRef = useRef();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // if (navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       audio: true,
    //     })
    // } else {
    //   alert("Media Tidak tersedia");
    // }

    AudioSoundRef.current.play();
    console.log(userdata);
    setUserdata({
      username: "hola",
    });

    if (window.localStorage) {
      console.log(window.localStorage.getItem("userSession"));
      window.localStorage.setItem("userSession", "Loheee");
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2-uncom.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        {/* <button type="button" className="btn btn-primary">Warning</button> */}
        <h1 className={stylesCustom.menu_title_font}>{localeGeneral.mainmenu_title}</h1>
        <h3 className={stylesCustom.menu_subtitle_font}>{localeGeneral.mainmenu_subtitle}</h3>
        <br></br>
        <div className={stylesCustom.container_card_row}>
          <div onClick={() => router.push("/demo")} className={stylesCustom.card_menu_home}>
            <h2 className={stylesCustom.card_menu_title_font}>{localeGeneral.menu1_title} &rarr;</h2>
            <p className={stylesCustom.card_menu_subtitle_font}>{localeGeneral.menu1_subtitle}</p>
          </div>

          <div onClick={() => router.push("/play")} className={stylesCustom.card_menu_home}>
            <h2 className={stylesCustom.card_menu_title_font}>{localeGeneral.menu2_title} &rarr;</h2>
            <p className={stylesCustom.card_menu_subtitle_font}>{localeGeneral.menu2_subtitle}</p>
          </div>

          <div onClick={() => router.push("/petunjuk-terapi/1")} className={stylesCustom.card_menu_home}>
            <h2 className={stylesCustom.card_menu_title_font}>{localeGeneral.menu3_title} &rarr;</h2>
            <p className={stylesCustom.card_menu_subtitle_font}>{localeGeneral.menu3_subtitle}</p>
          </div>

          <div onClick={() => alert("Belum Tersedia")} className={stylesCustom.card_menu_home_disabled}>
            <h2 className={stylesCustom.card_menu_title_font}>{localeGeneral.menu4_title} &rarr;</h2>
            <p className={stylesCustom.card_menu_subtitle_font}>{localeGeneral.menu4_subtitle}</p>
          </div>
        </div>
        <FooterLogo></FooterLogo>
        <ModalAnnaouncement isShow={showModal} clickFunction={closeModal}></ModalAnnaouncement>
      </main>
      <div style={{ position: "absolute", top: "5vh", left: "5vh", cursor: "pointer" }} onClick={() => router.push("/pengaturan")}>
        <div className={stylesCustom.button_card}>
          <h4 style={{ marginBottom: "0px", color: "green" }}>S</h4>
        </div>
      </div>
      <audio ref={AudioSoundRef} controls loop autoPlay src={"/assets/music/bg-music1.wav"} style={{ display: "none" }}></audio>
    </div>
  );
}

export async function getStaticProps(context) {
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
}
