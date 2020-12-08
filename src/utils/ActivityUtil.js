import React from "react";
import { fetchAPI, fetchManual } from "./FetchUtil";
import ENDPOINTS from "../config/endpoints";
import Logging from "./Logging";
import Notification from "./Notification";
import { FormattedMessage } from "react-intl";

export async function likePost(postId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.LIKE_POST}?postId=${postId}`,
      "POST"
    );

    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }

    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export async function unlikePost(postId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.UNLIKE_POST}?postId=${postId}`,
      "POST"
    );

    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }

    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export async function dislikePost(postId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.DISLIKE_POST}?postId=${postId}`,
      "POST"
    );

    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }

    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export async function undislikePost(postId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.UNDISLIKE_POST}?postId=${postId}`,
      "POST"
    );

    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }

    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export function editPost(postId, editedPost) {
    return fetchManual(
        `${ENDPOINTS.EDIT_POST}?postId=${postId}`,
        "POST",
        editedPost
    );
}

export function approvePost(postId) {
    return fetchAPI(
        `${ENDPOINTS.APPROVE_POST}?postId=${postId}`,
        "POST",
        { postId }
    );
}

export function unapprovePost(postId) {
    return fetchAPI(
        `${ENDPOINTS.UNAPPROVE_POST}?postId=${postId}`,
        "POST",
        { postId }
    );
}

export function deletePost(postId) {
    return fetchAPI(
        `${ENDPOINTS.DELETE_POST}?postId=${postId}`,
        "POST",
        { postId }
    );
}

export async function likeComment(postId, commentId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.LIKE_COMMENT}?postId=${postId}&commentId=${commentId}`,
      "POST"
    );

    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }

    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export async function unlikeComment(postId, commentId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.UNLIKE_COMMENT}?postId=${postId}&commentId=${commentId}`,
      "POST"
    );
    
    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }
    
    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export async function dislikeComment(postId, commentId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.DISLIKE_COMMENT}?postId=${postId}&commentId=${commentId}`,
      "POST"
    );
    
    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }
    
    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export async function undislikeComment(postId, commentId) {
  try {
    const response = await fetchAPI(
      `${ENDPOINTS.UNDISLIKE_COMMENT}?postId=${postId}&commentId=${commentId}`,
      "POST"
    );
    
    if (!response?.isSuccess) {
      if (response?.message || response?.json?.message) {
        Notification.displayErrorMessage(
          <FormattedMessage id={response.message || response.json.message} />
        );

        throw Error(response.message || response.json.message);
      }

      // TODO Add default error message

      return false;
    }
    
    return true;
  } catch (error) {
    Logging.Error(error);
  }
}

export function editComment(postId, editedComment) {
    return fetchAPI(
        `${ENDPOINTS.EDIT_COMMENT}?postId=${postId}`,
        "POST",
        editedComment
    );
}

export function deleteComment(postId, commentId) {
    return fetchAPI(
        `${ENDPOINTS.DELETE_COMMENT}?postId=${postId}`,
        "POST",
        { commentId }
    );
}