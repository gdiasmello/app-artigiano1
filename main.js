/**
 * PiZZA Master - Core Engine v2.20
 * Focado em Resiliência e Sincronização em Tempo Real
 */

// 1. CONFIGURAÇÃO FIREBASE (Firestore v8)
const firebaseConfig = { 
    apiKey: "AIzaSyBL70gtkhjBvC9BiKvz5HBivH07JfRKuo4", 
    authDomain: "artigiano-app.firebaseapp.com", 
    databaseURL: "https://artigiano-app-default-rtdb.firebaseio.com",
    projectId: "artigiano-app",
    storageBucket: "artigiano-app.firebasestorage.app",
    messagingSenderId: "212218495726",
    appId: "1:212218495726:web:dd6fec7a4a8c7ad572a9ff"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. ESCUDO GLOBAL DE ERROS
// A função window.exibirErroFatal já foi definida no index.html para capturar erros de carregamento.

Vue.config.errorHandler = (err, vm, info) => {
    if (window.exibirErroFatal) {
        window.exibirErroFatal("ERRO VUE", err, info);
    } else {
        console.error("Erro Vue (Fallback):", err, info);
    }
};

// Os handlers window.onerror e window.onunhandledrejection já estão definidos no index.html.
// Não precisamos redefini-los aqui, pois eles já capturam tudo.

// 3. INSTÂNCIA VUE PRINCIPAL
const app = new Vue({
    el: '#app',
    data: {
        versaoApp: '1.0.0',
        viewAtual: 'tela-login',
        carregandoDados: true,
        usuario: null,
        
        // Estado Operacional
        dataEstoqueMassas: '',
        dataPedidoSacolao: '',
        dataPedidoLimpeza: '',
        dataPedidoInsumos: '',
        carrinhoInsumos: [], // Carrinho consolidado (Insumos + Limpeza)
        
        // Sensores e IA
        clima: { temperatura: '...', isCalor: false, modoSmart: true },
        feriados: [],
        multiplicadoresProducao: { vespera: 30, feriado: 50 }, // % a mais
        
        // Listas Sincronizadas
        equipe: [],
        bancoProdutos: [],
        rotasSalvas: [],
        avisos: [],
        eventosEspeciais: [], // { data, nome, multiplicador }
        historicoGlobais: [],
        pedidosResetSenha: [],
        bancoChecklists: [], // { id, titulo, publico, idCriador, tarefas: [], agendamento: { horario, dias, feriado, vespera } }
        checklistsConcluidos: {}, // { 'checklistId_data': true }
        dadosNavegacao: null, // Para passar dados entre telas
        
        // Configurações
        metas: { 0: 80, 1: 0, 2: 0, 3: 60, 4: 65, 5: 110, 6: 120, feriado: 130 },
        localizacaoLoja: { latitude: null, longitude: null },
        
        // Memória de IA
        memoriaOperacional: {
            itens: {} // { 'Nome do Item': { ultimaQtd: 10, frequenciaDias: 3, ultimoPedido: timestamp } }
        }
    },
    methods: {
        vibrar(ms) {
            if (navigator.vibrate) navigator.vibrate(ms);
        },

        mudarTela(tela, pushState = true) {
            this.vibrar(20);
            this.viewAtual = tela;
            window.scrollTo(0, 0);
            if (pushState) history.pushState({ tela }, "");
        },

        fazerLogout() {
            this.usuario = null;
            this.mudarTela('tela-login');
        },

        // Sincronização LocalStorage (Cache)
        salvarMemoriaLocal() {
            const snapshot = {
                dataEstoqueMassas: this.dataEstoqueMassas,
                dataPedidoSacolao: this.dataPedidoSacolao,
                dataPedidoLimpeza: this.dataPedidoLimpeza,
                dataPedidoInsumos: this.dataPedidoInsumos,
                carrinhoInsumos: this.carrinhoInsumos,
                metas: this.metas
            };
            localStorage.setItem('pizza_master_cache', JSON.stringify(snapshot));
        },

        carregarMemoriaLocal() {
            const cache = localStorage.getItem('pizza_master_cache');
            if (cache) {
                try {
                    const parsed = JSON.parse(cache);
                    Object.assign(this, parsed);
                } catch (e) { console.error("Erro cache:", e); }
            }
        },

        // Auditoria
        registrarHistorico(acao, setor, detalhes = '') {
            if (!this.usuario) return;
            const log = {
                id: Date.now(),
                usuario: this.usuario.nome,
                acao,
                setor,
                detalhes,
                dataStr: new Date().toLocaleDateString('pt-BR'),
                horaStr: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
            this.historicoGlobais.unshift(log);
            if (this.historicoGlobais.length > 500) this.historicoGlobais.pop();
            
            db.collection("operacao").doc("historico").set({ itens: this.historicoGlobais });
        },

        // WhatsApp Integration
        enviarWhatsApp(texto) {
            const saudacao = this.usuario?.preferencias?.saudacaoZap || "Olá!";
            const despedida = this.usuario?.preferencias?.despedidaZap || "Obrigado.";
            const msg = `${saudacao}\n\n${texto}\n\n${despedida}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        },

        // Segurança
        autorizarAcao(permissao, callback) {
            if (this.usuario?.permissoes?.admin || this.usuario?.permissoes[permissao]) {
                return callback();
            }
            
            Swal.fire({
                title: '🔒 PIN de Gerente:',
                input: 'password',
                inputAttributes: { inputmode: 'numeric', maxlength: 4 },
                showCancelButton: true,
                confirmButtonText: 'Autorizar',
                background: '#1E1E1E', color: '#FFF'
            }).then((res) => {
                if (res.isConfirmed) {
                    const admin = this.equipe.find(u => u.pin === res.value && (u.permissoes?.admin || u.cargo === 'Gerente'));
                    if (admin) {
                        this.registrarHistorico('Segurança', 'Autorização', `Ação aprovada por ${admin.nome}`);
                        callback();
                    } else {
                        Swal.fire({ icon: 'error', title: 'PIN Inválido', background: '#1E1E1E' });
                    }
                }
            });
        },

        ordenarProdutosPorRota(produtos) {
            if (!this.rotasSalvas || this.rotasSalvas.length === 0) {
                return [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
            }

            const ordemRotas = {};
            this.rotasSalvas.forEach((rota, index) => {
                ordemRotas[rota] = index;
            });

            return [...produtos].sort((a, b) => {
                const rotaA = (a.rotas && a.rotas.length > 0) ? a.rotas[0] : (a.rota || '');
                const rotaB = (b.rotas && b.rotas.length > 0) ? b.rotas[0] : (b.rota || '');

                const posA = rotaA && ordemRotas[rotaA] !== undefined ? ordemRotas[rotaA] : 999;
                const posB = rotaB && ordemRotas[rotaB] !== undefined ? ordemRotas[rotaB] : 999;

                if (posA !== posB) return posA - posB;
                return a.nome.localeCompare(b.nome);
            });
        },

        carregarFeriados() {
            const anoAtual = new Date().getFullYear();
            const feriadosBase = [
                { data: `${anoAtual}-01-01`, nome: 'Confraternização Universal' },
                { data: `${anoAtual}-04-21`, nome: 'Tiradentes' },
                { data: `${anoAtual}-05-01`, nome: 'Dia do Trabalho' },
                { data: `${anoAtual}-09-07`, nome: 'Independência do Brasil' },
                { data: `${anoAtual}-10-12`, nome: 'Nossa Senhora Aparecida' },
                { data: `${anoAtual}-11-02`, nome: 'Finados' },
                { data: `${anoAtual}-11-15`, nome: 'Proclamação da República' },
                { data: `${anoAtual}-12-10`, nome: 'Aniversário de Londrina' },
                { data: `${anoAtual}-12-25`, nome: 'Natal' },
                // Adicionando ano seguinte para planejamento
                { data: `${anoAtual + 1}-01-01`, nome: 'Confraternização Universal' },
                { data: `${anoAtual + 1}-04-21`, nome: 'Tiradentes' },
                { data: `${anoAtual + 1}-05-01`, nome: 'Dia do Trabalho' },
                { data: `${anoAtual + 1}-09-07`, nome: 'Independência do Brasil' },
                { data: `${anoAtual + 1}-10-12`, nome: 'Nossa Senhora Aparecida' },
                { data: `${anoAtual + 1}-11-02`, nome: 'Finados' },
                { data: `${anoAtual + 1}-11-15`, nome: 'Proclamação da República' },
                { data: `${anoAtual + 1}-12-10`, nome: 'Aniversário de Londrina' },
                { data: `${anoAtual + 1}-12-25`, nome: 'Natal' },
            ];
            // Evita duplicatas se já houver feriados customizados
            feriadosBase.forEach(f => {
                if (!this.feriados.some(fExistente => fExistente.data === f.data)) {
                    this.feriados.push(f);
                }
            });
        }
     },
    mounted() {
        this.carregarMemoriaLocal();
        
        // Listeners Firestore (Real-time)
        const docs = [
            { col: "configuracoes", doc: "equipe", key: "equipe", field: "lista" },
            { col: "configuracoes", doc: "bancoProdutos", key: "bancoProdutos", field: "lista" },
            { col: "configuracoes", doc: "rotas", key: "rotasSalvas", field: "lista" },
            { col: "configuracoes", doc: "avisos", key: "avisos", field: "lista" },
            { col: "configuracoes", doc: "loja", key: "loja_config" },
            { col: "operacao", doc: "historico", key: "historicoGlobais", field: "itens" },
            { col: "operacao", doc: "memoria", key: "memoriaOperacional" },
            { col: "operacao", doc: "checklists_concluidos", key: "checklistsConcluidos" }
        ];

        docs.forEach(item => {
            db.collection(item.col).doc(item.doc).onSnapshot(snap => {
                if (snap.exists) {
                    const data = snap.data();
                    if (item.key === "loja_config") {
                        if (data.metas) this.metas = data.metas;
                        if (data.pedidosResetSenha) this.pedidosResetSenha = data.pedidosResetSenha;
                        if (data.feriados) this.feriados = data.feriados;
                        if (data.multiplicadoresProducao) this.multiplicadoresProducao = data.multiplicadoresProducao;
                        if (data.modoSmart !== undefined) this.clima.modoSmart = data.modoSmart;
                        if (data.eventosEspeciais) this.eventosEspeciais = data.eventosEspeciais;
                        if (data.localizacaoLoja) this.localizacaoLoja = data.localizacaoLoja;
                    } else if (item.key === "memoriaOperacional") {
                        this.memoriaOperacional = data;
                    } else if (item.key === "checklistsConcluidos") {
                        this.checklistsConcluidos = data;
                    } else {
                        this[item.key] = data[item.field] || [];
                    }
                }
                if (item.key === "equipe") this.carregandoDados = false;
            });
        });

        // Clima API
        this.carregarFeriados(); // Carrega feriados locais
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-23.31&longitude=-51.16&current_weather=true&hourly=precipitation_probability')
            .then(r => r.json())
            .then(d => {
                this.clima.temperatura = Math.round(d.current_weather.temperature);
                this.clima.isCalor = this.clima.temperatura >= 27;
                
                // Verifica chuva entre 18h e 22h
                const horasPico = [18, 19, 20, 21, 22];
                const probabilidades = d.hourly.precipitation_probability;
                const agora = new Date();
                const diaHoje = agora.getDate();
                
                this.clima.vaiChoverPico = horasPico.some(h => {
                    // Encontra o índice correspondente à hora de hoje
                    const index = d.hourly.time.findIndex(t => {
                        const date = new Date(t);
                        return date.getDate() === diaHoje && date.getHours() === h;
                    });
                    return index !== -1 && probabilidades[index] > 40; // Mais de 40% de chance
                });
            }).catch(() => this.clima.temperatura = 'Off');
    }
});

// Navegação Android
window.onpopstate = (e) => {
    if (app.viewAtual !== 'tela-dashboard' && app.viewAtual !== 'tela-login') {
        app.mudarTela('tela-dashboard', false);
    }
};
