Vue.component('tela-login', {
    template: `
        <div style="color: white; text-align: center; padding: 50px;">
            <h1>LOGIN DE RECUPERAÇÃO</h1>
            <p>Se você vê esta tela, o sistema base carregou.</p>
            <button @click="fazerLogin" style="padding: 20px; font-size: 1.5rem;">ENTRAR NO SISTEMA</button>
        </div>
    `,
    methods: {
        fazerLogin() {
            this.$root.usuario = { nome: 'Admin Recuperação', cargo: 'Gerente', permissoes: { admin: true } };
            this.$root.mudarTela('tela-dashboard');
        }
    }
});
