'use client'
import '../mainCss.css';
import './listCss.css';
import LeftMenu from '../leftMenu';
import BestList from './bestList';
import CommonList from './commonList';
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function List() {
    const [visible, setVisible] = useState('bestList');
    const [sort, setSort] = useState('date_desc'); // 정렬 기준 상태

    const showBestList = () => {setVisible('bestList')}
    const showCommonList = () => {setVisible('commonList')}

    const router = useRouter();

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={showCommonList} className={visible === 'commonList' ? 'active-span' : ''}>일반 코스</span>
                    <span onClick={showBestList} className={visible === 'bestList' ? 'active-span' : ''}>베스트 코스</span>
                    {visible === 'commonList' && (
                        <>
                            <FormControl sx={{ minWidth: 200, mb: 2, ml: 2 }}>
                                <InputLabel id="sort-select-label">정렬 기준</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sort}
                                    label="정렬 기준"
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <MenuItem value="date_desc">등록일 (최신순)</MenuItem>
                                    <MenuItem value="date_asc">등록일 (오래된 순)</MenuItem>
                                    <MenuItem value="hit_desc">조회수 (많은 순)</MenuItem>
                                    <MenuItem value="hit_asc">조회수 (적은 순)</MenuItem>
                                    <MenuItem value="like_desc">좋아요 많은 순</MenuItem>
                                    <MenuItem value="like_asc">좋아요 적은 순</MenuItem>
                                    <MenuItem value="star_avg_desc">별점 높은 순</MenuItem>
                                    <MenuItem value="star_avg_asc">별점 낮은 순</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                    <Link href="/courseSearch">
                        <div className={"search"} onClick={() => router.push('/courseSearch')}>
                            <img src={"searchIcon.png"} alt={"돋보기 아이콘"}/>
                        </div>
                    </Link>
                </div>
                <hr/>
                {visible === 'bestList' && <BestList/>}
                {visible === 'commonList' && <CommonList sort={sort} />}
            </div>
        </>
    );
}