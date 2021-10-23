import Head from "next/head";
import { GetStaticProps } from "next";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time>12 de março de 2021</time>
            <strong>Updated lib from Styles-Components</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
              aspernatur impedit, consequuntur quod in iste necessitatibus
              voluptates tenetur voluptatem distinctio animi! Quasi, quos
              incidunt facilis recusandae ut praesentium necessitatibus laborum.
            </p>
          </a>
          <a>
            <time>12 de março de 2021</time>
            <strong>Updated lib from Styles-Components</strong>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
              aspernatur impedit, consequuntur quod in iste necessitatibus
              voluptates tenetur voluptatem distinctio animi! Quasi, quos
              incidunt facilis recusandae ut praesentium necessitatibus laborum.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //Instanciando um cliente Prismic
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
    }
  );

  console.log(JSON.stringify(response, null, 2));

  return {
    props: {},
  };
};
