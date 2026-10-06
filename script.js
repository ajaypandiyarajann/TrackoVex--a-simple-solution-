// Initialize Icons
lucide.createIcons();

// Mock Data
const tags = [
    { id: 1, name: "Keys", emoji: "🔑", battery: 85, status: "Nearby", location: "Living Room" },
    { id: 2, name: "Backpack", emoji: "🎒", battery: 42, status: "Disconnected", location: "Last seen 2h ago" },
];

let isLocating = false;
let isAlerting = false;

// Boot Sequence
setTimeout(() => {
    const bootScreen = document.getElementById('boot-screen');
    const appContainer = document.getElementById('app-container');
    
    bootScreen.style.opacity = '0';
    bootScreen.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        bootScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
        // Small delay to trigger CSS transition
        setTimeout(() => appContainer.style.opacity = '1', 50);
        renderDashboard();
    }, 700);
}, 2500);

// Render Dashboard
function renderDashboard() {
    const grid = document.getElementById('tags-grid');
    grid.innerHTML = '';
    
    tags.forEach(tag => {
        const batteryColor = tag.battery > 20 ? 'text-accent' : 'text-red-500';
        
        const card = document.createElement('div');
        card.className = 'p-4 rounded-3xl glass-card cursor-pointer flex flex-col justify-between aspect-square hover:scale-105 transition-transform';
        card.onclick = () => openDetail(tag);
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <span class="text-4xl">${tag.emoji}</span>
                <div class="flex items-center space-x-1 text-xs text-gray-400">
                    <i data-lucide="battery" class="w-4 h-4 ${batteryColor}"></i>
                    <span>${tag.battery}%</span>
                </div>
            </div>
            <div>
                <h3 class="font-semibold text-lg">${tag.name}</h3>
                <p class="text-xs text-gray-400 mt-1">${tag.status}</p>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

// Navigation Logic
function openDetail(tag) {
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    
    // Populate Detail View
    document.getElementById('detail-emoji').innerText = tag.emoji;
    document.getElementById('detail-name').innerText = tag.name;
    document.getElementById('detail-location').innerText = tag.location;
    document.getElementById('detail-battery').innerText = tag.battery + '% Battery';
    
    // Reset states
    isLocating = false;
    isAlerting = false;
    updateLocateUI();
    updateAlertUI();
}

function showDashboard() {
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('dashboard-view').classList.remove('hidden');
}

// Feature Toggles
function toggleLocate() {
    isLocating = !isLocating;
    updateLocateUI();
}

function updateLocateUI() {
    const btn = document.getElementById('btn-locate');
    const text = document.getElementById('text-locate');
    const radar = document.getElementById('radar-pulse');
    
    if (isLocating) {
        btn.className = 'py-4 rounded-3xl flex flex-col items-center transition-all bg-accent text-background font-bold shadow-[0_0_20px_rgba(0,240,255,0.5)]';
        text.innerText = 'Finding...';
        radar.classList.remove('hidden');
        radar.classList.add('animate-radar');
    } else {
        btn.className = 'py-4 rounded-3xl glass-card text-accent flex flex-col items-center transition-all';
        text.innerText = 'Locate';
        radar.classList.add('hidden');
        radar.classList.remove('animate-radar');
    }
}

function toggleAlert() {
    isAlerting = !isAlerting;
    updateAlertUI();
}

function updateAlertUI() {
    const btn = document.getElementById('btn-alert');
    const text = document.getElementById('text-alert');
    const icon = document.getElementById('icon-bell');
    
    if (isAlerting) {
        btn.className = 'py-4 rounded-3xl flex flex-col items-center transition-all bg-white text-background font-bold';
        text.innerText = 'Playing...';
        icon.classList.add('animate-bounce', 'text-accent');
    } else {
        btn.className = 'py-4 rounded-3xl glass-card text-white flex flex-col items-center transition-all';
        text.innerText = 'Play Sound';
        icon.classList.remove('animate-bounce', 'text-accent');
    }
}

// Pairing Modal Logic
function openPairing() {
    const modal = document.getElementById('pairing-modal');
    const sheet = document.getElementById('pairing-sheet');
    
    modal.classList.remove('hidden');
    // Tiny delay to allow display:block to apply before animating transform
    setTimeout(() => {
        sheet.classList.remove('translate-y-full');
    }, 10);
}

function closePairing() {
    const modal = document.getElementById('pairing-modal');
    const sheet = document.getElementById('pairing-sheet');
    
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 500); // Wait for transition to finish
}
