import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../../../styles/Home.module.css";
import stylesCustom from "../../../styles/custom.module.css";

import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { useAppContext } from "../../../context/state";
import { getJSONFlash, getJSONCategory } from "../../../utils/getLocalJSON";
import { GenMengejaGambarData, GenDengarkanGambarData } from "../../../utils/genQuizData";
import { getLocale } from "../../../utils/getLocaleText";
import { ModalReactionQuiz } from "../../../components/modal";
import axios, { post } from "axios";

import { Preferences } from "@capacitor/preferences";

import { motion } from "framer-motion";

const QuestionNumber = 10;
const RepeatedTimes = 10;
var chunks = [];

export default function MengejaGambar(props) {
  const router = useRouter();
  const { userdata, setUserdata } = useAppContext();

  const [isRecordAvailable, SetIsRecordAvailable] = useState(false);
  const [mediaRecorder, SetImediaRecorder] = useState(null);
  const [recognizedData, SetrecognizedData] = useState({ prediction: "Empty, Start Recording", time_exec: 0 });

  const [recordIcon, setRecordIcon] = useState("/assets/button_record.png");
  const [enableRecog, setEnableRecog] = useState(false);
  const [RecogServer, setRecogServer] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [indexImage, setIndexImage] = useState(0);
  const [lengthImageArray, setLengthImageArray] = useState(0);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [indexBenda, setIndexBenda] = useState(0);
  const [kategori, setKategori] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [isFinishQuiz, setIsFinishQuiz] = useState(false);
  const [isStartQuiz, setIsStartQuiz] = useState(false);
  const [isDoneSubmitData, setDoneSubmitData] = useState(false);
  const [finalQuestionDataState, setfinalQuestionDataState] = useState([]);
  const [showModalData, setShowModalData] = useState({
    isCorrect: false,
    showModal: false,
  });

  const localeGeneral = props.localeData?.general;

  const recordButtonRef = useRef();
  const AudioSoundRef = useRef();
  const AudioSoundActorRef = useRef();

  useEffect(() => {
    var finalQuestionData = GenDengarkanGambarData(props.kategori_data, RepeatedTimes);
    setfinalQuestionDataState(finalQuestionData);
    setQuizData(finalQuestionData[indexBenda]);
    setKategori(router.query.category);
    setLengthImageArray(finalQuestionData[indexBenda]?.image_file?.length);

    setUserdata({
      username: "Apa iya",
    });

    //console.log(window.localStorage.getItem("userSession"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function randomIndexImage() {
    var random_index = Math.floor(Math.random() * lengthImageArray);
    if (indexImage == random_index) {
      if (random_index == 0) {
        random_index = random_index + 1;
      } else if (random_index == lengthImageArray - 1) {
        random_index = random_index - 1;
      }
    }
    return random_index;
  }

  function playActorSound() {
    if (indexQuestion == 0) {
      var random_mari = Math.floor(Math.random() * 3) + 1;
      if (AudioSoundActorRef.current) {
        AudioSoundActorRef.current.src = "/assets/actor/mari_" + random_mari + ".wav";
      }
      AudioSoundActorRef.current?.play().then(() => {
        setTimeout(() => {
          AudioSoundRef.current?.play().then(() => {
            setTimeout(() => {
              stopSound();
            }, Math.round(AudioSoundRef.current.duration) * 1000 + 500);
          });
        }, Math.round(AudioSoundActorRef.current.duration) * 1000 + 500);
      });
    } else {
      AudioSoundRef.current?.play().then(() => {
        setTimeout(() => {
          stopSound();
        }, Math.round(AudioSoundRef.current.duration) * 1000 + 500);
      });
    }
  }

  function playItemSound() {
    AudioSoundRef.current?.play().then(() => {
      setTimeout(() => {
        stopSound();
      }, Math.round(AudioSoundRef.current.duration) * 1000 + 500);
    });
  }

  function stopSound() {
    setIndexImage(randomIndexImage());
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  }

  const startQuiz = () => {
    setIndexImage(randomIndexImage());
    setShowModalData({
      isCorrect: false,
      showModal: false,
    });
    setIsStartQuiz(true);

    setTimeout(() => {
      playActorSound();
    }, 800);
  };

  const nextQuestion = () => {
    setShowModalData({
      isCorrect: false,
      showModal: false,
    });
    if (RepeatedTimes == indexQuestion) {
      if (indexBenda + 1 < 3) {
        setQuizData(finalQuestionDataState[indexBenda + 1]);
        setLengthImageArray(finalQuestionDataState[indexBenda + 1]?.image_file?.length);
      }

      try {
        Preferences.get({ key: "user_uuid" }).then((ret) => {
          let formData = new FormData();
          formData.append(
            "json_data",
            JSON.stringify({
              kategori: router.query.category,
              jenis_benda: finalQuestionDataState[indexBenda]?.show_name,
              jumlah_dengar: indexQuestion,
              timestamp: Date.now(),
            })
          );
          formData.append("tipe_terapi", 0);

          post("https://elbicare.my.id/api/vibio/insert_terapi/" + ret.value, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
            .then((response) => {
              console.log(response.data);
              if (indexBenda + 1 == 3) {
                setDoneSubmitData(true);
                setIsFinishQuiz(true);
              } else {
                setIndexBenda(indexBenda + 1);
                setIndexQuestion(0);
              }
            })
            .catch((error) => {
              alert(error);
              console.log("Error ========>", error);
            });
        });
      } catch (error) {
        alert(error);
      }
    } else {
      setTimeout(() => {
        setIndexQuestion(indexQuestion + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    playActorSound();
  }, [indexQuestion]);

  //   {
  //     "show_name": "Pulpen",
  //     "image_file": [
  //         "tas_1.png",
  //         "tas_2.png"
  //     ],
  //     "sound_file": [
  //         "tas.mp3"
  //     ]
  // }

  return (
    <div className={(styles.container, stylesCustom.backgound_image)} style={{ backgroundImage: "linear-gradient(rgba(36, 36, 36, 0.40), rgba(36, 36, 36, 0.40)), url('/bg2.jpg')" }}>
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
              <h4 style={{ marginBottom: "0px", color: "green", textAlign: "center" }}>
                Perulangan<br></br>
                {indexQuestion} / {RepeatedTimes}
              </h4>
            </div>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "green", textAlign: "center" }}>
                Jenis Benda<br></br>
                {indexBenda + 1} / 3
              </h4>
            </div>
          </div>

          {isDoneSubmitData ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                router.push("/play");
              }}
            >
              Kembali Ke Menu Terapi Wicara
            </button>
          ) : (
            <h4 className={stylesCustom.menu_subtitle_font}>Sedang Mengupload Data ke Server</h4>
          )}
        </main>
      ) : (
        <>
          {quizData.show_name ? (
            <>
              <main className={styles.main} style={{ display: isStartQuiz ? "" : "none" }}>
                <div className="container">
                  <div className="row mt-5">
                    <div className="col-6 col-sm-6 col-md-4 mx-auto">
                      <div className={stylesCustom.mini_card}>
                        <h4 style={{ marginBottom: "0px", color: "green", textAlign: "center" }}>
                          Perulangan<br></br>
                          {indexQuestion} / {RepeatedTimes}
                        </h4>
                      </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-4 mx-auto">
                      <div className={stylesCustom.mini_card}>
                        <h4 style={{ marginBottom: "0px", color: "green", textAlign: "center" }}>
                          Jenis Benda<br></br>
                          {indexBenda} / 3
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="container" style={{ width: "50%", justifyContent: "center" }}>
                  <div className={stylesCustom.status_bar}>
                    <div className={stylesCustom.mini_card}>
                      <h4 style={{ marginBottom: "0px", color: "green", textAlign: "center" }}>
                        Perulangan<br></br>
                        {indexQuestion} / {RepeatedTimes}
                      </h4>
                    </div>
                    <div className={stylesCustom.mini_card}>
                      <h4 style={{ marginBottom: "0px", color: "green", textAlign: "center" }}>
                        Jenis Benda<br></br>
                        {indexBenda} / 3
                      </h4>
                    </div>
                  </div>
                </div> */}
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
                  <div className={stylesCustom.card_option_dengar_gambar}>
                    <Image
                      src={`/assets/items/${kategori}/image/${quizData?.image_file[indexImage]}`}
                      width={window.innerHeight * 0.8}
                      height={window.innerHeight * 0.8}
                      alt="BendaImage"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
                <audio ref={AudioSoundActorRef} controls src={"/assets/actor/mari_1.wav"} style={{ display: "none" }}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
                <audio ref={AudioSoundRef} controls src={"/assets/items/" + kategori + "/sound/" + quizData?.sound_file} style={{ display: "none" }}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
                <ModalReactionQuiz isShow={showModalData.showModal} isCorrect={showModalData.isCorrect} clickFunction={nextQuestion}></ModalReactionQuiz>
                <div className={stylesCustom.home_button} onClick={() => router.push("/home")}>
                  <div className={stylesCustom.button_card}>
                    <h5 style={{ marginBottom: "0px", color: "green" }}>Home</h5>
                  </div>
                </div>
              </main>
              <main className={styles.main} style={{ display: !isStartQuiz ? "" : "none" }}>
                <div className="container" style={{ width: "80%", justifyContent: "center" }}>
                  <div className={stylesCustom.status_bar}>
                    <div className={stylesCustom.mini_card} onClick={() => startQuiz()}>
                      <h3 style={{ marginBottom: "0px", color: "black" }}>
                        Saat Permainan dimulai, Suara akan otomatis dimainkan, <br></br>pastikan suara terdengar dan layar dapat dilihat dengan jelas
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="container" style={{ width: "50%", justifyContent: "center" }}>
                  <div className={stylesCustom.status_bar}>
                    <div className={stylesCustom.mini_card} onClick={() => startQuiz()}>
                      <h4 style={{ marginBottom: "0px", color: "green" }}>Mulai Permainan</h4>
                    </div>
                  </div>
                </div>
              </main>
            </>
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
    arrayPath.push({ params: { category: key } });
  });
  return {
    paths: arrayPath,
    fallback: true,
  };
}

function wordSimilarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
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
