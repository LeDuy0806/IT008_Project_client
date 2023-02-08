import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core/';
import { useDispatch, useSelector } from 'react-redux';

import { commentQuiz } from '../../../actions/quiz';
import useStyles from './styles';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CommentSection = ({ quiz }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();
    const [comments, setComments] = useState(quiz?.comments);
    const classes = useStyles();
    const commentsRef = useRef();
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);

    if (quiz == null) {
        return (
            <div className={classes.commentsOuterContainer}>
                <div style={{ width: '95%' }}>
                    <div style={{ marginTop: '16px', width: '100%' }}>
                        <Skeleton />
                    </div>
                    <br />
                    <div style={{ marginTop: '16px', width: '100%' }}>
                        <Skeleton />
                    </div>
                </div>
            </div>
        )
    }

    const handleComment = async () => {
        const newComments = await dispatch(
            commentQuiz(`${user?.result?.userName}: ${comment}`, quiz._id),
        );

        setComment('');
        setComments(newComments);

        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                {user?.result?.userName && (
                    <div style={{ width: '95%' }}>
                        {/* <Typography gutterBottom variant="h6">
                            {isLanguageEnglish
                                ? 'Write a comment'
                                : 'Viết bình luận'}
                        </Typography> */}
                        <TextField
                            fullWidth
                            minRows={1}
                            variant="filled"
                            label={
                                isLanguageEnglish
                                    ? 'Add a comment'
                                    : 'Thêm một bình luận'
                            }
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                            }}
                        />
                        <br />
                        <Button
                            style={{ marginTop: '10px', width: '100%' }}
                            fullWidth
                            disabled={!comment.length}
                            color="primary"
                            variant="contained"
                            onClick={handleComment}
                        >
                            {isLanguageEnglish ? 'Comment' : 'Bình Luận'}
                        </Button>
                    </div>
                )}
                <div className={classes.commentWrapper}>
                    <Typography gutterBottom variant="h6">
                        {isLanguageEnglish ? 'Comments' : 'Bình luận'}
                    </Typography>
                    <div className={classes.commentsInnerContainer}>
                        {comments?.map((comment, index) => (
                            <Typography
                                key={index}
                                className={classes.commentItem}
                                gutterBottom
                                variant="subtitle1"
                            >
                                <span>
                                    <strong>{comment.split(': ')[0] + ": "}</strong>
                                    {comment.split(':')[1]}
                                </span>
                            </Typography>
                        ))}
                        <div ref={commentsRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
