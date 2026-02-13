// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                uclDark: '#0B162C',
                uclDeep: '#0F1D3E',
                uclBlue: '#1A3E72',
                uclGold: '#FFD700',
                uclGoldDark: '#E6C200',
                uclSilver: '#B0C4DE',
                uclCard: 'rgba(26, 47, 80, 0.7)',
            },
            fontFamily: {
                display: ['Montserrat', 'sans-serif'],
                body: ['Outfit', 'sans-serif'],
            },
            backgroundImage: {
                'ucl-gradient': 'linear-gradient(135deg, #0B162C 0%, #1A3E72 100%)',
            }
        }
    }
}

// Application State
let state = {
    activePlayers: [],
    guests: [],
    currentTeams: [
        { name: 'Real Madrid', color: '#FFFFFF', logo: 'img/real-madrid-2.svg' },
        { name: 'Manchester City', color: '#6CABDD', logo: 'img/manchester-city-fc-1.svg' },
        { name: 'Bayern Munich', color: '#DC052D', logo: 'img/bayern-munich.svg' },
        { name: 'Paris SG', color: '#004170', logo: 'img/psg-6.svg' },
        { name: 'Liverpool', color: '#C8102E', logo: 'img/liverpool-fc-4.svg' },
        { name: 'Barcelona', color: '#004D98', logo: 'img/fc-barcelona.svg' },
        { name: 'Inter Milan', color: '#0066B2', logo: 'img/inter-milan-2014-2021.svg' },
        { name: 'Arsenal', color: '#EF0107', logo: 'img/arsenal-7.svg' }
    ],
    currentDraw: [],
    history: JSON.parse(localStorage.getItem('ucl_history')) || [],
    ranking: JSON.parse(localStorage.getItem('ucl_ranking')) || {
        'Arthur': { t: 0, v: 0 },
        'Matheus': { t: 0, v: 0 },
        'Levy': { t: 0, v: 0 },
        'Athos': { t: 0, v: 0 }
    },
    teamRanking: JSON.parse(localStorage.getItem('ucl_team_ranking')) || {}
};

// Initialization
function init() {
    renderRanking();
    renderHistory();
    updateDrawButton();
}

// Tab Navigation
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(el => el.classList.replace('text-uclGold', 'text-uclSilver'));
    document.querySelectorAll('nav button').forEach(el => el.classList.remove('nav-active'));

    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.getElementById(`nav-${tabId}`).classList.add('nav-active');

    if (tabId === 'ranking') renderRanking();
    if (tabId === 'ranking-times') renderTeamRanking();
    if (tabId === 'historico') renderHistory();
}

// Player Management
function togglePlayer(name) {
    const index = state.activePlayers.indexOf(name);
    const card = document.getElementById(`player-${name}`);
    const indicator = card.querySelector('.status-indicator');

    if (index > -1) {
        state.activePlayers.splice(index, 1);
        card.classList.remove('border-uclGold', 'bg-uclGold/10');
        indicator.classList.replace('bg-uclGold', 'bg-white/20');
    } else {
        state.activePlayers.push(name);
        card.classList.add('border-uclGold', 'bg-uclGold/10');
        indicator.classList.replace('bg-white/20', 'bg-uclGold');
    }
    updateDrawButton();
}

function addGuestField() {
    if (state.guests.length >= 2) return;

    const guestId = `guest-${Date.now()}`;
    const container = document.getElementById('guests-container');

    const div = document.createElement('div');
    div.className = 'flex gap-2 animate-fadeIn';
    div.id = guestId;
    div.innerHTML = `
        <input type="text" placeholder="Nome do Convidado" class="flex-1 bg-uclDeep border border-white/10 rounded-lg p-3 text-sm" onchange="updateGuestName('${guestId}', this.value)">
        <button onclick="removeGuest('${guestId}')" class="bg-red-500/20 text-red-500 px-3 rounded-lg border border-red-500/20">&times;</button>
    `;
    container.appendChild(div);
    state.guests.push({ id: guestId, name: '' });

    if (state.guests.length >= 2) document.getElementById('btn-add-guest').classList.add('hidden');
    updateDrawButton();
}

function removeGuest(id) {
    state.guests = state.guests.filter(g => g.id !== id);
    document.getElementById(id).remove();
    document.getElementById('btn-add-guest').classList.remove('hidden');
    updateDrawButton();
}

