// INÍCIO DO ARQUIVO main.js - v2.0.9
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

// 🟢 ESCUDO ANTI-FALHAS CRÍTICAS
window.onerror = function(msg, url, line, col, error) { 
    return false; 
};

Vue.config.errorHandler = function (err, vm, info) {
    console.error(err);
    const div = document.getElementById('escudo-erro');
    if (div) { 
        document.getElementById('app').style.display = 'none'; 
        div.style.display = 'flex'; 
        document.getElementById('msg-erro-critico').innerText = err.message; 
    }
};

// 🟢 APLICAÇÃO PRINCIPAL (CÉREBRO)
const app = new Vue({
    el: '#app',
    data: {
        versaoApp: '2.0.9', 
        viewAtual: 'tela-login', 
        carregandoDados: true, // Bloqueia a tela de login até a nuvem responder
        usuario: null, 
        naPizzaria: false, 
        estaInstalado: false, 
        biometriaDisponivel: !!window.PublicKeyCredential, 
        eventoInstalacao: null,
        estoqueMassasHoje: 0, 
        carrinhoInsumos: [], 
        carrinhoSacolao: [], 
        dataEstoqueMassas: '',
        clima: { temperatura: '...', isCalor: false, modoSmart: true, riscoChuvaNoturna: false, geloVerificado: false },
        equipe: [], 
        bancoProdutos: [], 
        rotasSalvas: ['Geladeira 1', 'Estoque Seco', 'Embalagens', 'Limpeza'], 
        avisos: [], 
        historicoGlobais: [], 
        feedbacks: [], 
        pedidosResetSenha: [], 
        bancoChecklists: [], 
        tarefasConcluidas: [], 
        feriados: [],
        metas: { 0: 80, 1: 0, 2: 0, 3: 60, 4: 65, 5: 110, 6: 120, feriado: 130 },
        estadoErroIA: { titulo: 'Aviso', mensagem: '', icone: 'fa-exclamation-triangle', cor: '#FF5252', telaDestino: 'tela-dashboard', permitirIgnorar: false, callbackIgnorar: null }
    },
    methods: {
        vibrar(ms) { 
            if (this.usuario && this.usuario.preferencias && this.usuario.preferencias.vibracao !== false && navigator.vibrate) {
                navigator.vibrate(ms); 
            }
        },
        
        mudarTela(t, h = true) { 
            this.vibrar(30); 
            this.viewAtual = t; 
            window.scrollTo(0,0); 
            if (h) history.pushState({tela:t}, ""); 
        },
        
        fazerLogout() { 
            this.vibrar([50,50]); 
            this.usuario = null; 
            this.mudarTela('tela-login'); 
        },
        
        lidarComBotaoVoltar(e) {
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
                }).then((r) => { 
                    if (r.isConfirmed) { 
                        if (navigator.app) navigator.app.exitApp(); else window.close(); 
                    } else { 
                        history.pushState({ tela: this.viewAtual }, ""); 
                    } 
                });
            } else { 
                this.mudarTela('tela-dashboard', false); 
            }
        },
        
        marcarNovidadesLidas() {
            if (!this.usuario) return;
            // Força a atualização reativa na tela
            this.$set(this.usuario, 'versaoVista', this.versaoApp);
            
            const idx = this.equipe.findIndex(u => u.id === this.usuario.id);
            if (idx !== -1) {
                this.$set(this.equipe[idx], 'versaoVista', this.versaoApp);
                db.collection("configuracoes").doc("equipe").set({ lista: this.equipe }, { merge: true });
            }
            this.salvarMemoriaLocal();
        },
        
        marcarVersaoVista() { 
            this.marcarNovidadesLidas(); 
        },

        enviarWhatsApp(txt) {
            this.vibrar(30);
            const hora = new Date().getHours();
            let tempo = hora >= 18 ? 'Boa noite' : (hora >= 12 ? 'Boa tarde' : 'Bom dia');
            const pref = this.usuario?.preferencias || {};
            const saudacao = pref.saudacaoZap ? ` ${pref.saudacaoZap}` : '';
            const desp = pref.despedidaZap || 'Obrigado.';
            const msg = `${tempo}!${saudacao}\nPedido de hoje:\n\n${txt}\n\n${desp}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        },

        registrarHistorico(acao, setor, detalhes = '') {
            if (!this.usuario) return;
            const item = { 
                id: Date.now(), 
                usuario: this.usuario.nome, 
                acao: acao, 
                setor: setor, 
                detalhes: detalhes, 
                dataStr: new Date().toLocaleDateString('pt-BR'), 
                horaStr: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) 
            };
            this.historicoGlobais.unshift(item);
            if (this.historicoGlobais.length > 300) {
                this.historicoGlobais.pop();
            }
            db.collection("operacao").doc("historico").set({ itens: this.historicoGlobais });
            this.salvarMemoriaLocal();
        },

        salvarMemoriaLocal() {
            const obj = { 
                equipe: this.equipe, 
                bancoProdutos: this.bancoProdutos, 
                rotasSalvas: this.rotasSalvas, 
                avisos: this.avisos, 
                historicoGlobais: this.historicoGlobais, 
                metas: this.metas 
            };
            localStorage.setItem('pizzaMasterOffline', JSON.stringify(obj));
        },
        
        carregarMemoriaLocal() {
            const data = localStorage.getItem('pizzaMasterOffline');
            if (data) { 
                try { 
                    Object.assign(this, JSON.parse(data)); 
                } catch(e) { 
                    console.error(e); 
                } 
            }
        },

        async buscarClima() {
            try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=-23.3103&longitude=-51.1628&current_weather=true&timezone=America/Sao_Paulo`);
                const data = await res.json();
                if (data?.current_weather) { 
                    this.clima.temperatura = Math.round(data.current_weather.temperature); 
                    this.clima.isCalor = this.clima.temperatura >= 27; 
                }
            } catch(e) { 
                this.clima.temperatura = 'Off'; 
            }
        },
        
        verificarLocalizacao() { 
            if ("geolocation" in navigator) { 
                navigator.geolocation.getCurrentPosition(() => this.naPizzaria = true, () => this.naPizzaria = false); 
            }
        },

        precisaVerTutorial(idTutorial) {
            if (!this.usuario) return false;
            if (!this.usuario.tutoriaisVistos) this.$set(this.usuario, 'tutoriaisVistos', []);
            return !this.usuario.tutoriaisVistos.includes(idTutorial);
        },
        
        marcarTutorialVisto(idTutorial) {
            if (!this.usuario) return;
            if (!this.usuario.tutoriaisVistos) this.$set(this.usuario, 'tutoriaisVistos', []);
            
            if (!this.usuario.tutoriaisVistos.includes(idTutorial)) {
                this.usuario.tutoriaisVistos.push(idTutorial);
                const idx = this.equipe.findIndex(u => u.id === this.usuario.id);
                if (idx !== -1) {
                    this.$set(this.equipe[idx], 'tutoriaisVistos', this.usuario.tutoriaisVistos);
                    db.collection("configuracoes").doc("equipe").set({ lista: this.equipe }, { merge: true });
                }
                this.salvarMemoriaLocal();
            }
        },

        async autorizarAcao(permissaoNecessaria, callbackSucesso) {
            if (this.usuario?.permissoes?.admin || this.usuario?.permissoes[permissaoNecessaria]) { 
                return callbackSucesso(); 
            }
            
            this.vibrar([100, 50, 100]);
            Swal.fire({ 
                title: '🔒 PIN de Admin:', 
                input: 'password', 
                inputAttributes: { inputmode: 'numeric', maxlength: 4, style: 'text-align: center; letter-spacing: 5px; font-size: 1.5rem; background: #111; color: #FFF;' }, 
                showCancelButton: true, 
                confirmButtonText: 'Autorizar', 
                background: '#1E1E1E', 
                color: '#FFF' 
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
    mounted() {
        this.carregarMemoriaLocal();
        this.buscarClima();
        this.verificarLocalizacao();
        
        window.addEventListener('beforeinstallprompt', (e) => { 
            e.preventDefault(); 
            this.eventoInstalacao = e; 
        });
        
        history.pushState({ tela: this.viewAtual }, "");
        window.onpopstate = this.lidarComBotaoVoltar;

        // 🟢 SINCRONIZAÇÃO EM TEMPO REAL E DESBLOQUEIO DO APP
        db.collection("configuracoes").doc("equipe").onSnapshot(d => { 
            if(d.exists) { 
                this.equipe = d.data().lista || []; 
                this.salvarMemoriaLocal(); 
            } 
            // A mágica acontece aqui: A tela de login é liberada assim que a equipe é baixada!
            this.carregandoDados = false; 
        });
        
        db.collection("configuracoes").doc("bancoProdutos").onSnapshot(d => { 
            if(d.exists) { this.bancoProdutos = d.data().lista || []; this.salvarMemoriaLocal(); } 
        });
        
        db.collection("configuracoes").doc("rotas").onSnapshot(d => { 
            if(d.exists) { this.rotasSalvas = d.data().lista || []; this.salvarMemoriaLocal(); } 
        });
        
        db.collection("configuracoes").doc("avisos").onSnapshot(d => { 
            if(d.exists) { this.avisos = d.data().lista || []; this.salvarMemoriaLocal(); } 
        });
        
        db.collection("operacao").doc("historico").onSnapshot(d => { 
            if(d.exists) { this.historicoGlobais = d.data().itens || []; this.salvarMemoriaLocal(); } 
        });
        
        db.collection("configuracoes").doc("loja").onSnapshot(d => { 
            if(d.exists) { 
                const config = d.data(); 
                if(config.metas) this.metas = config.metas; 
                this.salvarMemoriaLocal(); 
            } 
        });
    },
    watch: {
        bancoProdutos: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        avisos: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        equipe: { deep: true, handler() { this.salvarMemoriaLocal(); } },
        rotasSalvas: { deep: true, handler() { this.salvarMemoriaLocal(); } }
    }
});
// FIM DO ARQUIVO main.js
