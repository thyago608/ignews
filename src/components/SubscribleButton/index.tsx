import { useSession, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

type SubscribleButtonProps = {
    priceId: string;
};

export function SubscribleButton({ priceId }:SubscribleButtonProps){

    const [session] = useSession();

    function handleSubscrible(){
        //Se o usuário não estiver autenticado
        if(!session){
            signIn('github');
            return;
        }

        //Cria a sessão de checkout
    }
    return(
        <button 
            type="button" 
            className={styles.subscribleButton}
            onClick={handleSubscrible}
        >
            Subscrible now
        </button>
    );
}