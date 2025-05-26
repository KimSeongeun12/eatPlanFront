'use client'

import LeftMenu from "@/app/leftMenu";
import styles from './courseSearch.module.css';

export default function CourseSearch(){

    const Search = () => {};

    return (
        <>
            <LeftMenu />
            <div className={styles.searchWrapper}>
                <input className={styles.StringSearch} type={"text"}/>
                <button className={styles.searchBtn}>
                    <img src={"돋보기 아이콘.png"} alt={"돋보기 아이콘"}/>
                </button>
            </div>
        </>
);
}