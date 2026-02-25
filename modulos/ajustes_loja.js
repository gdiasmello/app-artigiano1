/**
 * Ajustes da Loja v0.0.97
 */
Vue.component('tela-ajustes-loja', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #FF9800;"><i class="fas fa-store-alt"></i> Condução da Loja</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #FF9800; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;"><i class="fas fa-chart-pie"></i> Metas Base de Produção (Massas)</h4>
            <p style="color: #888; font-size: 0.8rem; margin-top: -10px; margin-bottom: 15px;">Defina a quantidade padrão de massas para cada dia.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div v-for="(m, i) in dias" :key="i">
                    <label class="label-form">{{ m }}</label>
                    <input type="number" v-model.number="$root.metas[i]" class="input-dark" @blur="salvar">
                </div>
            </div>
        </div>
        
        <div class="card" style="padding: 25px; border-top: 5px solid var(--cor-secundaria); margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;"><i class="fas fa-robot"></i> IA & Multiplicadores de Produção</h4>
            <p style="color: #888; font-size: 0.8rem; margin-top: -10px; margin-bottom: 20px;">A IA usará estes valores para ajustar as metas em dias especiais.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <label class="label-form">VÉSPERA DE FERIADO</label>
                    <div class="input-com-sufixo">
                        <input type="number" v-model.number="$root.multiplicadoresProducao.vespera" class="input-dark" @blur="salvar">
                        <span>%</span>
                    </div>
                </div>
                <div>
                    <label class="label-form">NO FERIADO</label>
                    <div class="input-com-sufixo">
                        <input type="number" v-model.number="$root.multiplicadoresProducao.feriado" class="input-dark" @blur="salvar">
                        <span>%</span>
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; background: #111; padding: 15px; border-radius: 8px;">
                <span style="color: #AAA; font-size: 0.9rem;"><i class="fas fa-cloud-sun-rain"></i> Modo Smart Clima</span>
                <input type="checkbox" v-model="$root.clima.modoSmart" @change="salvar" style="transform: scale(1.5); cursor: pointer;">
            </div>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #00E676; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;"><i class="fas fa-calendar-alt"></i> Feriados Fixos</h4>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <input type="date" v-model="novoFeriado.data" class="input-dark" style="flex: 1;">
                <input type="text" v-model="novoFeriado.nome" placeholder="Nome do Feriado" class="input-dark" style="flex: 2;">
                <button @click="addFeriado" class="btn" style="background: #00E676; color: #121212;"><i class="fas fa-plus"></i></button>
            </div>
            <div v-for="(f, i) in feriadosOrdenados" :key="f.data" class="item-feriado">
                <div style="flex: 1;">
                    <strong style="color: white;">{{ f.nome }}</strong>
                    <div style="color: #888; font-size: 0.8rem;">{{ formatarData(f.data) }}</div>
                </div>
                <button @click="rmFeriado(i)" class="btn-delete-aviso"><i class="fas fa-trash"></i></button>
            </div>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #2979FF; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;"><i class="fas fa-star"></i> Eventos Especiais de Produção</h4>
            <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 10px; margin-bottom: 20px; align-items: flex-end;">
                <input type="date" v-model="novoEvento.data" class="input-dark">
                <input type="text" v-model="novoEvento.nome" placeholder="Nome do Evento" class="input-dark">
                <div class="input-com-sufixo">
                    <input type="number" v-model.number="novoEvento.multiplicador" placeholder="Meta" class="input-dark">
                    <span>%</span>
                </div>
            </div>
            <button @click="addEvento" class="btn" style="background: #2979FF; color: white; width: 100%;"><i class="fas fa-plus"></i> ADICIONAR EVENTO</button>
            
            <div v-for="(e, i) in eventosOrdenados" :key="e.data" class="item-evento">
                <div style="flex: 1;">
                    <strong style="color: white;">{{ e.nome }}</strong>
                    <div style="color: #888; font-size: 0.8rem;">{{ formatarData(e.data) }}</div>
                </div>
                <strong style="color: #2979FF; font-size: 1.1rem;">+{{ e.multiplicador }}%</strong>
                <button @click="rmEvento(i)" class="btn-delete-aviso" style="margin-left: 15px;"><i class="fas fa-trash"></i></button>
            </div>
        </div>

        <div class="card" style="padding: 25px; border-top: 5px solid #FF5252; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: white;"><i class="fas fa-map-marker-alt"></i> Localização & Cerca Geográfica</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <input type="number" v-model.number="$root.localizacaoLoja.latitude" placeholder="Latitude" class="input-dark">
                <input type="number" v-model.number="$root.localizacaoLoja.longitude" placeholder="Longitude" class="input-dark">
            </div>
            <button @click="obterLocalizacao" class="btn" style="background: #FF5252; color: white; width: 100%; margin-bottom: 10px;"><i class="fas fa-location-arrow"></i> USAR LOCALIZAÇÃO ATUAL</button>
            <p style="color: #888; font-size: 0.75rem; text-align: center; margin: 0;">Define um raio de 100m para funções automáticas.</p>
        </div>
    </div>
    `,
    data() { 
        return { 
            dias: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            novoFeriado: { data: '', nome: '' },
            novoEvento: { data: '', nome: '', multiplicador: null }
        }; 
    },
    computed: {
        feriadosOrdenados() {
            return [...this.$root.feriados].sort((a,b) => a.data.localeCompare(b.data));
        },
        eventosOrdenados() {
            return [...this.$root.eventosEspeciais].sort((a,b) => a.data.localeCompare(b.data));
        }
    },
    methods: {
        formatarData(d) {
            const [ano, mes, dia] = d.split('-');
            return `${dia}/${mes}/${ano}`;
        },
        addFeriado() {
            if (!this.novoFeriado.data || !this.novoFeriado.nome.trim()) return;
            this.$root.feriados.push({ ...this.novoFeriado });
            this.novoFeriado.data = '';
            this.novoFeriado.nome = '';
            this.salvar();
        },
        rmFeriado(i) {
            const feriadoReal = this.feriadosOrdenados[i];
            const indexOriginal = this.$root.feriados.findIndex(f => f.data === feriadoReal.data);
            if (indexOriginal > -1) {
                this.$root.feriados.splice(indexOriginal, 1);
                this.salvar();
            }
        },
        addEvento() {
            if (!this.novoEvento.data || !this.novoEvento.nome.trim() || !this.novoEvento.multiplicador) return;
            this.$root.eventosEspeciais.push({ ...this.novoEvento });
            this.novoEvento = { data: '', nome: '', multiplicador: null };
            this.salvar();
        },
        rmEvento(i) {
            const eventoReal = this.eventosOrdenados[i];
            const indexOriginal = this.$root.eventosEspeciais.findIndex(e => e.data === eventoReal.data);
            if (indexOriginal > -1) {
                this.$root.eventosEspeciais.splice(indexOriginal, 1);
                this.salvar();
            }
        },
        obterLocalizacao() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(pos => {
                    this.$root.localizacaoLoja.latitude = pos.coords.latitude;
                    this.$root.localizacaoLoja.longitude = pos.coords.longitude;
                    this.salvar();
                    Swal.fire('Sucesso', 'Localização atualizada!', 'success');
                }, err => {
                    Swal.fire('Erro', 'Não foi possível obter a localização. Verifique as permissões do navegador.', 'error');
                });
            } else {
                Swal.fire('Erro', 'Geolocalização não é suportada neste navegador.', 'error');
            }
        },
        salvar() {
            db.collection("configuracoes").doc("loja").set({ 
                metas: this.$root.metas,
                multiplicadoresProducao: this.$root.multiplicadoresProducao,
                feriados: this.$root.feriados,
                eventosEspeciais: this.$root.eventosEspeciais,
                modoSmart: this.$root.clima.modoSmart,
                localizacaoLoja: this.$root.localizacaoLoja
            }, { merge: true });
        }
    },
    mounted() {
        if (!document.getElementById('css-ajustes-loja')) {
            const style = document.createElement('style');
            style.id = 'css-ajustes-loja';
            style.innerHTML = `
                .input-com-sufixo { position: relative; }
                .input-com-sufixo input { padding-right: 30px; }
                .input-com-sufixo span { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #666; font-weight: bold; }
                .item-feriado { background: #1A1A1A; border-left: 4px solid #00E676; padding: 10px 15px; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; }
                .item-evento { background: #1A1A1A; border-left: 4px solid #2979FF; padding: 10px 15px; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; }
            `;
            document.head.appendChild(style);
        }
    }
});
