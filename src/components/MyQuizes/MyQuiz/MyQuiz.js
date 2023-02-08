import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './myQuiz.module.css';
import { deleteQuiz } from '../../../actions/quiz';
import { createGame } from '../../../actions/game';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useHistory } from 'react-router-dom';
import { createLeaderboard } from '../../../actions/leaderboard';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import defaultQuizBackground from '../../../assets/defaultQuizBackground.jpg';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

function MyQuiz({ quiz }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);
    const socket = useSelector((state) => state.socket.socket);
    const openQuizPage = (e) => {
        history.push(`/myquizes/${quiz._id}`);
    };

    const addGame = async () => {
        let gameData = {
            quizId: quiz._id,
            isLive: true,
            pin: String(Math.floor(Math.random() * 9000) + 1000),
        };
        const newGame = await dispatch(createGame(gameData, history));
        let leaderboardData = { gameId: newGame._id, playerResultList: [] };

        const newLeaderboard = await dispatch(
            createLeaderboard(leaderboardData),
        );
        socket.emit('init-game', newGame, newLeaderboard);
    };

    // Delete Dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleQuizDelete = () => dispatch(deleteQuiz(quiz._id));

    return (
        <>
            {quiz ? (
                <div className={styles['quiz-card']}>
                    <div className={styles['image-container']}>
                        <h3 className={styles['quiz-creator']}>
                            {quiz.creatorName}
                        </h3>
                        <h3 className={styles['quiz-date']}>
                            {isLanguageEnglish ? 'Update: ' : 'Cập nhập: '}:{' '}
                            {moment(quiz.dateCreated).fromNow()}
                        </h3>
                        <div
                            className={styles['quiz-image']}
                            style={{
                                backgroundImage:
                                    `url("${quiz.backgroundImage || defaultQuizBackground}")`,
                            }}
                        ></div>
                        <h3 className={styles['quiz-question-number']}>
                            {isLanguageEnglish ? 'Questions:' : 'Câu hỏi:'}{' '}
                            {quiz.numberOfQuestions}
                        </h3>
                    </div>

                    <div className={styles['card-body']}>
                        <div className={styles['card-body-heading']}>
                            <h4 className={styles['quiz-tags']}>
                                {quiz.tags.map((tag) => `#${tag} `)}
                            </h4>
                            <div className={styles['card-buttons']}>
                                <button
                                    className={`${styles['btn']} ${styles['btn-start']}`}
                                    onClick={addGame}
                                >
                                    <PlayArrowIcon fontSize="small" />
                                    <span>
                                        {isLanguageEnglish
                                            ? 'Start a game'
                                            : 'Bắt đầu trò chơi'}
                                    </span>
                                </button>
                                <button
                                    className={`${styles['btn']} ${styles['btn-edit']}`}
                                    onClick={openQuizPage}
                                >
                                    <EditIcon fontSize="small" />
                                    <span>
                                        {isLanguageEnglish ? 'Edit' : 'Sửa'}
                                    </span>
                                </button>
                                <button
                                    className={`${styles['btn']} ${styles['btn-delete']}`}
                                    onClick={() => setOpenDeleteDialog(true)}
                                >
                                    <DeleteIcon fontSize="small" />
                                    <span>
                                        {isLanguageEnglish ? 'Delete' : 'Xóa'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className={styles['card-body-info']}>
                            <h2 className={styles['quiz-title']}>
                                {quiz.name}
                            </h2>
                            <p className={styles['quiz-description']}>
                                {quiz.description}
                            </p>
                        </div>

                        {/* Delete Dialog */}
                        <Dialog
                            open={openDeleteDialog}
                            onClose={() => setOpenDeleteDialog(false)}
                        >
                            <DialogTitle>
                                <h3 className={styles['dialog-title']}>
                                    {isLanguageEnglish
                                        ? 'Delete quiz'
                                        : 'Xóa bộ câu hỏi'}
                                </h3>
                            </DialogTitle>

                            <DialogContent>
                                <DialogContentText>
                                    <p className={styles['dialog-content']}>
                                        {isLanguageEnglish
                                            ? 'Are you sure you want to delete this quiz? This action can’t be undone.'
                                            : 'Bạn có chắc muốn xóa bộ câu hỏi này không? Hành động này không thể hủy'}
                                    </p>
                                </DialogContentText>
                            </DialogContent>

                            <DialogActions>
                                <Button
                                    variant="contained"
                                    onClick={handleQuizDelete}
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
                    </div>
                </div>
            ) : (
                <SkeletonTheme baseColor="#F0F5F9" highlightColor="#C9D6DF">
                    <div className={styles['quiz-card']}>
                        <div className={styles['image-container']}>
                            <div className={styles['quiz-image']}>
                                <Skeleton height="100%" />
                            </div>
                        </div>
                        <div className={styles['card-body']}>
                            <div className={styles['card-body-heading']}>
                                <h4 className={styles['quiz-tags']}>
                                    <Skeleton />
                                </h4>
                            </div>
                            <div className={styles['card-body-info']}>
                                <h2 className={styles['quiz-title']}>
                                    <Skeleton />
                                </h2>
                                <p className={styles['quiz-description']}>
                                    <Skeleton />
                                </p>
                            </div>
                        </div>
                    </div>
                </SkeletonTheme>
            )}
        </>
    );
}

export default MyQuiz;
