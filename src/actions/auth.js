import { toast } from 'react-toastify';
import * as api from '../api';
import { AUTH } from '../constants/actionTypes';

export const login =
    (formData, history, handleNotify, setAuthError) => async (dispatch) => {
        try {
            // const { data } = await api.login(formData);

            const { data } = await toast.promise(api.login(formData), {
                pending: {
                    render() {
                        return 'Promise is pending';
                    },
                    position: 'top-center',
                    onClose: () => {},
                },
            });

            switch (data) {
                case 'Not allowed':
                    handleNotify(false);
                    setAuthError((preState) => {
                        var newState = { ...preState, passwordE: true };
                        return newState;
                    });
                    break;
                case 'Cannot find user':
                    handleNotify(false);
                    setAuthError((preState) => {
                        var newState = { ...preState, userNameE: true };
                        return newState;
                    });
                    break;
                default:
                    dispatch({ type: AUTH, data });
                    handleNotify(true);
                    setTimeout(() => {
                        history.push('/');
                    }, 1500);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

export const register =
    (formData, history, handleNotify, setAuthError) => async (dispatch) => {
        try {
            // const { data } = await api.register(formData);
            const { data } = await toast.promise(api.register(formData), {
                pending: {
                    render() {
                        return 'Promise is pending';
                    },
                    position: 'top-center',
                    onClose: () => {},
                },
            });
            console.log(data);
            switch (data.message) {
                case 'UserName already exists':
                    handleNotify(false);
                    setAuthError((preState) => {
                        var newState = { ...preState, userNameRegisterE: true };
                        return newState;
                    });
                    break;
                case 'Email already exists':
                    handleNotify(false);
                    setAuthError((preState) => {
                        var newState = { ...preState, emailRegisterE: true };
                        return newState;
                    });
                    break;
                default:
                    handleNotify(true);
                    dispatch({ type: AUTH, data });
                    setTimeout(() => {
                        history.push('/');
                    }, 1500);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
