import Head from "next/head";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import styles from "./post.module.scss";

type PostProps = {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
};

export default function Post({ post }: PostProps) {
  const { data } = useSession();

  const subscriptionActiveExists = data && !!data.activeSubscription;

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post} role={`article`}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${
              !subscriptionActiveExists ? styles.notRegistered : ""
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  //Pegando o parâmetro da rota

  const prismic = getPrismicClient(req);

  //Pegando um documento no prismic por UID (tipo do doc no prismic, uid do doc, config do documento)
  const response = await prismic.getByUID("post", String(params?.slug), {});

  const post = {
    slug: params?.slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
