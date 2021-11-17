import Head from "next/head";
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
