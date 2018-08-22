import api, { limit } from "./api.js";

/**
 * 定义圈子对象
 * @typedef {Object} GroupObject
 * @property {number} id
 * @property {string} name
 * @property {number} user_id
 * @property {number} category_id
 * @property {string} avatar
 * @property {*} ...others
 */

/**
 *  定义圈子帖子对象
 * @typedef {Object} GroupPostObject
 * @property {number} group_id
 * @property {number} user_id
 * @property {string} title
 * @property {string} summary
 * @property {number[]} images
 * @property {*} ...others
 */

/**
 * 获取圈子总数
 * @author jsonleex <jsonlseex@163.com>
 * @returns {Promise<number>}
 */
export function getGroupTotalNumber() {
  return api
    .get("/plus-group/groups/count")
    .then(({ data: { count = 0 } }) => count)
    .catch(err => {
      console.warn(err);
      return 0;
    });
}

/**
 * 创建圈子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} categoryId
 * @param {Object} data
 * @returns
 */
export function postGroup(categoryId, data) {
  const url = `/plus-group/categories/${categoryId}/groups`;
  return api.post(url, data, { validateStatus: s => s === 200 });
}

/**
 * 获取圈子全部分类
 * @export
 * @returns
 */
export function getGroupCates() {
  return api.get("/plus-group/categories", { validateStatus: s => s === 200 });
}

/**
 * 获取我加入的圈子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @returns {Promise<GroupObject[]>}
 */
export function getMyGroups() {
  return api.get("/plus-group/user-groups", { validateStatus: s => s === 200 });
}

/**
 * 获取推荐圈子
 * @author jsonleex <jsonlseex@163.com>
 * @returns {Promise<Array>}
 */
export function getRecGroups() {
  return api
    .get("/plus-group/recommend/groups", {
      params: { type: "random" },
      validateStatus: s => s === 200
    })
    .then(({ data = [] }) => {
      return Array.isArray(data) ? data : [];
    })
    .catch(err => (err, []));
}

/**
 * 加入圈子
 * @author jsonleex <jsonlseex@163.com>
 * @param  {number} GID
 * @returns
 */
export function joinGroup(GID) {
  return api.put(`/plus-group/groups/${GID}`, {
    validateStatus: s => s === 201
  });
}

/**
 * 获取指定用户已加入的圈子列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {number} UID
 * @returns
 */
export function getGroupsByUser(UID, limit = 15, offset = 0) {
  return api.get("/plus-group/groups/users", {
    params: { user_id: UID, limit, offset },
    validateStatus: s => s === 200
  });
}

/**
 * 获取指定分类下的圈子列表
 * @author jsonleex <jsonlseex@163.com>
 * @param  {number} cate    分类id (cate === -1  && 获取推荐圈子)
 * @param  {number} limit
 * @param  {number} offset
 * @returns {Promise -> Array}
 */
export function getGroupsByCate(cate = -1, limit = 15, offset = 0) {
  const url =
    cate > -1
      ? `/plus-group/groups?category_id=${cate}`
      : "/plus-group/recommend/groups";
  const params = { limit, offset };
  return api
    .get(url, { params })
    .then(({ data = [] }) => data)
    .catch(err => (err, []));
}

/**
 * 收藏圈子帖子
 * @author jsonleex <jsonlseex@163.com>
 * @param  {number} postId
 * @param  {Boolean} status
 */
export function collectGroupPost(postId, status) {
  const url = status
    ? `/plus-group/group-posts/${postId}/uncollect`
    : `/plus-group/group-posts/${postId}/collections`;
  const method = status ? "delete" : "post";
  return api({ method, url, validateStatus: s => s === 201 || s === 204 });
}

/**
 * 收藏帖子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @returns
 */
export function collectionPost(postId) {
  const url = `/plus-group/group-posts/${postId}/collections`;
  return api.post(url, { validateStatus: s => s === 201 });
}

/**
 * 取消收藏帖子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @returns
 */
export function uncollectPost(postId) {
  const url = `/plus-group/group-posts/${postId}/uncollect`;
  return api.delete(url, { validateStatus: s => s === 204 });
}

/**
 * 获取指定圈子的圈子详情
 * @author mutoe <mutoe@foxmai.com>
 * @export
 * @param {number} groupId
 * @returns {Promise<GroupObject>}
 */
export function getGroupInfoById(groupId) {
  return api.get(`/plus-group/groups/${groupId}`, {
    validateStatus: s => s === 200
  });
}

/**
 * @export
 * @param {number} groupId
 * @param {string} [type="latest_post"]
 * @param {number} [limit=15]
 * @param {number} [offset=0]
 * @returns {Promise<{pinneds: Array, posts: Array}>}
 */
export function getGroudFeedsByType(
  groupId,
  type = "latest_post",
  limit = 15,
  offset = 0
) {
  const params = { type, offset, limit };
  return api
    .get(`/plus-group/groups/${groupId}/posts`, { params })
    .then(({ data }) => data)
    .catch(err => (err, { pinneds: [], posts: [] }));
}

/**
 * 申请帖子置顶
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @param {Object} params
 * @returns {Promise}
 */
