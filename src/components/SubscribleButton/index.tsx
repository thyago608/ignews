import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

type SubscribleButtonProps = {
    priceId: string;
};

export function SubscribleButton({ priceId }:SubscribleButtonProps){

    const [session] = useSession();

    async function handleSubscrible(){
        //Se o usuário não estiver autenticado
        if(!session){
            signIn('github');
            return;
        }

        //Cria a sessão de checkout
   
        try{
            const response = await api.post('/subscrible');

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });

        }catch(error){
            alert(error);
        }
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