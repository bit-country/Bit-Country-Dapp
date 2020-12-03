let API_URL;

if (process.env.NODE_ENV == "production") {
  API_URL = process.env.REACT_APP_UAT_URL;
} else {
  API_URL = process.env.REACT_APP_DEV_URL;
}

export const BASE_URL = API_URL;


export default {
  SIGN_UP: "/authentication/signup",
  SIGN_IN: "/authentication/signin",
  SIGN_IN_WITH_PROVIDER: "/authentication/signinwithprovider",
  AUTHENTICATED: "/authentication/getUser",
  CHECK_ACCOUNT_CREATED: "/authentication/checkAccountCreated",

  CREATE_COUNTRY: "/country/createCountry",
  GET_COUNTRY_PENDING_STATUS: "/country/getPendingStatus",
  GET_COUNTRIES: "/country/getCountries",
  GET_COUNTRIES_BY_UIDS: "/country/getCountriesByUids",
  GET_COUNTRIES_BY_USER: "/country/getCountriesByUser",
  GET_COUNTRY_BY_TOPIC: "/country/getCountryByTopic",
  GET_COUNTRY: "/country/getCountry",
  SEARCH_COUNTRIES: "/country/search",

  GET_COUNTRY_NAMES: "/name/getMyCountryNames",
  CREATE_COUNTRY_NAME: "/name/createCountryName",

  GET_IS_COUNTRY_RESIDENT: "/country/isResident",
  JOIN_COUNTRY: "/country/join",
  LEAVE_COUNTRY: "/country/leave",
  GET_CURRENT_RESIDENCY_APPLICATION: "/country/getApplicationForResidency",
  GET_COUNTRY_RESIDENCY_APPLICATIONS: "/country/getApplicationsForResidency",
  ACCEPT_RESIDENCY_APPLICATION: "/country/acceptResidencyApplication",
  REJECT_RESIDENCY_APPLICATION: "/country/rejectResidencyApplication",

  PURCHASE_BLOCK: "/country/purchaseBlock",
  GET_BLOCKS_BY_COUNTRY: "/country/getBlocksByCountry",
  GET_BLOCK_BY_ID: "/country/getBlockById",
  GET_SURROUNDING_BLOCKS_BY_BLOCK:
    "/country/getSurroundingBlocksByBlock",
  GET_SUBSCRIBED_TO_BLOCK: "/country/getSubscriptionByBlock",
  SUBSCRIBE_TO_BLOCK: "/country/subscribeToBlock",
  UNSUBSCRIBE_FROM_BLOCK: "/country/unsubscribeFromBlock",

  GET_WELCOME_MESSAGE: "/country/getWelcomeMessage",
  UPDATE_WELCOME_MESSAGE: "/country/updateWelcomeMessage",
  SEND_INVITATION_EMAIL: "/country/InviteUser",

  CREATE_TOPIC: "/post/createTopic",

  CREATE_POST: "/post/createNewPost",
  UPDATE_POST_PHOTO: "/post/updatePhoto", // TODO: Currently unimplemented
  GET_POSTS: "/post/getPosts",
  SEARCH_POSTS: "/post/searchPosts",
  GET_MIND: "/post/getMind",
  GET_POST_BY_ID: "/post/getPostById",
  GET_POST_BY_SHORTCODE: "/post/getPostByShortCode",
  ADD_VIEW_TO_POST: "/post/viewedPost",
  LIKE_POST: "/post/likePostById",
  UNLIKE_POST: "/post/unlikePostById",
  DISLIKE_POST: "/post/dislikePostById",
  UNDISLIKE_POST: "/post/undislikePostById",
  EDIT_POST: "/post/editPost",
  APPROVE_POST: "/post/approvePost",
  UNAPPROVE_POST: "/post/retrievePost",
  DELETE_POST: "/post/deletePost",

  GET_COMMENTS_BY_POST: "/post/getCommentsByPostId",
  CREATE_COMMENT: "/post/createNewComment",
  LIKE_COMMENT: "/post/likeCommentById",
  UNLIKE_COMMENT: "/post/unlikeCommentById",
  DISLIKE_COMMENT: "/post/dislikeCommentById",
  UNDISLIKE_COMMENT: "/post/undislikeCommentById",
  EDIT_COMMENT: "/post/editComment",
  DELETE_COMMENT: "/post/deleteComment",

  GET_USER: "/authentication/getUser",
  GET_USER_COUNTRY_ROLE: "/country/getUserCountryRole",
  GET_USER_BLOCKPURCHASE_PERMISSION: "/countrymanagement/getBlockPurchasePermission",

  GET_TOKEN_BALANCE: "/profile/getTokenBalance",

  GET_ACTIVITIES: "/country/getActivities",

  GET_RULES_BY_COUNTRY: "/country/getActivityRules",
  UPDATE_RULES: "/country/updateActivityRules",

  GET_COUNTRY_INSIGHTS: "/country/getCountryInsights",
  GET_COUNTRY_STAKEHOLDERS: "/staking/getCountryStakeShare",
  GET_COUNTRY_USER_STAKE_RECORDS: "/staking/getCountryUserStakingRecords",
  STAKE_INTO_COUNTRY: "/staking/stakeIntoCountry",

  GET_EXCHANGE_RATE: "/exchange/getExchangeRate",
  GET_TOKEN_RATE: "/exchange/getTokenRate",
  GET_BLOCK_RATE: "/exchange/getBlockRate",
  GET_BCG_TO_ETH_RATE: "/exchange/getBCGToEthRate",
  GET_TOKEN_PER_BLOCK_RATE: "/exchange/getTokenPerBlockRate",
  PURCHASE_BCG: "/platform/purchaseBCG",
  PROCESS_BCG: "/platform/processBCG",

  GET_COUNTRY_TOKEN: "/token/getCountryToken",
  GET_TOKEN_BY_ID: "/token/getTokenById",
  GET_ALL_TOKEN: "/token/getTokens",

  GET_BALANCE_OF_USER: "/token/getTokenBalanceOf",
  PLACE_ORDER: "/exchange/placeMarketOrder",
  PLACE_GLOBAL_ORDER: "/exchange/placeGlobalMarketOrder",
  GET_SELL_ORDERS: "/exchange/getSellOrders",
  GET_BUY_ORDERS: "/exchange/getBuyOrders",
  CLOSE_ORDER: "/exchange/closeMarketOrder",
  ACCEPT_ORDER: "/exchange/acceptMarketOrder",
  GET_GLOBAL_ORDERS: "/exchange/getGlobalOrders",

  GET_USER_TOKEN_BALANCE: "/token/userTokenBalance",
  GET_USER_DIGITAL_ASSETS: "/token/userAssets",

  GET_OWN_PROFILE: "/profile/getMyProfile",
  GET_USER_PROFILE: "/profile/getProfile",
  GET_USER_PROFILE_BY_BLOGUID: "/profile/getProfileByBlogUid",
  CHECK_MINDUID_AVAILABILITY: "/profile/checkMindUidAvailability",
  UPDATE_PROFILE: "/profile/updateMyProfile",
  UPDATE_PROFILE_IMAGE: "/profile/updateProfileImage",

  GET_NOTIFICATIONS: "/notification/getNotifications",
  GET_NOTIFICATION_COUNT: "/notification/getNotificationCount",

  GET_METADATA_POST: "/metadata/getPostMetadata",
  GET_METADATA_MIND: "/metadata/getMindMetadata",
  GET_METADATA_BLOCK: "/metadata/getBlockMetadata",
  GET_METADATA_COUNTRY: "/metadata/getCountryMetadata",
  GET_METADATA_HOME: "/metadata/getHomepageMetadata",

  CREATE_ASSET_AUCTION: "/auction/asset/createNewAuction",
  GET_SECTIONS_BY_BLOCK: "/dimension/getSectionsByBlock",
  GET_ASSETS_BY_BLOCK: "/dimension/getAssetsByBlock",
  GET_SLOTASSETS_BY_BLOCK: "/dimension/getSlotAssetsByBlock",
  PLACE_ASSET_IN_SLOT: "/dimension/placeAssetInSlot",

  GET_BLOCK_THEME: "/dimension/getBlockTheme",
  GET_BLOCK_THEMES: "/dimension/getBlockThemes",
  GET_BLOCK_TEMPLATES: "/dimension/getBlockTemplates",
  
  /* Marketplace endpoints */
  MARKETPLACE_GETFEATUREITEMS: "/marketplace/browse/featured",
  MARKETPLACE_CREATESELL: "/marketplace/sell",
  MARKETPLACE_BROWSE: "/marketplace/browse",
  MARKETPLACE_GETITEM: "/marketplace/item",
  MARKETPLACE_GETSELLABLEITEM: "/marketplace/sellable",
  MARKETPLACE_GET_LISTING_BY_ASSET: "/marketplace/listingByAsset",
  MARKETPLACE_BID: "/marketplace/bid",

  /* Asset endpoints */
  CREATE_ASSET: "/asset/asset/createAsset",
  UPDATE_ASSET_IMAGE: "/asset/asset/updateAssetContent",
  GET_USER_ASSET: "/asset/asset/getUserAsset",
  UPDATE_ASSET_HASH: "/asset/asset/updateAssetBlockHash",
  UPLOAD_ABI: "/asset/asset/uploadAbi",
  UPDATE_ASSET_ID_FROM_HASH: "/asset/asset/updateAssetId"
};
