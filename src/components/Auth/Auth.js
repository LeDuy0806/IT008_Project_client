import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Paper,
    Grid,
    Typography,
    Container,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from './Input';
import { login, register } from '../../actions/auth';
import { toast } from 'react-toastify';
import Snowfall from 'react-snowfall';

const initialState = {
    userType: '',
    firstName: '',
    lastName: '',
    userName: '',
    mail: '',
    password: '',
    confirmPassword: '',
};
const initialAuthError = {
    requestQuantity: false,
    VietextRequestQuantity: '',
    EngtextRequestQuantity: '',
    userTypeE: false,
    userNameE: false,
    passwordE: false,
    userNameRegisterE: false,
    emailRegisterValid: false,
    emailRegisterE: false,
    confirmPasswordE: false,
};

function Auth() {
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const history = useHistory();
    const dispatch = useDispatch();
    // const [notify,setNotify]=useState({isNotify:false, isSuccess: false});
    const [authError, setAuthError] = useState(initialAuthError);

    const {
        requestQuantity,
        VietextRequestQuantity,
        EngtextRequestQuantity,
        userTypeE,
        userNameE,
        passwordE,
        userNameRegisterE,
        emailRegisterValid,
        emailRegisterE,
        confirmPasswordE,
    } = authError;

    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);
    const [clear, SetClear] = useState(true);

    const TextSignUp = {
        isSuccess: {
            Eng: 'Sign up successfully',
            Vie: 'Sign up successfully',
        },
        isFalse: {
            Eng: 'Registration failed!',
            Vie: 'Đăng kí không thành công!',
        },
    };
    const TextSignIn = {
        isSuccess: {
            Eng: 'Logged in successfully!',
            Vie: 'Đăng nhập thành công',
        },
        isFalse: {
            Eng: 'The username/password provided is incorrect!',
            Vie: 'Tên đăng nhập hoặc mật khẩu sai!',
        },
    };

    const handleNotify = (isSuccess) => {
        var text;
        if (isSuccess) {
            if (isLanguageEnglish) {
                text = isSignup
                    ? TextSignUp.isSuccess.Eng
                    : TextSignIn.isSuccess.Eng;
            } else {
                text = isSignup
                    ? TextSignUp.isSuccess.Vie
                    : TextSignIn.isSuccess.Vie;
            }
            toast(text, {
                icon: <CheckCircleIcon style={{ color: 'green' }} />,
                style: { color: '#333' },
                position: 'top-center',
                autoClose: 2000,
                delay: 300,
                theme: 'light',
            });
        } else {
            if (isLanguageEnglish) {
                text = isSignup
                    ? TextSignUp.isFalse.Eng
                    : TextSignIn.isFalse.Eng;
            } else {
                text = isSignup
                    ? TextSignUp.isFalse.Vie
                    : TextSignIn.isFalse.Vie;
            }
            toast.error(text, {
                position: 'top-center',
                style: { color: '#333' },
                autoClose: 3000,
                delay: 300,
                theme: 'light',
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            !confirmPasswordE &&
                dispatch(
                    register(formData, history, handleNotify, setAuthError),
                );
        } else {
            dispatch(login(formData, history, handleNotify, setAuthError));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        var name = e.target.name;
        switch (name) {
            case 'userType':
                if (
                    e.target.value === 'Teacher' ||
                    e.target.value === 'Student' ||
                    e.target.value === ''
                ) {
                    setAuthError((preState) => {
                        var newState = {
                            ...preState,
                            userTypeE: false,
                        };
                        return newState;
                    });
                } else {
                    setAuthError((preState) => {
                        var newState = {
                            ...preState,
                            userTypeE: true,
                        };
                        return newState;
                    });
                }
                break;

            case 'confirmPassword':
                if (e.target.value !== formData.password) {
                    !confirmPasswordE &&
                        setAuthError((preState) => {
                            var newState = {
                                ...preState,
                                confirmPasswordE: true,
                            };
                            return newState;
                        });
                } else {
                    setAuthError((preState) => {
                        var newState = { ...preState, confirmPasswordE: false };
                        return newState;
                    });
                }
                break;
            case 'password':
                if (passwordE)
                    setAuthError((preState) => {
                        var newState = { ...preState, passwordE: false };
                        return newState;
                    });
                break;
            case 'userName':
                if (userNameE || userNameRegisterE)
                    setAuthError((preState) => {
                        var newState = {
                            ...preState,
                            userNameE: false,
                            userNameRegisterE: false,
                        };
                        return newState;
                    });
                if (
                    (e.target.value.length < 5 && e.target.value.length > 0) ||
                    e.target.value.length > 15
                ) {
                    var l = e.target.value.length;
                    setAuthError((preState) => {
                        var newState = {
                            ...preState,
                            requestQuantity: true,
                            EngtextRequestQuantity:
                                l < 5
                                    ? 'Enter at least 5 characters !'
                                    : 'Enter at most 15 characters !',
                            VietextRequestQuantity:
                                l < 5
                                    ? 'Nhập tối thiểu 5 ký tự !'
                                    : 'Nhập tối đa 15 ký tự !',
                        };
                        return newState;
                    });
                } else {
                    setAuthError((preState) => {
                        var newState = { ...preState, requestQuantity: false };
                        return newState;
                    });
                }

                break;
            case 'mail':
                if (emailRegisterE)
                    setAuthError((preState) => {
                        var newState = { ...preState, emailRegisterE: false };
                        return newState;
                    });

                var email =
                    // eslint-disable-next-line no-useless-escape
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (email.test(e.target.value) || e.target.value === '') {
                    setAuthError((preState) => {
                        var newState = {
                            ...preState,
                            emailRegisterValid: false,
                        };
                        return newState;
                    });
                } else {
                    setAuthError((preState) => {
                        var newState = {
                            ...preState,
                            emailRegisterValid: true,
                        };
                        return newState;
                    });
                }

                break;
            default:
                break;
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
        setFormData(prev => ({
            ...prev,
            ...initialState
        }));
        SetClear(true);
    };

    return (
        <div
            style={{
                width: '100vw',
                background: 'linear-gradient(120deg, #3ca7ee, #9b408f)',
                height: '94vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px',
            }}
        >
            <Snowfall
                speed={[0, 2]}
                style={{
                    position: 'fixed',
                    zIndex: '1',
                    height: '100vh',
                    width: '100vw',
                }}
            />
            <Container
                component="main"
                maxWidth="xs"
                style={{ zIndex: '2' }}
            >
                <Paper
                    className={classes.paper}
                    elevation={3}
                    style={{
                        background:
                            'linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%) ',
                    }}
                >
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {isSignup
                            ? isLanguageEnglish
                                ? 'Sign up'
                                : 'Đăng kí'
                            : isLanguageEnglish
                                ? 'Sign in'
                                : 'Đăng nhập'}
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {isSignup && (
                                <>
                                    <Input
                                        name="firstName"
                                        label="First Name"
                                        handleChange={handleChange}
                                        autoFocus
                                        half
                                    />

                                    <Input
                                        name="lastName"
                                        label="Last Name"
                                        handleChange={handleChange}
                                        half
                                    />
                                    <Input
                                        invalid={userTypeE}
                                        name="userType"
                                        label="User type (Teacher or Student)"
                                        handleChange={handleChange}
                                    />
                                    {userTypeE ? (
                                        <span
                                            style={{
                                                marginLeft: '10px',
                                                marginBottom: '10px',
                                                color: 'red',
                                            }}
                                        >
                                            {isLanguageEnglish
                                                ? 'This field must be Teacher or Student'
                                                : 'Trường này phải là Teacher hoặc Student'}
                                        </span>
                                    ) : (
                                        <span>{ }</span>
                                    )}

                                    <Input
                                        invalid={
                                            emailRegisterE || emailRegisterValid
                                        }
                                        name="mail"
                                        label="Email address"
                                        handleChange={handleChange}
                                        type="email"
                                    />
                                    <span
                                        style={{
                                            color: 'red',
                                            marginLeft: '8px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {emailRegisterE &&
                                            (isLanguageEnglish
                                                ? 'That email is already in use'
                                                : 'Email đó đã được sử dụng')}
                                    </span>

                                    {emailRegisterValid ? (
                                        <span
                                            style={{
                                                color: 'red',
                                                marginBottom: '4px',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {isLanguageEnglish
                                                ? 'Example: anhquoc1809@gmail.com'
                                                : 'Ví dụ: anhquoc1809@gmail.com'}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                            <Input
                                invalid={
                                    isSignup ? userNameRegisterE : userNameE
                                }
                                name="userName"
                                label="User Name"
                                handleChange={handleChange}
                                value={clear && ''}

                            />
                            {requestQuantity ? (
                                <span
                                    style={{
                                        marginLeft: '10px',
                                        marginBottom: '10px',
                                        color: 'red',
                                    }}
                                >
                                    {isLanguageEnglish
                                        ? EngtextRequestQuantity
                                        : VietextRequestQuantity}
                                </span>
                            ) : (
                                <span>{ }</span>
                            )}
                            <span
                                style={{
                                    color: 'red',
                                    marginLeft: '8px',
                                    fontSize: '14px',
                                }}
                            >
                                {userNameRegisterE &&
                                    (isLanguageEnglish
                                        ? 'That username is already in use'
                                        : 'Tên tài khoản đã có người dùng')}
                            </span>
                            <Input
                                invalid={(passwordE || userNameE) && !isSignup}
                                name="password"
                                label="Password"
                                handleChange={handleChange}
                                type={showPassword ? 'text' : 'password'}
                                handleShowPassword={handleShowPassword}
                            />
                            {!isSignup && (
                                <span
                                    style={{
                                        color: 'red',
                                        marginLeft: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {userNameE &&
                                        (isLanguageEnglish
                                            ? 'Account does not exist!'
                                            : 'Tài khoản không tồn tại!')}
                                    {passwordE &&
                                        !userNameE &&
                                        (isLanguageEnglish
                                            ? 'Wrong password!'
                                            : 'Mật khẩu bạn nhập bị sai')}
                                </span>
                            )}
                            {isSignup && (
                                <>
                                    <Input
                                        invalid={confirmPasswordE}
                                        name="confirmPassword"
                                        label="Repeat password"
                                        handleChange={handleChange}
                                        type="password"
                                    />
                                    {
                                        <span
                                            style={{
                                                color: 'red',
                                                marginLeft: '8px',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {confirmPasswordE &&
                                                (isLanguageEnglish
                                                    ? 'Password does not match!'
                                                    : 'Tài khoản không tồn tại!')}
                                        </span>
                                    }
                                </>
                            )}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            {isSignup
                                ? isLanguageEnglish
                                    ? 'Sign up'
                                    : 'Đăng kí'
                                : isLanguageEnglish
                                    ? 'Sign in'
                                    : 'Đăng nhập'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button onClick={switchMode}>
                                    {isSignup
                                        ? isLanguageEnglish
                                            ? 'Already have an account? Sign in'
                                            : 'Bạn đã có tài khoản? Đăng nhập'
                                        : isLanguageEnglish
                                            ? "Don't have an account? Sign Up"
                                            : 'Bạn chưa có tài khoản? Đăng kí'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </div>
    );
}

export default Auth;
