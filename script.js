// Configuração do Firebase - Substitua com seus dados reais do console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBL70gtkhjBvC9BiKvz5HBivH07JfRKuo4",
    databaseURL: "https://artigiano-app-default-rtdb.firebaseio.com",
    projectId: "artigiano-app",
};

// Inicialização
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

new Vue({
    el: '#app',
    data: {
        loading: true,
        logado: false,
        abaAtiva: 'home',
        user: {},
        formLogin: { user: '', pin: '' },
        config: { feriado: false, nomeFeriado: '', avisoGeral: '' },
        dataHoje: new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
        blocos: [
            { id: 'sacolao', label: 'Sacolão', icone: 'fas fa-leaf', cor: 'verde' },
            { id: 'insumos', label: 'Insumos', icone: 'fas fa-box', cor: 'vermelho' },
            { id: 'checklist', label: 'Checklist', icone: 'fas fa-tasks', cor: 'azul' }
        ]
    },
    computed: {
        blocosDisponiveis() {
            // Se for ADM (Gabriel), vê tudo. Se for funcionário, filtra pelas permissões no banco.
            if (this.user.cargo === 'adm') return this.blocos;
            return this.blocos.filter(b => this.user.permissoes && this.user.permissoes[b.id]);
        },
        tituloAba() {
            const bloco = this.blocos.find(b => b.id === this.abaAtiva);
            return bloco ? bloco.label : 'Ajustes';
        }
    },
    methods: {
        efetuarLogin() {
            // LOGIN MESTRE (GABRIEL)
            if (this.formLogin.pin === '1821') {
                this.user = { id: 'mestre', nome: 'Gabriel', cargo: 'adm' };
                this.sucessoLogin();
                return;
            }

            // LOGIN DE EQUIPE (Busca no Firebase)
            db.ref('usuarios').once('value', snapshot => {
                const usuarios = snapshot.val();
                const usuarioEncontrado = Object.values(usuarios || {}).find(
                    u => u.user === this.formLogin.user && u.pin === this.formLogin.pin
                );

                if (usuarioEncontrado) {
                    this.user = usuarioEncontrado;
                    this.sucessoLogin();
                } else {
                    alert("Usuário ou PIN incorretos. Tente novamente.");
                    this.formLogin.pin = '';
                }
            });
        },
        sucessoLogin() {
            this.logado = true;
            localStorage.setItem('artigiano_session', JSON.stringify(this.user));
            this.carregarConfiguracoes();
        },
        carregarConfiguracoes() {
            // Escuta o mural de avisos e status de feriado em tempo real
            db.ref('config').on('value', snapshot => {
                this.config = snapshot.val() || {};
            });
        },
        abrirModulo(id) {
            this.abaAtiva = id;
            // Aqui você poderá disparar funções específicas de cada módulo
            console.log("Abrindo módulo:", id);
        },
        deslogar() {
            localStorage.removeItem('artigiano_session');
            location.reload();
        }
    },
    mounted() {
        // Tenta recuperar sessão salva para não precisar logar toda hora
        const sessaoSalva = localStorage.getItem('artigiano_session');
        if (sessaoSalva) {
            this.user = JSON.parse(sessaoSalva);
            this.logado = true;
            this.carregarConfiguracoes();
        }
        
        // Simula tempo de carregamento para o loader sumir
        setTimeout(() => {
            this.loading = false;
        }, 1200);
    }
});
