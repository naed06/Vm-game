document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav) activeNav.classList.remove('active');
        item.classList.add('active');
    });
});

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const current = document.querySelector('.tile.focused');
        if (current) current.classList.remove('focused');
        tile.classList.add('focused');
    });
});

document.getElementById('settings-trigger').addEventListener('click', () => {
    alert("Settings menu coming soon!");
});
