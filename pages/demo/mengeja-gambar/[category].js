import Head from "next/head";
import Image from "next/legacy/image";
import styles from "../../../styles/Home.module.css";
import stylesCustom from "../../../styles/custom.module.css";

import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { useAppContext } from "../../../context/state";
import { getJSONFlash, getJSONCategory } from "../../../utils/getLocalJSON";
import { GenMengejaGambarData } from "../../../utils/genQuizData";
import { getLocale } from "../../../utils/getLocaleText";
import { ModalReactionQuiz } from "../../../components/modal";
import axios, { post } from "axios";
import { Preferences } from "@capacitor/preferences";
import { Plugins } from "@capacitor/core";

import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from "capacitor-voice-recorder";

import { motion } from "framer-motion";
import { Walktour, CardinalOrientation, WalktourLogic } from "walktour";

const QuestionNumber = 3;
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
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [rightQuestion, setRightQuestion] = useState(0);
  const [kategori, setKategori] = useState("");
  const [isPlay, setIsPlay] = useState(false);
  const [isFinishQuiz, setIsFinishQuiz] = useState(false);
  const [isDoneSubmitData, setDoneSubmitData] = useState(false);
  const [showModalData, setShowModalData] = useState({
    isCorrect: false,
    showModal: false,
  });

  const localeGeneral = props.localeData?.general;

  const recordButtonRef = useRef();
  const AudioSoundRef = useRef();

  useEffect(() => {
    //console.log(userdata);
    if (navigator.mediaDevices.getUserMedia) {
      SetIsRecordAvailable(true);

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then(onSuccess, onError);
    } else {
      SetIsRecordAvailable(false);
    }

    var finalQuestionData = GenMengejaGambarData(props.kategori_data, QuestionNumber);

    setQuizData(finalQuestionData);
    setKategori(router.query.category);

    setUserdata({
      username: "Apa iya",
    });

    //console.log(window.localStorage.getItem("userSession"));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mediaRecorder !== null) {
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = ({ e }) => {
        console.log("data available after MediaRecorder.stop() called.");

        const blob = new Blob(chunks, {
          type: "audio/wav;",
        });
        chunks = [];

        let file = new File([blob], "Lohe" + ".wav", {
          type: "audio/wav",
          lastModified: new Date().getTime(),
        });

        const formData = new FormData();
        formData.append("file_audio", file);

        // SetrecognizedData({
        //   prediction: "apple"
        // })
        //fetch("https://vibio.elbicare.my.id/recognition", {
        fetch("http://127.0.0.1:5000/recognition", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => SetrecognizedData(data))
          .catch((error) => {
            console.log("Error ========>", error);
          });

        // let fileReader = new FileReader();
        // let arrayBuffer;

        // fileReader.onloadend = () => {
        //   arrayBuffer = fileReader.result;
        // };

        // fileReader.readAsDataURL(superBlob);

        // chunks = [];
        // let file = new File([blob], "Lohe" + ".wav", {
        //   type: "audio/wav",
        //   lastModified: new Date().getTime(),
        // });

        // const formData = new FormData();
        // formData.append("file_audio", file);

        // blobToBase64(blob).then((base64) => {
        //   fetch("https://vibio.elbicare.my.id/recognition", {
        //     //fetch("http://127.0.0.1:5000/recognition", {
        //     method: "POST", // *GET, POST, PUT, DELETE, etc.
        //     mode: "no-cors", // no-cors, *cors, same-origin
        //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        //     body: formData,
        //   })
        //     .then((res) => {
        //       console.log(res);
        //       alert(JSON.stringify(res));
        //     })
        //     .catch((e) => {
        //       console.log(e.message);
        //       alert(e.message);
        //     });
        // .finally(() => {
        //   setTimeout(() => {
        //     router.push("/home");
        //   }, 2000);
        // });
        // post(
        //   RecogServer,
        //   {
        //     base64: base64,
        //   },
        //   {
        //     headers: {
        //       "content-type": "multipart/form-data",
        //     },
        //   }
        // )
        //   .then((response) => {
        //     console.log(response.data);
        //     SetrecognizedData(response.data);
        //   })
        //   .catch((error) => {
        //     alert(error);
        //     console.log("Error ========>", error);
        //   });
        // });

        //alert(file[0])

        // const formData = new FormData();
        // formData.append("file_audio", file);

        // try {
        //   post(RecogServer, formData, {
        //     headers: {
        //       "content-type": "multipart/form-data",
        //     },
        //   })
        //     .then((response) => {
        //       console.log(response.data);
        //       SetrecognizedData(response.data);
        //     })
        //     .catch((error) => {
        //       alert(error);
        //       console.log("Error ========>", error);
        //     });
        // } catch (error) {
        //   alert(error);
        // }
      };
    }
  }, [mediaRecorder]);

  let onSuccess = function (stream) {
    var mediaRecorder = new MediaRecorder(stream);
    SetImediaRecorder(mediaRecorder);

    Preferences.get({ key: "recognitionServer" }).then((ret) => {
      setRecogServer(ret.value);
    });

    Preferences.get({ key: "enableRecog" }).then((ret) => {
      setEnableRecog(ret.value == "true");
    });
  };

  let onError = function (err) {
    alert("The following error occured: " + err);
  };

  const start_record = () => {
    setRecordIcon("/assets/button_onrecord.png");
    console.log("recorder started");
    mediaRecorder.start();

    setTimeout(() => {
      setRecordIcon("/assets/button_record.png");
      mediaRecorder.stop();
    }, 3000);
  };

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

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      console.log("Hola");
      checkAnswer(recognizedData.prediction);
    }
    didMountRef.current = true;
  }, [recognizedData]);

  const checkAnswer = (prediction) => {
    var nowIndex = indexQuestion;
    var now_jawaban = quizData[nowIndex].name;
    var sp_prediction = prediction;
    //var sp_prediction = now_jawaban;
    var similarityWord = wordSimilarity(sp_prediction, now_jawaban);
    if (similarityWord > 0.7) {
      selectOption(true);
    } else {
      selectOption(false);
    }
  };

  const nextQuestion = () => {
    setShowModalData({
      isCorrect: false,
      showModal: false,
    });
    if (QuestionNumber == indexQuestion + 1) {
      setDoneSubmitData(true);
      setIsFinishQuiz(true);
    } else {
      setIndexQuestion(indexQuestion + 1);
    }
  };

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
          <h2 className={stylesCustom.menu_title_font}>Demo Selesai</h2>
          <h4 className={stylesCustom.menu_subtitle_font} style={{ textAlign: "center" }}>
            Pada sesi terapi sebenarnya, data anda akan terekam dan dapat dipantau
          </h4>
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
              <h4 style={{ marginBottom: "0px", color: "green", textAlign: 'center' }}>
                Menjawab Benar: <br></br> {rightQuestion} / {QuestionNumber}
              </h4>
            </div>
            <div className={stylesCustom.mini_card_vertical}>
              <h4 style={{ marginBottom: "0px", color: "red", textAlign: 'center' }}>
                Menjawab Salah: <br></br> {QuestionNumber - rightQuestion} / {QuestionNumber}
              </h4>
            </div>
          </div>
          {isDoneSubmitData ? (
            <button
              className="btn btn-success"
              onClick={() => {
                router.push("/home");
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
          {quizData.length != 0 ? (
            <main className={styles.main} style={{ paddingTop: "15px" }} id="tour_summary">
              <Walktour
                steps={[
                  {
                    selector: "#tour_soal",
                    title: "Jumlah Soal",
                    description: "Menampilkan berapa jumlah soal",
                    disableMaskInteraction: true,
                    disableClose: true,
                    disableSmoothScroll: true,
                    closeLabel: "",
                  },
                  {
                    selector: "#tour_benar",
                    title: "Jumlah Benar",
                    description: "Menampilkan berapa jumlah benar",
                    disableMaskInteraction: false,
                    disableClose: true,
                    disableSmoothScroll: true,
                    closeLabel: "",
                  },
                  {
                    selector: "#tour_gambarbenda",
                    title: "Gambar Benda",
                    description: "Berfungsi Sebagai ilustrasi dari benda yang harus disuarakan",
                    disableMaskInteraction: false,
                    disableClose: true,
                    disableSmoothScroll: true,
                    closeLabel: "",
                    orientationPreferences: ["north"],
                  },
                  {
                    selector: "#tour_jawabansalah",
                    title: "Jawaban Salah",
                    description: "Tekan tombol berikut jika jawaban anak salah",
                    disableMaskInteraction: false,
                    disableClose: true,
                    disableSmoothScroll: true,
                    closeLabel: "",
                  },
                  {
                    selector: "#tour_jawabanbenar",
                    title: "Jawaban Benar",
                    description: "Tekan tombol berikut jika jawaban anak benar",
                    disableMaskInteraction: false,
                    disableClose: true,
                    disableSmoothScroll: true,
                    closeLabel: "",
                  },
                  {
                    selector: "#tour_summary",
                    title: "Selamat Mencoba",
                    description: "Tekan Tombol tutup dan permainan akan berlanjut",
                    disableMaskInteraction: false,
                    disableSmoothScroll: true,
                    closeLabel: "Tutup",
                  },
                ]}
              />
              <div className="container">
                <div className="row mt-5">
                  <div className="col-6 col-sm-6 col-md-4 mx-auto">
                    <div className={stylesCustom.mini_card} id="tour_soal">
                      <h4 style={{ marginBottom: "0px" }}>
                        Soal: {indexQuestion + 1} / {QuestionNumber}
                      </h4>
                    </div>
                  </div>
                  <div className="col-6 col-sm-6 col-md-4 mx-auto">
                    <div className={stylesCustom.mini_card} id="tour_benar">
                      <h4 style={{ marginBottom: "0px", color: "green" }}>
                        Benar: {rightQuestion} / {QuestionNumber}
                      </h4>
                    </div>
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
                <div className={stylesCustom.card_option} id="tour_gambarbenda">
                  <Image
                    onClick={() => {
                      playSound();
                    }}
                    src={`/assets/items/${kategori}/image/${quizData[indexQuestion].name}_${quizData[indexQuestion].imageNum}.png`}
                    width={window.innerHeight * 0.4}
                    height={window.innerHeight * 0.4}
                    alt="BendaImage"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>

              {enableRecog ? (
                <div className={stylesCustom.button_container}>
                  <div
                    className={stylesCustom.button_image_subtitle}
                    onClick={() => {
                      start_record();
                    }}
                  >
                    <Image ref={recordButtonRef} src={recordIcon} width={window.innerHeight * 0.2} height={window.innerHeight * 0.2} alt="ButtonNo" style={{ cursor: "pointer" }} />
                  </div>
                </div>
              ) : (
                <div className={stylesCustom.button_container}>
                  <div className={stylesCustom.button_image_subtitle} onClick={() => selectOption(false)} id="tour_jawabansalah">
                    <Image src={`/assets/button_no.png`} width={window.innerHeight * 0.15} height={window.innerHeight * 0.15} alt="ButtonNo" style={{ cursor: "pointer" }} />
                    <h4 style={{ marginBottom: "0px" }}>Salah</h4>
                  </div>
                  <div className={stylesCustom.button_image_subtitle} onClick={() => selectOption(true)} id="tour_jawabanbenar">
                    <Image src={`/assets/button_ok.png`} width={window.innerHeight * 0.15} height={window.innerHeight * 0.15} alt="ButtonOK" style={{ cursor: "pointer" }} />
                    <h4 style={{ marginBottom: "0px" }}>Benar</h4>
                  </div>
                </div>
              )}

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
              <div className={stylesCustom.home_button} onClick={() => router.push("/home")}>
                <div className={stylesCustom.button_card}>
                  <h4 style={{ marginBottom: "0px", color: "green" }}>Home</h4>
                </div>
              </div>
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

function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    console.log(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
}

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const blobToBase64 = (blob) => blobToDataUrl(blob).then((text) => text.slice(text.indexOf(",")));

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

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer, options) {
  const type = options.isFloat ? Float32Array : Uint16Array;
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0);
  wavBytes.set(new Uint8Array(buffer), headerBytes.length);

  return wavBytes;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
  const numFrames = options.numFrames;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 44100;
  const bytesPerSample = options.isFloat ? 4 : 2;
  const format = options.isFloat ? 3 : 1;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dv = new DataView(buffer);

  let p = 0;

  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  }

  function writeUint32(d) {
    dv.setUint32(p, d, true);
    p += 4;
  }

  function writeUint16(d) {
    dv.setUint16(p, d, true);
    p += 2;
  }

  writeString("RIFF"); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString("data"); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}
