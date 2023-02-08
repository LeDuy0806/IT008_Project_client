import React from "react"
import styles from "./question.module.css"
import diamond from "../../../assets/diamond.svg"
import triangle from "../../../assets/triangle.svg"
import circle from "../../../assets/circle.svg"
import square from "../../../assets/square.svg"
import Answer from "../Answer/Answer"

function Question({ question, timer, host, isAnswerClicked, onClick }) {
  return (
    <div className={styles["container"]}>
      <div className={styles["question"]}>
        <div className={styles["question-time"]}><div>{timer}</div></div>
        <h2 className={styles["question-name"]}>{question.question}</h2>
        <div className={styles["image-container"]}
          style={{
            flex: question.backgroundImage === "" && '1',
          }}
        >
          {question.backgroundImage && (
            <img src={question.backgroundImage} alt="" />
          )}
        </div>
      </div>

      <div className={styles["answers-container"]}>
        <Answer
          body={question.answerList[0].body}
          icon={triangle}
          showText={host ? true : false}
          isAnswerClicked={!host && isAnswerClicked('a')}
          onClick={() => onClick('a')}
        />
        <Answer
          body={question.answerList[1].body}
          icon={diamond}
          showText={host ? true : false}
          isAnswerClicked={!host && isAnswerClicked('b')}
          onClick={() => onClick('b')}
        />
        {question.questionType !== "True/False" && (
          <>
            <Answer
              body={question.answerList[2].body}
              icon={circle}
              showText={host ? true : false}
              isAnswerClicked={!host && isAnswerClicked('c')}
              onClick={() => onClick('c')}
            />
            <Answer
              body={question.answerList[3].body}
              icon={square}
              showText={host ? true : false}
              isAnswerClicked={!host && isAnswerClicked('d')}
              onClick={() => onClick('d')}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default Question
