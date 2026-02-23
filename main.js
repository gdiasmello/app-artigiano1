// INÍCIO DO ARQUIVO main.js - v1.0.2

// 1. CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBL70gtkhjBvC9BiKvz5HBivH07JfRKuo4",
    authDomain: "artigiano-app.firebaseapp.com",
    databaseURL: "https://artigiano-app-default-rtdb.firebaseio.com",
    projectId: "artigiano-app",
    storageBucket: "artigiano-app.firebasestorage.app",
    messagingSenderId: "212218495726",
    appId: "1:212218495726:web:dd6fec7a4a8c7ad572a9ff"
};

// Inicializa a Nuvem
if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}
const db = firebase.firestore();

// 2. ESCUDO ANTI-ERRO GLOBAL
window.onerror = function(msg, url, line, col, error) { return false; };
Vue.config.errorHandler = function (err, vm, info) {
    console.error(err);
    const erroDiv = document.getElementById('escudo-erro');
    if(erroDiv) {
        document.getElementById('app').style.display = 'none';
        erroDiv.style.display = 'flex';
        document.getElementById('msg-erro-critico').innerText = 'Erro Vue: ' + err.message;
    }
};

// 3. APLICAÇÃO VUE PRINCIPAL
const app = new Vue({
    el: '#app',
    data: {
        // 🟢 SISTEMA DE VERSÃO AUTOMÁTICO
        versaoApp: '1.0.2',

        viewAtual: 'tela-login',
        usuario: null,
        naPizzaria: false,
        eventoInstalacao: null,
        estaInstalado: false, 
        biometriaDisponivel: false,

        estoqueMassasHoje: 0,
        dataEstoqueMassas: '', 
        carrinhoInsumos: [], 
        carrinhoSacolao: [], 
        
        clima: { 
            temperatura: '...', 
            riscoChuvaNoturna: false, 
            modoSmart: true, 
            isCalor: false, 
            geloVerificado: false 
        },
        
        metas: { 
            0: 80, 1: 0, 2: 0, 3: 60, 4: 65, 5: 110, 6: 120, feriado: 130 
        },
        
        feriados: [
            { data: "2026-12-25", nome: "Natal" }
        ],
        avisos: [],
        rotasSalvas: ['Geladeira 1', 'Estoque Seco', 'Embalagens', 'Material de Limpeza'],
        
        estadoErroIA: { 
            titulo: 'Aviso', 
            mensagem: '', 
            icone: 'fa-exclamation-triangle', 
            cor: '#FF5252', 
            telaDestino: 'tela-dashboard', 
            permitirIgnorar: false, 
            callbackIgnorar: null 
        },

        // BANCOS DE DADOS
        equipe: [],
        bancoProdutos: [],
        bancoChecklists: [],
        tarefasConcluidas: [], 
        historicoGlobais: [],
        feedbacks: [],
        pedidosResetSenha: []
    },
    methods: {
        vibrar(padrao) { 
            if (this.usuario?.preferencias?.vibracao !== false && 'vibrate' in navigator) { 
                navigator.vibrate(padrao); 
            } 
        },
        
        mudarTela(novaTela, registrarHistorico = true) {
            this.vibrar(30); 
            this.viewAtual = novaTela; 
            window.scrollTo(0, 0);
            if (registrarHistorico) { 
                history.pushState({ tela: novaTela }, ""); 
            }
        },
        
        fazerLogout() { 
            this.vibrar([50, 50, 50]); 
            this.usuario = null; 
            this.mudarTela('tela-login'); 
        },
        
        lidarComBotaoVoltar(event) {
            if (this.viewAtual === 'tela-dashboard' || this.viewAtual === 'tela-login') {
                this.vibrar([50, 100]);
                Swal.fire({ 
                    title: 'Sair do App?', 
                    text: "Deseja fechar o aplicativo?", 
                    icon: 'question', 
                    showCancelButton: true, 
                    confirmButtonColor: '#D50000', 
                    cancelButtonColor: '#444', 
                    confirmButtonText: 'Sim, Sair', 
                    cancelButtonText: 'Ficar', 
                    background: '#1E1E1E', 
                    color: '#FFF' 
                }).then((result) => {
                    if (result.isConfirmed) { 
                        if (navigator.app) navigator.app.exitApp(); else window.close(); 
                    } else { 
                        history.pushState({ tela: this.viewAtual }, ""); 
                    }
                });
            } else { 
                this.mudarTela('tela-dashboard', false); 
            }
        },
        
        enviarWhatsApp(listaTexto) {
            this.vibrar(30);
            const hora = new Date().getHours(); 
            let tempo = 'Bom dia';
            if (hora >= 12 && hora < 18) tempo = 'Boa tarde'; 
            else if (hora >= 18) tempo = 'Boa noite';
            
            const pref = this.usuario?.preferencias || {};
            const saudacao = pref.saudacaoZap ? ` ${pref.saudacaoZap}` : ''; 
            const despedida = pref.despedidaZap || 'Obrigado.';
            
            const textoFinal = `${tempo}!${saudacao}\nPedido de hoje:\n\n${listaTexto}\n\n${despedida}`;
            const link = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoFinal)}`;
            window.open(link, '_blank');
        },
        
        async verificarBiometriaLocal() { 
            if (window.PublicKeyCredential) { 
                try { return true; } catch (e) { return false; } 
            } 
            return false; 
        },
        
        async dispararInstalacao() {
            if (this.eventoInstalacao) { 
                this.eventoInstalacao.prompt(); 
                const { outcome } = await this.eventoInstalacao.userChoice; 
                if (outcome === 'accepted') { this.estaInstalado = true; } 
            }
        },
        
        dispararAlertaIA(opcoes) { 
            this.vibrar([100, 50, 100]); 
            this.estadoErroIA = { ...this.estadoErroIA, ...opcoes }; 
            this.mudarTela('tela-erros'); 
        },
        
        resolverPizzaSazonal(nomePizza, aindaTemos) {
            this.vibrar(30);
            this.autorizarAcao('remover', () => {
                if (!aindaTemos) {
                    this.bancoProdutos = this.bancoProdutos.filter(p => !(p.sazonal && p.sazonal.ativa && p.sazonal.nomePizza === nomePizza));
                    this.registrarHistorico('Sazonal Removida', 'Produtos', `Pizza ${nomePizza} finalizada.`);
                    Swal.fire({ icon: 'success', title: 'Limpeza Concluída', background: '#1E1E1E', color: '#FFF' });
                } else {
                    this.bancoProdutos.forEach(p => { 
                        if (p.sazonal && p.sazonal.ativa && p.sazonal.nomePizza === nomePizza) { 
                            let d = new Date(); d.setDate(d.getDate() + 15); p.sazonal.dataExpiracao = d.toISOString(); 
                        } 
                    });
                    this.registrarHistorico('Sazonal Adiada', 'Produtos', `Pizza ${nomePizza} prorrogada.`);
                    Swal.fire({ icon: 'success', title: 'Prazo Estendido', background: '#1E1E1E', color: '#FFF' });
                }
                this.salvarMemoriaLocal();
            });
        },
        
        async autorizarAcao(permissaoNecessaria, callbackSucesso) {
            if (this.usuario?.permissoes?.admin || this.usuario?.permissoes[permissaoNecessaria]) {
                if (this.usuario.preferencias.biometriaAtiva && this.biometriaDisponivel) { 
                    const ok = await this.verificarBiometriaLocal(); 
                    if (ok) return callbackSucesso(); 
                }
                return callbackSucesso();
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
                            this.vibrar([50, 50]); 
                            this.registrarHistorico('Autorização', 'Segurança', `Admin ${admin.nome}`); 
                            callbackSucesso(); 
                        } else { 
                            Swal.fire({ icon: 'error', title: 'Incorreto', background: '#1E1E1E', color: '#FFF' }); 
                        }
                    }
                });
            }
        },
        
        salvarMemoriaLocal() {
            const dados = { 
                metas: this.metas, 
                avisos: this.avisos, 
                rotasSalvas: this.rotasSalvas, 
                equipe: this.equipe, 
                historicoGlobais: this.historicoGlobais, 
                estoqueMassasHoje: this.estoqueMassasHoje, 
                dataEstoqueMassas: this.dataEstoqueMassas, 
                carrinhoInsumos: this.carrinhoInsumos, 
                carrinhoSacolao: this.carrinhoSacolao, 
                bancoProdutos: this.bancoProdutos, 
                bancoChecklists: this.bancoChecklists, 
                tarefasConcluidas: this.tarefasConcluidas, 
                feriados: this.feriados, 
                feedbacks: this.feedbacks, 
                pedidosResetSenha: this.pedidosResetSenha 
            };
            localStorage.setItem('pizzaMasterOfflineData', JSON.stringify(dados));
        },
        
        carregarMemoriaLocal() {
            const salvo = localStorage.getItem('pizzaMasterOfflineData');
            if (salvo) { 
                try { Object.assign(this, JSON.parse(salvo)); } catch(e) {} 
            }
        },
        
        registrarHistorico(acao, setor, detalhes = '') {
            if (!this.usuario) return; 
            const agora = new Date();
            
            this.historicoGlobais.unshift({ 
                id: Date.now(), 
                usuario: this.usuario.nome, 
                acao: acao, 
                setor: setor, 
                detalhes: detalhes, 
                dataStr: agora.toLocaleDateString('pt-BR'), 
                horaStr: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
            });
            
            if (this.historicoGlobais.length > 300) {
                this.historicoGlobais.pop();
            }
            this.salvarMemoriaLocal();

            // Grava na Nuvem em tempo real
            db.collection("operacao").doc("historico").set({ itens: this.historicoGlobais }, { merge: true });
        },
        
        async buscarClima() {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-23.3103&longitude=-51.1628&current_weather=true&timezone=America/Sao_Paulo`);
                const data = await res.json();
                if (data?.current_weather) { 
                    this.clima.temperatura = Math.round(data.current_weather.temperature); 
                    this.clima.isCalor = this.clima.temperatura >= 27; 
                }
            } catch (e) { 
                this.clima.temperatura = 'Off'; 
            }
        },
        
        verificarLocalizacao() {
            if ("geolocation" in navigator) { 
                navigator.geolocation.getCurrentPosition(
                    () => { this.naPizzaria = true; }, 
                    () => { this.naPizzaria = false; }
                ); 
            }
        }
    },
    mounted() {
        this.carregarMemoriaLocal(); 
        this.buscarClima(); 
        this.verificarLocalizacao();
        
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) { 
            this.estaInstalado = true; 
        }
        if (window.PublicKeyCredential) { 
            this.biometriaDisponivel = true; 
        }
        
        window.addEventListener('beforeinstallprompt', (e) => { 
            e.preventDefault(); 
            this.eventoInstalacao = e; 
            this.estaInstalado = false; 
        });
        
        history.pushState({ tela: this.viewAtual }, ""); 
        window.onpopstate = this.lidarComBotaoVoltar;

        // Puxa o histórico do Firebase para sincronizar os telemóveis
        db.collection("operacao").doc("historico").onSnapshot((doc) => {
            if(doc.exists) { 
                this.historicoGlobais = doc.data().itens || []; 
                this.salvarMemoriaLocal(); 
            }
        });
    },
    watch: {
        bancoProdutos: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        bancoChecklists: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        avisos: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        equipe: { deep: true, handler() { this.salvarMemoriaLocal(); } }
    }
});
// FIM DO ARQUIVO main.js
