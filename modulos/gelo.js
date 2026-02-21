// modulos/gelo.js - Módulo Exclusivo de Gelo v0.0.30

Vue.component('tela-gelo', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #00B0FF;">❄️ Controle de Gelo</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div v-if="$root.clima.modoSmart && $root.clima.isCalor" style="background: rgba(255, 82, 82, 0.1); border: 1px solid #FF5252; padding: 15px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-sun" style="font-size: 2rem; color: #FFAB00;"></i>
            <div>
                <strong style="color: #FF5252; display: block; font-size: 1rem;">Alerta de Calor!</strong>
                <small style="color: #CCC;">A previsão é de alto consumo hoje. Garanta a lotação máxima da arca ({{ metaFixa }} sacos).</small>
            </div>
        </div>
        <div v-else style="background: rgba(0, 176, 255, 0.1); border: 1px solid #00B0FF; padding: 15px; border-radius: 12px; margin-bottom: 20px; color: #82B1FF; font-size: 0.9rem; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-info-circle" style="font-size: 1.5rem;"></i>
            <span>Clima ameno hoje. Verifique se o estoque da arca bate com a meta.</span>
        </div>

        <div class="card" style="padding: 20px; border-top: 4px solid #00B0FF; background: #1A1A1A;">
            
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-icicles" style="font-size: 3rem; color: #00B0FF; margin-bottom: 10px;"></i>
                <h3 style="margin: 0; color: white;">Gelo Escama (5kg)</h3>
                <p style="color: #888; margin: 5px 0 0 0;">Lotação Máxima da Arca: <b style="color: var(--cor-primaria);">{{ metaFixa }} sacos</b></p>
            </div>

            <div style="background: #2C2C2C; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <label style="color: #FFF; font-size: 1rem; display: block; text-align: center; margin-bottom: 10px;">Quantos sacos <b>TEMOS</b> agora?</label>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 15px;">
                    <button @click="alterarQuantidade(-1)" style="background: #444; border: none; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: transform 0.1s; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                        -
                    </button>
                    
                    <input type="number" 
                           inputmode="numeric"
                           v-model.number="quantidadeAtual" 
                           placeholder="0"
                           style="width: 100px; height: 60px; background: #111; border: 2px solid #00B0FF; border-radius: 10px; color: white; font-size: 2rem; font-weight: bold; text-align: center; margin: 0; outline: none;">
                    
                    <button @click="alterarQuantidade(1)" style="background: #444; border: none; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: transform 0.1s; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                        +
                    </button>
                </div>
            </div>
            
            <div v-if="faltaPedir > 0" class="animate__animated animate__headShake" style="background: rgba(255, 171, 0, 0.1); border: 1px dashed #FFAB00; padding: 15px; border-radius: 8px; text-align: center;">
                <p style="color: #FFAB00; margin: 0; font-size: 1.1rem;">Precisamos de pedir <b>{{ faltaPedir }} sacos</b> de gelo.</p>
            </div>
            <div v-else-if="quantidadeAtual !== '' && faltaPedir === 0" class="animate__animated animate__pulse" style="background: rgba(0, 200, 83, 0.1); border: 1px dashed #00C853; padding: 15px; border-radius: 8px; text-align: center;">
                <p style="color: #00C853; margin: 0; font-size: 1.1rem;"><i class="fas fa-check-circle"></i> A arca está cheia! Não precisamos pedir hoje.</p>
            </div>

        </div>

        <transition name="fade">
            <div v-if="faltaPedir > 0" 
                 style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px; z-index: 1000;">
                <button class="btn animate__animated animate__bounceInUp" 
                        style="background-color: #00B0FF; color: #121212; box-shadow: 0 4px 15px rgba(0, 176, 255, 0.4); display: flex; justify-content: center; align-items: center; gap: 10px;" 
                        @click="gerarPedidoGelo">
                    <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i>
                    ENVIAR PEDIDO DE GELO
                </button>
            </div>
        </transition>

    </div>
    `,
    data() {
        return {
            metaFixa: 10, // Conforme sua exigência, a arca só suporta 10 sacos.
            quantidadeAtual: ''
        };
    },
    computed: {
        faltaPedir() {
            if (this.quantidadeAtual === '' || this.quantidadeAtual === null) return 0;
            const diferenca = this.metaFixa - this.quantidadeAtual;
            return diferenca > 0 ? diferenca : 0;
        }
    },
    mounted() {
        // Ao abrir o módulo de Gelo, a IA entende que a equipa já cumpriu a ordem de verificar, 
        // e por isso o botão vermelho de aviso no Mural vai desaparecer!
        this.$root.clima.geloVerificado = true;
    },
    methods: {
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-dashboard');
        },
        alterarQuantidade(valor) {
            this.$root.vibrar(15); // Micro vibração ao tocar nos botões de + e -
            let atual = this.quantidadeAtual === '' ? 0 : this.quantidadeAtual;
            let novaQtd = atual + valor;
            
            // Impede que coloque números negativos e impede que ultrapasse a lotação máxima da arca
            if (novaQtd < 0) novaQtd = 0;
            if (novaQtd > this.metaFixa) novaQtd = this.metaFixa;
            
            this.quantidadeAtual = novaQtd;
        },
        gerarPedidoGelo() {
            this.$root.vibrar(30);
            let textoPedido = `Olá! A Artigiano precisa de uma entrega de gelo.%0A%0A`;
            textoPedido += `• ${this.faltaPedir} Sacos de Gelo (5kg)%0A%0A`;
            textoPedido += `Agradecemos a rapidez!`;

            const url = `https://wa.me/?text=${textoPedido}`;
            
            Swal.fire({
                title: 'Pedir Gelo',
                text: `Vamos enviar um pedido de ${this.faltaPedir} sacos de gelo para o fornecedor.`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#00B0FF',
                cancelButtonColor: '#444',
                confirmButtonText: 'Sim, enviar',
                cancelButtonText: 'Cancelar',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.vibrar([50, 50, 50]); // Vibração de Sucesso
                    
                    // REGISTO NA AUDITORIA
                    this.$root.registrarHistorico('Pedido Gerado', 'Pedidos', `Solicitados ${this.faltaPedir} sacos de gelo.`);

                    window.open(url, '_blank');
                    this.quantidadeAtual = '';
                    this.$root.mudarTela('tela-dashboard');
                }
            });
        }
    }
});
