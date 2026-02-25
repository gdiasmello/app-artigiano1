/**
 * Gestão de Avisos v1.1.1
 */
Vue.component('tela-ajustes-avisos', {
    template: `
    <div class="container animate__animated animate__fadeInRight" v-if="$root.usuario" style="padding-bottom: 100px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
            <h2 style="margin: 0; color: #FFAB00;"><i class="fas fa-bullhorn"></i> Gestão do Mural</h2>
            <button @click="$root.mudarTela('tela-ajustes')" style="background: none; border: none; color: #AAA; font-size: 1.5rem; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div class="card" style="padding: 20px; border-top: 5px solid #FFAB00; margin-bottom: 30px;">
            <h4 style="color: white; margin-top: 0; margin-bottom: 15px;">Novo Comunicado</h4>
            
            <textarea v-model="novo.texto" placeholder="O que você quer comunicar à equipe?" class="input-dark" rows="3" style="margin-bottom: 15px;"></textarea>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div>
                    <label class="label-form">PARA QUEM?</label>
                    <select v-model="novo.publico" class="input-dark">
                        <option value="Todos">Todos da Equipe</option>
                        <optgroup label="Por Cargo">
                            <option value="Gerente">Apenas Gerentes</option>
                            <option value="Pizzaiolo">Apenas Pizzaiolos</option>
                            <option value="Atendente">Apenas Atendentes</option>
                        </optgroup>
                        <optgroup label="Funcionário Específico">
                            <option v-for="u in $root.equipe" :key="u.id" :value="'user_' + u.id">{{ u.nome }}</option>
                        </optgroup>
                    </select>
                </div>
                <div>
                    <label class="label-form">DURAÇÃO</label>
                    <select v-model="novo.duracao" class="input-dark">
                        <option value="1h">1 Hora</option>
                        <option value="6h">6 Horas</option>
                        <option value="1d">1 Dia</option>
                        <option value="1w">1 Semana</option>
                        <option value="perm">Permanente</option>
                    </select>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <label style="display: flex; align-items: center; gap: 10px; color: #FF5252; font-weight: 800; font-size: 0.8rem; cursor: pointer; text-transform: uppercase;">
                    <input type="checkbox" v-model="novo.urgente" style="width: 18px; height: 18px;"> 🚨 Marcar como Urgente
                </label>
            </div>

            <button @click="add" class="btn" style="background: #FFAB00; color: #121212; font-weight: bold; height: 55px;">
                <i class="fas fa-paper-plane"></i> PUBLICAR NO MURAL
            </button>
        </div>

        <h4 style="color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Avisos Ativos ({{ $root.avisos.length }})</h4>
        
        <div v-for="(a, i) in $root.avisos" :key="a.id" class="item-aviso-gestao" :style="a.urgente ? 'border-left: 4px solid #FF5252;' : 'border-left: 4px solid #444;'">
            <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                    <span v-if="a.urgente" style="background: #FF5252; color: white; font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; font-weight: 900;">URGENTE</span>
                    <span style="color: #888; font-size: 0.65rem; font-weight: bold;">{{ a.dataStr }} • Por {{ a.autor }}</span>
                </div>
                <p style="color: white; margin: 0; font-size: 0.95rem; line-height: 1.4;">{{ a.texto }}</p>
                <div style="font-size: 0.7rem; color: #555; margin-top: 8px;">
                    <i class="fas fa-eye"></i> Visibilidade: {{ formatarPublico(a.publico) }}
                    <span v-if="a.expiracao && a.expiracao !== 'perm'"> • <i class="fas fa-clock"></i> Expira em breve</span>
                </div>
            </div>
            <button @click="rm(i)" class="btn-delete-aviso"><i class="fas fa-trash"></i></button>
        </div>

        <div v-if="$root.avisos.length === 0" style="text-align: center; padding: 40px; color: #444;">
            <i class="fas fa-comment-slash" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.2;"></i>
            <p>Nenhum aviso no mural.</p>
        </div>
    </div>
    `,
    data() { 
        return { 
            novo: { texto: '', publico: 'Todos', urgente: false, duracao: '1d' } 
        }; 
    },
    methods: {
        formatarPublico(p) {
            if (p === 'Todos') return 'Todos';
            if (p.startsWith('user_')) {
                const id = p.replace('user_', '');
                const u = this.$root.equipe.find(x => x.id == id);
                return u ? u.nome : 'Usuário';
            }
            return p + 's';
        },
        add() {
            if (!this.novo.texto.trim()) return;

            let expiracao = null;
            const agora = Date.now();
            if (this.novo.duracao === '1h') expiracao = agora + (1 * 60 * 60 * 1000);
            else if (this.novo.duracao === '6h') expiracao = agora + (6 * 60 * 60 * 1000);
            else if (this.novo.duracao === '1d') expiracao = agora + (24 * 60 * 60 * 1000);
            else if (this.novo.duracao === '1w') expiracao = agora + (7 * 24 * 60 * 60 * 1000);
            else expiracao = 'perm';

            const a = { 
                id: Date.now(), 
                texto: this.novo.texto.trim(), 
                publico: this.novo.publico, 
                urgente: this.novo.urgente, 
                autor: this.$root.usuario.nome, 
                dataStr: new Date().toLocaleDateString('pt-BR'),
                expiracao: expiracao
            };

            this.$root.avisos.unshift(a);
            this.sinc();
            this.novo.texto = '';
            this.novo.urgente = false;
            this.$root.vibrar(30);
            Swal.fire({ icon: 'success', title: 'Publicado!', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#1E1E1E', color: '#FFF' });
        },
        rm(i) {
            this.$root.avisos.splice(i, 1);
            this.sinc();
        },
        sinc() {
            db.collection("configuracoes").doc("avisos").set({ lista: this.$root.avisos });
        }
    },
    mounted() {
        if (!document.getElementById('css-avisos-gestao')) {
            const style = document.createElement('style');
            style.id = 'css-avisos-gestao';
            style.innerHTML = `
                .item-aviso-gestao { 
                    background: #1A1A1A; 
                    padding: 15px; 
                    border-radius: 10px; 
                    margin-bottom: 12px; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px;
                    border: 1px solid #333;
                }
                .btn-delete-aviso { 
                    background: rgba(255,82,82,0.1); 
                    border: none; 
                    color: #FF5252; 
                    width: 40px; 
                    height: 40px; 
                    border-radius: 8px; 
                    cursor: pointer; 
                }
            `;
            document.head.appendChild(style);
        }
    }
});

