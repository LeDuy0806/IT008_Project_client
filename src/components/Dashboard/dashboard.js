/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import styles from './dashboard.module.css';
import telehome from '../../assets/telehome.png';
import { CgMicrosoft } from 'react-icons/cg';
import { FiUser } from 'react-icons/fi';
import { AiOutlineFileProtect } from 'react-icons/ai';
import { IoAnalytics } from 'react-icons/io5';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { MdFactCheck } from 'react-icons/md';
import { MdErrorOutline } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { IoIosAdd } from 'react-icons/io';
import { CgLogOut } from 'react-icons/cg';
import { Link } from 'react-router-dom';
// import { VscPreview } from "react-icons/vsc";
import { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getQuizes } from '../../actions/quiz';
import { getUsers } from '../../actions/users';
import noava from '../../assets/noava.jpg';

function Dashboard() {
    const datee = useMemo(() => {
        const current = new Date();
        return `${current.getDate()}/${
            current.getMonth() + 1
        }/${current.getFullYear()}`;
    }, []);
    const current = new Date();
    const date = `${current.getDate()}/${
        current.getMonth() + 1
    }/${current.getFullYear()}`;

    const [checkTG, SetCheckTG] = useState(false);
    const HandleThemeToggle = () => {
        document.body.classList.toggle(styles['dark-theme-variables']);
        SetCheckTG(!checkTG);
    };

    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        dispatch(getQuizes(quizes));
        dispatch(getUsers(user));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const { quizes } = useSelector((state) => state.quiz);
    const users = useSelector((state) => state.users);

    const CountTeacher = useMemo(() => {
        let result = 0;
        users.map((user) => {
            if (user.userType === 'Teacher') {
                result++;
            }
        });
        return result;
    }, [users]);

    const CountStudent = useMemo(() => {
        let result = 0;
        users.map((user) => {
            if (user.userType === 'Student') {
                result++;
            }
        });
        return result;
    }, [users]);

    const [CountPublic, CountAll] = useMemo(() => {
        let Public = 0;
        let All = 0;
        quizes.map((quize) => {
            if (quize.isPublic === true) {
                Public++;
            }
            All++;
        });
        return [Public, All];
    }, [quizes]);

    const [leaderboardTeacher, SumQuizesOfTeacher] = useMemo(() => {
        let a = 0;
        let Sum = 0;
        const UserTeacher = users.filter((user) => {
            return user.userType === 'Teacher';
        });

        const SetQuizesUserTeacher = UserTeacher.map((user) => {
            a = 0;
            quizes.map((quize) => {
                if (
                    user.firstName + ' ' + user.lastName ===
                    quize.creatorName
                ) {
                    a++;
                }
            });
            user.Count = a;
            Sum += a;
            return user;
        });

        return [
            SetQuizesUserTeacher.sort((teacher1, teacher2) => {
                if (teacher1.Count < teacher2.Count) return 1;
                if (teacher1.Count > teacher2.Count) return -1;
                return 0;
            }),
            Sum,
        ];
    }, [users, quizes]);

    const [percentTeacher, percentStudent, percentPublic] = useMemo(() => {
        const Teacher = Math.round(
            (CountTeacher * 100) / (CountStudent + CountTeacher),
        );
        const Studen = Math.round(
            (CountStudent * 100) / (CountStudent + CountTeacher),
        );
        const Public = Math.round((CountPublic * 100) / CountAll);
        return [Teacher, Studen, Public];
    }, [CountTeacher, CountStudent, CountPublic, CountAll]);

    const [RCpercentTC, setRCpercentTC] = useState(0);
    let timeTC = useRef();
    useEffect(() => {
        timeTC.current = setInterval(() => {
            setRCpercentTC((preState) => preState + 1);
        }, 20);
    }, []);
    useEffect(() => {
        if (RCpercentTC === percentTeacher) {
            clearInterval(timeTC.current);
        }
    });

    const [RCpercentST, setRCpercentST] = useState(0);
    let timeST = useRef();
    useEffect(() => {
        timeST.current = setInterval(() => {
            setRCpercentST((preState) => preState + 1);
        }, 20);
    }, []);
    useEffect(() => {
        if (RCpercentST === percentStudent) {
            clearInterval(timeST.current);
        }
    });

    const [RCpercentPL, setRCpercentPL] = useState(0);
    let timePL = useRef();
    useEffect(() => {
        timePL.current = setInterval(() => {
            setRCpercentPL((preState) => preState + 1);
        }, 20);
    }, []);
    useEffect(() => {
        if (RCpercentPL === percentPublic) {
            clearInterval(timePL.current);
        }
    });

    const [tableUsers, setTableUser] = useState(true);
    const [tableQuizes, setTableQuizes] = useState(false);
    const [active, SetActive] = useState({
        Dashboard: false,
        Customers: true,
        Quizes: false,
        Analytics: false,
        Messages: false,
        Prducts: false,
        Reports: false,
        Settings: false,
        AddProduct: false,
        Logout: false,
    });

    const handleClick = (e) => {
        switch (e.target.name) {
            case 'Customers':
                SetActive((preState) => {
                    var newState = {
                        ...preState,
                        Customers: true,
                        Quizes: false,
                    };
                    return newState;
                });
                setTableUser(true);
                setTableQuizes(false);

                break;
            case 'Quizes':
                SetActive((preState) => {
                    var newState = {
                        ...preState,
                        Customers: false,
                        Quizes: true,
                    };
                    return newState;
                });
                setTableUser(false);
                setTableQuizes(true);
                break;
            default:
                break;
        }
        console.log(e.target.name);
    };

    const [showAll, SetShowAll] = useState(false);
    const handleShow = () => {
        SetShowAll(!showAll);
    };

    return (
        <div className={styles['htmll']}>
            <div className={styles['container']}>
                <aside>
                    <div className={styles['top']}>
                        <div>
                            <Link
                                to="/"
                                className={styles['tele-link']}
                                style={{ width: '200px' }}
                            >
                                <img
                                    className={styles['imagelogo']}
                                    src={telehome}
                                    alt=""
                                ></img>
                            </Link>
                        </div>
                        <div className={styles['tele']}>
                            <h2
                                className={`${styles['text-muted']} ${styles['h2_text']}`}
                                style={{ paddingRight: '60px' }}
                            >
                                TEL
                                <span
                                    style={{ color: '#ff7782' }}
                                    className={styles['danger']}
                                >
                                    EXERCISE
                                </span>
                            </h2>
                        </div>
                    </div>
                    <div className={styles['sidebar']}>
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="Dashboard"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <CgMicrosoft />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                name="Dashboard"
                                onClick={handleClick}
                            >
                                Dashboard
                            </h3>
                        </a>
                        <a
                            href="#"
                            className={
                                styles[active.Customers ? 'active' : 'link_a']
                            }
                            onClick={handleClick}
                            name="Customers"
                        >
                            <div>
                                <span
                                    className={
                                        styles['material-symbols-outlined']
                                    }
                                    onClick={handleClick}
                                >
                                    <FiUser />
                                </span>
                            </div>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Customers
                            </h3>
                        </a>
                        <a
                            className={
                                styles[active.Quizes ? 'active' : 'link_a']
                            }
                            href="#"
                            onClick={handleClick}
                            name="Quizes"
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <AiOutlineFileProtect />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Quizes
                            </h3>
                        </a>
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="Analytics"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <IoAnalytics />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Analytics
                            </h3>
                        </a>
                        {/* <a
                            className={styles['link_a']}
                            href="#"
                            name="Messages"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <BiMessageSquareDetail />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Messages
                            </h3>
                            <span className={styles['message-count']}>26</span>
                        </a>
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="Products"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <MdFactCheck />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Products
                            </h3>
                        </a>
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="Reports"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <MdErrorOutline />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Reports
                            </h3>
                        </a>
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="Settings"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <FiSettings />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Settings
                            </h3>
                        </a> */}
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="AddProduct"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <IoIosAdd />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Add Product
                            </h3>
                        </a>
                        <a
                            className={styles['link_a']}
                            href="#"
                            name="Logout"
                            onClick={handleClick}
                        >
                            <span
                                className={styles['material-symbols-outlined']}
                                onClick={handleClick}
                            >
                                <CgLogOut />
                            </span>
                            <h3
                                className={styles['h3_text']}
                                onClick={handleClick}
                            >
                                Logout
                            </h3>
                        </a>
                    </div>
                </aside>
                <main>
                    <h1 className={styles['h1_text']}>Dashboard</h1>
                    <div className={styles['date']}>
                        <h1 className={styles['h1_text']}>{datee}</h1>
                    </div>

                    <div className={styles['insights']}>
                        <div className={styles['sales']}>
                            <span className="material-symbols-outlined">
                                analytics
                            </span>
                            <div className={styles['middle']}>
                                <div className={styles['left']}>
                                    <h3 className={styles['h3_text']}>
                                        Total Teachers
                                    </h3>
                                    <h1
                                        className={styles['h1_text']}
                                        style={{ fontSize: '1.2rem' }}
                                    >
                                        {CountTeacher} Person
                                    </h1>
                                </div>
                                <div className={styles['progress']}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        version="1.1"
                                    >
                                        <defs>
                                            <linearGradient id="GradientColor">
                                                <stop
                                                    offset="0%"
                                                    stopColor="#e91e63"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#673ab7"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <circle
                                            className="Teacher"
                                            cx="38"
                                            cy="38"
                                            r="36"
                                        ></circle>
                                    </svg>
                                    <div className={styles['number']}>
                                        <p className={styles['p_text']}>
                                            {RCpercentTC}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <!-- END OF SALES --> */}
                        <div className={styles['expenses']}>
                            <span className="material-symbols-outlined">
                                bar_chart
                            </span>
                            <div className={styles['middle']}>
                                <div className={styles['left']}>
                                    <h3 className={styles['h3_text']}>
                                        Total Students
                                    </h3>
                                    <h1
                                        className={styles['h1_text']}
                                        style={{ fontSize: '1.2rem' }}
                                    >
                                        {CountStudent} Person
                                    </h1>
                                </div>
                                <div className={styles['progress']}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        version="1.1"
                                    >
                                        <defs>
                                            <linearGradient id="GradientColor">
                                                <stop
                                                    offset="0%"
                                                    stopColor="#e91e63"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#673ab7"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className={styles['number']}>
                                        <p className={styles['p_text']}>
                                            {RCpercentST}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* END OF EXPENSES  */}
                        <div className={styles['income']}>
                            <span className="material-symbols-outlined">
                                stacked_line_chart
                            </span>
                            <div className={styles['middle']}>
                                <div className={styles['left']}>
                                    <h3 className={styles['h3_text']}>
                                        Total Public
                                    </h3>
                                    <h1
                                        className={styles['h1_text']}
                                        style={{ fontSize: '1.2rem' }}
                                    >
                                        {CountPublic} Quizes
                                    </h1>
                                </div>
                                <div className={styles['progress']}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        version="1.1"
                                    >
                                        <defs>
                                            <linearGradient id="GradientColor">
                                                <stop
                                                    offset="0%"
                                                    stopColor="#e91e63"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#673ab7"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <circle cx="38" cy="38" r="36"></circle>
                                    </svg>
                                    <div className={styles['number']}>
                                        <p className={styles['p_text']}>
                                            {RCpercentPL}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Recent-orders */}
                    <div className={styles['recent-orders']}>
                        <h2 className={styles['h2_text']}>
                            {tableUsers && 'Users-List'}
                            {tableQuizes && 'Quizes-List'}
                        </h2>
                        <table>
                            <thead>
                                {tableUsers && (
                                    <tr>
                                        <th>Id</th>
                                        <th>User Name</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>User Type</th>
                                    </tr>
                                )}
                                {tableQuizes && (
                                    <tr>
                                        <th>Name</th>
                                        <th>CreatorName</th>
                                        <th>isPublic</th>
                                        <th>QuestionNumber</th>
                                        <th>dateCreated</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {tableQuizes &&
                                    (showAll
                                        ? quizes.map((quize) => (
                                              <tr>
                                                  <td>{quize.name}</td>
                                                  <td>{quize.creatorName}</td>
                                                  <td
                                                      style={{
                                                          color:
                                                              quize.isPublic ===
                                                              true
                                                                  ? '#41F1B6'
                                                                  : 'red',
                                                          fontWeight: '700',
                                                      }}
                                                  >
                                                      {quize.isPublic.toString()}
                                                  </td>
                                                  <td>
                                                      {
                                                          quize.questionList
                                                              .length
                                                      }
                                                  </td>
                                                  <td>
                                                      {quize.dateCreated.slice(
                                                          0,
                                                          10,
                                                      )}
                                                  </td>
                                              </tr>
                                          ))
                                        : quizes
                                              .slice(0, 7)
                                              .map((quize, index) => (
                                                  <tr key={index}>
                                                      <td>{quize.name}</td>
                                                      <td>
                                                          {quize.creatorName}
                                                      </td>
                                                      <td
                                                          style={{
                                                              color:
                                                                  quize.isPublic ===
                                                                  true
                                                                      ? '#41F1B6'
                                                                      : 'red',
                                                              fontWeight: '700',
                                                          }}
                                                      >
                                                          {quize.isPublic.toString()}
                                                      </td>
                                                      <td>
                                                          {
                                                              quize.questionList
                                                                  .length
                                                          }
                                                      </td>
                                                      <td>
                                                          {quize.dateCreated.slice(
                                                              0,
                                                              10,
                                                          )}
                                                      </td>
                                                  </tr>
                                              )))}

                                {tableUsers &&
                                    (showAll
                                        ? users.map((user, index) => (
                                              <tr key={index}>
                                                  <td>{user._id}</td>
                                                  <td>{user.userName}</td>
                                                  <td>
                                                      {user.firstName +
                                                          user.lastName}
                                                  </td>
                                                  <td>{user.mail}</td>
                                                  <td>{user.userType}</td>
                                              </tr>
                                          ))
                                        : users
                                              .slice(0, 7)
                                              .map((user, index) => (
                                                  <tr key={index}>
                                                      <td>{user._id}</td>
                                                      <td>{user.userName}</td>
                                                      <td>
                                                          {user.firstName +
                                                              user.lastName}
                                                      </td>
                                                      <td>{user.mail}</td>
                                                      <td
                                                          style={{
                                                              color:
                                                                  user.userType ===
                                                                  'Teacher'
                                                                      ? '#41F1B6'
                                                                      : '#FFB100',
                                                          }}
                                                      >
                                                          {user.userType}
                                                      </td>
                                                  </tr>
                                              )))}
                            </tbody>
                        </table>
                        <a
                            className={styles['link_a']}
                            href="#"
                            onClick={handleShow}
                        >
                            {showAll ? 'Collapse' : 'Show All'}
                        </a>
                    </div>
                </main>
                {/* RIGHT */}
                <div className={styles['right']}>
                    <div className={styles['top']}>
                        <button id="menu-btn">
                            <span className="material-symbols-outlined">
                                menu
                            </span>
                        </button>
                        <div
                            className={styles['theme-toggler']}
                            onClick={HandleThemeToggle}
                        >
                            <span
                                id={checkTG ? styles['aaa'] : styles['bbb']}
                                className="material-symbols-outlined"
                            >
                                light_mode
                            </span>
                            <span
                                id={
                                    checkTG === false
                                        ? styles['aaa']
                                        : styles['bbb']
                                }
                                className="material-symbols-outlined"
                            >
                                dark_mode
                            </span>
                        </div>
                        <div className={styles['profile']}>
                            <div className={styles['info']}>
                                <p className={styles['p_text']}>
                                    Hello,{' '}
                                    <b>
                                        {user.result.firstName +
                                            user.result.lastName}
                                    </b>
                                </p>
                                <small
                                    className={`${styles['text-muted']} ${styles['small_text']}`}
                                >
                                    Have a good day
                                </small>
                            </div>
                            <div className={styles['profile-photo']}>
                                <img
                                    className={styles['image-admin']}
                                    src={user.result.avatar || noava}
                                    alt=""
                                ></img>
                            </div>
                        </div>
                    </div>
                    {/* <!-- End OF TOP --> */}

                    {/* <!-- END OF RECENT-UPDATES --> */}
                    <div className={styles['sales-analytics']}>
                        <h2 className={styles['h2_text']}>
                            TeacherUsers-Quizes
                        </h2>
                        {leaderboardTeacher.map((teacher, index) => {
                            return (
                                teacher.Count !== 0 && (
                                    <div
                                        className={`${styles['item']} ${styles['online']}`}
                                        key={index}
                                    >
                                        <img
                                            className={styles['image']}
                                            src={teacher.avatar || noava}
                                            alt=""
                                        ></img>
                                        <div className={styles['right']}>
                                            <div className={styles['info']}>
                                                <h3
                                                    className={
                                                        styles['h3_text']
                                                    }
                                                >
                                                    {teacher.lastName +
                                                        teacher.firstName}
                                                </h3>
                                                <small
                                                    className={`${styles['text-muted']} ${styles['small_text']}`}
                                                >
                                                    Last{' '}
                                                    {Math.floor(
                                                        Math.random() * 10,
                                                    )}{' '}
                                                    Hours
                                                </small>
                                            </div>
                                            <h5
                                                className={`${styles['danger']} ${styles['h5_text']}`}
                                                style={{
                                                    color:
                                                        parseInt(
                                                            (parseInt(
                                                                teacher.Count,
                                                            ) /
                                                                SumQuizesOfTeacher) *
                                                                100,
                                                        ) >= 30
                                                            ? '#41F1B6'
                                                            : parseInt(
                                                                  (parseInt(
                                                                      teacher.Count,
                                                                  ) /
                                                                      SumQuizesOfTeacher) *
                                                                      100,
                                                              ) >= 20
                                                            ? '#FFB100'
                                                            : 'red',
                                                }}
                                            >
                                                {Math.round(
                                                    (parseInt(teacher.Count) /
                                                        SumQuizesOfTeacher) *
                                                        100,
                                                ) + '%'}
                                            </h5>
                                            <h3 className={styles['h3_text']}>
                                                Quizes: {teacher.Count}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
