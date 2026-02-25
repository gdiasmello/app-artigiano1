/**
 * Rotas v2.0.1
 */
Vue.component('tela-ajustes-rotas', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #9C27B0;"><i class="fas fa-route"></i> Rotas de Contagem</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 20px; border-top: 5px solid #9C27B0; margin-bottom: 25px;">
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 20px;">
                Defina os locais físicos da pizzaria e a ordem em que a contagem de estoque deve ser feita.
            </p>
            <div style="display: flex; gap: 10px;">
                <input type="text" v-model="nova" placeholder="Ex: Freezer, Estoque Seco..." class="input-dark" @keyup.enter="add">
                <button @click="add" class="btn" style="background: #9C27B0; color: white; width: 60px;"><i class="fas fa-plus"></i></button>
            </div>
        </div>

        <div class="card" style="padding: 10px; background: transparent; border: none;">
            <div v-for="(r, i) in $root.rotasSalvas" :key="i" class="item-rota animate__animated animate__fadeInUp" :style="{ animationDelay: (i * 0.05) + 's' }">
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <button @click="mover(i, -1)" :disabled="i === 0" class="btn-ordem"><i class="fas fa-chevron-up"></i></button>
                    <button @click="mover(i, 1)" :disabled="i === $root.rotasSalvas.length - 1" class="btn-ordem"><i class="fas fa-chevron-down"></i></button>
                </div>
                
                <div style="flex: 1; margin-left: 15px;">
                    <span style="color: #666; font-size: 0.7rem; font-weight: bold; display: block;">POSIÇÃO {{ i + 1 }}</span>
                    <strong style="color: white; font-size: 1.1rem;">{{ r }}</strong>
                </div>

                <button @click="rm(i)" class="btn-delete-rota"><i class="fas fa-trash"></i></button>
            </div>
        </div>

        <div v-if="$root.rotasSalvas.length === 0" style="text-align: center; padding: 40px; color: #444;">
            <i class="fas fa-map-marked-alt" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.2;"></i>
            <p>Nenhuma rota configurada.</p>
        </div>
    </div>
    `,
    data() { return { nova: '' }; },
    methods: {
        add() {
            if (!this.nova.trim()) return;
            this.$root.rotasSalvas.push(this.nova.trim());
            this.sinc();
            this.nova = '';
            this.$root.vibrar(20);
        },
        mover(index, direcao) {
            const novaPos = index + direcao;
            if (novaPos < 0 || novaPos >= this.$root.rotasSalvas.length) return;
            
            const item = this.$root.rotasSalvas.splice(index, 1)[0];
            this.$root.rotasSalvas.splice(novaPos, 0, item);
            this.sinc();
            this.$root.vibrar(10);
        },
        rm(i) {
            Swal.fire({
                title: 'Remover Local?',
                text: "Isso pode desorganizar a contagem dos produtos vinculados a este local.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF5252',
                background: '#1E1E1E', color: '#FFF'
            }).then(res => {
                if (res.isConfirmed) {
                    this.$root.rotasSalvas.splice(i, 1);
                    this.sinc();
                }
            });
        },
        sinc() {
            db.collection("configuracoes").doc("rotas").set({ lista: this.$root.rotasSalvas });
        }
    },
    mounted() {
        if (!document.getElementById('css-rotas')) {
            const style = document.createElement('style');
            style.id = 'css-rotas';
            style.innerHTML = `
                .item-rota { 
                    background: #1A1A1A; 
                    padding: 15px; 
                    border-radius: 12px; 
                    margin-bottom: 10px; 
                    display: flex; 
                    align-items: center; 
                    border: 1px solid #333;
                }
                .btn-ordem { 
                    background: #222; 
                    border: 1px solid #444; 
                    color: #666; 
                    width: 30px; 
                    height: 25px; 
                    border-radius: 4px; 
                    cursor: pointer; 
                    font-size: 0.7rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-ordem:disabled { opacity: 0.2; cursor: default; }
                .btn-ordem:not(:disabled):active { background: #333; color: #9C27B0; }
                .btn-delete-rota { 
                    background: none; 
                    border: none; 
                    color: #444; 
                    font-size: 1.1rem; 
                    cursor: pointer; 
                    padding: 10px;
                    transition: color 0.2s;
                }
                .btn-delete-rota:hover { color: #FF5252; }
            `;
            document.head.appendChild(style);
        }
    }
});

