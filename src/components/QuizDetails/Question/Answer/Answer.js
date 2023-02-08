import React from 'react';
import styles from './answer.module.css';
import answerCheck from '../../../../assets/answerCheck.svg';

function Answer({ value, isAnswerCorrect, svg, name, showAnswer }) {
    return (
        <div
            className={`${styles['answer-field']} ${
                isAnswerCorrect && styles['answer-correct']
            }`}
            style={{
                opacity: !showAnswer || isAnswerCorrect ? '1' : '.1',
            }}
        >
            <img className={styles['answer-icon']} src={svg} alt="" />
            <p value={value} name={name} className={styles['answer-text']}>
                {value}
            </p>
            <div className={styles['answer-check']}>
                <img
                    style={{
                        visibility: isAnswerCorrect ? 'visible' : 'hidden',
                    }}
                    src={answerCheck}
                    alt=""
                />
            </div>
        </div>
    );
}

export default Answer;
