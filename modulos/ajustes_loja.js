// INÍCIO DO ARQUIVO modulos/ajustes_loja.js - v0.0.97
Vue.component('tela-ajustes-loja', {
    template: `
    <div class="container animate__animated animate__fadeIn" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #E0E0E0;">🏪 Ajustes da Loja</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: var(--text-sec); font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>

        <div class="card" style="border-top: 4px solid var(--cor-primaria); padding: 20px;">
            <h3 style="color: white; margin-top: 0;">Metas Base de Massas</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <label class="label-ia">Dom</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[0]" @blur="salvarNuvem" class="input-dark">
                </div>
                <div>
                    <label class="label-ia">Seg</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[1]" @blur="salvarNuvem" class="input-dark">
                </div>
                <div>
                    <label class="label-ia">Ter</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[2]" @blur="salvarNuvem" class="input-dark">
                </div>
                <div>
                    <label class="label-ia">Qua</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[3]" @blur="salvarNuvem" class="input-dark">
                </div>
                <div>
                    <label class="label-ia">Qui</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[4]" @blur="salvarNuvem" class="input-dark">
                </div>
                <div>
                    <label class="label-ia">Sex (Apenas)</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[5]" @blur="salvarNuvem" class="input-dark">
                </div>
                <div>
                    <label class="label-ia">Sáb</label>
                    <input type="number" inputmode="numeric" v-model.number="$root.metas[6]" @blur="salvarNuvem" class="input-dark">
                </div>
            </div>
            
            <div style="background: rgba(255,171,0,0.1); padding: 15px; border-radius: 8px; border: 1px dashed var(--cor-primaria);">
                <label class="label-ia" style="color: var(--cor-primaria);">
                    <i class="fas fa-glass-cheers"></i> Meta de Feriados/Especiais
                </label>
                <input type="number" inputmode="numeric" v-model.number="$root.metas.feriado" @blur="salvarNuvem" class="input-dark" style="border-color: var(--cor-primaria); font-weight: bold;">
                <small style="color: #888; display: block; margin-top: 5px;">A IA usará este valor automaticamente nas datas especiais cadastradas.</small>
            </div>
        </div>

        <div class="card" style="border-top: 4px solid #00B0FF; padding: 20px;">
            <h3 style="color: white; margin-top: 0;">Datas Especiais</h3>
            
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <input type="text" v-model="novoFerNome" placeholder="Ex: Natal" class="input-dark">
                <div style="display: flex; gap: 10px;">
                    <input type="date" v-model="novoFerData" class="input-dark" style="flex: 2;">
                    <button @click="addFeriado" class="btn" style="background: #00B0FF; color: #121212; flex: 1; padding: 0;">
                        <i class="fas fa-plus"></i> ADD
                    </button>
                </div>
            </div>

            <div v-if="$root.feriados.length === 0" style="color: #666; font-size: 0.85rem; text-align: center;">Nenhuma data cadastrada.</div>

            <div v-for="(f, i) in $root.feriados" :key="i" class="animate__animated animate__fadeIn" style="display: flex; justify-content: space-between; align-items: center; background: #111; padding: 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #333;">
                <div>
                    <strong style="color: white;">{{ f.nome }}</strong><br>
                    <small style="color: #888;">{{ formatarData(f.data) }}</small>
                </div>
                <button @click="rmFeriado(i)" style="background: none; border: none; color: #FF5252; font-size: 1.2rem; cursor: pointer;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>

        <div class="card" style="border-top: 4px solid #00E676; padding: 20px;">
            <h3 style="color: white; margin-top: 0;">IA & Clima</h3>
            <label style="display: flex; justify-content: space-between; align-items: center; color: white; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #333; cursor: pointer;">
                <span><i class="fas fa-brain" style="color: #00E676; margin-right: 10px;"></i> Modo Smart IA</span>
                <input type="checkbox" v-model="$root.clima.modoSmart" @change="salvarNuvem" style="transform: scale(1.3);">
            </label>
            <p style="color: #888; font-size: 0.8rem; margin-top: 10px; line-height: 1.4;">
                A IA vai aumentar ou diminuir as produções automaticamente com base na temperatura em Londrina.
            </p>
        </div>

    </div>
    `,
    data() { 
        return { 
            novoFerNome: '', 
            novoFerData: '' 
        }; 
    },
    mounted() {
        // 🔴 SISTEMA ANTI-TELA PRETA: Cria a variável de Feriados na hora se ela não existir
        if (typeof this.$root.metas.feriado === 'undefined') {
            this.$set(this.$root.metas, 'feriado', 130);
        }
        
        // 🟢 LÊ DO FIREBASE EM TEMPO REAL
        db.collection("configuracoes").doc("loja").onSnapshot((doc) => {
            if (doc.exists) {
                const d = doc.data();
                if (d.metas) {
                    this.$root.metas = d.metas;
                    if (typeof this.$root.metas.feriado === 'undefined') this.$set(this.$root.metas, 'feriado', 130);
                }
                if (d.feriados) this.$root.feriados = d.feriados;
                if (d.modoSmart !== undefined) this.$root.clima.modoSmart = d.modoSmart;
            }
        });

        if (!document.getElementById('css-loja-v97')) {
            const s = document.createElement('style'); 
            s.id = 'css-loja-v97';
            s.innerHTML = `
                .input-dark { width: 100%; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; font-size: 1rem; box-sizing: border-box; } 
                .input-dark:focus { outline: none; border-color: var(--cor-primaria); } 
                .label-ia { color: #AAA; font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; display: block; }
            `;
            document.head.appendChild(s);
        }
    },
    methods: {
        salvarNuvem() { 
            // 🟢 ENVIA PARA O FIREBASE
            db.collection("configuracoes").doc("loja").set({ 
                metas: this.$root.metas, 
                feriados: this.$root.feriados, 
                modoSmart: this.$root.clima.modoSmart 
            }, { merge: true });
            
            this.$root.salvarMemoriaLocal();
        },
        addFeriado() {
            if (!this.novoFerNome || !this.novoFerData) {
                Swal.fire({icon: 'warning', title: 'Dados Inválidos', background: '#1E1E1E', color: '#FFF'});
                return;
            }
            this.$root.vibrar(20);
            this.$root.feriados.push({ nome: this.novoFerNome, data: this.novoFerData });
            this.novoFerNome = ''; 
            this.novoFerData = ''; 
            this.salvarNuvem();
        },
        rmFeriado(i) { 
            this.$root.vibrar(20);
            this.$root.feriados.splice(i, 1); 
            this.salvarNuvem(); 
        },
        formatarData(d) { 
            if (!d) return ''; 
            const p = d.split('-'); 
            return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d; 
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_loja.js
