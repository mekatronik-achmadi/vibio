import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
import stylesCustom from "../../../styles/custom.module.css";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { useAppContext } from "../../../context/state";
import { getJSONFlash, getJSONCategory } from "../../../utils/getLocalJSON";
import { GenTebakGambarData } from "../../../utils/genQuizData";
import { getLocale } from "../../../utils/getLocaleText";
import { ModalReactionQuiz } from "../../../components/modal";

//TODO : Show all image Option, so it will pre rendered, make it menarik, like "Loading All Image"... -> then show 4x4 image

const QuestionNumber = 10;

export default function PlayStart(props) {
  const router = useRouter();
  const { userdata, setUserdata } = useAppContext();

  const [quizData, setQuizData] = useState([]);
  const [quizOptionImage, setQuizOptionImage] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [rightQuestion, setRightQuestion] = useState(0);
  const [kategori, setKategori] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [isFinishQuiz, setIsFinishQuiz] = useState(false);
  const [showModalData, setShowModalData] = useState({
    isCorrect: false,
    showModal: false,
  });

  const localeGeneral = props.localeData?.general;

  const AudioSoundRef = useRef();
  const PlayButtonRef = useRef();
  const OptionsRef = useRef();

  useEffect(() => {
    console.log(userdata);
    var tempQuizData = GenTebakGambarData(props.kategori_data, QuestionNumber);

    setQuizData(tempQuizData);
    setKategori(router.query.category);
    setUserdata({
      username: "Apa iya",
    });

    console.log(window.localStorage.getItem("userSession"));
  }, []);

  useEffect(() => {
    if (quizData.length != 0) {
      setQuizOptionImage([
        "/assets/items/" + kategori + "/image/" + quizData[indexQuestion]?.options[0]?.name + "_" + quizData[indexQuestion]?.options[0]?.imageNum + ".png",
        "/assets/items/" + kategori + "/image/" + quizData[indexQuestion]?.options[1]?.name + "_" + quizData[indexQuestion]?.options[1]?.imageNum + ".png",
        "/assets/items/" + kategori + "/image/" + quizData[indexQuestion]?.options[2]?.name + "_" + quizData[indexQuestion]?.options[2]?.imageNum + ".png",
        "/assets/items/" + kategori + "/image/" + quizData[indexQuestion]?.options[3]?.name + "_" + quizData[indexQuestion]?.options[3]?.imageNum + ".png",
      ]);
    }
    console.log(indexQuestion);
  }, [quizData, kategori, indexQuestion]);

  function playSound() {
    setIsPlay(true);
    if (!isPlay) {
      AudioSoundRef.current.play();
      setShowOption(true);
    }
  }

  function stopSound() {
    if (isPlay == true) {
      setIsPlay(false);
    }
  }

  function selectOption(choosed) {
    if (choosed == quizData[indexQuestion]?.name) {
      console.log("Betul");
      setShowModalData({
        isCorrect: true,
        showModal: true,
      });
      setRightQuestion(rightQuestion + 1);
    } else {
      setShowModalData({
        isCorrect: false,
        showModal: true,
      });
      console.log("Salah");
    }
  }

  const nextQuestion = () => {
    setShowModalData({
      isCorrect: false,
      showModal: false,
    });
    if (QuestionNumber == indexQuestion + 1) {
      console.log(indexQuestion);
      setIsFinishQuiz(true);
    } else {
      setIndexQuestion(indexQuestion + 1);
      setShowOption(false);
    }
  };

  //console.log(router.query.data);

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container" style={{ width: "50%", justifyContent: "center" }}>
        <div className={stylesCustom.status_bar}>
          <div className={stylesCustom.mini_card}>
            <h4 style={{ marginBottom: "0px" }}>
              Soal: {indexQuestion + 1} / {QuestionNumber}
            </h4>
          </div>
          <div className={stylesCustom.mini_card}>
            <h4 style={{ marginBottom: "0px", color: "green" }}>
              Benar: {rightQuestion} / {QuestionNumber}
            </h4>
          </div>
        </div>
      </div>
      {isFinishQuiz ? (
        <main className={styles.main}>
          <h2>{localeGeneral.play_finish}</h2>
          <h4>{localeGeneral.play_finish_subtitle}</h4>
          <motion.div
            initial={{
              scale: 1,
              rotate: 0,
            }}
            animate={{
              rotate: [-2, 2, -2, 2, -2],
              scale: [1.01, 0.99, 1.01, 0.99, 1.01],
            }}
            transition={{
              duration: 1.5,
              times: [0.3, 0.6, 0.9, 1.2, 1.5],
              repeat: Infinity,
            }}
          >
            <Image src={"/assets/emoji_good.png"} width={150} height={150} alt="PlayButton" style={{ cursor: "pointer" }} />
          </motion.div>
          <div className={stylesCustom.finish_play_container}>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "green" }}>
                Benar: {rightQuestion} / {QuestionNumber}
              </h4>
            </div>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "red" }}>
                Salah: {QuestionNumber - rightQuestion} / {QuestionNumber}
              </h4>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              router.push("/play");
            }}
          >
            Kembali Ke Menu Terapi Wicara
          </button>
        </main>
      ) : (
        <>
          {quizData.length != 0 ? (
            <main className={styles.main}>
              <div id="PlayButton" ref={PlayButtonRef} className={`${showOption ? stylesCustom.fade_out : stylesCustom.fade_in}`}>
                <div className={isPlay ? stylesCustom.overlay : null} style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image
                    onClick={() => {
                      playSound();
                    }}
                    src={"/assets/button_play.png"}
                    width={400}
                    height={400}
                    alt="PlayButton"
                    style={{ cursor: "pointer" }}
                  />
                  <h3 className={stylesCustom.mini_card}>Tekan Tombol diatas untuk memutar suara</h3>
                </div>
              </div>
              <h4 className={`${stylesCustom.mini_card} ${showOption ? stylesCustom.fade_in : stylesCustom.fade_out}`}>Pilih jawaban sesuai suara yang muncul</h4>

              {/* <h1 className={styles.title}>Buah: {quizData[indexQuestion]?.name}</h1> */}
              <audio ref={AudioSoundRef} controls src={"/assets/items/" + kategori + "/sound/" + quizData[indexQuestion]?.name + ".mp3"} style={{ display: "none" }} onEnded={stopSound()}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
              <br></br>
              {quizOptionImage.length != 0 ? (
                <div>
                  <div id="Options" ref={OptionsRef} className={showOption ? stylesCustom.fade_in : stylesCustom.fade_out}>
                    <br></br> 
                    <div className={stylesCustom.tebak_gambar_grid}>
                      <div onClick={() => selectOption(quizData[indexQuestion]?.options[0]?.name)} className={stylesCustom.card_option_tebak_gambar}>
                        <Image src={quizOptionImage[0]} width={"400vw"} height={"400vw"} alt="Option1" placeholder="blur" blurDataURL={"/assets/placeholder400400.png"} loading="lazy" />
                      </div>
                      <div onClick={() => selectOption(quizData[indexQuestion]?.options[1]?.name)} className={stylesCustom.card_option_tebak_gambar}>
                        <Image src={quizOptionImage[1]} width={400} height={400} alt="Option2" placeholder="blur" blurDataURL={"/assets/placeholder400400.png"} loading="lazy" />
                      </div>
                    </div>
                    <div className={stylesCustom.tebak_gambar_grid}>
                      <div onClick={() => selectOption(quizData[indexQuestion]?.options[2]?.name)} className={stylesCustom.card_option_tebak_gambar}>
                        <Image src={quizOptionImage[2]} width={400} height={400} alt="Option3" placeholder="blur" blurDataURL={"/assets/placeholder400400.png"} loading="lazy" />
                      </div>
                      <div onClick={() => selectOption(quizData[indexQuestion]?.options[3]?.name)} className={stylesCustom.card_option_tebak_gambar}>
                        <Image src={quizOptionImage[3]} width={400} height={400} alt="Option4" placeholder="blur" blurDataURL={"/assets/placeholder400400.png"} loading="lazy" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <ModalReactionQuiz isShow={showModalData.showModal} isCorrect={showModalData.isCorrect} clickFunction={nextQuestion}></ModalReactionQuiz>
            </main>
          ) : (
            <main className={styles.main}>
              <h1 className={styles.title}>Memuat Permainan...</h1>
            </main>
          )}
        </>
      )}
    </div>
  );
}

export const getStaticProps = async ({ params: { category } }) => {
  var kategori_data = getJSONFlash(category);
  var localeDataGeneral = getLocale("id", "general");
  return {
    props: {
      kategori_data: kategori_data,
      localeData: {
        general: localeDataGeneral,
      },
    },
  };
};


export async function getStaticPaths() {
  var arrayPath = [];
  var kategoriObj = getJSONCategory();
  Object.keys(kategoriObj).map((key, id) => {
    if ((key === "buah" || key === "hewan")) {
      arrayPath.push({ params: { category: key } });
    }
  });
  return {
    paths: arrayPath,
    fallback: true,
  };
}
