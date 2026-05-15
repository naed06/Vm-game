// Quick-response Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    const selectNav = () => {
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');
        console.log("Navigated to: " + item.innerText);
    };
    item.addEventListener('click', selectNav);
    item.addEventListener('touchstart', (e) => { e.preventDefault(); selectNav(); });
});

// Quick-response Tiles
document.querySelectorAll('.tile').forEach(tile => {
    const focusTile = () => {
        const current = document.querySelector('.tile.focused');
        if (current) current.classList.remove('focused');
        tile.classList.add('focused');
    };
    tile.addEventListener('click', focusTile);
    tile.addEventListener('touchstart', (e) => { focusTile(); });
});

// Settings Icon
const settings = document.querySelector('.settings-btn');
settings.addEventListener('click', () => alert("Settings coming soon!"));
settings.addEventListener('touchstart', (e) => { e.preventDefault(); alert("Settings coming soon!"); });
