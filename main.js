// main.js - O Cérebro do PiZZA Master v0.0.58 (Estabilizado)

// 🛡️ ESCUDO CONTRA ERROS NO NAVEGADOR
window.onerror = function(msg, url, line, col, error) {
    return false; // O listener do index.html trata a parte visual (Tela Vermelha)
};

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err);
    const erroDiv = document.getElementById('escudo-erro');
    if(erroDiv) {
        document.getElementById('app').style.display = 'none';
        erroDiv.style.display = 'flex';
        document.getElementById('msg-erro-critico').innerText = 'Erro Vue: ' + err.message;
    }
};

const app = new Vue({
    el: '#app',
    data: {
        // --- NAVEGAÇÃO ---
        viewAtual: 'tela-login',
        usuario: null,
        naPizzaria: false,
        eventoInstalacao: null,

        // --- OPERAÇÃO ---
        estoqueMassasHoje: 0,
        dataEstoqueMassas: '', 
        carrinhoInsumos: [], // Carrinho Insumos + Limpeza
        carrinhoSacolao: [], // Carrinho Hortifruti
        clima: { temperatura: '...', riscoChuvaNoturna: false, modoSmart: true, isCalor: false, geloVerificado: false },
        
        // --- CONFIGURAÇÕES ---
        metas: { 0: 80, 1: 0, 2: 0, 3: 60, 4: 65, 5: 110, 6: 120 },
        feriados: [{ data: "2026-12-25", nome: "Natal" }],
        avisos: [],
        rotasSalvas: ['Geladeira 1', 'Estoque Seco', 'Embalagens', 'Material de Limpeza'],
        
        // --- AUDITORIA IA ---
        estadoErroIA: {
            titulo: 'Aviso do Sistema',
            mensagem: '',
            icone: 'fa-exclamation-triangle',
            cor: '#FF5252',
            telaDestino: 'tela-dashboard',
            permitirIgnorar: false,
            callbackIgnorar: null
        },

        // --- BANCO DE DADOS LOCAL ---
        equipe: [{ 
            id: 1, nome: 'Gabriel', pin: '1821', cargo: 'Gerente', 
            permissoes: { admin: true, producao: true, pedidos: true, limpeza: true, gerenciar: true, historico: true, avisos: true, adicionar: true, remover: true },
            preferencias: { vibracao: true } 
        }],

        bancoProdutos: [],
        bancoChecklists: [
            { id: 1, titulo: 'Sequência Bater Massa', cargoDestino: 'Pizzaiolo', diasSemana: [0, 1, 2, 3, 4, 5, 6], tarefas: [{ id: 101, texto: 'Pesar Sal, Levain e Água' }, { id: 102, texto: 'Verificar temperatura do Gelo' }] }
        ],
        tarefasConcluidas: [], 
        historicoGlobais: []
    },
    methods: {
        // --- VIBRAÇÃO ---
        vibrar(padrao) {
            if (this.usuario?.preferencias?.vibracao !== false && 'vibrate' in navigator) {
                navigator.vibrate(padrao);
            }
        },

        // --- NAVEGAÇÃO INTELIGENTE (BOTÃO VOLTAR) ---
        mudarTela(novaTela, registrarHistorico = true) {
            this.vibrar(30);
            this.viewAtual = novaTela;
            window.scrollTo(0, 0);
            if (registrarHistorico) {
                history.pushState({ tela: novaTela }, "");
            }
        },

        lidarComBotaoVoltar(event) {
            if (this.viewAtual === 'tela-dashboard' || this.viewAtual === 'tela-login') {
                this.vibrar([50, 100]);
                Swal.fire({
                    title: 'Sair do PiZZA Master?',
                    text: "Tens a certeza que queres fechar o aplicativo?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#D50000',
                    cancelButtonColor: '#444',
                    confirmButtonText: 'Sim, Sair',
                    cancelButtonText: 'Ficar',
                    background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (navigator.app) { navigator.app.exitApp(); } else { window.close(); }
                    } else {
                        history.pushState({ tela: this.viewAtual }, "");
                    }
                });
            } else {
                // Se estiver dentro de qualquer módulo, volta para o Dashboard
                this.mudarTela('tela-dashboard', false);
            }
        },

        // --- INTERVENÇÃO DA IA ---
        dispararAlertaIA(opcoes) {
            this.vibrar([100, 50, 100]);
            this.estadoErroIA = { ...this.estadoErroIA, ...opcoes };
            this.mudarTela('tela-erros');
        },

        // --- SEGURANÇA E PIN ---
        autorizarAcao(permissaoNecessaria, callbackSucesso) {
            if (this.usuario?.permissoes?.admin || this.usuario?.permissoes[permissaoNecessaria]) {
                callbackSucesso();
            } else {
                this.vibrar([100, 50, 100]);
                Swal.fire({
                    title: '🔒 PIN de Admin:',
                    input: 'password',
                    inputAttributes: { inputmode: 'numeric', maxlength: 4, style: 'text-align: center; letter-spacing: 5px; font-size: 1.5rem; background: #111; color: #FFF;' },
                    showCancelButton: true, confirmButtonText: 'Autorizar', background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const admin = this.equipe.find(u => u.pin === result.value && u.permissoes.admin);
                        if (admin) {
                            this.vibrar([50, 50]); callbackSucesso();
                        } else {
                            Swal.fire({ icon: 'error', title: 'Incorreto', background: '#1E1E1E', color: '#FFF' });
                        }
                    }
                });
            }
        },

        // --- MEMÓRIA E DADOS ---
        salvarMemoriaLocal() {
            const dados = {
                metas: this.metas, avisos: this.avisos, rotasSalvas: this.rotasSalvas, 
                equipe: this.equipe, historicoGlobais: this.historicoGlobais, 
                estoqueMassasHoje: this.estoqueMassasHoje, dataEstoqueMassas: this.dataEstoqueMassas, 
                carrinhoInsumos: this.carrinhoInsumos, carrinhoSacolao: this.carrinhoSacolao, 
                bancoProdutos: this.bancoProdutos, bancoChecklists: this.bancoChecklists, 
                tarefasConcluidas: this.tarefasConcluidas
            };
            localStorage.setItem('pizzaMasterOfflineData', JSON.stringify(dados));
        },

        carregarMemoriaLocal() {
            const salvo = localStorage.getItem('pizzaMasterOfflineData');
            if (salvo) {
                try { Object.assign(this, JSON.parse(salvo)); } catch(e) { console.error("Erro no Backup"); }
            }
        },

        registrarHistorico(acao, setor, detalhes = '') {
            if (!this.usuario) return;
            const agora = new Date();
            this.historicoGlobais.unshift({
                id: Date.now(), usuario: this.usuario.nome, acao, setor, detalhes,
                dataStr: agora.toLocaleDateString('pt-BR'),
                horaStr: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });
            if (this.historicoGlobais.length > 300) this.historicoGlobais.pop();
            this.salvarMemoriaLocal();
        },

        async buscarClima() {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-23.3103&longitude=-51.1628&current_weather=true&timezone=America/Sao_Paulo`);
                const data = await res.json();
                if (data?.current_weather) {
                    this.clima.temperatura = Math.round(data.current_weather.temperature);
                    this.clima.isCalor = this.clima.temperatura >= 27;
                }
            } catch (e) { this.clima.temperatura = 'Off'; }
        }
    },
    mounted() {
        this.carregarMemoriaLocal();
        this.buscarClima();
        
        // Ativa o controlo do botão voltar físico
        history.pushState({ tela: this.viewAtual }, "");
        window.onpopstate = this.lidarComBotaoVoltar;

        window.addEventListener('beforeinstallprompt', (e) => { 
            e.preventDefault(); 
            this.eventoInstalacao = e; 
        });
    },
    watch: {
        bancoProdutos: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        carrinhoInsumos: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        carrinhoSacolao: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        tarefasConcluidas: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        avisos: { deep: true, handler() { this.salvarMemoriaLocal(); } }
    }
});
