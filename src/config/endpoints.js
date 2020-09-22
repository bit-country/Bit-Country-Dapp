/* global process */
let API_URL;

if (process.env.NODE_ENV == "production") {
  API_URL = process.env.REACT_APP_UAT_URL;
} else {
  API_URL = process.env.REACT_APP_DEV_URL;
}

export const BASE_URL = API_URL;

export default {
  SIGN_UP: "/authentication/authentication/signup",
  SIGN_IN: "/authentication/authentication/signin",
  SIGN_IN_WITH_PROVIDER: "/authentication/authentication/signinwithprovider",
  AUTHENTICATED: "/authentication/authentication/getUser",
  CHECK_ACCOUNT_CREATED: "/authentication/authentication/checkAccountCreated",

  CREATE_COUNTRY: "/country/country/createCountry",
  GET_COUNTRY_PENDING_STATUS: "/country/country/getPendingStatus",
  GET_COUNTRIES: "/country/country/getCountries",
  GET_COUNTRIES_BY_UIDS: "/country/country/getCountriesByUids",
  GET_COUNTRIES_BY_USER: "/country/country/getCountriesByUser",
  GET_COUNTRY_BY_TOPIC: "/country/country/getCountryByTopic",
  GET_COUNTRY: "/country/country/getCountry",
  SEARCH_COUNTRIES: "/country/country/search",

  GET_IS_COUNTRY_RESIDENT: "/country/country/isResident",
  JOIN_COUNTRY: "/country/country/join",
  LEAVE_COUNTRY: "/country/country/leave",

  PURCHASE_BLOCK: "/country/country/purchaseBlock",
  GET_BLOCKS_BY_COUNTRY: "/country/country/getBlocksByCountry",
  GET_BLOCK_BY_ID: "/country/country/getBlockById",
  GET_SURROUNDING_BLOCKS_BY_BLOCK:
    "/country/country/getSurroundingBlocksByBlock",
  GET_SUBSCRIBED_TO_BLOCK: "/country/country/getSubscriptionByBlock",
  SUBSCRIBE_TO_BLOCK: "/country/country/subscribeToBlock",
  UNSUBSCRIBE_FROM_BLOCK: "/country/country/unsubscribeFromBlock",

  GET_WELCOME_MESSAGE: "/country/country/getWelcomeMessage",
  UPDATE_WELCOME_MESSAGE: "/country/country/updateWelcomeMessage",
  SEND_INVITATION_EMAIL: "/email/email/sendInvitationEmail",

  CREATE_TOPIC: "/post/post/createTopic",

  CREATE_POST: "/post/post/createNewPost",
  GET_POSTS: "/post/post/getPosts",
  SEARCH_POSTS: "/post/post/searchPosts",
  GET_MIND: "/post/post/getMind",
  GET_POST_BY_ID: "/post/post/getPostById",
  GET_POST_BY_SHORTCODE: "/post/post/getPostByShortCode",
  ADD_VIEW_TO_POST: "/post/post/viewedPost",
  LIKE_POST: "/post/post/likePostById",
  UNLIKE_POST: "/post/post/unlikePostById",
  DISLIKE_POST: "/post/post/dislikePostById",
  UNDISLIKE_POST: "/post/post/undislikePostById",
  EDIT_POST: "/post/post/editPost",
  APPROVE_POST: "/post/post/approvePost",
  UNAPPROVE_POST: "/post/post/retrievePost",
  DELETE_POST: "/post/post/deletePost",

  GET_COMMENTS_BY_POST: "/post/post/getCommentsByPostId",
  CREATE_COMMENT: "/post/post/createNewComment",
  LIKE_COMMENT: "/post/post/likeCommentById",
  UNLIKE_COMMENT: "/post/post/unlikeCommentById",
  DISLIKE_COMMENT: "/post/post/dislikeCommentById",
  UNDISLIKE_COMMENT: "/post/post/undislikeCommentById",
  EDIT_COMMENT: "/post/post/editComment",
  DELETE_COMMENT: "/post/post/deleteComment",

  GET_USER: "/authentication/authentication/getUser",
  GET_USER_COUNTRY_ROLE: "/country/country/getUserCountryRole",

  GET_TOKEN_BALANCE: "/profile/profile/getTokenBalance",

  GET_ACTIVITIES: "/country/country/getActivities",

  GET_RULES_BY_COUNTRY: "/country/country/getActivityRules",
  UPDATE_RULES: "/country/country/updateActivityRules",

  GET_COUNTRY_INSIGHTS: "/country/country/getCountryInsights",
  GET_COUNTRY_STAKEHOLDERS: "/country/country/getCountryStakeholders",

  GET_EXCHANGE_RATE: "/exchange/exchange/getExchangeRate",
  GET_TOKEN_RATE: "/exchange/exchange/getTokenRate",
  GET_BLOCK_RATE: "/exchange/exchange/getBlockRate",
  PURCHASE_BCG: "/platform/platform/purchaseBCG",
  PROCESS_BCG: "/platform/platform/processBCG",

  GET_COUNTRY_TOKEN: "/token/token/getCountryToken",
  GET_BALANCE_OF_USER: "/token/token/getTokenBalanceOf",
  PLACE_ORDER: "/exchange/exchange/placeMarketOrder",
  GET_SELL_ORDERS: "/exchange/exchange/getSellOrders",
  GET_BUY_ORDERS: "/exchange/exchange/getBuyOrders",
  CLOSE_ORDER: "/exchange/exchange/closeMarketOrder",
  ACCEPT_ORDER: "/exchange/exchange/acceptMarketOrder",

  GET_USER_TOKEN_BALANCE: "/token/token/userTokenBalance",
  GET_USER_DIGITAL_ASSETS: "/token/token/userAssets",

  GET_OWN_PROFILE: "/profile/profile/getMyProfile",
  GET_USER_PROFILE: "/profile/profile/getProfile",
  GET_USER_PROFILE_BY_BLOGUID: "/profile/profile/getProfileByBlogUid",
  UPDATE_PROFILE: "/profile/profile/updateMyProfile",
  UPDATE_PROFILE_IMAGE: "/profile/profile/updateProfileImage",

  GET_NOTIFICATIONS: "/notification/notification/getNotifications",
  GET_NOTIFICATION_COUNT: "/notification/notification/getNotificationCount",

  GET_METADATA_POST: "/metadata/metadata/getPostMetadata",
  GET_METADATA_MIND: "/metadata/metadata/getMindMetadata",
  GET_METADATA_BLOCK: "/metadata/metadata/getBlockMetadata",
  GET_METADATA_COUNTRY: "/metadata/metadata/getCountryMetadata",
  GET_METADATA_HOME: "/metadata/metadata/getHomepageMetadata",
};
