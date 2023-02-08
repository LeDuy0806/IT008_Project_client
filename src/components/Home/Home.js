import React from 'react';
import { useSelector } from 'react-redux';
import styles from './home.module.css';
// import img1 from "../../assets/img1.jpeg";
// import img2 from "../../assets/img2.jpeg";
import img3 from '../../assets/img3.svg';
import img4 from '../../assets/img4.svg';
import img5 from '../../assets/img5.svg';
import pic1 from '../../assets/pic1.jpeg';
import pic2 from '../../assets/pic2.jpeg';
import snow from '../../assets/snow-flake.png';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import Snowfall from 'react-snowfall';

const snowflake = document.createElement('img');
snowflake.src = snow;
const images = [snowflake];

function Home() {
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);
    const user = JSON.parse(localStorage.getItem('profile'));

    return (
        <main className={styles.page}>
            <Snowfall
                speed={[0, 2]}
                radius={[5, 20]}
                style={{
                    position: 'fixed',
                    zIndex: '1',
                    height: '100vh',
                    width: '100vw',
                }}
                images={images}
            />
            <section className={styles['page-section']}>
                <section className={styles['first-section']}>
                    <div className={styles.banner}>
                        <div className={styles['banner-body']}>
                            <h2 className={styles['banner-title']}>
                                {isLanguageEnglish
                                    ? 'Make learning awesome'
                                    : 'Học tập một cách hiệu quả'}
                            </h2>
                            <p className={styles['banner-description']}>
                                {isLanguageEnglish
                                    ? 'Telexercisely delivers engaging learning to billions'
                                    : 'Telexercise cung cấp việc học hấp dẫn cho hàng triệu người có liên quan'}
                            </p>
                            <button className={styles['banner-button']}>
                                {user ? (
                                    user.result.userName === 'admin' ? (
                                        <a href="/dashboard">
                                            {isLanguageEnglish
                                                ? 'Dashboard'
                                                : 'Câu hỏi của tôi'}
                                        </a>
                                    ) : (
                                        <a href="/myquizes">
                                            {isLanguageEnglish
                                                ? 'My Quizes'
                                                : 'Câu hỏi của tôi'}
                                        </a>
                                    )
                                ) : (
                                    <a href="/auth">
                                        {isLanguageEnglish
                                            ? 'Sign up for free'
                                            : 'Đăng kí miễn phí'}
                                    </a>
                                )}
                            </button>
                        </div>
                        <img
                            src={pic1}
                            alt=""
                            className={styles['banner-image']}
                        />
                    </div>
                    <div className={styles.banner}>
                        <div className={styles['banner-body']}>
                            <h2 className={styles['banner-title']}>
                                {isLanguageEnglish
                                    ? 'Explore content'
                                    : 'Khám phá nội dung'}
                            </h2>
                            <p className={styles['banner-description']}>
                                {isLanguageEnglish
                                    ? 'Explore content and join one of the world’s largest educator communities.'
                                    : 'Khám phá nội dung và tham gia một trong những cộng đồng giáo dục lớn nhất thế giới'}
                            </p>
                            <button className={styles['banner-button']}>
                                <Link to="/quizes">
                                    {isLanguageEnglish
                                        ? 'Check public Telexercise'
                                        : 'Kiểm tra Telexercise công khai'}
                                </Link>
                                {/* <a href="/">
                                    {isLanguageEnglish
                                        ? 'Check public Telexercise'
                                        : 'Kiểm tra Telexercise công khai'}
                                </a> */}
                            </button>
                        </div>
                        <img
                            src={pic2}
                            alt=""
                            className={styles['banner-image']}
                        />
                    </div>
                </section>
                <section className={styles['second-section']}>
                    <div className={styles['section-background']}></div>
                    <div className={styles.info}>
                        <div className={styles['info-body']}>
                            <h2 className={styles['info-title']}>
                                {isLanguageEnglish
                                    ? 'Telexercise at school'
                                    : 'Telexercise tại trường'}
                            </h2>
                            <p className={styles['info-description']}>
                                {isLanguageEnglish
                                    ? 'Engaging group and distance learning for teachers and students.'
                                    : 'Thu hút học nhóm và học từ xa cho giáo viên và học sinh.'}
                            </p>
                            <a href="/" className={styles['info-link']}>
                                {isLanguageEnglish
                                    ? 'Learn more'
                                    : 'Tìm hiểu thêm'}{' '}
                                &gt;
                            </a>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles['info-body']}>
                            <h2 className={styles['info-title']}>
                                {isLanguageEnglish
                                    ? 'Telexercise at work'
                                    : 'Telexercise cho công việc'}
                            </h2>
                            <p className={styles['info-description']}>
                                {isLanguageEnglish
                                    ? 'Deliver training, presentations, meetings and events in-person or on any video conferencing platform.'
                                    : 'Thực hiện đào tạo, thuyết trình, các cuộc họp và sự kiện trực tiếp hoặc trên bất kỳ nền tảng hội nghị video nào.'}
                            </p>
                            <a href="/" className={styles['info-link']}>
                                {isLanguageEnglish
                                    ? 'Learn more'
                                    : 'Tìm hiểu thêm'}{' '}
                                &gt;
                            </a>
                        </div>
                    </div>
                    <div className={styles.info}>
                        <div className={styles['info-body']}>
                            <h2 className={styles['info-title']}>
                                {isLanguageEnglish
                                    ? 'Telexercise at home'
                                    : 'Telexercise tại nhà'}
                            </h2>
                            <p className={styles['info-description']}>
                                {isLanguageEnglish
                                    ? 'Learning Apps and games for family fun or home study.'
                                    : 'Các ứng dụng và trò chơi học tập giúp gia đình giải trí hoặc học tập tại nhà.'}
                            </p>
                            <a href="/" className={styles['info-link']}>
                                {isLanguageEnglish
                                    ? 'Learn more'
                                    : 'Tìm hiểu thêm'}{' '}
                                &gt;
                            </a>
                        </div>
                    </div>
                </section>
                <section className={styles['third-section']}>
                    <h1 style={{ color: 'white' }}>
                        {isLanguageEnglish
                            ? 'How does Telexercise work?'
                            : 'Telexercise hoạt động như thế nào?'}
                    </h1>
                    <div className={styles['card-container']}>
                        <div className={styles.card}>
                            <img src={img3} alt="" />
                            <div className={styles['card-body']}>
                                <h1>
                                    {isLanguageEnglish ? 'Create' : 'Tạo Game'}
                                </h1>
                                <p>
                                    {isLanguageEnglish
                                        ? 'It only takes minutes to create a learning game or trivia quiz on any topic, in any language.'
                                        : 'Tạo một bài kiểm tra về bất kỳ chủ đề nào, trong bất kỳ ngôn ngữ nào chỉ mất vài phút.'}
                                </p>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <img src={img4} alt="" />
                            <div className={styles['card-body']}>
                                <h1>
                                    {isLanguageEnglish
                                        ? 'Host or share'
                                        : 'Chủ nhà hoặc chia sẻ'}
                                </h1>
                                <p>
                                    {isLanguageEnglish
                                        ? 'Host a live game with questions on a big screen or share a game with remote players.'
                                        : 'Lấy trò chơi trực tiếp với các câu hỏi trên màn hình lớn hoặc chia sẻ trò chơi với những người chơi từ xa.'}
                                </p>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <img src={img5} alt="" />
                            <div className={styles['card-body']}>
                                <h1>
                                    {isLanguageEnglish ? 'Play' : 'Trò chơi'}
                                </h1>
                                <p>
                                    {isLanguageEnglish
                                        ? 'Game on! Join a kahoot with a PIN provided by the host and answer questions on your device.'
                                        : 'Tiếp tục chơi!Tham gia Kahoot bằng mã PIN do máy chủ cung cấp và trả lời các câu hỏi trên thiết bị của bạn.'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles['card-button']}>
                        {isLanguageEnglish
                            ? 'Play Telexercise  to see how it works.'
                            : 'Chơi câu hỏi để xem nó hoạt động như thế nào.'}{' '}
                        &nbsp;
                        <a href="/">
                            {isLanguageEnglish
                                ? 'Explore our public Telexercise'
                                : 'Duyệt các câu đố công khai'}
                        </a>
                    </div>
                </section>
            </section>
            <Footer />
        </main>
    );
}

export default Home;
