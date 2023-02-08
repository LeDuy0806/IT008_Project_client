import { Link } from 'react-router-dom';
import errorBackground from '../../assets/errorPage.jpg'
import styles from './ErrorPage.module.css'

function ErrorPage() {
    return <div className={styles['container']}>
        <img src={errorBackground} alt="Error" />
        <Link to="/auth" className={styles['button']} >Login to see this page</Link>

    </div>;
}

export default ErrorPage;