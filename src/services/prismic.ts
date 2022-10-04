import * as prismic from "@prismicio/client";
import { request } from "http";

export function getPrismicClient(req?: prismic.HttpRequestLike) {
  const prismicClient = prismic.createClient(
    String(process.env.PRISMIC_ENDPOINT)
  );

  prismicClient.accessToken = process.env.PRISMIC_ACCESS_TOKEN;
  req ? prismicClient.enableAutoPreviewsFromReq(req) : null;

  return prismicClient;
}

/*

import Prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(String(process.env.PRISMIC_ENDPOINT), {
    req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}

*/
