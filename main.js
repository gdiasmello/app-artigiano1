// main.js - Cérebro com IA de Auditoria v0.0.49

window.onerror = function(msg, url, line, col, error) {
    // Agora o escudo no HTML captura isto, mas mantemos por segurança
    return false;
};

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err);
    var appDiv = document.getElementById('app');
    if(appDiv) appDiv.style.display = 'none';
    var erroDiv = document.getElementById('escudo-erro');
    if(erroDiv) {
        erroDiv.style.display = 'flex';
        document.getElementById('msg-erro-critico').innerText = 'Erro Vue: ' + err.message + '\nInfo: ' + info;
    }
};

const app = new Vue({
    el: '#app',
    data: {
        viewAtual: 'tela-login',
        usuario: null,
        eventoInstalacao: null,
        naPizzaria: false,
        estoqueMassasHoje: 0,
        dataEstoqueMassas: '', 

        carrinhoInsumos: [], 
        carrinhoSacolao: [], 

        clima: { temperatura: '...', riscoChuvaNoturna: false, modoSmart: true, isCalor: false, geloVerificado: false },
        
        metas: { 0: 80, 1: 0, 2: 0, 3: 60, 4: 65, 5: 110, 6: 120 },
        feriados: [{ data: "2026-12-25", nome: "Natal" }],
        avisos: [],
        rotasSalvas: ['Geladeira 1', 'Estoque Seco', 'Embalagens', 'Material de Limpeza'],
        
        // 🟢 NOVO: Variável que controla a tela de erro da IA
        estadoErroIA: {
            titulo: 'Aviso do Sistema',
            mensagem: 'Ocorreu uma anomalia.',
            icone: 'fa-exclamation-triangle',
            cor: '#FF5252',
            telaDestino: 'tela-dashboard',
            permitirIgnorar: false,
            callbackIgnorar: null
        },

        equipe: [{ 
            id: 1, nome: 'Gabriel', pin: '1821', nascimento: '1995-05-21', cargo: 'Gerente', 
            permissoes: { admin: true, producao: true, pedidos: true, limpeza: true, gerenciar: true, historico: true, avisos: true, adicionar: true, remover: true },
            preferencias: { vibracao: true } 
        }],

        bancoProdutos: [
            { id: 1, nome: 'Presunto Cru', local: 'Geladeira 1', grupo: 'Refrigerado', undContagem: 'fatias', undCompra: 'Caixas', fator: 40, estoqueIdeal: 120, apenasNome: false, categoria: 'insumos', emEstoque: '' },
            { id: 2, nome: 'Bacon', local: 'Geladeira 1', grupo: 'Refrigerado', undContagem: 'kg', undCompra: '', fator: 1, estoqueIdeal: 5, apenasNome: true, categoria: 'insumos', emEstoque: '' },
            { id: 4, nome: 'Farinha de Trigo', local: 'Estoque Seco', grupo: 'Seco', undContagem: 'sacos', undCompra: 'Fardos', fator: 5, estoqueIdeal: 20, apenasNome: false, categoria: 'insumos', emEstoque: '' },
            { id: 5, nome: 'Detergente Neutro', local: 'Material de Limpeza', grupo: 'Limpeza', undContagem: 'frascos', undCompra: 'Caixas', fator: 24, estoqueIdeal: 48, apenasNome: false, categoria: 'limpeza', emEstoque: '' },
            { id: 7, nome: 'Tomate Longa Vida', local: 'Geladeira 1', grupo: 'Hortifruti', undContagem: 'kg', undCompra: 'Caixas', fator: 20, estoqueIdeal: 40, apenasNome: false, categoria: 'sacolao', emEstoque: '' }
        ],

        bancoChecklists: [
            { id: 1, titulo: 'Sequência Bater Massa', cargoDestino: 'Pizzaiolo', diasSemana: [0, 1, 2, 3, 4, 5, 6], tarefas: [{ id: 101, texto: 'Pesar Sal, Levain e Água' }, { id: 102, texto: 'Verificar temperatura do Gelo' }] },
            { id: 2, titulo: 'Fechamento de Caixa', cargoDestino: 'Gerente', diasSemana: [0, 1, 2, 3, 4, 5, 6], tarefas: [{ id: 201, texto: 'Conferir gaveta' }] }
        ],
        tarefasConcluidas: [],

        historicoGlobais: []
    },
    methods: {
        vibrar(padrao) {
            let permitirVibracao = true; 
            if (this.usuario && this.usuario.preferencias && this.usuario.preferencias.vibracao === false) { permitirVibracao = false; }
            if (permitirVibracao && 'vibrate' in navigator) { navigator.vibrate(padrao); }
        },

        mudarTela(novaTela) { this.vibrar(30); this.viewAtual = novaTela; window.scrollTo(0, 0); },
        fazerLogout() { this.vibrar([50, 50, 50]); this.usuario = null; this.mudarTela('tela-login'); },

        // 🟢 NOVO: Função Global para travar a tela por ordens ilógicas
        dispararAlertaIA(opcoes) {
            this.vibrar([100, 50, 100, 50, 100]); // Vibração de sirene
            this.estadoErroIA = {
                titulo: opcoes.titulo || 'Alerta de Auditoria',
                mensagem: opcoes.mensagem || 'Ação bloqueada.',
                icone: opcoes.icone || 'fa-exclamation-triangle',
                cor: opcoes.cor || '#FF5252',
                telaDestino: opcoes.telaDestino || 'tela-dashboard',
                permitirIgnorar: opcoes.permitirIgnorar || false,
                callbackIgnorar: opcoes.callbackIgnorar || null
            };
            this.mudarTela('tela-erros');
        },

        verificarLocalizacao() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const latApp = -23.3103; const lonApp = -51.1628; 
                    const latUser = position.coords.latitude; const lonUser = position.coords.longitude;
                    const R = 6371e3; 
                    const p1 = latApp * Math.PI/180; const p2 = latUser * Math.PI/180;
                    const dp = (latUser-latApp) * Math.PI/180; const dl = (lonUser-lonApp) * Math.PI/180;
                    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    if ((R * c) <= 999999) { this.naPizzaria = true; } else { this.naPizzaria = false; }
                }, (error) => { this.naPizzaria = false; });
            }
        },

        autorizarAcao(permissaoNecessaria, callbackSucesso) {
            if (this.usuario.permissoes.admin || this.usuario.permissoes[permissaoNecessaria]) { callbackSucesso(); } 
            else {
                this.vibrar([100, 50, 100]);
                Swal.fire({
                    title: '🔒 Acesso Restrito', text: 'Peça a um Administrador para digitar o PIN:', input: 'password',
                    inputAttributes: { inputmode: 'numeric', maxlength: 4, pattern: '[0-9]*', style: 'text-align: center; letter-spacing: 5px; font-size: 1.5rem; background: #111; color: #FFF; border: 1px solid #444;' },
                    showCancelButton: true, confirmButtonText: 'Autorizar', cancelButtonText: 'Cancelar', confirmButtonColor: '#2962FF', background: '#1E1E1E', color: '#FFF'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const autorizador = this.equipe.find(u => u.pin === result.value && u.permissoes.admin);
                        if (autorizador) {
                            this.vibrar([50, 50, 50]); this.registrarHistorico('Autorização', 'Segurança', `Admin ${autorizador.nome} liberou ação.`); Swal.fire({ icon: 'success', title: 'Autorizado!', timer: 1000, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' }); callbackSucesso();
                        } else {
                            this.vibrar([100, 50, 100]); Swal.fire({ icon: 'error', title: 'Negado', background: '#1E1E1E', color: '#FFF' });
                        }
                    }
                });
            }
        },

        salvarMemoriaLocal() {
            const dadosOffline = { 
                metas: this.metas, feriados: this.feriados, avisos: this.avisos, rotasSalvas: this.rotasSalvas, 
                equipe: this.equipe, historicoGlobais: this.historicoGlobais,
                estoqueMassasHoje: this.estoqueMassasHoje, dataEstoqueMassas: this.dataEstoqueMassas,
                carrinhoInsumos: this.carrinhoInsumos, carrinhoSacolao: this.carrinhoSacolao,
                bancoProdutos: this.bancoProdutos, bancoChecklists: this.bancoChecklists, tarefasConcluidas: this.tarefasConcluidas
            };
            localStorage.setItem('pizzaMasterOfflineData', JSON.stringify(dadosOffline));
        },
        carregarMemoriaLocal() {
            const salvo = localStorage.getItem('pizzaMasterOfflineData');
            if (salvo) {
                const dados = JSON.parse(salvo);
                if(dados.metas) this.metas = dados.metas; if(dados.feriados) this.feriados = dados.feriados; if(dados.avisos) this.avisos = dados.avisos;
                if(dados.rotasSalvas) this.rotasSalvas = dados.rotasSalvas; if(dados.equipe) this.equipe = dados.equipe; if(dados.historicoGlobais) this.historicoGlobais = dados.historicoGlobais;
                if(dados.estoqueMassasHoje !== undefined) this.estoqueMassasHoje = dados.estoqueMassasHoje;
                if(dados.dataEstoqueMassas) this.dataEstoqueMassas = dados.dataEstoqueMassas;
                if(dados.carrinhoInsumos) this.carrinhoInsumos = dados.carrinhoInsumos;
                if(dados.carrinhoSacolao) this.carrinhoSacolao = dados.carrinhoSacolao;
                if(dados.bancoProdutos) this.bancoProdutos = dados.bancoProdutos;
                if(dados.bancoChecklists) this.bancoChecklists = dados.bancoChecklists;
                if(dados.tarefasConcluidas) this.tarefasConcluidas = dados.tarefasConcluidas;
            }
        },
        registrarHistorico(acao, setor, detalhes = '') {
            if (!this.usuario) return;
            const agora = new Date(); const dataStr = String(agora.getDate()).padStart(2, '0') + '/' + String(agora.getMonth() + 1).padStart(2, '0'); const horaStr = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');
            this.historicoGlobais.unshift({ id: Date.now(), usuario: this.usuario.nome, acao: acao, setor: setor, detalhes: detalhes, dataStr: dataStr, horaStr: horaStr });
            if (this.historicoGlobais.length > 300) this.historicoGlobais.pop();
            this.salvarMemoriaLocal();
        },
        async buscarClima() {
            try {
                const lat = -23.3103; const lon = -51.1628;
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation&timezone=America/Sao_Paulo&forecast_days=3`;
                const res = await fetch(url, { cache: "no-store" });
                if (!res.ok) throw new Error("Erro de conexão");
                const data = await res.json();
                if (data && data.current_weather) {
                    this.clima.temperatura = Math.round(data.current_weather.temperature);
                    if (this.clima.temperatura >= 27) this.clima.isCalor = true;
                    const dataAmanha = new Date(); dataAmanha.setDate(dataAmanha.getDate() + 1);
                    const stringAmanha = dataAmanha.toISOString().split('T')[0];
                    let choveAmanhaNoite = false;
                    for (let i = 0; i < data.hourly.time.length; i++) {
                        const horaAPI = data.hourly.time[i]; 
                        if (horaAPI.startsWith(stringAmanha)) { 
                            const horaMilitar = parseInt(horaAPI.split('T')[1].split(':')[0]); 
                            if (horaMilitar >= 19 && horaMilitar <= 22 && data.hourly.precipitation[i] > 0.5) { choveAmanhaNoite = true; break; } 
                        }
                    }
                    this.clima.riscoChuvaNoturna = choveAmanhaNoite;
                }
            } catch (error) { this.clima.temperatura = 'Off'; this.clima.modoSmart = false; }
        }
    },
    mounted() {
        this.carregarMemoriaLocal(); this.buscarClima(); this.verificarLocalizacao();
        window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); this.eventoInstalacao = e; });
    },
    watch: {
        metas: { deep: true, handler() { this.salvarMemoriaLocal(); } }, feriados: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        avisos: { deep: true, handler() { this.salvarMemoriaLocal(); } }, rotasSalvas: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        equipe: { deep: true, handler() { this.salvarMemoriaLocal(); } }, estoqueMassasHoje() { this.salvarMemoriaLocal(); }, dataEstoqueMassas() { this.salvarMemoriaLocal(); },
        carrinhoInsumos: { deep: true, handler() { this.salvarMemoriaLocal(); } }, carrinhoSacolao: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        bancoProdutos: { deep: true, handler() { this.salvarMemoriaLocal(); } }, bancoChecklists: { deep: true, handler() { this.salvarMemoriaLocal(); } }, tarefasConcluidas: { deep: true, handler() { this.salvarMemoriaLocal(); } }
    }
});
