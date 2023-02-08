import React, { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
// import Dashboard from './components/Dashboard/Dashboard';
// import Footer from "./components/Footer/Footer";
import QuizCreator from './components/QuizCreator/QuizCreator';
import Quizes from './components/Quizes/Quizes';
import MyQuizes from './components/MyQuizes/MyQuizes';
import QuizDetails from './components/QuizDetails/QuizDetails';
import HostScreen from './components/Game/HostScreen/HostScreen';
import PlayerScreen from './components/Game/PlayerScreen/PlayerScreen';
import JoinGame from './components/Game/JoinGame/JoinGame';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { createSocket } from './actions/socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Notify from "./components/Notify/notify";
import Dashboard from './components/Dashboard/dashboard';
import Profile from './components/Profile/profile';
// import Notify from "./components/Notify/notify";
// import dashboard from "./components/Dashboard/dashboard";

function App() {
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    // const SOCKET_URL="https://it008-project.onrender.com"
    const SOCKET_URL = 'http://localhost:3001';
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });
        dispatch(createSocket(socket));

        return () => socket.disconnect();
    }, [dispatch]);

    // const [isNav,setIsNav]=useState(false)

    // const handleNav=()=>{
    //     setIsNav(!isNav);
    // }

    return (
        <BrowserRouter>
            <ToastContainer
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={true}
                pauseOnFocusLoss={false}
                draggable={true}
                limit={3}
                theme="light"
            />
            {/* {(isNav===true)&&(<Navbar/>)} */}
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route
                    path="/auth"
                    exact
                    component={() =>
                        user === null ? <Auth /> : <Redirect to="/" />
                    }
                />
                <Route path="/quizes" exact component={Quizes} />
                <Route path="/quizes/search" exact component={Quizes} />
                <Route path="/quizes/:id" exact component={QuizDetails} />
                <Route path="/myquizes/:id" exact component={QuizCreator} />
                <Route path="/games/joingame" exact component={JoinGame} />
                <Route path="/games/host/:id" exact component={HostScreen} />
                <Route
                    path="/games/player/:id"
                    exact
                    component={PlayerScreen}
                />
                <Route path="/myquizes" exact component={MyQuizes} />
                <Route path="/dashboard" exact component={Dashboard} />
                <Route path="/profile/:nickname" exact component={Profile} />

                {/* {(isNav===false) && <Dashboard handleNav={handleNav}/>} */}
            </Switch>
            {/* <Footer /> */}
            {/* Chỉ màn hình Home hiện Footer */}
        </BrowserRouter>
    );
}

export default App;
