/** پاسخ `POST /admin/uploads/media` */
export type MediaUploadResponse = {
  url: string;
  key?: string;
  kind: "image" | "video";
  contentType?: string;
};

/** پاسخ `GET /admin/uploads/suggest-slug` */
export type SuggestSlugResponse = {
  slug: string;
};
