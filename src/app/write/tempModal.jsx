const TempModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const dummySavedPosts = [
        { title: "첫 번째 임시저장 글", previewText: "이것은 첫 글의 미리보기 텍스트입니다." },
        { title: "두 번째 임시저장 글", previewText: "두 번째 글 내용의 일부입니다." },
    ];

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    width: "90%",
                    maxWidth: "600px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>임시저장 글 목록</h2>
                {dummySavedPosts.length === 0 ? (
                    <p>저장된 글이 없습니다.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {dummySavedPosts.map((post, idx) => (
                            <li
                                key={idx}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #ddd",
                                    cursor: "pointer",
                                }}
                            >
                                <strong>{post.title}</strong>
                                <p style={{ margin: 0, color: "#555" }}>
                                    {post.previewText || post.content?.slice(0, 50) + "..."}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={onClose}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#cc503b",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "700",
                    }}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}

export default TempModal;