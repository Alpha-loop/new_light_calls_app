import { api } from "../../../services/apiClient";

// Request body shared by the feeds / devotionals endpoints. Mirrors
// the backend DTO: TenantId, UserId, IsPending, IsDevotional,
// DevotionalDate, Tags, AllPost, IsRefresh. Anything not passed
// keeps the value this app has always sent; `isRefresh` is the new
// field and is true only for a user-initiated pull-to-refresh.
export interface FeedQueryOptions {
  userId?: string | null;

  isPending?: boolean;

  isDevotional?: boolean;

  devotionalDate?: string | null;

  tags?: string | null;

  allPost?: boolean;

  isRefresh?: boolean;
}

const buildFeedBody = (
  tenantId: string,
  options: FeedQueryOptions = {}
) => ({
  tenantId,

  userId: options.userId ?? null,

  isPending: options.isPending ?? true,

  isDevotional:
    options.isDevotional ?? true,

  devotionalDate:
    options.devotionalDate ?? null,

  tags: options.tags ?? null,

  allPost: options.allPost ?? true,

  isRefresh:
    options.isRefresh ?? false,
});

/**
 * Today's Devotional
 */
export const getTodayDevotional =
  async (
    tenantId: string
  ,
    options?: FeedQueryOptions
  ) => {
    const response =
      await api.post(
        `/portal/${tenantId}/devotionals/today`,
        buildFeedBody(tenantId, options)
      );

    return response.data;
  };

/**
 * Devotional Library
 */
export const getDevotionals =
  async (
    tenantId: string
  ,
    options?: FeedQueryOptions
  ) => {
    const response =
      await api.post(
        `/portal/${tenantId}/devotionals`,
        buildFeedBody(tenantId, options)
      );

    return response.data;
  };

/**
 * Church Feeds
 */
export const getFeeds =
  async (
    tenantId: string
  ,
    options?: FeedQueryOptions
  ) => {
    const response =
      await api.post(
        `/portal/${tenantId}/feeds`,
        buildFeedBody(tenantId, options)
      );

    console.log(
      "FEEDS API RESPONSE:",
      response.data
    );

    return response.data;
  };

/**
 * YouTube Videos
 */
export const getYouTubeVideos =
  async (
    channelId: string
  ) => {
    const response =
      await api.get(
        "/portal/Media/GetYouTubeVideos",
        {
          params: {
            channelId,
          },
        }
      );

    return response.data;
  };

/**
 * Celebrants
 */
export const getCelebrants =
  async (
    tenantId: string
  ) => {
    const response =
      await api.get(
        "/portal/profile/celebrants",
        {
          params: {
            tenantId,
          },
        }
      );

    return response.data;
  };

// ministry.services.ts

export const getMinistryProfile =
  async (
    tenantId: string,
  ) => {
    const response =
      await api.get(
        `/portal/Ministry/${tenantId}/profile`
      );
    console.log(response, "this is ministry profile")
    return response.data;
  };

export const likePost = async ({
  tenantId,
  
  postId,
  userId,
  isLike,
}: {
  tenantId: string;
  postId: string;
  userId: string;
  isLike: boolean;
}) => {
  const response = api.post(`/portal/${tenantId}/feeds/like`, {
    userId,
    postId,
    isLike,
  });

  return response
};

export const commentOnPost = async (
  {
    tenantId,
    postId,
    userId,
    commentMessage,
  }: {
    tenantId: string;
    postId: string;
    userId: string;
    commentMessage: string;
  },
  token: string
) => {
  return api.post(
    `/portal/${tenantId}/feeds/comment`,
    {
      postId,
      commentMessage,
      userId,
      tenantId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ FIX
      },
    }
  );
};

export const sharePost = async (
  tenantId: string,
  postId: string,
  token: string | null
) => {
  const res = await api.get(
    `/portal/${tenantId}/feeds/share`,
    {
      params: { postId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};