import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { SubscribleButton } from '../components/SubscribleButton';
import styles from './home.module.scss';

export default function Home(props){

    return(
        <>
            <Head>
                <title>ig.news</title>
            </Head>

            <main className={styles.contentContainer}>
                <section className={styles.hero}>
                    <span>🖐 Hey, welcome</span>
                    <h1>News about<br/>the <span>React</span> world.</h1>
                    <p>
                        Get access to all the publications <br/>
                        <span>for $9.90 month</span> 
                    </p>

                    <SubscribleButton/>
                </section>
                <img src="/images/avatar.svg" alt="girl coding"/>
            </main>
        </>
    );
}

export const getServerSideProps:GetServerSideProps = async () =>{

    return {
        props:{
            name: 'Thyago',
            age: 27
        }
    }
}