import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { query as q} from 'faunadb';

import { fauna } from '../../../services/fauna';


export default NextAuth({
  //Configuração dos providers da aplicação
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope:'read:user'  //concede acesso as informações básicas do perfil do usuário
    }),
  ],
  callbacks:{
    async signIn(user, account, profile){
      
      try{

        const { email } = user;

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(email)
              )
            )
          ),
        );

        return true;

      }catch{
        return false;
      }
    
    }
  }
})