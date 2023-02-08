import React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addAnswer, getPlayerResult } from "../../../actions/playerResult"
import { useEffect } from "react"
import styles from "./playerScreen.module.css"
// import Answer from "../Answer/Answer"
// import diamond from "../../../assets/diamond.svg"
// import triangle from "../../../assets/triangle.svg"
// import circle from "../../../assets/circle.svg"
// import square from "../../../assets/square.svg"
import { CircularProgress } from "@material-ui/core"
import { toast } from "react-toastify"
import Question from "../Question/Question"

function PlayerScreen() {
  const socket = useSelector((state) => state.socket.socket)
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)
  const dispatch = useDispatch()
  const { playerResult } = useSelector((state) => state.playerResults)
  const [result, setResult] = useState(playerResult?.answers[0])

  const [totalResult, setTotalResult] = useState(playerResult?.score)
  const [isGameEnded, setIsGameEnded] = useState(false)
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false)
  const [isPreviewScreen, setIsPreviewScreen] = useState(false)
  const [isQuestionScreen, setIsQuestionScreen] = useState(false)
  const [isResultScreen, setIsResultScreen] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerQuestion, setTimerQuestion] = useState(0)
  const [answerTime, setAnswerTime] = useState(0)
  const [questionData, setQuestionData] = useState()
  const [correctAnswerCount, setCorrectAnswerCount] = useState(1)

  const [answer, setAnswer] = useState({
    questionIndex: 0,
    answers: [],
    time: 0,
  })

  useEffect(() => {
    setTimer(5)
  }, [])

  useEffect(() => {
    socket.on("host-start-preview", () => {
      setIsPreviewScreen(true)
      setIsResultScreen(false)
      startPreviewCountdown(5)
    })
    socket.on("host-start-question-timer", (time, question) => {
      setQuestionData(question.questionData)
      startQuestionCountdown(time)
      setAnswer((prevstate) => ({
        ...prevstate,
        questionIndex: question.questionIndex,
        answers: [],
        time: 0,
      }))
      setCorrectAnswerCount(question.correctAnswersCount)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const startPreviewCountdown = (seconds) => {
    let time = seconds
    let interval = setInterval(() => {
      setTimer(time)
      if (time === 0) {
        clearInterval(interval)
        setIsPreviewScreen(false)
        setIsQuestionScreen(true)
      }
      time--
    }, 1000)
  }
  useEffect(() => {
    socket.on('host-end-game', (playerlist, leaderboard) => {
      console.log(playerlist)
      console.log(leaderboard)
      setIsGameEnded(true)
    })
  }, [socket])
  useEffect(() => {
    setTotalResult(playerResult?.score)
    if (isGameEnded) {
      toast.info(`Game ended! Your score is ${totalResult}`, {
        position: 'top-center',
        style: { color: '#333', marginTop: '50px' },
        autoClose: false,
      })
    }
  }, [isGameEnded, playerResult?.score, totalResult])

  useEffect(() => {
    if (timerQuestion === 0) {
      if (isQuestionAnswered === false && questionData) {

        let wrongAnswer = questionData.answerList.filter((answer) =>
          answer.isCorrect === false
        ).map((answer) => answer.name)
        let trueAnswer = questionData.answerList.filter((answer) =>
          answer.isCorrect === true
        ).map((answer) => answer.name)

        if (correctAnswerCount < 3) {
          for (let i = 0; i <= correctAnswerCount - 1; i++) {
            checkAnswer(wrongAnswer[i])
          }
        }
        else {
          for (let i = 0; i <= wrongAnswer.length - 1; i++) {
            checkAnswer(wrongAnswer[i])
          }
          for (let i = 0; i <= correctAnswerCount - 1 - wrongAnswer.length; i++) {
            checkAnswer(trueAnswer[i])
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerQuestion])
  const startQuestionCountdown = (seconds) => {
    let time = seconds
    let answerSeconds = 0
    let interval = setInterval(() => {
      setTimerQuestion(time)
      setAnswerTime(answerSeconds)
      if (time === 0) {
        clearInterval(interval)
        setIsQuestionScreen(false)
        setIsQuestionAnswered(false)
        setIsResultScreen(true)
      }
      time--
      answerSeconds++

    }, 1000)
  }

  const sendAnswer = async () => {
    const updatedPlayerResult = await dispatch(
      addAnswer(answer, playerResult._id)
    )
    console.log(
      updatedPlayerResult.answers[updatedPlayerResult.answers.length - 1]
    )
    setResult(
      updatedPlayerResult.answers[updatedPlayerResult.answers.length - 1]
    )
    let data = {
      questionIndex: answer.questionIndex,
      playerId: updatedPlayerResult.playerId,
      playerPoints:
        updatedPlayerResult.answers[answer.questionIndex - 1].points,
    }
    let score = updatedPlayerResult.score
    socket.emit("send-answer-to-host", data, score)
    dispatch(getPlayerResult(playerResult._id))
  }

  const checkAnswer = (name) => {
    let answerIndex = answer.answers.findIndex((obj) => obj === name)
    if (answer.answers.includes(name)) {
      //remove answer
      setAnswer((prevstate) => ({
        ...prevstate,
        answers: [
          ...prevstate.answers.slice(0, answerIndex),
          ...prevstate.answers.slice(answerIndex + 1, prevstate.answers.length),
        ],
      }))
    } else {
      //add answer
      setAnswer((prevstate) => ({
        ...prevstate,
        answers: [...prevstate.answers, name],
      }))
    }
    setAnswer((prevstate) => ({
      ...prevstate,
      time: answerTime,
    }))
  }

  useEffect(() => {
    if (
      answer?.answers.length > 0 &&
      answer?.answers.length === correctAnswerCount
    ) {
      setIsQuestionScreen(false)
      setIsQuestionAnswered(true)
      sendAnswer()
    } else {
      setIsQuestionAnswered(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer?.answers.length, correctAnswerCount, answer, socket])

  return (
    <div className={styles.page}>
      {isPreviewScreen && (
        <div className={styles["lobby"]}>
          <h1>{timer}</h1>
        </div>
      )}
      {isQuestionScreen && (
        <div className={styles["question-preview"]}>
          {questionData && <Question
            question={questionData}
            timer={timerQuestion}
            host={false}
            isAnswerClicked={(key) => answer.answers.includes(key)}
            onClick={(key) => checkAnswer(key)}
          />}
          {/* <div className={styles["question"]}>
            {questionData && (
              <>
                <h2 className={styles["question-name"]}>{questionData.question}</h2>
                <div className={styles["container"]}>
                  <div className={styles["question-time"]}>{timer}</div>
                  {questionData.backgroundImage && (
                    <img src={questionData.backgroundImage} alt="" className={styles["question-image"]} />
                  )}
                  <div></div>
                </div>
              </>
            )}
            <div className={styles["answers-container"]}>
              <Answer
                body={questionData && questionData.answerList[0].body}
                icon={triangle}
                showText={false}
                isAnswerClicked={answer.answers.includes("a")}
                onClick={() => checkAnswer("a")}
              />
              <Answer
                body={questionData && questionData.answerList[1].body}
                icon={diamond}
                showText={false}
                isAnswerClicked={answer.answers.includes("b")}
                onClick={() => checkAnswer("b")}
              />
              {questionData?.answerList.length > 2 && (
                <>
                  <Answer
                    body={questionData && questionData.answerList[2].body}
                    icon={circle}
                    showText={false}
                    isAnswerClicked={answer.answers.includes("c")}
                    onClick={() => checkAnswer("c")}
                  />
                  <Answer
                    body={questionData && questionData.answerList[3].body}
                    icon={square}
                    showText={false}
                    isAnswerClicked={answer.answers.includes("d")}
                    onClick={() => checkAnswer("d")}
                  />
                </>
              )}
            </div>
          </div> */}
        </div>
      )}
      {isQuestionAnswered && (
        <div className={styles["lobby"]}>
          <h1>{isLanguageEnglish ? "Wait for a result" : "Chờ kết quả"}</h1>
          <CircularProgress />
        </div>
      )}
      {isResultScreen && (
        <div
          className={styles["lobby"]}
          style={{ backgroundColor: result.points > 0 ? "green" : "red", backgroundImage: "none" }}
        >
          <h1>{isLanguageEnglish ? "Result" : "Kết quả"}</h1>
          <h3>
            {result.points > 0
              ? isLanguageEnglish
                ? "Correct"
                : "Chính xác"
              : isLanguageEnglish
                ? "Wrong"
                : "Sai"}
          </h3>
          <h3>
            {isLanguageEnglish ? "Points: " : "Điểm số: "} {result.points}
          </h3>
        </div>
      )}
    </div>
  )
}

export default PlayerScreen
