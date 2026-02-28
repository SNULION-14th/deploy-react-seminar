import { Link } from "react-router-dom";

export const SmallPost = ({ post }) => {
  const onClickLike = () => {
    alert("나도 좋아!");
    // add api call for liking post here
  };
  return (
    <Link
      to={`/${post.id}`}
      className="w-64 relative block group py-10 px-8 mr-5 my-5 ring-8 ring-transparent border-2 border-box border-white hover:bg-orange-400 hover:text-black hover:border-transparent hover:ring-orange-300 hover:ring-opacity-90 rounded-xl font-medium"
    >
      <h1 className="font-extrabold text-2xl truncate">{post.title}</h1>
      <p className="mt-2">{post.author.username}</p>
      <div className="flex flex-wrap mt-4">
        {post.tags.map((tag) => (
          <span key={tag.id} className="tag mr-1 mb-2">
            #{tag.content}
          </span>
        ))}
      </div>
      <div className="cursor-pointer" onClick={onClickLike}>
        {post.like_users.length > 0 && `❤️ ${post.like_users.length}`}
      </div>
    </Link>
  );
};

export const BigPost = ({ post }) => {
  const onClickLike = () => {
    alert("나도 좋아!");
    // add api call for liking post here
  };
  return (
    <div className="flex flex-col px-8 py-5 w-full bg-orange-400 ring-4 ring-orange-300 rounded-xl gap-5">
      <div className="flex flex-row items-center justify-between gap-3">
        <span className="text-black font-bold text-2xl">
          {post.author.username}의 {post.title}
        </span>
        <span className="text-black font-medium text-base">
          {post.created_at.slice(0, 10)}
        </span>
      </div>

      <div className=" rounded-xl p-2 text-black font-medium text-lg border-2 border-black">
        {post.content}
      </div>

      <div className="flex flex-row gap-2">
        {post.tags &&
          post.tags.map((tag) => (
            <span key={tag.id} className="tag">
              #{tag.content}
            </span>
          ))}
      </div>

      <div
        className="flex flex-row text-black cursor-pointer"
        onClick={onClickLike}
      >
        {post.like_users.length > 0 && `❤️ ${post.like_users.length}`}
      </div>
    </div>
  );
};
