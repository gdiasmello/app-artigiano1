// INÍCIO DO ARQUIVO modulos/ajustes_rotas.js - v2.0.1
Vue.component('tela-ajustes-rotas', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; color: #9C27B0;"><i class="fas fa-route"></i> Gestão de Rotas</h2>
        </div>

        <div class="card" style="padding: 20px; border-top: 4px solid #9C27B0;">
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 20px; line-height: 1.4;">
                Cadastre os locais da pizzaria (Ex: Geladeira 1, Estoque Seco) para organizar as contagens.
            </p>
            
            <label style="color: #AAA; font-size: 0.8rem; font-weight: bold; display: block; margin-bottom: 8px;">NOME DA NOVA ROTA:</label>
            <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                <input type="text" v-model="novaRota" @keyup.enter="addRota" placeholder="Ex: Congelador Vertical" style="flex: 1; padding: 12px; background: #2C2C2C; border: 1px solid #444; border-radius: 8px; color: white; outline: none; font-size: 1rem;">
                <button @click="addRota" style="background: #9C27B0; color: white; border: none; border-radius: 8px; width: 55px; font-size: 1.2rem; cursor: pointer;">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            
            <div v-for="(rota, idx) in $root.rotasSalvas" :key="idx" class="animate__animated animate__fadeInUp" style="display: flex; justify-content: space-between; align-items: center; background: #1A1A1A; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #333;">
                <span style="color: white; font-weight: bold; font-size: 1rem;">{{ rota }}</span>
                <button @click="removerRota(idx)" style="background: none; border: none; color: #FF5252; cursor: pointer; padding: 5px; font-size: 1.1rem;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            
            <div v-if="$root.rotasSalvas.length === 0" style="text-align: center; color: #555; padding: 20px;">
                Nenhuma rota cadastrada.
            </div>
        </div>
    </div>
    `,
    data() { return { novaRota: '' } },
    methods: {
        addRota() {
            if(!this.novaRota.trim()) return;
            this.$root.rotasSalvas.push(this.novaRota.trim());
            this.salvar(); 
            this.novaRota = ''; 
            this.$root.vibrar(20);
        },
        removerRota(i) {
            Swal.fire({ 
                title: 'Remover Rota?', 
                text: 'Isso apagará o local da lista.', 
                icon: 'warning', 
                showCancelButton: true, 
                confirmButtonColor: '#FF5252', 
                background: '#1E1E1E', 
                color: '#FFF' 
            }).then(r => {
                if(r.isConfirmed) { 
                    this.$root.rotasSalvas.splice(i,1); 
                    this.salvar(); 
                }
            });
        },
        salvar() {
            db.collection("configuracoes").doc("rotas").set({ lista: this.$root.rotasSalvas });
            this.$root.registrarHistorico('Alteração', 'Rotas', 'Atualizou a lista de locais da loja');
            this.$root.salvarMemoriaLocal();
        }
    }
});
// FIM DO ARQUIVO modulos/ajustes_rotas.js
