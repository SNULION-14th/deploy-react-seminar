import { instance, instanceWithToken } from "./axios";

// Account 관련 API들
export const signIn = async (data) => {
  const response = await instance.post("/account/signin/", data);

  if (response.status === 200) {
    window.location.href = "/";
  } else {
    console.log("Error");
  }

  return response;
};

export const signUp = async (data) => {
  const response = await instance.post("/account/signup/", data);

  if (response.status === 200 || response.status === 201) {
    window.location.href = "/";
  } else {
    console.log("Error");
  }

  return response;
};

export const getUser = async () => {
  const response = await instanceWithToken.get("/account/info/");

  if (response.status === 200) {
    console.log("GET USER SUCCESS");
  } else {
    console.log("[ERROR] error while getting user");
  }

  return response.data;
};

// Post 관련 API들
export const getPosts = async () => {
  const response = await instance.get("/post/");
  return response.data;
};

export const getPost = async (id) => {
  const response = await instance.get(`/post/${id}/`);
  return response.data;
};

export const createPost = async (data, navigate) => {
  const response = await instanceWithToken.post("/post/", data);

  if (response.status === 201) {
    console.log("POST SUCCESS");
    navigate("/");
  } else {
    console.log("[ERROR] error while creating post");
  }

  return response;
};

export const updatePost = async (id, data, navigate) => {
  const response = await instanceWithToken.put(`/post/${id}/`, data);

  if (response.status === 200) {
    console.log("POST UPDATE SUCCESS");
    navigate(-1);
  } else {
    console.log("[ERROR] error while updating post");
  }

  return response;
};

export const deletePost = async (id, navigate) => {
  const response = await instanceWithToken.delete(`/post/${id}/`);

  if (response.status === 204) {
    console.log("POST DELETE SUCCESS");
    navigate("/");
  } else {
    console.log("[ERROR] error while deleting post");
  }

  return response;
};


export const likePost = async (postId) => {
  const response = await instanceWithToken.post(`/post/${postId}/like/`);

  if (response.status === 200) {
    console.log("LIKE SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while liking post");
  }

  return response.data;
};



// Tag 관련 API들
export const getTags = async () => {
  const response = await instance.get("/tag/");
  return response.data;
};

export const createTag = async (data) => {
  const response = await instanceWithToken.post("/tag/", data);

  if (response.status === 201) {
    console.log("TAG SUCCESS");
  } else {
    console.log("[ERROR] error while creating tag");
  }

  return response;
};

// Comment 관련 API들
export const getComments = async (postId) => {
  const response = await instance.get(`/comment/?post=${postId}`);
  return response.data;
};
export const createComment = async (postId, content) => {
  const response = await instanceWithToken.post("/comment/", {
    post: Number(postId),
    content: content,
  });

  if (response.status === 201) {
    console.log("COMMENT CREATE SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while creating comment");
  }

  return response;
};

export const updateComment = async (id, data) => {
  const response = await instanceWithToken.put(`/comment/${id}/`, data);

  if (response.status === 200) {
    console.log("COMMENT UPDATE SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while updating comment");
  }

  return response;
};

export const deleteComment = async (id) => {
  const response = await instanceWithToken.delete(`/comment/${id}/`);

  if (response.status === 204) {
    console.log("COMMENT DELETE SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while deleting comment");
  }

  return response;
};