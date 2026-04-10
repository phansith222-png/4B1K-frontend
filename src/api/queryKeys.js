export const queryKeys = {
  auth: {
    all: ["auth"],
    profile: () => [...queryKeys.auth.all, "profile"],
  },
  posts: {
    all: ["posts"],
    detail: (id) => [...queryKeys.posts.all, id],
    comments: (postId) => [...queryKeys.posts.detail(postId), "comments"],
  },
};
