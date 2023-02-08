import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import styles from "./waitingRoom.module.css"

function WaitingRoom({ pin, socket }) {
  const [playerList, setPlayerList] = useState([])
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)

  useEffect(() => {
    socket.on("player-added", (player) => {
      setPlayerList([...playerList, player])
    })
  }, [playerList, socket])

  return (
    <div className={styles["waiting-room"]}>
      <div className={styles["header"]}>
        <h1 className={styles["title"]}>
          {isLanguageEnglish ? "Waiting room" : "Phòng chờ"}
        </h1>
        <h2 className={styles["heading"]}>
          {isLanguageEnglish
            ? "Show PIN to your students"
            : "Hiển thị PIN cho người khác"}
          : {pin}
        </h2>
      </div>
      <div className={styles["players-list"]}>
        <div className={styles["leaderboard"]}>
          <h1 className={styles["leaderboard-title"]}>
            {isLanguageEnglish ? "Player List" : "Danh sách người chơi"}
          </h1>
          {playerList.length > 0 ? (
            <ol>
              {playerList.map((player, index) => (
                <li key={index}>
                  <mark>{player.userName.toUpperCase()}</mark>
                  <small>{isLanguageEnglish ? "Player " : "Người chơi"}</small>
                </li>
              ))}
            </ol>
          ) : (
            <h1 className={styles["leaderboard-title"]}>
              {isLanguageEnglish
                ? "No players yet"
                : "Chưa có người tham gia!"}
            </h1>
          )}
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom
