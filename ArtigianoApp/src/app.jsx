import React, { useState, useEffect } from 'react';
import { 
  Pizza, User, Send, ChevronRight, ChevronLeft, Settings, Plus, Trash2, 
  RefreshCcw, ShoppingBag, Package, Ban, MapPin, Tag, Phone, 
  Wheat, Milk, Beef, Carrot, Sparkles, Box
} from 'lucide-react';

/** CONFIGURAÇÕES INICIAIS **/
const DEFAULT_LOCATIONS = ['Depósito Seco', 'Cozinha', 'Geladeira 1', 'Freezer', 'Área de Limpeza'];

const DEFAULT_CATEGORIES = [
  { id: 'cat1', name: 'Farinha de Trigo', color: 'bg-amber-100 text-amber-800', icon: 'Wheat', contactName: 'Fornecedor Farinha', contactPhone: '554399999999' },
  { id: 'cat2', name: 'Lacticínios', color: 'bg-sky-100 text-sky-800', icon: 'Milk', contactName: 'Laticínios', contactPhone: '554388888888' },
  { id: 'cat3', name: 'Proteínas', color: 'bg-rose-100 text-rose-800', icon: 'Beef', contactName: 'Açougue', contactPhone: '554377777777' },
  { id: 'cat4', name: 'Hortifruti', color: 'bg-green-100 text-green-800', icon: 'Carrot', contactName: 'Sacolão', contactPhone: '554366666666' },
  { id: 'cat5', name: 'Limpeza', color: 'bg-purple-100 text-purple-800', icon: 'Sparkles', contactName: 'Mercado', contactPhone: '5543984544686' },
  { id: 'cat6', name: 'Outros', color: 'bg-slate-100 text-slate-800', icon: 'Box', contactName: 'Gerente', contactPhone: '5543984544686' },
];

const APP_CONFIG = { appName: 'Artigiano Contagem' };

const ICON_MAP = {
  Wheat: <Wheat size={18}/>, Milk: <Milk size={18}/>, Beef: <Beef size={18}/>, 
  Carrot: <Carrot size={18}/>, Sparkles: <Sparkles size={18}/>, Box: <Box size={18}/>
};

