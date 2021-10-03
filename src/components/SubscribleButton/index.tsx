import styles from './styles.module.scss';

type SubscribleButtonProps = {
    priceId: string;
};

export function SubscribleButton({ priceId }:SubscribleButtonProps){
    return(
        <button 
            type="button" 
            className={styles.subscribleButton}
        >
            Subscrible now
        </button>
    );
}