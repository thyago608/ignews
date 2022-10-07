import * as prismic from "@prismicio/client";

export function getPrismicClient(req?: prismic.HttpRequestLike) {
  const prismicClient = prismic.createClient(
    String(process.env.PRISMIC_ENDPOINT)
  );

  prismicClient.accessToken = String(process.env.PRISMIC_ACCESS_TOKEN);
  req ? prismicClient.enableAutoPreviewsFromReq(req) : null;

  return prismicClient;
}
