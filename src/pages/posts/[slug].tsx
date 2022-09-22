import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/client";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import styles from "./post.module.scss";
import { SubscribeButton } from "../../components/SubscribeButton";

type PostProps = {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
};

export default function Post({ post }: PostProps) {
  const [session] = useSession();

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${
              !session ? styles.notRegistered : ""
            }`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {!session?.activeSubscription && <SubscribeButton />}
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  //Pegando informações se o usuário está autenticado
  const session = await getSession({ req });

  //Pegando o parâmetro da rota
  const { slug } = params;

  const prismic = getPrismicClient(req);

  //Pegando um documento no prismic por UID (tipo do doc no prismic, uid do doc, config do documento)
  const response = await prismic.getByUID("post", String(slug), {});

  const post = {
    slug,
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