function updateGuestName(id, val) {
    const guest = state.guests.find(g => g.id === id);
    if (guest) {
        guest.name = val.trim();
        if (guest.name && !state.ranking[guest.name]) {
            state.ranking[guest.name] = { t: 0, v: 0 };
        }
    }
    updateDrawButton();
}

function updateDrawButton() {
    const total = state.activePlayers.length + state.guests.filter(g => g.name).length;
    document.getElementById('btn-sortear').disabled = total < 2;
}

// Draw Logic
async function startDraw() {
    const activeGuests = state.guests.filter(g => g.name).map(g => g.name);
    const participants = [...state.activePlayers, ...activeGuests];

    if (participants.length < 2) return;

    const anim = document.getElementById('draw-animation');
    anim.classList.remove('hidden');

    // Visual draw delay
    await new Promise(r => setTimeout(r, 2000));

    const shuffledPlayers = [...participants].sort(() => Math.random() - 0.5);
    const shuffledTeams = [...state.currentTeams].sort(() => Math.random() - 0.5);

    state.currentDraw = [];

    // Emparelhamento
    shuffledPlayers.forEach((player, idx) => {
        state.currentDraw.push({
            player: player,
            team: shuffledTeams[idx].name,
            logo: shuffledTeams[idx].logo
        });
    });

    // Times do CPU
    const remainingTeams = shuffledTeams.slice(shuffledPlayers.length);
    remainingTeams.forEach(team => {
        state.currentDraw.push({
            player: 'CPU',
            team: team.name,
            logo: team.logo
        });
    });

    renderResults();
    anim.classList.add('hidden');
}

function renderResults() {
    const list = document.getElementById('results-list');
    list.innerHTML = '';

    state.currentDraw.forEach(pair => {
        const isCPU = pair.player === 'CPU';
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between bg-uclDeep/60 p-3 rounded-lg border-l-4 border-uclGold';
        li.innerHTML = `
            <span class="font-bold ${isCPU ? 'text-uclSilver/50' : 'text-uclGold text-lg drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]'}">${pair.player}</span>
            <div class="flex items-center gap-3">
                <span class="text-uclGold font-display text-sm tracking-tighter uppercase italic font-bold">${pair.team}</span>
                <div class="bg-white/10 p-1.5 rounded-lg flex items-center justify-center">
                    <img src="${pair.logo}" alt="${pair.team}" class="w-8 h-8 object-contain">
                </div>
            </div>
        `;
        list.appendChild(li);
    });

    document.getElementById('draw-results').classList.remove('hidden');

    const winnerSelect = document.getElementById('select-winner');
    const runnerSelect = document.getElementById('select-runnerup');
    winnerSelect.innerHTML = '<option value="">Selecione o vencedor</option>';
    runnerSelect.innerHTML = '<option value="">Selecione o vice</option>';

    state.currentDraw.forEach((p, idx) => {
        const label = `${p.player} (${p.team})`;
        const opt1 = new Option(label, idx);
        const opt2 = new Option(label, idx);
        winnerSelect.add(opt1);
        runnerSelect.add(opt2);
    });

    document.getElementById('result-registration').classList.remove('hidden');
    document.getElementById('result-registration').scrollIntoView({ behavior: 'smooth' });
}

// Ranking & History
function saveChampionship() {
    const winnerIdx = document.getElementById('select-winner').value;
    const runnerIdx = document.getElementById('select-runnerup').value;

    if (winnerIdx === "" || runnerIdx === "" || winnerIdx === runnerIdx) {
        alert("Por favor selecione o Campeão e o Vice (diferentes).");
        return;
    }

    const winnerData = state.currentDraw[winnerIdx];
    const runnerData = state.currentDraw[runnerIdx];

    const champData = {
        date: new Date().toLocaleDateString('pt-BR'),
        winner: winnerData.player,
        winnerTeam: winnerData.team,
        winnerLogo: winnerData.logo,
        runner: runnerData.player,
        runnerTeam: runnerData.team,
        runnerLogo: runnerData.logo
    };

    state.history.unshift(champData);

    const winnerName = winnerData.player;
    const runnerName = runnerData.player;
    const winnerTeam = winnerData.team;
    const runnerTeam = runnerData.team;

    if (!state.ranking[winnerName]) state.ranking[winnerName] = { t: 0, v: 0 };
    if (!state.ranking[runnerName]) state.ranking[runnerName] = { t: 0, v: 0 };

    state.ranking[winnerName].t += 1;
    state.ranking[runnerName].v += 1;

    if (!state.teamRanking[winnerTeam]) state.teamRanking[winnerTeam] = { t: 0, v: 0, logo: winnerData.logo };
    if (!state.teamRanking[runnerTeam]) state.teamRanking[runnerTeam] = { t: 0, v: 0, logo: runnerData.logo };

    state.teamRanking[winnerTeam].t += 1;
    state.teamRanking[runnerTeam].v += 1;

    localStorage.setItem('ucl_history', JSON.stringify(state.history));
    localStorage.setItem('ucl_ranking', JSON.stringify(state.ranking));
    localStorage.setItem('ucl_team_ranking', JSON.stringify(state.teamRanking));

    alert(`🏆 ${winnerName === 'CPU' ? 'O CPU' : winnerName} (${winnerTeam}) é o Campeão!`);

    document.getElementById('result-registration').classList.add('hidden');
    document.getElementById('draw-results').classList.add('hidden');
    switchTab('historico');
}

