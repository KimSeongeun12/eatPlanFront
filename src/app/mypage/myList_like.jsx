export default function myList_like() {
    return (
        <>
            <table className={"courseTable"}>
                <tbody>
                <tr className={"courseTr"}>
                    <th className={"courseTh"}>No</th>
                    <th>제목</th>
                    <th>글쓴이</th>
                    <th>작성 날짜</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                    <th>공개 여부</th>
                </tr>
                <tr></tr>
                </tbody>
            </table>
        </>
    );
}