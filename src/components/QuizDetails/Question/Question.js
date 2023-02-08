import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import QuestionListItem from '../../QuizCreator/QuestionListItem/QuestionListItem';
import styles from './question.module.css';

function Question({ question, onClick }) {
    if (question == null) {
        return (
            <>
                <div className={styles['quiz-card']}>
                    <div style={{ padding: '5px', borderRadius: '5%' }}>
                        <h4>
                            <Skeleton />
                        </h4>
                        <div
                            style={{
                                padding: '5px',
                                margin: '5px',
                                top: '-10px',
                                height: '80px',
                            }}
                        >
                            <Skeleton height="100%" />
                        </div>
                    </div>
                    <div className={styles['card-body']}>
                        <p className={styles['quiz-description']}>
                            <Skeleton />
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={styles['quiz-card']} onClick={onClick}>
            <div>
                <QuestionListItem
                    key={question.questionIndex}
                    number={question.questionIndex}
                    type={question.questionType}
                    time={question.answerTime}
                    image={question.backgroundImage}
                    style={{
                        background: '#EEEEEE',
                    }}
                />
            </div>
            <div className={styles['card-body']}>
                <p className={styles['quiz-description']}>
                    {question.question}
                </p>
            </div>
        </div>
    );
}

export default Question;
