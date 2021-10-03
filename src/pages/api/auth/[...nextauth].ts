import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  //Configuração dos providers da aplicação
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope:'read:user'  //concede acesso as informações básicas do perfil do usuário
    }),
  ],
})