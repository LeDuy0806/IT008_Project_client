import styles from "./noresults.module.css"


export default function Noresult() {
    return (
        <div className={styles["container"]}>
            <img style={{ width: "200px" }} src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg//assets/a60759ad1dabe909c46a817ecbf71878.png" className="shopee-search-empty-result-section__icon" alt="    "></img>
            <div style={{ margin: "0.9375rem 0 0.625rem", color: "rgba(0,0,0,.87)", fontSize: "1.125rem" }}>No result found</div>
            <div style={{ color: "rgba(0,0,0,.54)", fontSize: "1.125rem" }}>Try different or more general keyword</div>
        </div>
    )
}