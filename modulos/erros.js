/**
 * Tela de Intervenção IA v0.0.50
 * Bloqueia ações críticas detectadas pela IA.
 */
import IA_Resolucao from './ia_resolucao.js';

Vue.component('tela-erros', {
    template: `
    <div class="container animate__animated animate__zoomIn" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 30px; padding-bottom: 100px;">
        
        <div v-if="carregandoIA" style="text-align: center;">
            <i class="fas fa-brain fa-spin" style="font-size: 4rem; color: var(--cor-primaria); margin-bottom: 20px;"></i>
            <h3 style="color: white;">A IA está analisando o erro...</h3>
            <p style="color: #666;">Buscando a melhor solução para você.</p>
        </div>

        <div v-else style="width: 100%;">
            <i :class="['fas', icone, 'animate__animated animate__flash animate__infinite']" 
               :style="{ fontSize: '5rem', color: cor, marginBottom: '25px' }"></i>
            
            <h2 style="color: white; margin-bottom: 15px;">{{ titulo }}</h2>
            
            <div style="background: #1A1A1A; border: 1px solid #333; padding: 20px; border-radius: 12px; margin-bottom: 30px; line-height: 1.6;">
                <p style="color: #CCC; font-size: 1.1rem; margin: 0;">{{ mensagem }}</p>
            </div>

            <!-- Sugestão da IA -->
            <div v-if="resolucao" class="animate__animated animate__fadeInUp" style="background: rgba(255, 171, 0, 0.1); border: 1px solid var(--cor-primaria); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <i :class="['fas', resolucao.icone]" :style="{ color: resolucao.cor || 'var(--cor-primaria)' }"></i>
                    <strong :style="{ color: resolucao.cor || 'var(--cor-primaria)' }">{{ resolucao.titulo }}</strong>
                </div>
                <p style="color: #AAA; font-size: 0.9rem; margin-bottom: 15px;">{{ resolucao.mensagem }}</p>
                
                <button v-if="resolucao.sugestao" 
                        @click="executarSugestao" 
                        class="btn" 
                        :style="{ background: resolucao.cor || 'var(--cor-primaria)', color: '#121212' }">
                    <i class="fas fa-magic"></i> {{ resolucao.sugestao.label }}
                </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
                <button class="btn" style="background: #2C2C2C; color: white; border: 1px solid #444;" @click="voltar">
                    <i class="fas fa-undo"></i> {{ resolucao ? 'NÃO, VOLTAR' : 'CORRIGIR DADOS' }}
                </button>
                
                <button v-if="permitirIgnorar" class="btn" :style="{ background: cor, color: '#121212' }" @click="ignorar">
                    <i class="fas fa-exclamation-triangle"></i> FORÇAR AÇÃO
                </button>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            carregandoIA: false,
            resolucao: null
        };
    },
    computed: {
        config() { return this.$root.estadoErroIA || {}; },
        titulo() { return this.config.titulo || "Intervenção da IA"; },
        mensagem() { return this.config.mensagem || "Detectamos uma inconsistência nos dados."; },
        cor() { return this.config.cor || "var(--cor-erro)"; },
        icone() { return this.config.icone || "fa-robot"; },
        permitirIgnorar() { return this.config.permitirIgnorar || false; }
    },
    methods: {
        async analisarComIA() {
            if (!this.config.contexto) return;
            
            this.carregandoIA = true;
            try {
                const res = await IA_Resolucao.resolverErro(this.config.contexto, this.$root);
                if (res) {
                    this.resolucao = res;
                }
            } catch (e) {
                console.error("Erro ao analisar com IA:", e);
            } finally {
                this.carregandoIA = false;
            }
        },
        voltar() {
            this.$root.mudarTela(this.config.telaDestino || 'tela-dashboard');
        },
        ignorar() {
            if (this.config.callbackIgnorar) this.config.callbackIgnorar();
        },
        executarSugestao() {
            const s = this.resolucao.sugestao;
            if (!s || !s.acao) return;

            this.$root.vibrar(30);
            
            if (s.acao.tipo === 'ADD_ITEM') {
                // Lógica para adicionar item ao carrinho ou pedido
                if (this.config.callbackSugestao) {
                    this.config.callbackSugestao(s.acao);
                }
            } else if (s.acao.tipo === 'UPDATE_QUANTITY') {
                if (this.config.callbackSugestao) {
                    this.config.callbackSugestao(s.acao);
                }
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Sugestão Aplicada!',
                background: '#1E1E1E', color: '#FFF',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                this.voltar();
            });
        }
    },
    mounted() {
        if (this.config.contexto) {
            this.analisarComIA();
        }
    }
});

