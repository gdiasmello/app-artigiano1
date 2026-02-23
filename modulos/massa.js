// INÍCIO DO ARQUIVO modulos/massa.js - v0.0.88
Vue.component('tela-massa', {
    template: `
    <div class="container animate__animated animate__fadeInRight" style="padding-bottom:100px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">
            <h2 style="margin:0;color:var(--text-main);">🍕 Produção</h2>
            <button @click="$root.mudarTela('tela-dashboard')" style="background:none;border:none;color:var(--text-sec);font-size:1.5rem;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="border-left:5px solid var(--cor-primaria);">
            <h4 style="margin-top:0;color:var(--text-main);">📅 Massa para: <span style="color:var(--cor-primaria);">{{ infoAlvo.nomeDia }}</span></h4>
            <p style="margin:5px 0;color:var(--text-sec);"><i class="fas fa-thermometer-half" style="color:#FF5252;"></i> Geladeira: <b>{{ infoAlvo.temperatura }}</b></p>
            <p style="margin:10px 0 5px 0;color:white;">🎯 Meta Base: <b>{{ analiseSmart.metaBase }}</b> massas</p>

            <div style="display:flex;flex-direction:column;gap:5px;margin-top:10px;">
                <div v-if="analiseSmart.isEspecial" style="background:rgba(255,171,0,0.2);border:1px solid var(--cor-primaria);padding:8px;border-radius:5px;color:var(--cor-primaria);font-size:0.85rem;">
                    <i class="fas fa-glass-cheers"></i> Especial: {{ analiseSmart.nomeEvento }} (Usando meta Feriado)
                </div>
                <div v-if="analiseSmart.reducaoChuva" style="background:rgba(41,98,255,0.2);border:1px solid #2962FF;padding:8px;border-radius:5px;color:#82B1FF;font-size:0.85rem;">
                    <i class="fas fa-cloud-rain"></i> Chuva Previsão (-20%)
                </div>
            </div>
            <hr style="border-color:#333;margin:15px 0;">
            <p style="margin:0;color:var(--cor-primaria);font-size:1.1rem;text-align:center;font-weight:bold;">= Meta Final: {{ analiseSmart.metaFinal }} massas</p>
        </div>

        <div style="margin-bottom:20px;">
            <label style="color:var(--text-sec);font-size:0.9rem;display:block;margin-bottom:5px;">Massas prontas na geladeira <b>AGORA</b>?</label>
            <input type="number" inputmode="numeric" v-model.number="sobrasManuais" @blur="enviarNuvem" placeholder="Ex: 40" style="width:100%;padding:15px;background:#2C2C2C;border:1px solid #444;border-radius:10px;color:white;font-size:1.2rem;box-sizing:border-box;text-align:center;">
            
            <div v-if="consumoNoite > 0 && sobrasBase > 0" class="animate__animated animate__fadeIn" style="margin-top:10px;background:rgba(255,171,0,0.1);border:1px dashed #FFAB00;padding:12px;border-radius:8px;font-size:0.85rem;color:#FFD54F;">
                <i class="fas fa-clock" style="float:left;margin-right:10px;"></i>
                <b>Turno em Andamento:</b> IA calcula saída de aprox. <b>{{ consumoNoite }} massas hoje</b>.<br>
                <span style="color:white;display:block;margin-top:5px;border-top:1px solid rgba(255,171,0,0.3);padding-top:5px;">Sobras reais projetadas: <b>{{ sobrasCalculadas }}</b></span>
            </div>
        </div>

        <div class="card animate__animated animate__fadeInUp" v-if="aProduzir > 0" style="background:#222;">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #333;padding-bottom:10px;margin-bottom:15px;">
                <h3 style="color:var(--cor-primaria);margin:0;">Faltam: {{ aProduzir }}</h3>
                <div style="text-align:right;">
                    <label style="font-size:0.75rem;color:var(--text-sec);display:block;">LOTE SUGERIDO:</label>
                    <select v-model="loteSelecionado" style="background:#111;color:white;border:1px solid var(--cor-primaria);padding:5px;border-radius:5px;font-weight:bold;">
                        <option v-for="l in lotes" :value="l.massas">{{ l.massas }} Massas</option>
                    </select>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center;">
                <div style="background:#1A1A1A;padding:10px;border-radius:8px;">🌾 Farinha<br><b style="color:white;font-size:1.2rem;">{{ loteAtual.farinha }} g</b></div>
                <div style="background:#1A1A1A;padding:10px;border-radius:8px;">💧 Água Liq.<br><b style="color:#4FC3F7;font-size:1.2rem;">{{ loteAtual.aguaLiq }} g</b></div>
                <div style="background:#1A1A1A;padding:10px;border-radius:8px;">🧊 Gelo<br><b style="color:#B3E5FC;font-size:1.2rem;">{{ loteAtual.gelo }} g</b></div>
                <div style="background:#1A1A1A;padding:10px;border-radius:8px;">🧂 Sal<br><b style="color:white;font-size:1.2rem;">{{ loteAtual.sal }} g</b></div>
                <div style="grid-column:span 2;background:#3E2723;padding:10px;border-radius:8px;border:1px solid #5D4037;">🦠 Levain<br><b style="color:#FFAB00;font-size:1.3rem;">{{ loteAtual.levain }} g</b></div>
            </div>
        </div>

        <button class="btn" v-if="aProduzir > 0" style="background:#00C853;color:white;margin-top:10px;" @click="confirmarProd">
            <i class="fas fa-check-circle"></i> CONFIRMAR PRODUÇÃO
        </button>
        
        <div v-if="aProduzir <= 0 && sobrasBase > 0" class="animate__animated animate__pulse" style="background:rgba(0,200,83,0.1);border:1px dashed #00C853;padding:15px;border-radius:8px;text-align:center;margin-top:15px;">
            <p style="color:#00C853;margin:0;"><i class="fas fa-thumbs-up"></i> Metas batidas! Produção desnecessária.</p>
        </div>
    </div>
    `,
    data() {
        return {
            sobrasManuais: '', loteSelecionado: null,
            lotes: [
                { massas:15, farinha:2000, aguaLiq:873, gelo:374, levain:90, sal:60 }, { massas:30, farinha:4000, aguaLiq:1746, gelo:748, levain:180, sal:120 },
                { massas:45, farinha:6000, aguaLiq:2619, gelo:1123, levain:270, sal:180 }, { massas:60, farinha:8000, aguaLiq:3492, gelo:1497, levain:360, sal:240 },
                { massas:75, farinha:10000, aguaLiq:4366, gelo:1871, levain:450, sal:300 }, { massas:90, farinha:12000, aguaLiq:5239, gelo:2245, levain:540, sal:360 },
                { massas:110, farinha:14000, aguaLiq:6112, gelo:2620, levain:630, sal:420 }
            ]
        };
    },
    computed: {
        infoAlvo() {
            const dias = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
            const hj = new Date().getDay(); let a = hj+1; let s = 1; let temp = '19°C-20°C (24h)';
            if(hj === 1){ a=3; s=2; temp='14°C-15°C (48h)'; } if(a>6) a=0;
            return { nomeDia: dias[a], index: a, saltos: s, temperatura: temp };
        },
        analiseSmart() {
            const dA = new Date(); dA.setDate(dA.getDate() + this.infoAlvo.saltos); const dAs = dA.toISOString().split('T')[0];
            const dP = new Date(dA); dP.setDate(dP.getDate() + 1); const dPs = dP.toISOString().split('T')[0];

            let metaBase = this.$root.metas[this.infoAlvo.index];
            // 🟢 AGORA A IA USA A NOVA META EXCLUSIVA DE FERIADOS
            const metaEsp = this.$root.metas.feriado || 130; 
            let isEsp = false; let metaCalc = metaBase; let nEvt = '';

            const fer = this.$root.feriados.find(f => (f.data||f) === dAs || (f.data||f) === dPs);
            if(fer) { isEsp = true; nEvt = fer.nome || 'Evento'; metaCalc = metaEsp; }

            let redChuva = false;
            if(this.$root.clima.modoSmart && this.$root.clima.riscoChuvaNoturna) { redChuva = true; metaCalc = metaCalc - Math.round(metaCalc * 0.20); }
            return { metaBase, metaFinal: metaCalc, isEspecial: isEsp, nomeEvento: nEvt, reducaoChuva: redChuva };
        },
        consumoNoite() {
            const mAt = new Date().getHours() * 60 + new Date().getMinutes();
            const iT = 18*60; const fT = 23*60+30; let mR = 0;
            if(mAt < iT && mAt > 6*60) mR = fT - iT; else if(mAt >= iT && mAt <= fT) mR = fT - mAt;
            return Math.floor(mR / 30) * 6; 
        },
        sobrasBase() { return (this.sobrasManuais !== '' && this.sobrasManuais !== null) ? Number(this.sobrasManuais) : (this.$root.estoqueMassasHoje > 0 ? this.$root.estoqueMassasHoje : 0); },
        sobrasCalculadas() { const s = this.sobrasBase - this.consumoNoite; return s > 0 ? s : 0; },
        aProduzir() { const c = this.analiseSmart.metaFinal - this.sobrasCalculadas; return c > 0 ? c : 0; },
        loteAtual() { return this.lotes.find(l => l.massas === this.loteSelecionado) || this.lotes.find(l => l.massas >= this.aProduzir) || this.lotes[this.lotes.length-1]; }
    },
    watch: { aProduzir(n) { if(n > 0) this.loteSelecionado = (this.lotes.find(l => l.massas >= n) || this.lotes[this.lotes.length-1]).massas; } },
    mounted() { 
        if(this.$root.estoqueMassasHoje > 0) this.sobrasManuais = this.$root.estoqueMassasHoje;
        if(this.aProduzir > 0) this.loteSelecionado = (this.lotes.find(l => l.massas >= this.aProduzir) || this.lotes[this.lotes.length-1]).massas; 

        // 🟢 ESCUTA DA NUVEM (Se alguém alterar noutro aparelho, atualiza o ecrã)
        db.collection("operacao").doc("producao").onSnapshot((doc) => {
            if(doc.exists) {
                const d = doc.data(); const hj = new Date().toISOString().split('T')[0];
                if(d.dataEstoqueMassas === hj) {
                    this.$root.estoqueMassasHoje = d.estoqueMassasHoje;
                    this.sobrasManuais = d.estoqueMassasHoje;
                }
            }
        });
    },
    methods: { 
        enviarNuvem() { // 🟢 ENVIA P/ NUVEM AO DIGITAR
            if(this.sobrasManuais !== '' && this.sobrasManuais >= 0) {
                const hj = new Date().toISOString().split('T')[0];
                db.collection("operacao").doc("producao").set({ estoqueMassasHoje: Number(this.sobrasManuais), dataEstoqueMassas: hj, user: this.$root.usuario.nome }, { merge: true });
                this.$root.estoqueMassasHoje = Number(this.sobrasManuais);
            }
        },
        confirmarProd() { 
            this.$root.vibrar(30);
            Swal.fire({ title:'Confirmar', html:`Registar lote de <b><span style="color:var(--cor-primaria);">${this.loteSelecionado}</span></b> massas?`, showCancelButton:true, confirmButtonColor:'#00C853', background:'#1E1E1E', color:'#FFF' })
            .then((r) => {
                if(r.isConfirmed) {
                    if(this.sobrasManuais !== '' && Number(this.sobrasManuais) !== this.$root.estoqueMassasHoje) this.enviarNuvem();
                    this.$root.registrarHistorico('Lote Produzido', 'Produção', `Lote: ${this.loteSelecionado}. Contagem: ${this.sobrasManuais||0}`);
                    Swal.fire({ icon:'success', title:'Registado!', timer:1500, showConfirmButton:false, background:'#1E1E1E' }).then(() => this.$root.mudarTela('tela-dashboard'));
                }
            });
        } 
    }
});
// FIM DO ARQUIVO modulos/massa.js
