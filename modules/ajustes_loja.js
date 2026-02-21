// modulos/ajustes_loja.js - v0.0.16

Vue.component('tela-ajustes-loja', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #2962FF;">🏢 Loja & Smart</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <h3 style="color: white; border-bottom: 1px solid #333; padding-bottom: 10px;">Metas Base da Semana</h3>
        <div class="card" v-if="$root.metas">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><label style="color:#CCC; font-size:0.8rem;">Dom</label><input type="number" v-model.number="$root.metas[0]" class="input-dark"></div>
                <div><label style="color:#CCC; font-size:0.8rem;">Seg</label><input type="number" v-model.number="$root.metas[1]" class="input-dark" disabled></div>
                <div><label style="color:#CCC; font-size:0.8rem;">Ter</label><input type="number" v-model.number="$root.metas[2]" class="input-dark" disabled></div>
                <div><label style="color:#CCC; font-size:0.8rem;">Qua</label><input type="number" v-model.number="$root.metas[3]" class="input-dark"></div>
                <div><label style="color:#CCC; font-size:0.8rem;">Qui</label><input type="number" v-model.number="$root.metas[4]" class="input-dark"></div>
                <div><label style="color:#CCC; font-size:0.8rem;">Sex (Feriados)</label><input type="number" v-model.number="$root.metas[5]" class="input-dark" style="border: 1px solid var(--cor-primaria)"></div>
                <div><label style="color:#CCC; font-size:0.8rem;">Sab</label><input type="number" v-model.number="$root.metas[6]" class="input-dark"></div>
            </div>
        </div>

        <h3 style="color: white; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 20px;">Feriados (Mural Automático)</h3>
        <div class="card">
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                <input type="text" v-model="novoFeriadoNome" placeholder="Nome (Ex: Feriado Municipal)" class="input-dark">
                <div style="display: flex; gap: 10px;">
                    <input type="date" v-model="novoFeriadoData" class="input-dark" style="flex: 1;">
                    <button class="btn" style="width: auto; background: var(--cor-primaria); color: #121212; padding: 0 20px;" @click="adicionarFeriado"><i class="fas fa-plus"></i></button>
                </div>
            </div>

            <div style="max-height: 150px; overflow-y: auto; padding-right: 5px; scrollbar-width: thin;">
                <div v-for="(feriado, index) in feriadosOrdenados" :key="index" style="display: flex; justify-content: space-between; align-items: center; background: #1A1A1A; padding: 10px; border-radius: 5px; margin-bottom: 5px;">
                    <div>
                        <strong style="color: white; display: block;">{{ feriado.nome || 'Evento' }}</strong>
                        <small style="color: var(--text-sec);">{{ formatarDataBR(feriado.data) }}</small>
                    </div>
                    <button @click="removerFeriado(feriado.data)" style="background: none; border: none; color: #FF5252; cursor: pointer;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>

        <h3 style="color: white; border-bottom: 1px solid #333; padding-bottom: 10px; margin-top: 20px;">IA & Clima</h3>
        <div class="card" v-if="$root.clima" style="display: flex; justify-content: space-between; align-items: center;">
            <div><strong style="color: white; display: block;">API Smart</strong><small style="color: var(--text-sec);">Desconta 20% se chover</small></div>
            <button @click="$root.clima.modoSmart = !$root.clima.modoSmart" :style="$root.clima.modoSmart ? toggleOn : toggleOff">{{ $root.clima.modoSmart ? 'ATIVADO' : 'DESATIVADO' }}</button>
        </div>
    </div>
    `,
    data() {
        return {
            novoFeriadoNome: '', novoFeriadoData: '',
            toggleOn: 'background: #00C853; color: white; border: none; padding: 8px 15px; border-radius: 20px; font-weight: bold;',
            toggleOff: 'background: #444; color: #AAA; border: none; padding: 8px 15px; border-radius: 20px;'
        };
    },
    computed: {
        feriadosOrdenados() {
            if(!this.$root.feriados) return [];
            return this.$root.feriados.slice().sort((a, b) => new Date(a.data || a) - new Date(b.data || b));
        }
    },
    mounted() {
        if (!document.getElementById('css-loja')) {
            const style = document.createElement('style'); style.id = 'css-loja';
            style.innerHTML = `.input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: none; border-radius: 5px; color: white; box-sizing: border-box; } .input-dark:disabled { background: #1A1A1A; color: #555; }`;
            document.head.appendChild(style);
        }
    },
    methods: {
        adicionarFeriado() {
            if(!this.novoFeriadoNome || !this.novoFeriadoData) { Swal.fire('Erro', 'Preencha Nome e Data!', 'error'); return; }
            const ex = this.$root.feriados.find(f => (f.data || f) === this.novoFeriadoData);
            if(!ex) { 
                this.$root.feriados.push({ nome: this.novoFeriadoNome, data: this.novoFeriadoData }); 
                Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Adicionado!', timer: 1500, showConfirmButton: false, background: '#1E1E1E', color: '#FFF' });
            } else { Swal.fire('Aviso', 'Data já existe.', 'warning'); }
            this.novoFeriadoNome = ''; this.novoFeriadoData = '';
        },
        removerFeriado(d) { this.$root.feriados = this.$root.feriados.filter(f => (f.data || f) !== d); },
        formatarDataBR(d) { if(!d) return ''; const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0]}`; }
    }
});