export default function App() {
  const [screen, setScreen] = useState('login'); 
  const [user, setUser] = useState({ name: '', role: '' });
  
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [masterList, setMasterList] = useState([]);
  
  const [counts, setCounts] = useState({});
  const [skippedItems, setSkippedItems] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [settingsTab, setSettingsTab] = useState('products');

  const [newItem, setNewItem] = useState({ name: '', categoryId: 'cat6', location: DEFAULT_LOCATIONS[0], baseUnit: 'kg', minStock: '', countUnit: 'Un', packSize: '1', orderPackSize: '', orderUnit: '' });
  const [newCat, setNewCat] = useState({ name: '', contactName: '', contactPhone: '' });
  const [newLoc, setNewLoc] = useState('');

  // Persistência
  useEffect(() => {
    const savedMaster = localStorage.getItem('artigiano_master_v4');
    const savedCats = localStorage.getItem('artigiano_cats_v4');
    const savedLocs = localStorage.getItem('artigiano_locs_v4');
    if (savedMaster) setMasterList(JSON.parse(savedMaster));
    if (savedCats) setCategories(JSON.parse(savedCats));
    if (savedLocs) setLocations(JSON.parse(savedLocs));
  }, []);

  useEffect(() => { localStorage.setItem('artigiano_master_v4', JSON.stringify(masterList)); }, [masterList]);
  useEffect(() => { localStorage.setItem('artigiano_cats_v4', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('artigiano_locs_v4', JSON.stringify(locations)); }, [locations]);

  const getCat = (id) => categories.find(c => c.id === id) || categories[categories.length - 1];

  const generateWhatsAppLink = (targetPhone, targetName, items) => {
    const dateStr = new Date().toLocaleDateString('pt-BR');
    let message = `🇮🇹 *${APP_CONFIG.appName}* - Pedido: ${targetName}\n`;
    message += `👤 *Resp:* ${user.name} | 📅 ${dateStr}\n\n`;
    
    if (items.length > 0) {
      message += `🛒 *LISTA DE COMPRAS*\n`;
      const catsInMessage = [...new Set(items.map(i => i.categoryId))];
      catsInMessage.forEach(catId => {
        const cat = getCat(catId);
        const catItems = items.filter(i => i.categoryId === catId);
        message += `\n📁 *${cat.name.toUpperCase()}*\n`;
        catItems.forEach(item => {
           message += `🔴 *${item.name}*: ${item.orderSuggestion}\n`;
        });
      });
    } else {
      message += `✅ Nada para pedir deste grupo.\n`;
    }
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.minStock) return alert("Preencha nome e mínimo!");
    const itemToAdd = {
      id: Date.now(),
      ...newItem,
      minStock: parseFloat(newItem.minStock),
      packSize: parseFloat(newItem.packSize),
      orderPackSize: newItem.orderPackSize ? parseFloat(newItem.orderPackSize) : null
    };
    setMasterList([...masterList, itemToAdd]);
    alert("Produto adicionado!");
    setNewItem({ ...newItem, name: '', minStock: '' });
  };

  const handleAddCategory = () => {
    if(!newCat.name || !newCat.contactPhone) return alert("Nome e Telefone obrigatórios");
    const newCategory = {
      id: `cat_${Date.now()}`,
      name: newCat.name,
      contactName: newCat.contactName,
      contactPhone: newCat.contactPhone,
      color: 'bg-slate-100 text-slate-800',
      icon: 'Box'
    };
    setCategories([...categories, newCategory]);
    setNewCat({ name: '', contactName: '', contactPhone: '' });
  };

  const handleAddLocation = () => {
    if(!newLoc) return;
    setLocations([...locations, newLoc]);
    setNewLoc('');
  };

  const resetCounts = () => {
    if(window.confirm("Zerar todas as contagens?")) { 
      setCounts({}); setSkippedItems({}); setCurrentCardIndex(0); 
    }
  };

  // --- UI RENDER ---

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6">
        <div className="bg-red-700 p-6 rounded-full mb-6 shadow-xl border-4 border-stone-200">
          <Pizza size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-800">{APP_CONFIG.appName}</h1>
        <p className="text-stone-500 mb-8 text-xs uppercase">Gestão Pro v4.0</p>
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-700 space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase">Pizzaiolo</label>
            <input type="text" placeholder="Seu nome" className="w-full border-b-2 border-stone-200 py-2 outline-none focus:border-green-600" onChange={(e) => setUser({...user, name: e.target.value})} />
          </div>
          <button onClick={() => user.name ? setScreen('dashboard') : alert('Nome?')} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2">
            ENTRAR <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'dashboard') {
    const countedItems = Object.keys(counts).length + Object.keys(skippedItems).length;
    const sortedList = [...masterList].sort((a, b) => 
      a.location.localeCompare(b.location) || a.categoryId.localeCompare(b.categoryId) || a.name.localeCompare(b.name)
    );

    return (
      <div className="min-h-screen bg-stone-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-10 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-800">{APP_CONFIG.appName}</h1>
            <p className="text-xs text-stone-500">Olá, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetCounts} className="p-2 text-stone-400 hover:text-red-600"><RefreshCcw size={20}/></button>
            <button onClick={() => setScreen('settings')} className="p-2 text-stone-400"><Settings size={20}/></button>
          </div>
        </header>

        <div className="p-4 space-y-3">
          {sortedList.length === 0 && <div className="text-center py-10 text-stone-400">Nenhum produto cadastrado. <br/> Vá em configurações.</div>}
          {sortedList.map(item => {
            const currentPacks = counts[item.id];
            const isSkipped = skippedItems[item.id];
            const isDone = currentPacks !== undefined || isSkipped;
            const cat = getCat(item.categoryId);
            return (
              <div key={item.id} onClick={() => { setCurrentCardIndex(masterList.findIndex(i => i.id === item.id)); setScreen('counting'); }}
                className={`relative p-4 rounded-lg shadow-sm flex justify-between items-center border cursor-pointer overflow-hidden ${isDone ? 'bg-white border-green-200' : 'bg-white border-stone-200'}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cat.color.split(' ')[0]}`}></div>
                <div className="pl-3">
                  <div className="flex gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 rounded uppercase ${cat.color}`}>{cat.name}</span>
                    <span className="text-[9px] font-bold bg-stone-100 text-stone-500 px-1.5 rounded uppercase flex items-center gap-1"><MapPin size={8}/> {item.location}</span>
                  </div>
                  <h3 className={`font-bold text-lg ${isSkipped ? 'text-stone-400 line-through' : 'text-stone-800'}`}>{item.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {isSkipped ? ( <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">Não Precisa</span> ) 
                  : currentPacks !== undefined ? ( <span className="block font-bold text-green-700 text-xl">{currentPacks} <span className="text-xs">{item.countUnit}</span></span> ) 
                  : ( <span className="text-xs bg-stone-100 text-stone-400 px-3 py-2 rounded-lg font-bold">Contar</span> )}
                  <ChevronRight size={16} className="text-stone-300" />
                </div>
              </div>
            );
          })}
        </div>
        {countedItems > 0 && (
          <div className="fixed bottom-6 right-6">
            <button onClick={() => setScreen('report')} className="bg-green-700 text-white px-6 py-4 rounded-full shadow-lg flex items-center justify-center gap-2 font-bold animate-in zoom-in">
              <ShoppingBag size={20} /> ENVIAR PEDIDOS
            </button>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'counting') {
    const item = masterList[currentCardIndex];
    const cat = getCat(item.categoryId);
    const currentPacks = counts[item.id] !== undefined ? counts[item.id] : 0; 
    
    const handleSave = (val) => {
      setCounts(prev => ({...prev, [item.id]: parseFloat(val)}));
      const newSkipped = {...skippedItems}; delete newSkipped[item.id]; setSkippedItems(newSkipped);
    };

    const handleSkip = () => {
      setSkippedItems(prev => ({...prev, [item.id]: true}));
      const newCounts = {...counts}; delete newCounts[item.id]; setCounts(newCounts);
      if (currentCardIndex < masterList.length - 1) setCurrentCardIndex(curr => curr + 1); else setScreen('dashboard');
    };

    return (
      <div className="min-h-screen bg-stone-800 flex flex-col justify-between pb-6">
        <div className="p-4 flex justify-between items-center text-white">
          <button onClick={() => setScreen('dashboard')} className="text-stone-400 text-sm">Voltar</button>
          <span className="font-mono text-sm">{currentCardIndex + 1} / {masterList.length}</span>
        </div>
        <div className="flex-1 px-6 flex flex-col justify-center animate-fade-in-up">
          <div className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden relative">
            <div className={`p-4 flex flex-col items-center justify-center ${cat.color}`}>
               {ICON_MAP[cat.icon]} <span className="font-bold text-xs uppercase mt-1 tracking-widest">{cat.name}</span>
            </div>
            <div className="p-8 flex flex-col items-center text-center">
              <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 flex items-center gap-1"><MapPin size={10}/> {item.location}</span>
              <h2 className="text-2xl font-bold text-stone-800 mb-1">{item.name}</h2>
              <div className="bg-stone-50 border border-stone-100 rounded-lg p-2 mb-6 mt-2">
                <p className="text-sm text-stone-600 font-medium flex items-center gap-2 justify-center"><Package size={16}/> Contar: <strong>{item.countUnit}</strong> ({item.packSize}{item.baseUnit})</p>
              </div>
              <div className="flex items-center justify-center gap-4 mb-6 w-full">
                <button onClick={() => handleSave(Math.max(0, currentPacks - 1))} className="w-12 h-12 rounded-full border-2 border-stone-200 text-stone-400 text-2xl pb-1 hover:bg-stone-100">-</button>
                <div className="relative">
                  <input type="number" value={counts[item.id] !== undefined ? counts[item.id] : ''} placeholder="0" onChange={(e) => handleSave(e.target.value)} className="w-32 text-center text-6xl font-bold text-stone-800 outline-none border-b-2 border-stone-200 bg-transparent p-2" autoFocus />
                  <span className="absolute -right-12 bottom-4 text-stone-400 text-sm font-bold w-12 text-left">{item.countUnit}s</span>
                </div>
                <button onClick={() => handleSave(currentPacks + 1)} className="w-12 h-12 rounded-full bg-stone-800 text-white shadow-lg text-2xl pb-1 hover:bg-stone-700">+</button>
              </div>
              <button onClick={handleSkip} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${skippedItems[item.id] ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-400 hover:bg-stone-200'}`}>
                <Ban size={16}/> {skippedItems[item.id] ? 'MARCADO: NÃO PRECISA' : 'Não Precisa / Pular'}
              </button>
            </div>
            <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-between items-center">
               <button disabled={currentCardIndex === 0} onClick={() => setCurrentCardIndex(curr => curr - 1)} className="p-2 text-stone-400 disabled:opacity-20 hover:bg-stone-200 rounded-full"> <ChevronLeft /> </button>
               <button onClick={() => { if (currentCardIndex < masterList.length - 1) setCurrentCardIndex(curr => curr + 1); else setScreen('dashboard'); }} className="bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-800">
                 {currentCardIndex === masterList.length - 1 ? 'Próximo' : 'Finalizar'}
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'settings') {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col">
        <div className="bg-white shadow p-4 sticky top-0 z-10 flex items-center gap-3">
          <button onClick={() => setScreen('dashboard')}><ChevronLeft/></button>
          <h1 className="font-bold text-lg">Configurações</h1>
        </div>
        <div className="flex bg-white border-b border-stone-200">
          <button onClick={() => setSettingsTab('products')} className={`flex-1 py-3 text-sm font-bold ${settingsTab === 'products' ? 'text-red-700 border-b-2 border-red-700' : 'text-stone-400'}`}>Produtos</button>
          <button onClick={() => setSettingsTab('categories')} className={`flex-1 py-3 text-sm font-bold ${settingsTab === 'categories' ? 'text-red-700 border-b-2 border-red-700' : 'text-stone-400'}`}>Categorias</button>
          <button onClick={() => setSettingsTab('locations')} className={`flex-1 py-3 text-sm font-bold ${settingsTab === 'locations' ? 'text-red-700 border-b-2 border-red-700' : 'text-stone-400'}`}>Locais</button>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto pb-20">
          {settingsTab === 'products' && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
              <h3 className="font-bold text-stone-700 mb-4 flex items-center gap-2 border-b pb-2"><Plus size={18} className="text-green-600"/> Novo Produto</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"> <label className="text-[10px] font-bold text-stone-400 uppercase">Nome</label> <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm" placeholder="Ex: Farinha Premium" /> </div>
                <div> <label className="text-[10px] font-bold text-stone-400 uppercase">Categoria</label> <select value={newItem.categoryId} onChange={e => setNewItem({...newItem, categoryId: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm"> {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)} </select> </div>
                <div> <label className="text-[10px] font-bold text-stone-400 uppercase">Local</label> <select value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm"> {locations.map(l => <option key={l} value={l}>{l}</option>)} </select> </div>
                <div> <label className="text-[10px] font-bold text-stone-400">Conta em (Un)</label> <input value={newItem.countUnit} onChange={e => setNewItem({...newItem, countUnit: e.target.value})} className="w-full bg-white border border-stone-200 rounded p-2 text-sm" placeholder="Ex: Saco" /> </div>
                <div> <label className="text-[10px] font-bold text-stone-400">Qtd Unitária</label> <input type="number" value={newItem.packSize} onChange={e => setNewItem({...newItem, packSize: e.target.value})} className="w-full bg-white border border-stone-200 rounded p-2 text-sm" placeholder="Ex: 25" /> </div>
                <div className="col-span-2"> <label className="text-[10px] font-bold text-stone-400">Mínimo (Total)</label> <input type="number" value={newItem.minStock} onChange={e => setNewItem({...newItem, minStock: e.target.value})} className="w-full bg-white border border-stone-200 rounded p-2 text-sm" placeholder="Ex: 100" /> </div>
              </div>
              <button onClick={handleAddItem} className="w-full mt-4 bg-stone-800 text-white font-bold py-3 rounded-lg hover:bg-stone-900">SALVAR PRODUTO</button>
            </div>
          )}
          {settingsTab === 'categories' && (
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
                  <h3 className="font-bold text-stone-700 mb-2 flex items-center gap-2"><Tag size={18}/> Nova Categoria</h3>
                  <div className="space-y-2">
                     <input value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm" placeholder="Nome (Ex: Congelados)" />
                     <input value={newCat.contactName} onChange={e => setNewCat({...newCat, contactName: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm" placeholder="Nome Contato (Ex: Zé do Gelo)" />
                     <input value={newCat.contactPhone} onChange={e => setNewCat({...newCat, contactPhone: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-sm" placeholder="Telefone (5543...)" />
                  </div>
                  <button onClick={handleAddCategory} className="w-full mt-3 bg-stone-800 text-white font-bold py-2 rounded text-sm">ADICIONAR CATEGORIA</button>
               </div>
               <div className="space-y-2">
                 {categories.map(c => (
                   <div key={c.id} className="bg-white p-3 rounded border border-stone-200 flex justify-between items-center">
                      <div>
                        <div className={`text-[10px] font-bold uppercase px-1.5 rounded inline-block ${c.color}`}>{c.name}</div>
                        <div className="text-xs text-stone-500 mt-1 flex items-center gap-1"><Phone size={10}/> Envia para: {c.contactName}</div>
                      </div>
                      <Trash2 size={16} className="text-stone-300"/>
                   </div>
                 ))}
               </div>
            </div>
          )}
          {settingsTab === 'locations' && (
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex gap-2">
                  <input value={newLoc} onChange={e => setNewLoc(e.target.value)} className="flex-1 bg-stone-50 border border-stone-200 rounded p-2 text-sm" placeholder="Novo Local (Ex: Câmara Fria)" />
                  <button onClick={handleAddLocation} className="bg-stone-800 text-white font-bold px-4 rounded text-sm">ADD</button>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 {locations.map(l => (
                   <div key={l} className="bg-white p-3 rounded border border-stone-200 text-sm font-bold text-stone-600 flex justify-between items-center">
                      <span className="flex items-center gap-2"><MapPin size={12}/> {l}</span>
                      <Trash2 size={14} className="text-stone-300 cursor-pointer hover:text-red-500" onClick={() => setLocations(locations.filter(x => x !== l))}/>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'report') {
    const itemsToBuy = masterList.map(item => {
      if (skippedItems[item.id]) return null;
      const currentPacks = counts[item.id] || 0;
      const totalStock = currentPacks * item.packSize;
      const deficitBase = item.minStock - totalStock;
      if (deficitBase <= 0) return null;
      let orderSuggestion = '';
      if (item.orderPackSize && item.orderUnit) {
          const boxes = Math.ceil(deficitBase / (item.orderPackSize * item.packSize)); 
          orderSuggestion = `${boxes} ${item.orderUnit}s`;
      } else {
          const packs = Math.ceil(deficitBase / item.packSize);
          orderSuggestion = `${packs} ${item.countUnit}s`;
      }
      return { ...item, orderSuggestion, deficitBase };
    }).filter(Boolean);

    const groups = {};
    itemsToBuy.forEach(item => {
      const cat = getCat(item.categoryId);
      const phone = cat.contactPhone;
      if (!groups[phone]) { groups[phone] = { contactName: cat.contactName, contactPhone: phone, items: [] }; }
      groups[phone].items.push(item);
    });
    
    const groupKeys = Object.keys(groups);

    return (
      <div className="min-h-screen bg-stone-100 flex flex-col">
        <div className="bg-green-700 p-6 text-center text-white pb-12 rounded-b-3xl shadow-lg">
          <ShoppingBag size={48} className="mx-auto mb-2 text-green-200" />
          <h1 className="text-2xl font-bold">Pedidos Gerados</h1>
          <p className="opacity-90 text-sm">{itemsToBuy.length} itens precisam de reposição.</p>
        </div>
        <div className="flex-1 px-4 -mt-8 pb-8 space-y-4">
          {itemsToBuy.length === 0 && (
             <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-green-600 font-bold">Tudo certo! Nenhum pedido necessário.</p>
                <button onClick={() => setScreen('dashboard')} className="mt-4 text-stone-400 text-sm underline">Voltar</button>
             </div>
          )}
          {groupKeys.map(phone => {
            const group = groups[phone];
            const waLink = generateWhatsAppLink(group.contactPhone, group.contactName, group.items);
            return (
              <div key={phone} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-stone-800 text-white p-3 flex justify-between items-center">
                   <div className="flex items-center gap-2"><User size={16}/> <span className="font-bold text-sm">Enviar para: {group.contactName}</span></div>
                   <span className="bg-stone-700 text-xs px-2 py-1 rounded-full">{group.items.length} itens</span>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    {group.items.map(item => (
                       <div key={item.id} className="flex justify-between text-sm border-b border-stone-100 pb-1 last:border-0">
                          <span className="text-stone-600">{item.name}</span>
                          <span className="font-bold text-red-600">{item.orderSuggestion}</span>
                       </div>
                    ))}
                  </div>
                  <a href={waLink} target="_blank" rel="noreferrer" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Send size={18} /> ENVIAR WHATSAPP
                  </a>
                </div>
              </div>
            );
          })}
          <div className="pt-4">
            <button onClick={() => setScreen('dashboard')} className="w-full bg-stone-200 text-stone-600 font-bold py-3 rounded-xl hover:bg-stone-300">Voltar ao Início</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}