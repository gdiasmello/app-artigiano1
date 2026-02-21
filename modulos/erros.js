// modulos/erros.js - Tela de Intervenção da IA v0.0.50

Vue.component('tela-erros', {
    template: `
    <div class="container animate__animated animate__zoomIn" style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; box-sizing: border-box;">
        
        <i :class="['fas', $root.estadoErroIA.icone, 'animate__animated', 'animate__flash', 'animate__infinite', 'animate__slower']" :style="{ fontSize: '5rem', color: $root.estadoErroIA.cor, marginBottom: '20px' }"></i>
        
        <h2 style="color: white; margin-bottom: 10px;">{{ $root.estadoErroIA.titulo }}</h2>
        
        <div style="background: #1A1A1A; border: 1px solid #333; padding: 20px; border-radius: 10px; width: 100%; max-width: 400px; margin-bottom: 30px;">
            <p style="color: #CCC; font-size: 1.1rem; margin: 0; line-height: 1.5;">{{ $root.estadoErroIA.mensagem }}</p>
        </div>

        <div style="display: flex; gap: 15px; width: 100%; max-width: 400px; flex-direction: column;">
            <button class="btn" style="background: #2C2C2C; color: white; border: 1px solid #555;" @click="voltar">
                <i class="fas fa-undo"></i> CORRIGIR DADOS
            </button>
            
            <button v-if="$root.estadoErroIA.permitirIgnorar" class="btn" :style="{ background: $root.estadoErroIA.cor, color: '#121212' }" @click="ignorarEAvançar">
                <i class="fas fa-exclamation-triangle"></i> FORÇAR AÇÃO
            </button>
        </div>

    </div>
    `,
    mounted() {
        // Quando a IA acorda para bloquear a tela, o telemóvel vibra agressivamente
        this.$root.vibrar([100, 50, 100, 50, 100]); 
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela(this.$root.estadoErroIA.telaDestino);
        },
        ignorarEAvançar() {
            this.$root.vibrar([50, 50, 50]);
            if (typeof this.$root.estadoErroIA.callbackIgnorar === 'function') {
                this.$root.estadoErroIA.callbackIgnorar();
            } else {
                this.voltar();
            }
        }
    }
});