function renderRanking() {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '';

    const sorted = Object.keys(state.ranking)
        .map(name => ({ name, ...state.ranking[name] }))
        .sort((a, b) => b.t - a.t || b.v - a.v);

    sorted.forEach((player, idx) => {
        const tr = document.createElement('tr');
        tr.className = idx === 0 ? 'bg-uclGold/5' : '';
        tr.innerHTML = `
            <td class="px-5 py-4 font-display font-black text-uclSilver">#${idx + 1}</td>
            <td class="px-5 py-4 font-bold ${idx === 0 ? 'text-uclGold' : 'text-white'}">${player.name}</td>
            <td class="px-5 py-4 text-center font-bold">${player.t}</td>
            <td class="px-5 py-4 text-center text-uclSilver">${player.v}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTeamRanking() {
    const tbody = document.getElementById('ranking-times-body');
    tbody.innerHTML = '';

    const sorted = Object.keys(state.teamRanking)
        .map(name => ({ name, ...state.teamRanking[name] }))
        .sort((a, b) => b.t - a.t || b.v - a.v);

    sorted.forEach((team, idx) => {
        const tr = document.createElement('tr');
        tr.className = idx === 0 ? 'bg-uclGold/5' : '';
        tr.innerHTML = `
            <td class="px-5 py-4 font-display font-black text-uclSilver">#${idx + 1}</td>
            <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                    <div class="bg-white/10 p-1 rounded flex items-center justify-center">
                        <img src="${team.logo}" alt="" class="w-5 h-5 object-contain">
                    </div>
                    <span class="font-bold ${idx === 0 ? 'text-uclGold' : 'text-white'}">${team.name}</span>
                </div>
            </td>
            <td class="px-5 py-4 text-center font-bold">${team.t}</td>
            <td class="px-5 py-4 text-center text-uclSilver">${team.v}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = '';

    if (state.history.length === 0) {
        container.innerHTML = `<p class="text-center text-uclSilver py-8 italic">Nenhum campeonato registrado ainda.</p>`;
        return;
    }

    state.history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'glass-card p-4 border-l-4 border-uclGold';
        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] text-uclSilver font-bold">${entry.date}</span>
                <span class="text-[10px] text-uclGold font-black tracking-widest uppercase italic border-b border-uclGold/30">team draw FC</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <p class="text-[9px] uppercase text-uclSilver tracking-tighter">🏆 Campeão</p>
                    <p class="font-bold text-white">${entry.winner}</p>
                    <div class="flex items-center gap-2">
                        <div class="bg-white/10 p-1 rounded flex items-center justify-center">
                            <img src="${entry.winnerLogo}" alt="" class="w-5 h-5 object-contain">
                        </div>
                        <p class="text-xs text-uclGold italic font-bold">${entry.winnerTeam}</p>
                    </div>
                </div>
                <div class="space-y-1 text-right">
                    <p class="text-[9px] uppercase text-uclSilver tracking-tighter">Vice</p>
                    <p class="font-bold text-white">${entry.runner}</p>
                    <div class="flex items-center justify-end gap-2">
                        <p class="text-xs text-uclSilver italic font-bold">${entry.runnerTeam}</p>
                        <div class="bg-white/10 p-1 rounded flex items-center justify-center">
                            <img src="${entry.runnerLogo}" alt="" class="w-5 h-5 object-contain">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

init();