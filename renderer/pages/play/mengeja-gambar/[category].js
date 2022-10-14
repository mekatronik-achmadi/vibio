import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";
import stylesCustom from "../../../styles/custom.module.css";

import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { useAppContext } from "../../../context/state";
import { getJSONFlash, getJSONCategory } from "../../../utils/getLocalJSON";
import { GenMengejaGambarData } from "../../../utils/genQuizData";
import { getLocale } from "../../../utils/getLocaleText";
import { ModalReactionQuiz } from "../../../components/modal";

import { motion } from "framer-motion";

const QuestionNumber = 10;

export default function MengejaGambar(props) {
  const router = useRouter();
  const { userdata, setUserdata } = useAppContext();

  const [quizData, setQuizData] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [rightQuestion, setRightQuestion] = useState(0);
  const [kategori, setKategori] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [isFinishQuiz, setIsFinishQuiz] = useState(false);
  const [showModalData, setShowModalData] = useState({
    isCorrect: false,
    showModal: false,
  });

  const localeGeneral = props.localeData?.general;

  const AudioSoundRef = useRef();

  useEffect(() => {
    //console.log(userdata);
    var finalQuestionData = GenMengejaGambarData(props.kategori_data, QuestionNumber);

    setQuizData(finalQuestionData);
    setKategori(router.query.category);

    setUserdata({
      username: "Apa iya",
    });

    //console.log(window.localStorage.getItem("userSession"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playSound() {
    setIsPlay(true);
    if (!isPlay) {
      AudioSoundRef.current.play();
    }
  }

  function stopSound() {
    if (isPlay == true) {
      setIsPlay(false);
    }
  }

  function selectOption(choosed) {
    setShowModalData({
      isCorrect: choosed,
      showModal: true,
    });

    if (choosed) {
      setRightQuestion(rightQuestion + 1);
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
    }
  };

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "url('/bg2.jpg')" }}>
      <Head>
        <title>Vibio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {isFinishQuiz ? (
        <main className={styles.main}>
        <h2 className={stylesCustom.menu_title_font}>{localeGeneral.play_finish}</h2>
          <h4 className={stylesCustom.menu_subtitle_font}>{localeGeneral.play_finish_subtitle}</h4>
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
                Menjawab Benar: {rightQuestion} / {QuestionNumber}
              </h4>
            </div>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "red" }}>
                Menjawab Salah: {QuestionNumber - rightQuestion} / {QuestionNumber}
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
              <div className="container" style={{ width: "50%", justifyContent: "center", marginBottom: "10vh" }}>
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
              <div
                className={styles.grid}
                animate={{
                  rotate: [0, -2, 2, -2, 0],
                  scale: [1, 1, 1.01, 0.99, 1],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.8, 1.1, 1.5],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <div className={stylesCustom.card_option}>
                  <Image
                    onClick={() => {
                      playSound();
                    }}
                    src={`/assets/items/${kategori}/image/${quizData[indexQuestion].name}_${quizData[indexQuestion].imageNum}.png`}
                    width={200}
                    height={200}
                    alt="BendaImage"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              <div className={stylesCustom.button_container}>
                <div className={stylesCustom.button_image_subtitle} onClick={() => selectOption(false)}>
                  <Image src={`/assets/button_no.png`} width={"100%"} height={"100%"} alt="ButtonNo" style={{ cursor: "pointer" }} />
                  <h4 style={{ marginBottom: "0px" }}>Salah</h4>
                </div>
                <div className={stylesCustom.button_image_subtitle} onClick={() => selectOption(true)}>
                  <Image src={`/assets/button_ok.png`} width={"100%"} height={"100%"} alt="ButtonOK" style={{ cursor: "pointer" }} />
                  <h4 style={{ marginBottom: "0px" }}>Benar</h4>
                </div>
              </div>

              {/* <div id="PlayButton" ref={PlayButtonRef} className={`${showOption ? stylesCustom.fade_out : stylesCustom.fade_in}`}>
            <div className={isPlay ? stylesCustom.overlay : null} style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <h3 className={stylesCustom.mini_card}>Tekan Tombol diatas untuk memutar suara</h3>
            </div>
          </div> */}

              <audio ref={AudioSoundRef} controls src={"/assets/items/" + kategori + "/sound/" + quizData[indexQuestion]?.name + ".mp3"} style={{ display: "none" }} onEnded={stopSound()}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
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

// export async function getStaticProps({ params: { category } }) {

//   console.log(category);
//   return { props: { category } };
// }

// export async function getStaticPaths() {
//   const [posts] = await Promise.all([getAllBlogPostEntries()]);

//   const paths = posts.entries.map((c) => {
//     return { params: { post: c.route } }; // Route is something like "this-is-my-post"
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// }

// export const getServerSideProps = async (context) => {
//   if (context.query.category !== undefined) {
//     var kategori_data = getJSONFlash(context.query.category);
//     var localeDataGeneral = getLocale("id", "general");
//     return {
//       props: {
//         kategori_data: kategori_data,
//         localeData: {
//           general: localeDataGeneral,
//         },
//       },
//     };
//   } else {
//     return {
//       redirect: {
//         destination: "/play",
//         permanent: false,
//       },
//     };
//   }
// };
