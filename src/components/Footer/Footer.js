import React from 'react';
import styles from './footer.module.css';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
// import { useSelector } from "react-redux"

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles['footer-container']}>
                <div className={styles['footer-row']}>
                    <div className={styles['footer-column']}>
                        <h4>
                            <span>About</span>
                        </h4>
                        <ul>
                            <li>
                                <a href="/">Company</a>
                            </li>
                            <li>
                                <a href="/">Service</a>
                            </li>
                            <li>
                                <a href="/">Blog</a>
                            </li>
                            <li>
                                <a href="/">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles['footer-column']}>
                        <h4>
                            <span>Application</span>
                        </h4>
                        <ul>
                            <li>
                                <a href="/">At home</a>
                            </li>
                            <li>
                                <a href="/">At school</a>
                            </li>
                            <li>
                                <a href="/">At work</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles['footer-column']}>
                        <h4>
                            <span>Terms and conditions</span>
                        </h4>
                        <ul>
                            <li>
                                <a href="/">Terms and conditions</a>
                            </li>
                            <li>
                                <a href="/">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles['footer-column']}>
                        <h4>
                            <span>Follow us</span>
                        </h4>
                        <div className={styles['footer-social-links']}>
                            <a href="/">
                                <FacebookIcon />
                            </a>
                            <a href="/">
                                <TwitterIcon />
                            </a>
                            <a href="/">
                                <InstagramIcon />
                            </a>
                            <a href="/">
                                <LinkedInIcon />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
