import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import FileBase from 'react-file-base64';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import styles from './quizCreator.module.css';
import QuestionListItem from './QuestionListItem/QuestionListItem';
import AnswerInput from './AnswerInput/AnswerInput';
import { updateQuiz, getQuiz } from '../../actions/quiz';
import triangle from '../../assets/triangle.svg';
import diamond from '../../assets/diamond.svg';
import circle from '../../assets/circle.svg';
import square from '../../assets/square.svg';
import questionType from '../../assets/questionType.svg';
import timer from '../../assets/timer.svg';
import gamePoints from '../../assets/gamePoints.svg';
import answerOptions from '../../assets/answerOptions.svg';
import backgroundIcon from '../../assets/background_icon.png';
import defaultQuestionImage from '../../assets/defaultQuestionImage.svg';

function QuizCreator() {
    let subtitle;

    const user = JSON.parse(localStorage.getItem('profile'));
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);

    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [quizData, setQuizData] = useState({
        name: '',
        creatorName: `${user?.result.firstName} ${user?.result.lastName}`,
        backgroundImage: '',
        description: '',
        pointsPerQuestion: 1,
        numberOfQuestions: 0,
        isPublic: true,
        tags: [],
        questionList: [],
    });

    const [questionData, setQuestionData] = useState({
        questionType: 'Quiz',
        pointType: 'Standard',
        answerTime: 5,
        backgroundImage: '',
        question: '',
        answerList: [
            { name: 'a', body: '', isCorrect: false },
            { name: 'b', body: '', isCorrect: false },
            { name: 'c', body: '', isCorrect: false },
            { name: 'd', body: '', isCorrect: false },
        ],
        questionIndex: 1,
    });

    useEffect(() => {
        dispatch(getQuiz(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const [modalIsOpen, setIsOpen] = React.useState(false);

    const { quiz } = useSelector((state) => state.quiz);

    useEffect(() => {
        if (quiz) {
            setQuizData(quiz);
            setQuestionData((prev) => ({
                ...prev,
                questionIndex: quiz.numberOfQuestions + 1,
            }));
        }
    }, [quiz]);

    // const [isQuizPublic, setIsQuizPublic] = useState(quizData.isPublic);
    const [isQuestionDataSave, setIsQuestionDataSave] = useState(false);
    const [questionImage, setQuestionImage] = useState('');
    const [quizImage, setQuizImage] = useState('');

    // ===== Notify =====
    const NotifyEnterQues = {
        Eng: 'Enter your question',
        Vie: 'Nhập nội dung của câu hỏi',
    };

    const NotifyEnterAnswer = {
        Eng: 'Enter your answer',
        Vie: 'Nhập nội dung của câu trả lời',
    };

    const NotifyChooseAnswer = {
        Eng: 'Choose correct answer',
        Vie: 'Chọn câu trả lời đúng',
    };

    const NotifyAlreadyAnswer = {
        Eng: 'You chose the correct answer',
        Vie: 'Bạn đã chọn câu trả lời đúng',
    };

    const NotifySaveChanges = {
        Eng: 'Save changes first',
        Vie: 'Lưu các thay đổi trước tiên',
    };

    const NotifyDelete = {
        Eng: 'Delete successfully',
        Vie: 'Đã xóa thành công',
    };

    const NotifyNotDelete = {
        Eng: 'No more questions to delete',
        Vie: 'Không còn câu hỏi để xóa',
    };

    const NotifySaveSuccess = {
        Eng: 'Save successfully',
        Vie: 'Lưu thành công',
    };

    const showQuizOptions = () => {
        setIsOpen(true);
    };

    const setCorrectAnswer = (index) => {
        setQuestionData((prevState) => ({
            ...prevState,
            answerList: [
                ...prevState.answerList.slice(0, index),
                {
                    name: prevState.answerList[index].name,
                    body: prevState.answerList[index].body,
                    isCorrect: !prevState.answerList[index].isCorrect,
                },
                ...prevState.answerList.slice(
                    index + 1,
                    prevState.answerList.length,
                ),
            ],
        }));

        questionData.answerList[index].isCorrect
            ? setCorrectAnswerCount((prevState) => prevState - 1)
            : setCorrectAnswerCount((prevState) => prevState + 1);
    };

    const handleQuizSubmit = (e) => {
        dispatch(updateQuiz(quiz._id, quizData));
        history.push(`/myquizes`);
    };

    const [openExitDialog, setOpenExitDialog] = useState(false);
    const handleExit = () => {
        setOpenExitDialog(true);
    };

    const handleQuizChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
    };

    const updateAnswer = (name, body, index) => {
        setQuestionData((prevState) => ({
            ...prevState,
            answerList: [
                ...prevState.answerList.slice(0, index),
                {
                    name: name,
                    body: body,
                    isCorrect: prevState.answerList[index].isCorrect,
                },
                ...prevState.answerList.slice(
                    index + 1,
                    prevState.answerList.length,
                ),
            ],
        }));
    };

    const validateAnswerFields = () => {
        return questionData.answerList.every((answer) => answer.body !== '');
    };

    const validateCorrectAnswer = () => {
        return questionData.answerList.some(
            (answer) => answer.isCorrect === true,
        );
    };

    const handleSaveNotify = () => {
        let text = {
            warning: '',
            success: '',
        };

        let isSuccess = false;

        if (questionData.question === '') {
            text.warning = isLanguageEnglish
                ? NotifyEnterQues.Eng
                : NotifyEnterQues.Vie;
        } else if (!validateAnswerFields()) {
            text.warning = isLanguageEnglish
                ? NotifyEnterAnswer.Eng
                : NotifyEnterAnswer.Vie;
        } else if (!validateCorrectAnswer()) {
            text.warning = isLanguageEnglish
                ? NotifyChooseAnswer.Eng
                : NotifyChooseAnswer.Vie;
        } else {
            isSuccess = true;
            text.success = isLanguageEnglish
                ? NotifySaveSuccess.Eng
                : NotifySaveSuccess.Vie;
        }

        isSuccess
            ? toast.success(text.success, {
                style: {
                    color: '#fff',
                },
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            })
            : toast.warning(text.warning, {
                style: {
                    color: '#fff',
                },
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            });
    };

    const handleNotifyAlreadyAnswer = () => {
        let text = isLanguageEnglish
            ? NotifyAlreadyAnswer.Eng
            : NotifyAlreadyAnswer.Vie;

        toast.warning(text, {
            style: {
                color: '#fff',
            },
            position: 'top-center',
            autoClose: 3000,
            theme: 'dark',
        });
    };

    const handleNotifySaveChanges = () => {
        let text = isLanguageEnglish
            ? NotifySaveChanges.Eng
            : NotifySaveChanges.Vie;

        toast.warning(text, {
            style: {
                color: '#fff',
            },
            position: 'top-center',
            autoClose: 3000,
            theme: 'dark',
        });
    };

    const handleQuestionSubmit = () => {
        if (questionData.question === '') {
            handleSaveNotify();
        } else if (!validateAnswerFields()) {
            handleSaveNotify();
        } else if (!validateCorrectAnswer()) {
            handleSaveNotify();
        } else {
            handleSaveNotify();
            setIsQuestionDataSave(true);
            // if true it means question already exist and is only updated
            if (
                quizData.questionList.filter(
                    (question) =>
                        question.questionIndex === questionData.questionIndex,
                )
            ) {
                //update list of questions in quizData
                setQuizData((prevState) => ({
                    ...prevState,
                    questionList: [
                        ...prevState.questionList.slice(
                            0,
                            questionData.questionIndex - 1,
                        ),
                        questionData,
                        ...prevState.questionList.slice(
                            questionData.questionIndex,
                            prevState.questionList.length,
                        ),
                    ],
                }));
            } else {
                //question don't exist - add new one
                setQuizData({
                    ...quizData,
                    questionList: [...quizData.questionList, questionData],
                });
            }
        }
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleQuestionRemove = () => {
        let index = questionData.questionIndex;
        setQuizData((prevState) => ({
            ...prevState,
            questionList: [
                ...prevState.questionList.slice(0, index - 1),
                ...prevState.questionList.slice(
                    index,
                    prevState.questionList.length,
                ),
            ],
        }));
        //update indexes
        quizData.questionList.forEach((question) => {
            if (question.questionIndex > index) {
                question.questionIndex -= 1;
            }
        });
        //display previous question or new first one if first was deleted
        if (quizData.questionList.length > 1 && index > 1) {
            showQuestion(index - 1);
        } else if (quizData.questionList.length > 1 && index === 1) {
            showQuestion(1);
        } else {
            clear();
        }
        setCorrectAnswerCount(0);

        setOpenDeleteDialog(false);
        // Notify
        if (quizData.questionList.length !== 0) {
            let text = isLanguageEnglish ? NotifyDelete.Eng : NotifyDelete.Vie;
            toast.success(text, {
                style: {
                    color: '#fff',
                },
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            });
        } else {
            let text = isLanguageEnglish
                ? NotifyNotDelete.Eng
                : NotifyNotDelete.Vie;
            toast.warning(text, {
                style: {
                    color: '#fff',
                },
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
            });
        }
    };

    const clear = () => {
        setQuestionData({
            questionType: 'Quiz',
            pointType: 'Standard',
            answerTime: 5,
            backgroundImage: '',
            question: '',
            answerList: [
                { name: 'a', body: '', isCorrect: false },
                { name: 'b', body: '', isCorrect: false },
                { name: 'c', body: '', isCorrect: false },
                { name: 'd', body: '', isCorrect: false },
            ],
            questionIndex: quizData.questionList.length + 1,
        });
        setQuestionImage('');
    };

    const addNewQuestion = () => {
        setIsQuestionDataSave(false);
        clear();
        setIsQuestionTrueFalse(false);
        setCorrectAnswerCount(0);
    };

    const handleQuestionChange = (e) => {
        setQuestionData({ ...questionData, [e.target.name]: e.target.value });
    };

    const showQuestion = (index) => {
        var question = quizData.questionList.find(
            (question) => question.questionIndex === index,
        );
        setQuestionData(question);
        setQuestionImage(question.backgroundImage);
        question.questionType === 'True/False'
            ? setIsQuestionTrueFalse(true)
            : setIsQuestionTrueFalse(false);
    };

    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [maxCorrectAnswerCount, setMaxCorrectAnswerCount] = useState(1);

    const changeMaxCorrectAnswerCount = (e) => {
        setMaxCorrectAnswerCount(e.target.value);
        questionData.answerList.forEach((answer) => (answer.isCorrect = false));
        setCorrectAnswerCount(0);
    };

    const [isQuestionTrueFalse, setIsQuestionTrueFalse] = useState(false);

    const changeQuestionType = () => {
        setIsQuestionTrueFalse((prevState) => !prevState);
        if (!isQuestionTrueFalse) {
            questionData.answerList.splice(2, 2);
            questionData.answerList[0].body = isLanguageEnglish
                ? 'True'
                : 'Đúng';
            questionData.answerList[1].body = isLanguageEnglish
                ? 'False'
                : 'Sai';
        } else {
            questionData.answerList[0].body = '';
            questionData.answerList[1].body = '';
            questionData.answerList.push({
                name: 'c',
                body: '',
                isCorrect: false,
            });
            questionData.answerList.push({
                name: 'd',
                body: '',
                isCorrect: false,
            });
        }

        setMaxCorrectAnswerCount(1);
        questionData.answerList.forEach((answer) => (answer.isCorrect = false));
        setCorrectAnswerCount(0);
    };

    if (user === null) {
        return (
            <h1>
                {isLanguageEnglish
                    ? 'Log in to your teacher account to create quizzes'
                    : 'Đăng nhập vào tài khoản giáo viên của bạn để tạo bài kiểm tra'}
            </h1>
        );
    } else if (user.result.userType !== 'Teacher') {
        return (
            <h1>
                {isLanguageEnglish
                    ? 'Only teacher accounts are allowed to create quizzes'
                    : 'Chỉ tài khoản giao viên mới được tạo bài kiểm tra'}
            </h1>
        );
    }

    // Settings Modal
    const afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f9591e';
        subtitle.style.fontSize = '36px';
    };

    const closeModal = () => {
        setIsOpen(false);
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
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '4px',
            padding: '20px 32px',
        },
    };

    return (
        <section className={styles.section}>
            <div className={styles['question-list']}>
                <div className={styles['quiz-info']}>
                    <h1>
                        {quizData.name.length > 0
                            ? quizData.name.length > 8
                                ? quizData.name.substring(0, 20) + '...'
                                : quizData.name
                            : isLanguageEnglish
                                ? 'Set quiz name'
                                : 'Nhập tên bài kiểm tra'}
                    </h1>
                </div>

                <div className={styles['quiz-info-container']}>
                    <button
                        className={styles['quiz-info-button']}
                        onClick={showQuizOptions}
                    >
                        {isLanguageEnglish ? 'Settings' : 'Cài đặt'}
                    </button>
                    <button
                        className={styles['quiz-info-button']}
                        onClick={handleExit}
                    >
                        {isLanguageEnglish ? 'Exit' : 'Thoát'}
                    </button>
                </div>

                <div className={styles['question-list-container']}>
                    {quizData.questionList.length > 0 &&
                        quizData.questionList.map((question) => (
                            <QuestionListItem
                                onClick={() =>
                                    showQuestion(question.questionIndex)
                                }
                                key={question.questionIndex}
                                number={question.questionIndex}
                                type={question.questionType}
                                name={question.question}
                                time={question.answerTime}
                                image={question.backgroundImage}
                            />
                        ))}

                    <div className={styles['add-question-container']}>
                        <button
                            onClick={() => {
                                isQuestionDataSave
                                    ? addNewQuestion()
                                    : handleNotifySaveChanges();
                            }}
                            className={styles['add-question-button']}
                        >
                            {isLanguageEnglish
                                ? 'Add question'
                                : 'Thêm câu hỏi'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles['question-creator']}>
                <input
                    type="text"
                    name="question"
                    value={questionData.question}
                    onChange={handleQuestionChange}
                    placeholder={
                        isLanguageEnglish
                            ? 'Start typing your question'
                            : 'Bắt đầu nhập câu hỏi của bạn'
                    }
                    className={styles['question-name']}
                />
                <div className={styles['image-container']}>
                    {questionImage ? (
                        <img
                            src={questionImage}
                            alt=""
                            className={styles['question-image']}
                        />
                    ) : (
                        <div>
                            <img
                                src={defaultQuestionImage}
                                alt=""
                                className={styles['default-question-image']}
                            />
                            <h3>
                                {isLanguageEnglish
                                    ? 'Find and insert media'
                                    : 'Tìm và chèn ảnh'}
                            </h3>
                        </div>
                    )}
                </div>
                <div className={styles['answers-container']}>
                    <div className={styles['answer-field']}>
                        <AnswerInput
                            value={questionData.answerList[0].body}
                            name={'a'}
                            onChange={(e) => {
                                isQuestionTrueFalse
                                    ? updateAnswer(e.target.name, 'True', 0)
                                    : updateAnswer(
                                        e.target.name,
                                        e.target.value,
                                        0,
                                    );
                            }}
                            onClick={() => {
                                correctAnswerCount < maxCorrectAnswerCount ||
                                    questionData.answerList[0].isCorrect
                                    ? setCorrectAnswer(0)
                                    : handleNotifyAlreadyAnswer();
                            }}
                            isAnswerCorrect={
                                questionData.answerList[0].isCorrect
                            }
                            svg={triangle}
                        />
                    </div>
                    <div className={styles['answer-field']}>
                        <AnswerInput
                            value={questionData.answerList[1].body}
                            name={'b'}
                            onChange={(e) => {
                                isQuestionTrueFalse
                                    ? updateAnswer(e.target.name, 'False', 1)
                                    : updateAnswer(
                                        e.target.name,
                                        e.target.value,
                                        1,
                                    );
                            }}
                            onClick={() => {
                                correctAnswerCount < maxCorrectAnswerCount ||
                                    questionData.answerList[1].isCorrect
                                    ? setCorrectAnswer(1)
                                    : handleNotifyAlreadyAnswer();
                            }}
                            isAnswerCorrect={
                                questionData.answerList[1].isCorrect
                            }
                            svg={diamond}
                        />
                    </div>
                    {!isQuestionTrueFalse && (
                        <>
                            <div className={styles['answer-field']}>
                                <AnswerInput
                                    value={questionData.answerList[2].body}
                                    name={'c'}
                                    onChange={(e) =>
                                        updateAnswer(
                                            e.target.name,
                                            e.target.value,
                                            2,
                                        )
                                    }
                                    onClick={() => {
                                        correctAnswerCount <
                                            maxCorrectAnswerCount ||
                                            questionData.answerList[2].isCorrect
                                            ? setCorrectAnswer(2)
                                            : handleNotifyAlreadyAnswer();
                                    }}
                                    isAnswerCorrect={
                                        questionData.answerList[2].isCorrect
                                    }
                                    svg={circle}
                                />
                            </div>
                            <div className={styles['answer-field']}>
                                <AnswerInput
                                    value={questionData.answerList[3].body}
                                    name={'d'}
                                    onChange={(e) =>
                                        updateAnswer(
                                            e.target.name,
                                            e.target.value,
                                            3,
                                        )
                                    }
                                    onClick={() => {
                                        correctAnswerCount <
                                            maxCorrectAnswerCount ||
                                            questionData.answerList[3].isCorrect
                                            ? setCorrectAnswer(3)
                                            : handleNotifyAlreadyAnswer();
                                    }}
                                    isAnswerCorrect={
                                        questionData.answerList[3].isCorrect
                                    }
                                    svg={square}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.options}>
                <div className={styles['question-options']}>
                    <div>
                        <div className={styles.option}>
                            <div className={styles['option-label']}>
                                <img src={questionType} alt="" />
                                <label>
                                    {isLanguageEnglish
                                        ? 'Question type'
                                        : 'Loại câu hỏi'}
                                </label>
                            </div>
                            <select
                                onChange={(e) => {
                                    handleQuestionChange(e);
                                    changeQuestionType();
                                }}
                                name="questionType"
                                value={questionData.questionType}
                            >
                                <option defaultValue disabled>
                                    {isLanguageEnglish
                                        ? 'Select question type'
                                        : 'Chọn loại câu hỏi'}
                                </option>
                                <option value="Quiz">
                                    {isLanguageEnglish ? 'Quiz' : 'Câu hỏi'}
                                </option>
                                <option value="True/False">
                                    {isLanguageEnglish
                                        ? 'True/False'
                                        : 'Đúng/Sai'}
                                </option>
                            </select>
                        </div>
                        <div className={styles.option}>
                            <div className={styles['option-label']}>
                                <img src={timer} alt="" />
                                <label>
                                    {isLanguageEnglish
                                        ? 'Time limit'
                                        : 'Thời gian giới hạn'}
                                </label>
                            </div>
                            <select
                                onChange={handleQuestionChange}
                                name="answerTime"
                                value={questionData.answerTime}
                            >
                                <option defaultValue disabled>
                                    {isLanguageEnglish
                                        ? 'Set time limit'
                                        : 'Đặt thời gian giới hạn'}
                                </option>
                                <option value={5}>
                                    5 {isLanguageEnglish ? 'seconds' : 'giây'}
                                </option>
                                <option value={10}>
                                    10 {isLanguageEnglish ? 'seconds' : 'giây'}
                                </option>
                                <option value={20}>
                                    20 {isLanguageEnglish ? 'seconds' : 'giây'}
                                </option>
                                <option value={30}>
                                    30 {isLanguageEnglish ? 'seconds' : 'giây'}
                                </option>
                                <option value={60}>
                                    1 {isLanguageEnglish ? 'minute' : 'phút'}
                                </option>
                                <option value={90}>
                                    1,5 {isLanguageEnglish ? 'minute' : 'phút'}
                                </option>
                            </select>
                        </div>
                        <div className={styles.option}>
                            <div className={styles['option-label']}>
                                <img src={gamePoints} alt="" />
                                <label>
                                    {isLanguageEnglish ? 'Points' : 'Điểm'}
                                </label>
                            </div>
                            <select
                                onChange={handleQuestionChange}
                                name="pointType"
                                value={questionData.pointType}
                            >
                                <option defaultValue disabled>
                                    {isLanguageEnglish
                                        ? 'Set points type'
                                        : 'Chọn loại điểm thưởng'}
                                </option>
                                <option value="Standard">
                                    {isLanguageEnglish
                                        ? 'Standard'
                                        : 'Tiêu chuẩn'}
                                </option>
                                <option value="Double">
                                    {isLanguageEnglish ? 'Double' : 'gấp đôi'}
                                </option>
                                <option value="BasedOnTime">
                                    {isLanguageEnglish
                                        ? 'Based on Time'
                                        : 'Dựa trên thời gian phản hồi'}
                                </option>
                            </select>
                        </div>
                        <div className={styles.option}>
                            <div className={styles['option-label']}>
                                <img src={answerOptions} alt="" />
                                <label>
                                    {isLanguageEnglish
                                        ? 'Answer options'
                                        : 'Tùy chọn câu trả lời'}
                                </label>
                            </div>
                            <select onChange={changeMaxCorrectAnswerCount}>
                                <option defaultValue disabled value="1">
                                    {isLanguageEnglish
                                        ? 'Set answer options'
                                        : 'Chọn tùy chọn trả lời'}
                                </option>
                                <option value="1">
                                    {isLanguageEnglish
                                        ? 'Single choice'
                                        : 'Đơn lựa chọn'}
                                </option>
                                <option value="4">
                                    {isLanguageEnglish
                                        ? 'Multiple choice'
                                        : 'Đa lựa chọn'}
                                </option>
                            </select>
                        </div>
                        <div className={styles.option}>
                            <div className={styles['option-label']}>
                                <img src={backgroundIcon} alt="" />
                                <label>
                                    {isLanguageEnglish
                                        ? 'Background Question'
                                        : 'Hình nền câu hỏi'}
                                </label>
                            </div>
                            <div className={styles['file-option']}>
                                <FileBase
                                    type="file"
                                    multiple={false}
                                    onDone={({ base64 }) => {
                                        setQuestionData({
                                            ...questionData,
                                            backgroundImage: base64,
                                        });
                                        setQuestionImage(base64);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles['option-button-container']}>
                        <button
                            onClick={handleQuestionSubmit}
                            className={styles['option-button']}
                        >
                            {isLanguageEnglish ? 'Save' : 'lưu'}
                        </button>
                        <button
                            onClick={() => setOpenDeleteDialog(true)}
                            className={styles['option-button']}
                        >
                            {isLanguageEnglish ? 'Delete' : 'Xóa'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Setting Modal"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Settings</h2>
                <div className={styles['settings']}>
                    <div className={styles['settings-menu']}>
                        <div className={styles['settings-left']}>
                            <div className={styles['option-label']}>
                                <label>
                                    {isLanguageEnglish ? 'Title' : 'Tiêu đề'}
                                </label>
                            </div>
                            <textarea
                                value={quizData.name}
                                type="text"
                                name="name"
                                onChange={handleQuizChange}
                                className={styles['option-input']}
                                rows={1}
                            />
                            <div className={styles['option-label']}>
                                <label>
                                    {isLanguageEnglish
                                        ? 'Description'
                                        : 'Mô tả'}
                                </label>
                            </div>
                            <textarea
                                value={quizData.description}
                                type="text"
                                name="description"
                                onChange={handleQuizChange}
                                className={styles['option-input']}
                                rows={4}
                            />
                            <div className={styles['option-label']}>
                                <label>
                                    {isLanguageEnglish
                                        ? 'Points per question'
                                        : 'Điểm cho câu hỏi'}
                                </label>
                            </div>
                            <input
                                type="number"
                                min={1}
                                value={quizData.pointsPerQuestion}
                                name="pointsPerQuestion"
                                onChange={handleQuizChange}
                                className={styles['option-input']}
                            />

                            <div className={styles['option-label']}>
                                <label>
                                    {isLanguageEnglish
                                        ? 'Tags (comma separated)'
                                        : 'Tags (riêng biệt bởi dấu phẩy)'}
                                </label>
                            </div>
                            <input
                                type="text"
                                value={quizData.tags}
                                name="tags"
                                onChange={(e) =>
                                    setQuizData({
                                        ...quizData,
                                        tags: e.target.value.split(',').map((tag) => tag.trim()),
                                    })
                                }
                                className={styles['option-input']}
                            />
                        </div>

                        <div className={styles['settings-right']}>
                            <div className={styles['option-label']}>
                                <label>
                                    {isLanguageEnglish
                                        ? 'Visibility'
                                        : 'Hiện thị'}
                                </label>
                            </div>
                            <div className={styles['access-container']}>
                                <button
                                    onClick={() => {
                                        // setIsQuizPublic(true);
                                        setQuizData({
                                            ...quizData,
                                            isPublic: true,
                                        });
                                    }}
                                    className={styles['option-button']}
                                    style={{
                                        backgroundColor: quizData.isPublic
                                            ? 'rgb(19, 104, 206)'
                                            : 'inherit',
                                        color: quizData.isPublic
                                            ? 'white'
                                            : 'rgb(110, 110, 110)',
                                    }}
                                >
                                    {isLanguageEnglish ? 'Public' : 'Công khai'}
                                </button>
                                <button
                                    onClick={() => {
                                        // setIsQuizPublic(false);
                                        setQuizData({
                                            ...quizData,
                                            isPublic: false,
                                        });
                                    }}
                                    className={styles['option-button']}
                                    style={{
                                        backgroundColor: quizData.isPublic
                                            ? 'inherit'
                                            : 'rgb(19, 104, 206)',
                                        color: quizData.isPublic
                                            ? 'rgb(110, 110, 110)'
                                            : 'white',
                                    }}
                                >
                                    {isLanguageEnglish ? 'Private' : 'Riêng tư'}
                                </button>
                            </div>
                            <div className={styles['option-label']}>
                                <label>
                                    {isLanguageEnglish
                                        ? 'Cover Image'
                                        : 'Hình nền'}
                                </label>
                            </div>
                            <div className={styles['option-input-file']}>
                                <FileBase
                                    type="file"
                                    multiple={false}
                                    onDone={({ base64 }) => {
                                        setQuizData({
                                            ...quizData,
                                            backgroundImage: base64,
                                        });
                                        setQuizImage(base64);
                                    }}
                                />
                            </div>
                            <img
                                className={styles['quiz-image']}
                                src={
                                    quizImage ||
                                    quizData.backgroundImage ||
                                    defaultQuestionImage
                                }
                                alt=""
                            />
                        </div>
                    </div>

                    <div className={styles['option-button-container']}>
                        <button
                            className={`${styles['option-button']} ${styles['option-cancel']}`}
                            onClick={closeModal}
                        >
                            {isLanguageEnglish ? 'Cancel' : 'Thoát'}
                        </button>
                        <button
                            className={`${styles['option-button']} ${styles['option-submit']}`}
                            onClick={handleQuizSubmit}
                        >
                            {isLanguageEnglish ? 'Submit' : 'Hoàn thành'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Submit Dialog */}
            <Dialog
                open={openExitDialog}
                onClose={() => setOpenExitDialog(false)}
            >
                <DialogTitle>
                    <h3 className={styles['dialog-title']}>
                        {isLanguageEnglish
                            ? 'Discard latest changes?'
                            : 'Xóa bỏ những thay đổi mới nhất?'}
                    </h3>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        <p className={styles['dialog-content']}>
                            {isLanguageEnglish
                                ? 'Hold on - are you sure you want to discard all unsaved changes? You won’t be able to restore these changes.'
                                : 'Chờ đã - Bạn có chắc muốn xóa bỏ tất cả những thay đổi chưa được lưu không? Bạn sẽ không thể lấy lại được những thay đổi đó.'}
                        </p>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleQuizSubmit}
                        startIcon={<ChangeCircleIcon />}
                        autoFocus
                    >
                        {isLanguageEnglish
                            ? 'Keep changes'
                            : 'Giữ các thay đổi'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => history.push('/myquizes')}
                        startIcon={<ExitToAppIcon />}
                    >
                        {isLanguageEnglish ? 'Discard all' : 'Xóa bỏ tất cả'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenExitDialog(false)}
                        startIcon={<DeleteIcon />}
                    >
                        {isLanguageEnglish ? 'Cancel' : 'Hủy'}{' '}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>
                    <h3 className={styles['dialog-title']}>
                        {isLanguageEnglish ? 'Delete question' : 'Xóa câu hỏi'}
                    </h3>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        <p className={styles['dialog-content']}>
                            {isLanguageEnglish
                                ? 'Are you sure you want to delete this question? This action can’t be undone.'
                                : 'Bạn có chắc muốn xóa câu hỏi này không? Hành động này không thể hủy'}
                        </p>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleQuestionRemove}
                        startIcon={<DeleteIcon />}
                    >
                        {isLanguageEnglish ? 'Delete' : 'Xóa'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setOpenDeleteDialog(false)}
                        startIcon={<CancelIcon />}
                    >
                        {isLanguageEnglish ? 'Cancel' : 'Hủy'}{' '}
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}

export default QuizCreator;
