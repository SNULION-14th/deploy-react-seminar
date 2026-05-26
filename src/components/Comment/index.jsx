import { useEffect, useState } from "react";
import CommentElement from "./CommentElement";
import { createComment, deleteComment, getComments } from "../../apis/api";
import { useNavigate } from "react-router-dom";

const Comment = ({ postId }) => {
    const [commentList, setCommentList] = useState([]); // state for comments
    const [newContent, setNewContent] = useState(""); // state for new comment

    const getCommentsAPI = async () => {
        const comments = await getComments(postId);
        setCommentList(comments);
    }

    useEffect(() => {
        getCommentsAPI();
    }, [postId])

    const navigate = useNavigate();

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            post: postId,
            content: newContent
        }
        createComment(newComment);
        setNewContent("");
        getCommentsAPI();
    };

    const handleCommentDelete = async (commentId) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;
        try {
            await deleteComment(commentId, navigate);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full mt-5 self-start">
            <h1 className="text-3xl font-bold my-5">Comments</h1>
            {commentList.map((comment) => {
                return (
                    <CommentElement key={comment.id} comment={comment} handleCommentDelete={handleCommentDelete} postId={postId} />
                );
            })}
            
            <form className="flex flex-row mt-10 gap-3" onSubmit={handleCommentSubmit}>
                <input type="text" value={newContent} placeholder="댓글을 입력해주세요" className="input" style={{ width: "calc(100% - 100px)" }} onChange={(e) => setNewContent(e.target.value)} />
                <button type="submit" className="button">작성</button>
            </form>
        </div>
    );
};

export default Comment;
