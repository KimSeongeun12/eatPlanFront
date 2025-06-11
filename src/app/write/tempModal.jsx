import {useState} from "react";

const TempModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [tmpList, setTempList] = useState('');

    const tmpList_load = () => {

    }

    const dummySavedPosts = [
        { title: "첫 번째 임시저장 글", previewText: "이것은 첫 글의 미리보기 텍스트입니다." },
        { title: "두 번째 임시저장 글", previewText: "두 번째 글 내용의 일부입니다." },
    ];

    return (
        <div onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <h2>임시저장 글 목록</h2>
                {dummySavedPosts.length === 0 ? (
                    <p>저장된 글이 없습니다.</p>
                ) : (
                    <ul>
                        {dummySavedPosts.map((post, idx) => (
                            <li key={idx}>
                                <strong>{post.title}</strong>
                                <p>{post.previewText || post.content?.slice(0, 50) + "..."}</p>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default TempModal;