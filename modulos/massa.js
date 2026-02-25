/**
 * Produção de Massas v2.5.0
 * Cálculo inteligente de produção baseado em metas e estoque.
 */
Vue.component('tela-massa', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <button @click="$root.mudarTela('tela-dashboard')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <div>
                <h2 style="margin: 0; color: var(--cor-primaria);"><i class="fas fa-pizza-slice"></i> Produção de Massas</h2>
                <p v-if="eventoDeHoje" style="margin: 5px 0 0 0; color: #2979FF; font-size: 0.8rem; font-weight: bold;">
                    <i class="fas fa-star"></i> IA: Meta +{{ eventoDeHoje.multiplicador }}% (Evento: {{ eventoDeHoje.nome }})
                </p>
                <p v-else-if="isFeriado" style="margin: 5px 0 0 0; color: #00E676; font-size: 0.8rem; font-weight: bold;">
                    <i class="fas fa-robot"></i> IA: Meta +{{ $root.multiplicadoresProducao.feriado }}% (Feriado: {{ nomeFeriado }})
                </p>
                <p v-else-if="isVespera" style="margin: 5px 0 0 0; color: #00E676; font-size: 0.8rem; font-weight: bold;">
                    <i class="fas fa-robot"></i> IA: Meta +{{ $root.multiplicadoresProducao.vespera }}% (Véspera de {{ nomeFeriado }})
                </p>
                <p v-else-if="ajusteClima !== 0" style="margin: 5px 0 0 0; color: #00B0FF; font-size: 0.8rem; font-weight: bold;">
                    <i class="fas fa-cloud-sun-rain"></i> IA: Meta {{ ajusteClima > 0 ? '+' : '' }}{{ ajusteClima }}% (Smart Clima)
                </p>
            </div>
        </div>

        <div class="card" style="padding: 25px; text-align: center; border-top: 5px solid var(--cor-primaria);">
            <label style="color: #AAA; font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 15px;">QUANTAS MASSAS PRONTAS TEMOS AGORA?</label>
            <input type="number" v-model.number="estoqueAtual" placeholder="Ex: 20" class="input-dark" style="text-align: center; font-size: 2.5rem; font-weight: 900; color: var(--cor-primaria);">

            <div v-if="estoqueAtual !== ''" class="animate__animated animate__fadeIn" style="margin-top: 30px; padding: 20px; background: #1A1A1A; border-radius: 12px; border: 1px dashed #444;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="color: #888;">Meta de Hoje:</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <strong style="color: white; font-size: 1.2rem;">{{ metaCalculada }} massas</strong>
                        <button @click="sugerirComIA" class="btn-ia-sugestao">
                            <i class="fas fa-brain"></i> Sugerir com IA
                        </button>
                    </div>
                </div>
                
                <div style="padding-top: 15px; border-top: 1px solid #333;">
                    <span style="color: #888; display: block; margin-bottom: 5px;">A IA recomenda produzir:</span>
                    <div style="font-size: 3.5rem; font-weight: 900; color: var(--cor-primaria);">{{ producaoNecessaria }}</div>
                    
                    <div v-if="producaoNecessaria > 0" class="card-batidas">
                        <i class="fas fa-blender"></i>
                        <div style="flex: 1;">
                            <strong>FAÇA {{ batidas }} BATIDAS</strong>
                            <span>(Considerando 30 massas por batida)</span>
                        </div>
                        <button @click="showRecipe = !showRecipe" class="btn-mini">
                            {{ showRecipe ? 'OCULTAR' : 'VER RECEITA' }}
                        </button>
                    </div>

                    <!-- Receita Detalhada -->
                    <div v-if="showRecipe && producaoNecessaria > 0" class="animate__animated animate__fadeIn" style="margin-top: 15px; text-align: left; background: #222; padding: 15px; border-radius: 8px; font-size: 0.85rem;">
                        <h5 style="color: var(--cor-primaria); margin: 0 0 10px 0; border-bottom: 1px solid #333; padding-bottom: 5px;">
                            RECEITA PARA {{ loteSelecionado }} MASSAS ({{ batidas }} batida{{ batidas > 1 ? 's' : '' }})
                        </h5>
                        <ul style="list-style: none; padding: 0; margin: 0; color: #CCC;">
                            <li>🍞 Farinha: <strong>{{ (receitasMassa[loteSelecionado].farinha * batidas).toLocaleString() }} g</strong></li>
                            <li>💧 Água Líquida (70%): <strong>{{ (receitasMassa[loteSelecionado].aguaLiquida * batidas).toLocaleString() }} g</strong></li>
                            <li>❄️ Gelo (30%): <strong>{{ (receitasMassa[loteSelecionado].gelo * batidas).toLocaleString() }} g</strong></li>
                            <li>🧬 Levain: <strong>{{ (receitasMassa[loteSelecionado].levain * batidas).toLocaleString() }} g</strong></li>
                            <li>🧂 Sal: <strong>{{ (receitasMassa[loteSelecionado].sal * batidas).toLocaleString() }} g</strong></li>
                        </ul>
                        <p style="margin: 10px 0 0 0; font-size: 0.7rem; color: #666; font-style: italic;">
                            * Padrão: 220g por bolinha | 6 bolinhas por bandeja.
                        </p>
                    </div>
                    
                    <div v-else-if="producaoNecessaria <= 0" style="color: #00E676; font-weight: bold; margin-top: 15px;">
                        <i class="fas fa-check-circle"></i> Meta atingida!
                    </div>
                </div>
            </div>

            <button @click="salvar" class="btn" style="background: var(--cor-primaria); color: #121212; margin-top: 30px; height: 60px;">
                <i class="fas fa-save"></i> REGISTRAR E FINALIZAR
            </button>
        </div>
    </div>
    `,
    data() { return { 
        estoqueAtual: '', 
        showRecipe: false,
        receitasMassa: {
            15: { farinha: 2000, aguaLiquida: 873, gelo: 374, levain: 90, sal: 60, totalAgua: 1247 },
            30: { farinha: 4000, aguaLiquida: 1746, gelo: 748, levain: 180, sal: 120, totalAgua: 2494 },
            45: { farinha: 6000, aguaLiquida: 2619, gelo: 1123, levain: 270, sal: 180, totalAgua: 3742 },
            60: { farinha: 8000, aguaLiquida: 3492, gelo: 1497, levain: 360, sal: 240, totalAgua: 4989 },
            75: { farinha: 10000, aguaLiquida: 4366, gelo: 1871, levain: 450, sal: 300, totalAgua: 6237 },
            90: { farinha: 12000, aguaLiquida: 5239, gelo: 2245, levain: 540, sal: 360, totalAgua: 7484 },
            110: { farinha: 14000, aguaLiquida: 6112, gelo: 2620, levain: 630, sal: 420, totalAgua: 8732 }
        }
    }; },
    computed: {
        isVespera() {
            const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
            const dataAmanha = amanha.toISOString().split('T')[0];
            return this.$root.feriados.some(f => f.data === dataAmanha);
        },
        isFeriado() {
            const hoje = new Date().toISOString().split('T')[0];
            return this.$root.feriados.some(f => f.data === hoje);
        },
        eventoDeHoje() {
            const hoje = new Date().toISOString().split('T')[0];
            return this.$root.eventosEspeciais.find(e => e.data === hoje);
        },
        nomeFeriado() {
            const hoje = new Date().toISOString().split('T')[0];
            const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
            const dataAmanha = amanha.toISOString().split('T')[0];
            
            const feriadoHoje = this.$root.feriados.find(f => f.data === hoje);
            if (feriadoHoje) return feriadoHoje.nome;

            const feriadoAmanha = this.$root.feriados.find(f => f.data === dataAmanha);
            return feriadoAmanha ? feriadoAmanha.nome : '';
        },
        metaCalculada() {
            const dia = new Date().getDay();
            let meta = this.$root.metas[dia] || 80;
            
            if (this.eventoDeHoje) {
                const mult = (this.eventoDeHoje.multiplicador || 0) / 100;
                meta = Math.ceil(meta * (1 + mult));
            } else if (this.isFeriado) {
                const mult = (this.$root.multiplicadoresProducao.feriado || 0) / 100;
                meta = Math.ceil(meta * (1 + mult));
            } else if (this.isVespera) {
                const mult = (this.$root.multiplicadoresProducao.vespera || 0) / 100;
                meta = Math.ceil(meta * (1 + mult));
            }

            // Aplica ajuste de clima se o modo smart estiver ativo
            if (this.$root.clima.modoSmart && this.ajusteClima !== 0) {
                meta = Math.ceil(meta * (1 + this.ajusteClima / 100));
            }

            return meta;
        },
        ajusteClima() {
            if (!this.$root.clima.modoSmart) return 0;

            let ajuste = 0;
            if (this.$root.clima.isCalor) ajuste -= 10; // Reduz 10% em dias quentes
            if (this.$root.clima.vaiChoverPico) ajuste += 20; // Aumenta 20% se houver previsão de chuva no pico

            return ajuste;
        },
        producaoNecessaria() {
            if (this.estoqueAtual === '') return 0;
            const falta = this.metaCalculada - this.estoqueAtual;
            return falta > 0 ? falta : 0;
        },
        loteSelecionado() {
            if (this.producaoNecessaria <= 0) return 0;
            const lotesDisponiveis = Object.keys(this.receitasMassa).map(Number).sort((a, b) => a - b);
            for (const lote of lotesDisponiveis) {
                if (lote >= this.producaoNecessaria) {
                    return lote;
                }
            }
            // Se a produção necessária for maior que o maior lote, retorna o maior lote
            return lotesDisponiveis[lotesDisponiveis.length - 1];
        },
        batidas() {
            if (this.producaoNecessaria <= 0) return 0;
            // Calcula o número de 'batidas' com base no lote selecionado
            return Math.ceil(this.producaoNecessaria / this.loteSelecionado);
        }
    },
    methods: {
        sugerirComIA() {
            this.$root.vibrar(30);
            const historico = this.$root.historicoGlobais.filter(h => h.setor === 'Massa' && h.acao === 'Produção');
            const prompt = `Como assistente de uma pizzaria, analise os dados e sugira uma meta de produção de massas para hoje. Considere o seguinte contexto:\n- Dia da semana: ${new Date().toLocaleDateString('pt-BR', { weekday: 'long' })}\n- Clima: ${this.$root.clima.temperatura}°C, ${this.$root.clima.vaiChoverPico ? 'com chuva prevista' : 'sem chuva'}\n- Evento: ${this.eventoDeHoje ? this.eventoDeHoje.nome : (this.isFeriado ? `Feriado (${this.nomeFeriado})` : 'Nenhum')}\n- Histórico de produção recente (estoque | meta | a produzir):\n${historico.slice(0, 10).map(h => `- ${h.dataStr}: ${h.detalhes}`).join('\n')}\n\nSugira um número final para a meta de massas, justificando brevemente.`;

            Swal.fire({ 
                title: 'Analisando...', 
                html: '<i class="fas fa-brain fa-spin"></i> A IA está processando os dados...',
                allowOutsideClick: false, 
                background: '#1E1E1E', color: '#FFF',
                didOpen: () => { Swal.showLoading(); }
            });

            window.gemini.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt)
                .then(result => {
                    Swal.close();
                    const numeroSugerido = result.response.text().match(/\d+/);
                    if (numeroSugerido) {
                        Swal.fire({
                            title: 'Sugestão da IA',
                            html: `A IA sugere uma meta de <strong>${numeroSugerido[0]} massas</strong>. <p style='font-size:0.8rem; text-align:left; margin-top:15px;'>${result.response.text()}</p>`,
                            icon: 'info',
                            showCancelButton: true,
                            confirmButtonText: 'Aplicar Sugestão',
                            cancelButtonText: 'Manter Atual',
                            background: '#1E1E1E', color: '#FFF'
                        }).then(res => {
                            if (res.isConfirmed) {
                                const dia = new Date().getDay();
                                this.$set(this.$root.metas, dia, parseInt(numeroSugerido[0]));
                                this.$root.registrarHistorico('IA', 'Massa', `Meta ajustada para ${numeroSugerido[0]} massas.`);
                            }
                        });
                    } else {
                        Swal.fire('Erro', 'Não foi possível extrair um número da sugestão.', 'error');
                    }
                }).catch(err => {
                    console.error(err);
                    Swal.fire('Erro de IA', 'Não foi possível conectar com a IA.', 'error');
                });
        },
        salvar() {
            if (this.estoqueAtual === '') {
                Swal.fire({ icon: 'warning', text: 'Informe o estoque atual.', background: '#1E1E1E' });
                return;
            }
            this.$root.estoqueMassasHoje = this.estoqueAtual;
            this.$root.dataEstoqueMassas = new Date().toLocaleDateString('pt-BR');
            
            const msg = `Estoque: ${this.estoqueAtual} | Meta: ${this.metaCalculada} | Produzir: ${this.producaoNecessaria} (${this.batidas} batidas)`;
            this.$root.registrarHistorico('Produção', 'Massa', msg);
            this.$root.salvarMemoriaLocal();
            
            Swal.fire({ 
                icon: 'success', 
                title: 'Produção Registrada!', 
                text: this.producaoNecessaria > 0 ? `Bora fazer essas ${this.batidas} batidas!` : 'Estoque em dia!',
                background: '#1E1E1E',
                confirmButtonColor: '#FFAB00'
            }).then(() => this.$root.mudarTela('tela-dashboard'));
        }
    },
    mounted() {
        if (!document.getElementById('css-massa-batidas')) {
            const style = document.createElement('style');
            style.id = 'css-massa-batidas';
            style.innerHTML = `
                .card-batidas { 
                    margin-top: 20px; 
                    background: rgba(0, 176, 255, 0.1); 
                    border: 1px solid #00B0FF; 
                    padding: 15px; 
                    border-radius: 10px; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    text-align: left;
                    color: #00B0FF;
                }
                .card-batidas i { font-size: 2rem; }
                .card-batidas strong { display: block; font-size: 1.1rem; }
                .card-batidas span { font-size: 0.75rem; opacity: 0.8; }
                .btn-mini { background: var(--cor-primaria); color: #121212; border: none; padding: 5px 10px; border-radius: 5px; font-size: 0.7rem; font-weight: bold; cursor: pointer; }
                .btn-ia-sugestao { background: none; border: 1px solid #673AB7; color: #673AB7; padding: 5px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
                .btn-ia-sugestao:hover { background: #673AB7; color: white; }
            `;
            document.head.appendChild(style);
        }
    }
});
