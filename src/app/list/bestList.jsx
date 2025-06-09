'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";

export default function bestList() {
    const [weeklyList, setWeeklyList] = useState([]);
    const [monthlyList, setMonthlyList] = useState([]);

    useEffect(() => {
        weekly();
        monthly();
    }, []);

    const weekly = async () => {
        const {data} = await axios.get('http://localhost/weekly_best_list');
        console.log("course_img 값들: ", data.list.map(item => item.course_img));
        console.log(data.list);
        setWeeklyList(data.list);
    }

    const monthly = async () => {
        const {data} = await axios.get('http://localhost/monthly_best_list');
        console.log("월간 베스트 코스: ", data.list[0].course_img);
        setMonthlyList(data.list);
    }

    return (
        <>
            <div className={"rightMenu-bottom"}>
                <div className={"weekly"}>
                    <span className={"weeklySpan"}>Weekly 주간 베스트</span>
                    <div className={"weeklyDiv"}>
                        {weeklyList.map(item => (
                            <div key={item.course.post_idx} className={"best_listItem"}>
                                <img
                                    className={"mainImage"}
                                    src={`http://localhost/image/${item.course_img}`}
                                    onError={(e) => {
                                        e.target.src = '/no_image.png';
                                    }}
                                    alt="코스 이미지"
                                />
                                <span className="courseTitle">
                                    <Link className={"courseTitle_link"} href={`/courseDetail/${item.course.post_idx}`}>
                                        {item.course.subject}
                                    </Link>
                                </span>
                                <span className="courseComment">[{item.cmt_cnt}]</span><br/>
                                <span className="courseAuthor">{item.nickname}</span>
                                <span className="courseViews">조회 {item.course.b_hit}</span><br/>
                                <span className="courseScope">별점 {item.star_avg}</span>
                                <span className="courseLike">좋아요 {item.course.like_cnt}</span><br/>
                                <span className="courseDate">{new Date(item.course?.reg_date).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true, // 오전/오후 나오게
                                })}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={"monthly"}>
                    <span className={"monthlySpan"}>Monthly 월간 베스트</span>
                    <div className={"monthlyDiv"}>
                        {monthlyList.map(item => (
                            <div key={item.course.post_idx} className={"listItem"}>
                                <img
                                    className={"mainImage"}
                                    src={`http://localhost/image/${item.course_img}`}
                                    onError={(e) => {
                                        e.target.src = '/no_image.png';
                                    }}
                                    alt="코스 이미지"
                                />
                                <span className="courseTitle">
                                    <Link className={"courseTitle_link"} href={`/courseDetail/${item.course.post_idx}`}>
                                        {item.course.subject}
                                    </Link>
                                </span>
                                <span className="courseComment">[{item.cmt_cnt}]</span><br/>
                                <span className="courseAuthor">{item.nickname}</span>
                                <span className="courseViews">조회 {item.course.b_hit}</span><br/>
                                <span className="courseScope">별점 {item.star_avg}</span>
                                <span className="courseLike">좋아요 {item.course.like_cnt}</span><br/>
                                {/*<span className="courseLike">좋아요: {item.like_cnt}</span><br /> 혹시 문제 있으면 이걸로*/}
                                <span className="courseDate">{new Date(item.course?.reg_date).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true, // 오전/오후 나오게
                                })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}