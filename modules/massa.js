// modulos/massa.js - Calculadora de Produção v0.0.38

Vue.component('tela-massa', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: var(--text-main);">🍕 Produção Artigiano</h2>
            <button @click="voltar" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-times-circle"></i>
            </button>
        </div>

        <div class="card" style="border-left: 5px solid var(--cor-primaria);">
            <h4 style="margin-top: 0; color: var(--text-main);">📅 Massa para: <span style="color: var(--cor-primaria);">{{ infoAlvo.nomeDia }}</span></h4>
            <p style="margin: 5px 0; color: var(--text-sec);"><i class="fas fa-thermometer-half" style="color: #FF5252;"></i> Geladeira: <b>{{ infoAlvo.temperatura }}</b></p>
            <p style="margin: 10px 0 5px 0; color: white;">🎯 Meta Base: <b>{{ analiseSmart.metaBase }}</b> bolinhas</p>

            <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
                <div v-if="analiseSmart.isEspecial" style="background: rgba(255,171,0,0.2); border: 1px solid var(--cor-primaria); padding: 8px; border-radius: 5px; color: var(--cor-primaria); font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-glass-cheers"></i> Especial: {{ analiseSmart.nomeEvento }} (+30% de sexta)
                </div>
                <div v-if="analiseSmart.reducaoChuva" style="background: rgba(41, 98, 255, 0.2); border: 1px solid #2962FF; padding: 8px; border-radius: 5px; color: #82B1FF; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-cloud-rain"></i> Previsão de Chuva 19h-22h (-20%)
                </div>
            </div>
            
            <hr style="border-color: #333; margin: 15px 0;">
            <p style="margin: 0; color: var(--cor-primaria); font-size: 1.1rem; text-align: center; font-weight: bold;">= Meta Ajustada: {{ analiseSmart.metaFinal }} bolinhas</p>
        </div>

        <div style="margin-bottom: 20px;">
            <label style="color: var(--text-sec); font-size: 0.9rem; margin-bottom: 5px; display: block;">Quantas massas TEMOS na geladeira <b>AGORA</b>?</label>
            <input type="number" 
                   inputmode="numeric" 
                   v-model.number="sobrasManuais" 
                   placeholder="Ex: 40" 
                   style="width: 100%; padding: 15px; background: #2C2C2C; border: 1px solid #444; border-radius: 10px; color: white; font-size: 1.2rem; box-sizing: border-box; text-align: center;">
            <small v-if="$root.estoqueMassasHoje > 0" style="color: #888; display: block; text-align: center; margin-top: 5px;">
                *Valor da contagem diária da equipa.
            </small>

            <div v-if="consumoEstimadoNoite > 0 && sobrasBase > 0" class="animate__animated animate__fadeIn" style="margin-top: 10px; background: rgba(255, 171, 0, 0.1); border: 1px dashed #FFAB00; padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #FFD54F;">
                <i class="fas fa-clock" style="font-size: 1.2rem; float: left; margin-right: 10px; color: #FFAB00;"></i>
                <b>Ajuste de Horário Ativo:</b> Como o turno não acabou (até 23:30), a IA calcula que ainda saiam aprox. <b>{{ consumoEstimadoNoite }} massas hoje</b> (Regressivo: 6 a cada 30 min).<br>
                <span style="color: white; margin-top: 8px; display: block; font-size: 0.95rem; border-top: 1px solid rgba(255, 171, 0, 0.3); padding-top: 5px;">
                    Sobras reais para usar amanhã: <b>{{ sobrasCalculadas }}</b>
                </span>
            </div>
        </div>

        <div class="card animate__animated animate__fadeInUp" v-if="aProduzir > 0" style="background-color: #222;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="color: var(--cor-primaria); margin: 0; font-size: 1.1rem;">Faltam: {{ aProduzir }}</h3>
                <div style="text-align: right;">
                    <label style="font-size: 0.75rem; color: var(--text-sec); display: block; margin-bottom: 3px;">LOTE SUGERIDO:</label>
                    <select v-model="loteSelecionado" style="background: #111; color: white; border: 1px solid var(--cor-primaria); padding: 5px 10px; border-radius: 5px; font-weight: bold; cursor: pointer; outline: none;">
                        <option v-for="l in lotesDisponiveis" :value="l.massas">{{ l.massas }} Massas</option>
                    </select>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 1rem; text-align: center;">
                <div style="background: #1A1A1A; padding: 10px; border-radius: 8px;">🌾 Farinha<br><b style="color: white; font-size: 1.2rem;">{{ loteAtual.farinha }} g</b></div>
                <div style="background: #1A1A1A; padding: 10px; border-radius: 8px;">💧 Água Liq.<br><b style="color: #4FC3F7; font-size: 1.2rem;">{{ loteAtual.aguaLiq }} g</b></div>
                <div style="background: #1A1A1A; padding: 10px; border-radius: 8px;">🧊 Gelo<br><b style="color: #B3E5FC; font-size: 1.2rem;">{{ loteAtual.gelo }} g</b></div>
                <div style="background: #1A1A1A; padding: 10px; border-radius: 8px;">🧂 Sal<br><b style="color: white; font-size: 1.2rem;">{{ loteAtual.sal }} g</b></div>
                <div style="grid-column: span 2; background: #3E2723; padding: 10px; border-radius: 8px; border: 1px solid #5D4037;">🦠 Levain<br><b style="color: #FFAB00; font-size: 1.3rem;">{{ loteAtual.levain }} g</b></div>
            </div>
        </div>

        <button class="btn" v-if="aProduzir > 0" style="background-color: #00C853; color: white; margin-top: 10px;" @click="confirmarProducao">
            <i class="fas fa-check-circle"></i> CONFIRMAR PRODUÇÃO
        </button>
        
        <div v-if="aProduzir <= 0 && sobrasBase > 0" class="animate__animated animate__pulse" style="background: rgba(0, 200, 83, 0.1); border: 1px dashed #00C853; padding: 15px; border-radius: 8px; text-align: center; margin-top: 15px;">
            <p style="color: #00C853; margin: 0; font-size: 1.1rem;"><i class="fas fa-thumbs-up"></i> Metas batidas! Não é necessário produzir massa.</p>
        </div>
    </div>
    `,
    data() {
        return {
            sobrasManuais: '', 
            loteSelecionado: null,
            lotesDisponiveis: [
                { massas: 15, farinha: 2000, aguaLiq: 873, gelo: 374, levain: 90, sal: 60 }, { massas: 30, farinha: 4000, aguaLiq: 1746, gelo: 748, levain: 180, sal: 120 },
                { massas: 45, farinha: 6000, aguaLiq: 2619, gelo: 1123, levain: 270, sal: 180 }, { massas: 60, farinha: 8000, aguaLiq: 3492, gelo: 1497, levain: 360, sal: 240 },
                { massas: 75, farinha: 10000, aguaLiq: 4366, gelo: 1871, levain: 450, sal: 300 }, { massas: 90, farinha: 12000, aguaLiq: 5239, gelo: 2245, levain: 540, sal: 360 },
                { massas: 110, farinha: 14000, aguaLiq: 6112, gelo: 2620, levain: 630, sal: 420 }
            ]
        };
    },
    computed: {
        infoAlvo() {
            const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
            const hojeIndex = new Date().getDay(); 
            let alvoIndex = hojeIndex + 1; let saltos = 1; let temp = '19°C a 20°C (24h)';
            if (hojeIndex === 1) { alvoIndex = 3; saltos = 2; temp = '14°C a 15°C (48h)'; }
            if (alvoIndex > 6) alvoIndex = 0;
            return { nomeDia: dias[alvoIndex], index: alvoIndex, saltos: saltos, temperatura: temp };
        },
        analiseSmart() {
            const dataAlvo = new Date(); dataAlvo.setDate(dataAlvo.getDate() + this.infoAlvo.saltos);
            const dataAlvoStr = dataAlvo.toISOString().split('T')[0];
            const dataPosAlvo = new Date(dataAlvo); dataPosAlvo.setDate(dataPosAlvo.getDate() + 1);
            const dataPosAlvoStr = dataPosAlvo.toISOString().split('T')[0];

            let metaBase = this.$root.metas[this.infoAlvo.index];
            const metaSexta = this.$root.metas[5]; 
            let isEspecial = false; let metaCalculada = metaBase; let nomeEvento = '';

            const feriadoAlvo = this.$root.feriados.find(f => (f.data || f) === dataAlvoStr || (f.data || f) === dataPosAlvoStr);
            if (feriadoAlvo) { isEspecial = true; nomeEvento = feriadoAlvo.nome || 'Evento'; metaCalculada = Math.round(metaSexta * 1.30); }

            let reducaoChuva = false;
            if (this.$root.clima.modoSmart && this.$root.clima.riscoChuvaNoturna) {
                reducaoChuva = true; metaCalculada = metaCalculada - Math.round(metaCalculada * 0.20);
            }
            return { metaBase, metaFinal: metaCalculada, isEspecial, nomeEvento, reducaoChuva };
        },
        
        // 🟢 CÁLCULO DE TEMPO E DESCONTO DINÂMICO
        consumoEstimadoNoite() {
            const agora = new Date();
            const hora = agora.getHours();
            const min = agora.getMinutes();
            const tempoAtualMinutos = hora * 60 + min;

            // Considera o turno de 18:00 até as 23:30
            const inicioTurno = 18 * 60; 
            const fimTurno = 23 * 60 + 30; 

            let minutosRestantes = 0;

            if (tempoAtualMinutos < inicioTurno && tempoAtualMinutos > 6 * 60) {
                // Se contar ANTES de abrir (ex: 15h), vai vender o turno inteiro.
                minutosRestantes = fimTurno - inicioTurno; 
            } else if (tempoAtualMinutos >= inicioTurno && tempoAtualMinutos <= fimTurno) {
                // Se contar DURANTE o turno (ex: 20h), calcula o que falta.
                minutosRestantes = fimTurno - tempoAtualMinutos;
            } else {
                // Se contar DEPOIS de fechar (madrugada), a loja não vende mais.
                minutosRestantes = 0;
            }

            // Calcula blocos de 30 minutos e multiplica por 6 massas.
            const blocos30 = Math.floor(minutosRestantes / 30);
            return blocos30 * 6; 
        },

        // Sobras declaradas no input (ou puxadas do mural)
        sobrasBase() {
            if (this.sobrasManuais !== '' && this.sobrasManuais !== null) {
                return Number(this.sobrasManuais);
            } else if (this.$root.estoqueMassasHoje > 0) {
                return this.$root.estoqueMassasHoje;
            }
            return 0;
        },

        // Sobras FINAIS (Sobras Base - O que vai ser vendido hoje ainda)
        sobrasCalculadas() {
            if (this.sobrasBase === 0) return 0;
            let sobraReal = this.sobrasBase - this.consumoEstimadoNoite;
            return sobraReal > 0 ? sobraReal : 0;
        },

        aProduzir() { 
            const calc = this.analiseSmart.metaFinal - this.sobrasCalculadas; 
            return calc > 0 ? calc : 0; 
        },

        loteAtual() {
            if (this.loteSelecionado) return this.lotesDisponiveis.find(l => l.massas === this.loteSelecionado);
            return this.lotesDisponiveis.find(l => l.massas >= this.aProduzir) || this.lotesDisponiveis[this.lotesDisponiveis.length - 1];
        }
    },
    watch: {
        aProduzir(novoValor) { 
            if (novoValor > 0) {
                this.loteSelecionado = (this.lotesDisponiveis.find(l => l.massas >= novoValor) || this.lotesDisponiveis[this.lotesDisponiveis.length - 1]).massas; 
            }
        }
    },
    mounted() { 
        if (this.$root.estoqueMassasHoje > 0) {
            this.sobrasManuais = this.$root.estoqueMassasHoje;
        }
        if (this.aProduzir > 0) {
            this.loteSelecionado = (this.lotesDisponiveis.find(l => l.massas >= this.aProduzir) || this.lotesDisponiveis[this.lotesDisponiveis.length - 1]).massas; 
        }
    },
    methods: { 
        voltar() {
            this.$root.vibrar(30);
            this.$root.mudarTela('tela-dashboard');
        },
        confirmarProducao() { 
            this.$root.vibrar(30);
            
            Swal.fire({
                title: 'Confirmar Produção',
                html: `Você vai registar a produção do lote de <b><span style="color: var(--cor-primaria); font-size: 1.2rem;">${this.loteSelecionado}</span></b> massas.<br><br>Deseja continuar?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#00C853',
                cancelButtonColor: '#444',
                confirmButtonText: 'Sim, Registei',
                cancelButtonText: 'Cancelar',
                background: '#1E1E1E', color: '#FFF'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$root.vibrar([50, 50, 50]); 
                    
                    if (this.sobrasManuais !== '' && Number(this.sobrasManuais) !== this.$root.estoqueMassasHoje) {
                        this.$root.estoqueMassasHoje = Number(this.sobrasManuais);
                    }

                    this.$root.registrarHistorico(
                        'Lote Produzido', 
                        'Produção', 
                        `Lote de ${this.loteSelecionado} massas. Contadas hoje: ${this.sobrasManuais || 0} (Sobras projetadas: ${this.sobrasCalculadas}).`
                    );

                    Swal.fire({
                        icon: 'success',
                        title: 'Produção Registrada!',
                        text: 'A IA já salvou os dados da sua produção de hoje na Auditoria.',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1E1E1E', color: '#FFF'
                    }).then(() => {
                        this.$root.mudarTela('tela-dashboard'); 
                    });
                }
            });
        } 
    }
});
