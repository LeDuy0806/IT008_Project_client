import styles from './profile.module.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../actions/users';
import noava from '../../assets/noava.jpg';
// import FileBase from 'react-file-base64';

let checkUserName = true;
let checkName = true;
let checkAvatar = true;

export default function Profile() {
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);

    const [formData, setFormData] = useState(user ? {
        avatar: user.result?.avatar || null,
        userName: user.result.userName,
        firstName: user.result.firstName,
        lastName: user.result.lastName,
    } : null)
    const [save, setSave] = useState(false);




    const history = useHistory();

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        // eslint-disable-next-line default-case
        switch (name) {
            case 'userName':
                setFormData((preState) => {
                    var newState = {
                        ...preState,
                        userName: value,
                    };
                    return newState;
                });
                if (value === user.result.userName) {
                    checkUserName = true;
                } else {
                    checkUserName = false;
                }
                break;
            case 'firstName':
                setFormData((preState) => {
                    var newState = {
                        ...preState,
                        firstName: value,
                    };
                    return newState;
                });

                if (value === user.result.firstName) {
                    checkName = true;
                } else {
                    checkName = false;
                }
                break;
            case 'lastName':
                setFormData((preState) => {
                    var newState = {
                        ...preState,
                        lastName: value,
                    };
                    return newState;
                });

                if (value === user.result.lastName) {
                    checkName = true;
                } else {
                    checkName = false;
                }
                break;
            case 'avatar':
                encodeToBase64(e.target.files[0])
                checkAvatar = false;
                break;
            default:
                break;
        }


        if (checkUserName && checkName && checkAvatar) {
            setSave(false);
        } else {
            setSave(true);
        }
    };
    const encodeToBase64 = (file) => {
        if (file === undefined)
            return null;
        // Make new FileReader
        let reader = new FileReader();
        let base64;
        // Convert the file to base64 text
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Make a fileInfo Object
            let fileInfo = {
                name: file.name,
                type: file.type,
                size: Math.round(file.size / 1000) + ' kB',
                base64: reader.result,
                file: file,
            };
            base64 = fileInfo.base64
            setFormData(prevState => {
                return {
                    ...prevState,
                    avatar: base64
                }
            })
        }
    }

    const handleSave = async () => {
        if (save) {
            dispatch(updateUser(user.result._id, formData))
            localStorage.setItem("profile", JSON.stringify({ ...user, result: { ...user.result, ...formData } }))
            toast.success(
                isLanguageEnglish ? 'Save successfully !' : 'Lưu thành công !',
                {
                    style: { color: '#333' },
                    position: 'top-center',
                    autoClose: 2000,
                },
            );
            setSave(false);
            setTimeout(() => {
                window.location.reload();
            }, 2500);
        }
    };

    const handleCancel = () => {
        history.push('/');
    };

    return (
        <div className={styles['main']}>
            <div className={styles['profile_item-header']}>
                Edit profile
            </div>

            <div className={styles['profile_item-contain']}>
                <div className={styles['contain_item']}>
                    <div className={styles['contain_editprofile']}>
                        Profile photo
                    </div>
                    <div className={styles['contain_editava']}>
                        <div className={styles['contain_editavachil']}>
                            <label htmlFor="avatar">
                                <img
                                    className={styles['contain_editavachilimg']}
                                    src={formData.avatar || noava}
                                    alt=""
                                />
                                <div className={styles['contain_editicon']}>
                                    <svg
                                        width="16"
                                        data-e2e=""
                                        height="16"
                                        viewBox="0 0 48 48"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M26.5858 5.08579C27.3479 4.32371 28.5767 4.30253 29.3646 5.03789L36.8646 12.0379C37.2612 12.408 37.4904 12.9232 37.4997 13.4655C37.5091 14.0078 37.2977 14.5307 36.9142 14.9142L16.9142 34.9142C16.5391 35.2893 16.0304 35.5 15.5 35.5H8.5C7.39543 35.5 6.5 34.6046 6.5 33.5V26C6.5 25.4696 6.71071 24.9609 7.08579 24.5858L26.5858 5.08579ZM28.0479 9.2805L10.5 26.8284V31.5H14.6716L32.622 13.5496L28.0479 9.2805Z"
                                        ></path>
                                        <path d="M7 41C7 40.4477 7.44772 40 8 40H41C41.5523 40 42 40.4477 42 41V43C42 43.5523 41.5523 44 41 44H8C7.44772 44 7 43.5523 7 43V41Z"></path>
                                    </svg>
                                </div>
                            </label>
                            <input
                                id="avatar"
                                name='avatar'
                                type="file"
                                accept=".jpg,.png"
                                multiple={false}
                                onChange={handleChange}
                                hidden={true}
                            />
                            {/* <FileBase
                                type="file"
                                multiple={false}
                                onDone={({ base64 }) => {
                                    console.log(base64)
                                }} /> */}
                        </div>
                    </div>
                </div>

                <div className={styles['contain_item']}>
                    <div className={styles['edit-profile-name']}>
                        Username
                    </div>
                    <div className={styles['edit-profile-input']}>
                        <input
                            value={formData.userName}
                            name="userName"
                            onChange={handleChange}
                            className={
                                styles['edit-profile-input-chil']
                            }
                        />
                        <p className={styles['edit-profile-input-p1']}>
                            www.telexercise.com/@anhquoc
                        </p>
                        <p className={styles['edit-profile-input-p2']}>
                            Usernames can only contain letters, numbers,
                            underscores, and periods. Changing your username
                            will also change your profile link
                        </p>
                    </div>
                </div>
                <div className={styles['contain_item']}>
                    <div className={styles['edit-profile-name']}>
                        Name
                    </div>
                    <div className={styles['edit-profile-input']}>
                        <div className={styles['edit-profile-name-input']}>
                            <input
                                name="firstName"
                                type="text"
                                onChange={handleChange}
                                className={
                                    styles['edit-profile-input-chil']
                                }
                                value={formData.firstName}
                            />
                            <input
                                name="lastName"
                                type="text"
                                onChange={handleChange}
                                className={
                                    styles['edit-profile-input-chil']
                                }
                                value={formData.lastName}
                            />
                        </div>
                        <p className={styles['edit-profile-input-p1']}>
                            Your nickname can only be changed once every 7 days
                        </p>
                    </div>
                </div>

                {/* <div className={styles['contain_item']}>
                    <div className={styles['edit-profile-name']}>
                        Bio
                    </div>
                    <div className={styles['edit-profile-input']}>
                        <input
                            name="Bio"
                            onChange={handleChange}
                            className={
                                styles['edit-profile-input-chil']
                            }
                            value={profile.Bio}
                        />
                        <p className={styles['edit-profile-input-p1']}>
                            0/80
                        </p>
                    </div>
                </div> */}
            </div>

            <div className={styles['profile_item-footer']}>
                <button
                    className={styles['profile_item-footer-btnC']}
                    onClick={handleCancel}
                >
                    Cancle
                </button>
                <button
                    className={
                        styles[
                        save
                            ? 'profile_item-footer-btnS-active'
                            : 'profile_item-footer-btnS'
                        ]
                    }
                    onClick={() => { handleSave() }}
                    style={{
                        backgroundColor: save ? 'red' : 'rgb(187, 187, 187)',
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
