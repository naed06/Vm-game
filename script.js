// Handle Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');
    });
});

// Handle Tile Focus
document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        const currentFocused = document.querySelector('.tile.focused');
        if (currentFocused) currentFocused.classList.remove('focused');
        tile.classList.add('focused');
    });
});

// Settings Button
document.querySelector('.settings-btn').addEventListener('click', () => {
    alert("Settings menu coming soon!");
});
