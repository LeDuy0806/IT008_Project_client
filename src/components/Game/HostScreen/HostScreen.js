import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import WaitingRoom from "../WaitingRoom/WaitingRoom"
import { useDispatch, useSelector } from "react-redux"
import { getGame } from "../../../actions/game"
import { getQuiz } from "../../../actions/quiz"
import {
  // getLeaderboard,
  updateQuestionLeaderboard,
  updateCurrentLeaderboard,
} from "../../../actions/leaderboard"
import styles from "./hostScreen.module.css"
import Question from "../Question/Question"
import { toast } from "react-toastify"

function HostScreen() {
  const socket = useSelector((state) => state.socket.socket)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isPreviewScreen, setIsPreviewScreen] = useState(false)
  const [isQuestionScreen, setIsQuestionScreen] = useState(false)
  const [isQuestionResultScreen, setIsQuestionResultScreen] = useState(false)
  const [isLeaderboardScreen, setIsLeaderboardScreen] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timer, setTimer] = useState(0)
  const [playerList, setPlayerList] = useState([])
  const [questionData, setQuestionData] = useState({
    questionType: "Quiz",
    pointType: "Standard",
    answerTime: 5,
    backgroundImage: "",
    question: "",
    answerList: [
      { name: "a", body: "", isCorrect: false },
      { name: "b", body: "", isCorrect: false },
      { name: "c", body: "", isCorrect: false },
      { name: "d", body: "", isCorrect: false },
    ],
    questionIndex: 1,
  })
  const dispatch = useDispatch()
  const { id } = useParams()
  const { game } = useSelector((state) => state.games)
  const { quiz } = useSelector((state) => state.quiz)
  const { leaderboard } = useSelector((state) => state.leaderboards)
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)
  const [questionResult, setQuestionResult] = useState(
    leaderboard?.questionLeaderboard[0]
  )
  const [currentLeaderboard, setCurrentLeaderboard] = useState(
    leaderboard?.currentLeaderboard[0]
  )

  useEffect(() => {
    dispatch(getGame(id))
  }, [id, dispatch])

  useEffect(() => {
    if (game) {
      dispatch(getQuiz(game.quizId))
    }
  }, [dispatch, game])

  useEffect(() => {
    setTimer(5)
  }, [])
  useEffect(() => {
    socket.on("get-answer-from-player", (data, id, score, player) => {
      updateLeaderboard(data, id, score)
      let playerData = { id: data.playerId, userName: player.userName }
      setPlayerList((prevstate) => [...prevstate, playerData])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const updateLeaderboard = async (data, id, score) => {
    let question = await dispatch(updateQuestionLeaderboard(data, id))
    setQuestionResult(question.questionLeaderboard[data.questionIndex - 1])
    let leaderboardData = {
      questionIndex: data.questionIndex,
      playerId: data.playerId,
      playerCurrentScore: score,
    }
    let leaderboard = await dispatch(
      updateCurrentLeaderboard(leaderboardData, id)
    )
    setCurrentLeaderboard(
      leaderboard.currentLeaderboard[data.questionIndex - 1]
    )
  }

  const startGame = () => {
    socket.emit("start-game", quiz)
    socket.emit("question-preview", () => {
      startPreviewCountdown(5, currentQuestionIndex)
    })
    setIsGameStarted((prevstate) => !prevstate)
    setIsPreviewScreen(true)
  }

  const startPreviewCountdown = (seconds, index) => {
    setIsLeaderboardScreen(false)
    setIsPreviewScreen(true)
    let time = seconds
    let interval = setInterval(() => {
      setTimer(time)
      if (time === 0) {
        clearInterval(interval)
        displayQuestion(index)
        setIsPreviewScreen(false)
        setIsQuestionScreen(true)
      }
      time--
    }, 1000)
  }

  const startQuestionCountdown = (seconds, index) => {
    let time = seconds
    let interval = setInterval(() => {
      setTimer(time)
      if (time === 0) {
        clearInterval(interval)
        displayQuestionResult(index)
      }
      time--
    }, 1000)
  }
  const displayQuestionResult = (index) => {
    setIsQuestionScreen(false)
    setIsQuestionResultScreen(true)
    setTimeout(() => {
      displayCurrentLeaderBoard(index)
    }, 5000)
  }

  const displayCurrentLeaderBoard = (index) => {
    setIsQuestionResultScreen(false)
    setIsLeaderboardScreen(true)
    if (index >= quiz.questionList.length) {
      socket.emit("host-end-game", playerList, currentLeaderboard)
      toast.info('Game ended!', {
        position: "top-right",
        autoClose: 2000,
        pauseOnFocusLoss: false,
      })
    }
    else {
      setTimeout(() => {
        socket.emit("question-preview", () => {
          startPreviewCountdown(5, index)
          index !== quiz.questionList.length - 1 && setPlayerList([])
        })
      }, 5000)
    }
  }

  const displayQuestion = (index) => {
    if (index === quiz.questionList.length) {
      displayCurrentLeaderBoard(index)
    } else {
      setQuestionData(quiz.questionList[index])
      setCurrentQuestionIndex((prevstate) => prevstate + 1)
      let time = quiz.questionList[index].answerTime
      let question = {
        questionData: quiz.questionList[index],
        answerList: quiz.questionList[index].answerList,
        questionIndex: quiz.questionList[index].questionIndex,
        correctAnswersCount: quiz.questionList[index].answerList.filter(
          (answer) => answer.isCorrect === true
        ).length,
      }
      socket.emit("start-question-timer", time, question, () => {
        startQuestionCountdown(time, index + 1)
      })
    }
  }
  console.log(playerList)
  return (
    <div className={styles.page}>
      {!isGameStarted && (
        <div className={styles.lobby}>
          <WaitingRoom pin={game?.pin} socket={socket} />
          <button onClick={startGame}>
            {isLanguageEnglish ? "Start a game" : "Bắt đầu trò chơi"}
          </button>
        </div>
      )}

      {isPreviewScreen && (
        <div className={styles["lobby"]}>
          <h1>{timer}</h1>
        </div>
      )}
      {isQuestionScreen && (
        <div className={styles["question-preview"]}>
          <Question
            key={questionData.questionIndex}
            question={questionData}
            timer={timer}
            host={true}
          />
        </div>
      )}
      {isQuestionResultScreen && (
        <div className={styles["lobby"]}>
          <div className={styles["leaderboard"]}>
            <h1 className={styles["leaderboard-title"]}>
              {isLanguageEnglish ? "Question result" : "Kết quả của câu hỏi"}
            </h1>
            <ol>
              {questionResult.questionResultList.map((player, index) => (
                <li key={index}>
                  {playerList
                    .filter((x) => x.id === player.playerId)
                    .map((x) => (
                      <mark>{x.userName}</mark>
                    ))}
                  <small>{player.playerPoints}</small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
      {isLeaderboardScreen && (
        <div className={styles["lobby"]}>
          <div className={styles["leaderboard"]}>
            <h1 className={styles["leaderboard-title"]}>
              {isLanguageEnglish ? "Leaderboard" : "Bảng điểm"}
            </h1>
            <ol>
              {currentLeaderboard.leaderboardList.map((player) => (
                <li>
                  {playerList
                    .filter((x) => x.id === player.playerId)
                    .map((x) => (
                      <mark>{x.userName}</mark>
                    ))}
                  <small>{player.playerCurrentScore}</small>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

export default HostScreen