export function applyTopPost(postId, params) {
  const url = `/plus-group/currency-pinned/posts/${postId}`;
  return api.post(url, params, { validateStatus: s => s === 201 });
}

/**
 * 打赏帖子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @param {Object} data
 * @param {number} data.amount 打赏金额
 * @returns
 */
export function rewardPost(postId, data) {
  const url = `/plus-group/group-posts/${postId}/new-rewards`;
  return api.post(url, data, { validateStatus: s => s === 201 });
}

/**
 * 创建帖子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} groupId
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.body
 * @param {string} data.summary
 * @param {number[]} [data.images]
 * @param {number} [data.sync_feed]
 * @param {number} [data.feed_from]
 * @returns {Promise<GroupPostObject[]>}
 */
export function createGroupPost(groupId, data) {
  const url = `/plus-group/groups/${groupId}/posts`;
  Object.assign(data, { feed_from: 2 });
  return api.post(url, data, { validateStatus: s => s === 201 });
}

/**
 * 删除帖子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} groupId
 * @param {number} postId
 * @returns {Promise}
 */
export function deletePost(groupId, postId) {
  const url = `/plus-group/groups/${groupId}/posts/${postId}`;
  return api.delete(url, { validateStatus: s => s === 204 });
}

export function likeGroupPost(postId, status) {
  const url = `/plus-group/group-posts/${postId}/likes`;
  const method = status ? "delete" : "post";
  return api({ method, url, validateStatus: s => s === 201 || s === 204 });
}

/**
 * 获取待审核的帖子置顶申请
 * @Author   Wayne
 * @DateTime 2018-05-04
 * @Email    qiaobin@zhiyicx.com
 * @param    {number}            after [description]
 * @returns
 */
export function getPostAudits({ after = 0, group = 0 }) {
  const params = { after, limit, group };
  return api.get("/plus-group/pinned/posts", { params });
}

/**
 * 获取帖子评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @param {params} params
 * @returns
 */
export function getPostComments(postId, params) {
  const url = `/plus-group/group-posts/${postId}/comments`;
  return api.get(url, { params, validateStatus: s => s === 200 });
}

/**
 * 发表帖子评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @param {Object} payload
 * @param {string} payload.body 评论内容
 * @param {number} [payload.reply_user] 回复的用户id
 * @returns {Promise<{comment}>}
 */
export function postComment(postId, payload) {
  const url = `/plus-group/group-posts/${postId}/comments`;
  return api
    .post(url, payload, { validateStatus: s => s === 201 })
    .then(({ data = { comment: {} } }) => data.comment);
}

export function getPostCommentAudits({ after = 0, post = 0 }) {
  const params = { after, limit, post };
  return api.get("/plus-group/pinned/comments", { params });
}

/**
 * 申请评论置顶
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object} params
 * @param {number} params.postId
 * @param {number} params.commentId
 * @param {Object} payload
 * @param {number} payload.amount
 * @param {number} payload.day
 * @returns
 */
export function applyTopPostComment({ postId, commentId }, payload) {
  const url = `/plus-group/currency-pinned/comments/${commentId}`;
  Object.assign(payload, { post_id: postId });
  return api.post(url, payload, { validateStatus: s => s === 201 });
}

/**
 * 删除帖子评论
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} postId
 * @param {number} commentId
 * @returns
 */
export function deletePostComment(postId, commentId) {
  const url = `/plus-group/group-posts/${postId}/comments/${commentId}`;
  return api.delete(url, { validateStatus: s => s === 204 });
}

/**
 * 搜索圈子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object} params
 * @returns {Promise<GroupObject[]>}
 */
export function searchGroups(params) {
  return api.get("/plus-group/groups", {
    params,
    validateStatus: s => s === 200
  });
}

/**
 * 搜索帖子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {Object} params
 * @param {string} params.keyword
 * @param {number} params.group_id
 * @param {number} params.limit
 * @param {number} params.offset
 * @returns {Promise<GroupPostObject[]>}
 */
export function searchPosts(params) {
  return api.get("/plus-group/group-posts", {
    params,
    validateStatus: s => s === 200
  });
}

/**
 * 获取圈子协议
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @returns {Promise<Object>}
 */
export function getProtocol() {
  return api.get("/plus-group/groups/protocol", {
    validateStatus: s => s === 200
  });
}

/**
 * 获取圈子成员
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} groupId
 * @param {Object} params
 * @param {number} [params.limit=15]
 * @param {number} [params.after=0]
 * @param {string} [params.name]
 * @param {string} [params.type]
 * @returns {Promise<UserObject[]>}
 */
export function getMembers(groupId, params) {
  const url = `/plus-group/groups/${groupId}/members`;
  return api.get(url, { params, validateStatus: s => s === 200 });
}

/**
 * 退出圈子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} groupId
 * @returns {Promise<null>}
 */
export function exitGroup(groupId) {
  const url = `/plus-group/groups/${groupId}/exit`;
  return api.delete(url, { validateStatus: s => s === 204 });
}

/**
 * 转让圈子
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} groupId
 * @param {Object} params
 * @param {number} params.target 被转让用户id
 * @returns
 */
export function transferGroup(groupId, params) {
  const url = `/plus-group/groups/${groupId}/owner`;
  return api.patch(url, params, { validateStatus: s => s === 201 });
}
