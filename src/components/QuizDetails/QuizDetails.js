import React, { useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from 'react-modal';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import Question from './Question/Question';
import CommentSection from './CommentSection/CommentSection';
import { getQuiz, getQuizesBySearch } from '../../actions/quiz';
import defaultQuizBackground from '../../assets/defaultQuizBackground.jpg';
import useStyles from './styles';
import Answer from './Question/Answer/Answer';
import triangle from '../../assets/triangle.svg';
import diamond from '../../assets/diamond.svg';
import circle from '../../assets/circle.svg';
import square from '../../assets/square.svg';
import styles from './quizDetails.module.css';

const Post = () => {
    const [questionData, setQuestionData] = useState({
        questionType: 'Quiz',
        answerTime: 5,
        backgroundImage: '',
        question: '',
        answerList: [
            { name: 'a', body: '', isCorrect: false },
            { name: 'b', body: '', isCorrect: false },
            { name: 'c', body: '', isCorrect: false },
            { name: 'd', body: '', isCorrect: false },
        ],
    });

    const [showAnswer, setShowAnswer] = useState(false);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { quiz, isLoading } = useSelector((state) => state.quiz);
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);
    const dispatch = useDispatch();
    const classes = useStyles();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getQuiz(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (quiz) {
            dispatch(
                getQuizesBySearch({
                    search: 'none',
                    tags: quiz?.tags.join(','),
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    if (!quiz) return null;

    if (isLoading || quiz === null) {
        return (
            <div className={classes.card}>
                {/* Background Image */}
                <div className={classes.imageSection}>
                    <div>
                        <Skeleton style={{ height: '200px', width: '100%' }} />
                    </div>

                    <div className={classes.info}>
                        <Typography variant="h3" component="h2">
                            <Skeleton />
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h6"
                            color="textSecondary"
                            component="h2"
                        >
                            <Skeleton />
                        </Typography>
                        <Typography gutterBottom variant="body1" component="p">
                            <Skeleton />
                        </Typography>
                        <Typography variant="h6">
                            <Skeleton />
                        </Typography>
                        <Typography variant="body1">
                            <Skeleton />
                        </Typography>

                        <CommentSection quiz={null} />
                    </div>
                </div>

                <div
                    className={classes.questions}
                    style={{ marginLeft: '40px' }}
                >
                    <div>
                        <Typography gutterBottom variant="h5">
                            <Skeleton />
                        </Typography>
                        {/* <Divider /> */}

                        <Question quiz={null} />
                        <Question quiz={null} />
                        <Question quiz={null} />
                        <Divider style={{ marginBottom: '20px' }} />
                    </div>
                </div>
            </div>
        );
    }

    const isQuestionQuiz = () => {
        return questionData.questionType === 'Quiz';
    };
    // Code start

    const handleClickNext = () => {
        const nextQuestion = quiz.questionList[questionData.index + 1];
        setQuestionData({
            index: questionData.index + 1,
            ...nextQuestion,
        });
        setShowAnswer(false);
    };
    const handleClickPrev = () => {
        const nextQuestion = quiz.questionList[questionData.index - 1];
        setQuestionData({
            index: questionData.index - 1,
            ...nextQuestion,
        });
        setShowAnswer(false);
    };
    const showModal = () => {
        setModalIsOpen(true);
        console.log(questionData.answerList)
        let wrongAnswer = questionData.answerList.filter((answer) =>
            answer.isCorrect === false
        ).map((answer) => answer.name)
        let trueAnswer = questionData.answerList.filter((answer) =>
            answer.isCorrect === true
        ).map((answer) => answer.name)

        if (trueAnswer.length <= 2) {
            for (let i = 0; i <= trueAnswer.length - 1; i++) {
                console.log(wrongAnswer[i])
            }
        }
        else {
            if (wrongAnswer.length > 0)
                for (let i = 0; i <= wrongAnswer.length - 1; i++) {
                    console.log(wrongAnswer[i])
                }
            for (let i = 0; i <= trueAnswer.length - 1 - wrongAnswer.length; i++) {
                console.log(trueAnswer[i])
            }
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setShowAnswer(false);
    };

    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 2,
        },
        content: {
            width: '90%',
            height: '96%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            borderRadius: '12px',
            padding: '10px',
            backgroundColor: '#000',
            border: 'none',
        },
    };

    const handleShowAnswer = () => {
        setShowAnswer((prev) => !prev);
    };

    // Code end

    return (
        <section>
            <div className={classes.card}>
                <div
                    className={classes.imageSection}
                    style={{
                        background: 'linear-gradient(90deg, #EFF5F5, #D6E4E5)',
                    }}
                >
                    {quiz.backgroundImage ? (
                        <img
                            className={classes.media}
                            src={quiz.backgroundImage}
                            alt=""
                        />
                    ) : (
                        <img
                            className={classes.media}
                            src={defaultQuizBackground}
                            alt=""
                        />
                    )}

                    <div className={classes.info}>
                        <Typography
                            variant="h3"
                            component="h2"
                            style={{
                                fontSize: '2rem',
                                fontWeight: '600',
                            }}
                        >
                            {quiz.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            component="h2"
                            style={{
                                fontSize: '.8rem',
                            }}
                        >
                            {quiz.tags.map((tag) => `#${tag} `)}
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            style={{
                                lineHeight: '1.5',
                                paddingRight: '30px',
                            }}
                        >
                            {quiz.description}
                        </Typography>
                        <Typography
                            variant="h6"
                            style={{
                                lineHeight: '1.4',
                            }}
                        >
                            {isLanguageEnglish ? 'Created by: ' : 'Tạo bởi: '}
                            {quiz.creatorName}
                        </Typography>
                        <Typography variant="body1">
                            {moment(quiz.dateCreated).fromNow()}
                        </Typography>

                        <CommentSection quiz={quiz} />
                    </div>
                </div>
                <div
                    className={classes.questions}
                    style={{
                        background: 'linear-gradient(90deg, #D6E4E5, #497174)',
                    }}
                >
                    {/* Render Question List */}
                    {quiz.questionList.length > 0 && (
                        <div>
                            <Typography
                                gutterBottom
                                variant="h5"
                                style={{
                                    fontSize: '28px',
                                    color: '#FFF',
                                    fontWeight: '600',
                                    textShadow: '2px 2px 8px #000',
                                }}
                            >
                                {isLanguageEnglish
                                    ? 'QUESTION LIST '
                                    : 'Danh sách câu hỏi '}
                                <span style={{ fontSize: '14px' }}>
                                    (click in quiz card to preview)
                                </span>
                            </Typography>
                            {/* <Divider /> */}
                            {quiz.questionList.map((question, index) => (
                                <Question
                                    key={question._id}
                                    question={question}
                                    onClick={() => {
                                        setQuestionData({
                                            ...question,
                                            index: index,
                                        });
                                        showModal();
                                    }}
                                />
                            ))}
                            <Divider
                                style={{ width: '96%', marginBottom: '20px' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => closeModal()}
                // afterOpenModal={() => afterOpenModal()}
                style={customStyles}
                contentLabel="Detail Question Modal"
            >
                <div className={styles['heading']}>
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div className={styles['index-question']}>
                            <p>
                                <span>{questionData.index + 1}</span>/
                                {quiz.numberOfQuestions}
                            </p>
                        </div>
                        <div className={styles['type-question']}>
                            {isQuestionQuiz() ? <QuizIcon /> : <CheckBoxIcon />}
                            <p>{questionData.questionType}</p>
                        </div>
                    </div>

                    <div className={styles['sub-title']}>
                        <p>
                            Question <span>Preview</span>
                        </p>
                    </div>

                    <IconButton
                        onClick={() => closeModal()}
                        sx={{
                            color: '#fff',
                            background: '#3a3a3a',
                            borderRadius: '8px',
                            '&:hover': {
                                background: '#5a5a5a',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <div className={styles['body']}>
                    <div className={styles['image-container']}>
                        <div className={styles['question']}>
                            <h2>{questionData.question}</h2>
                        </div>

                        {questionData.backgroundImage && (
                            <img
                                className={styles['question-img']}
                                src={questionData.backgroundImage}
                                alt=""
                            />
                        )}
                    </div>

                    <div className={styles['answers-container']}>
                        <div
                            style={{
                                height: isQuestionQuiz() ? '108px' : '140px',
                            }}
                            className={styles['answer-field']}
                        >
                            <Answer
                                showAnswer={showAnswer}
                                value={questionData.answerList[0].body}
                                name={'a'}
                                isAnswerCorrect={
                                    showAnswer &&
                                    questionData.answerList[0].isCorrect
                                }
                                svg={triangle}
                            />
                        </div>
                        <div
                            style={{
                                height: isQuestionQuiz() ? '108px' : '140px',
                            }}
                            className={styles['answer-field']}
                        >
                            <Answer
                                showAnswer={showAnswer}
                                value={questionData.answerList[1].body}
                                name={'b'}
                                isAnswerCorrect={
                                    showAnswer &&
                                    questionData.answerList[1].isCorrect
                                }
                                svg={diamond}
                            />
                        </div>
                        {isQuestionQuiz() && (
                            <>
                                <div className={styles['answer-field']}>
                                    <Answer
                                        showAnswer={showAnswer}
                                        value={questionData.answerList[2].body}
                                        name={'c'}
                                        isAnswerCorrect={
                                            showAnswer &&
                                            questionData.answerList[2].isCorrect
                                        }
                                        svg={circle}
                                    />
                                </div>
                                <div className={styles['answer-field']}>
                                    <Answer
                                        showAnswer={showAnswer}
                                        value={questionData.answerList[3].body}
                                        name={'d'}
                                        isAnswerCorrect={
                                            showAnswer &&
                                            questionData.answerList[3].isCorrect
                                        }
                                        svg={square}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles['actions']}>
                    <Button
                        variant="contained"
                        startIcon={
                            showAnswer ? (
                                <VisibilityOffIcon />
                            ) : (
                                <VisibilityIcon />
                            )
                        }
                        sx={{
                            fontWeight: '600',
                            fontSize: '16px',
                            color: '#fff',
                            background: 'rgb(136 84 192)',
                            padding: '8px 16px',
                            '&:hover': {
                                background: 'rgb(160 118 204)',
                            },
                        }}
                        onClick={handleShowAnswer}
                    >
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </Button>

                    <div className={styles['change-page']}>
                        <IconButton
                            sx={{
                                color: '#fff',
                                background: '#3a3a3a',
                                borderRadius: '8px',
                                marginRight: '8px',
                                '&:disabled': {
                                    background: '#3a3a3a',
                                    opacity: '0.6',
                                },
                                '&:hover': {
                                    background: '#5a5a5a',
                                },
                            }}
                            disabled={questionData.index === 0}
                            onClick={handleClickPrev}
                        >
                            <PlayArrowIcon
                                sx={{
                                    transform: 'rotate(180deg)',
                                }}
                            />
                        </IconButton>
                        <IconButton
                            sx={{
                                color: '#fff',
                                background: '#3a3a3a',
                                borderRadius: '8px',
                                '&:disabled': {
                                    background: '#3a3a3a',
                                    opacity: '0.6',
                                },
                                '&:hover': {
                                    background: '#5a5a5a',
                                },
                            }}
                            disabled={
                                questionData.index + 1 ===
                                quiz.numberOfQuestions
                            }
                            onClick={handleClickNext}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default Post;
