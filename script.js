// Simple click handling for tiles and menu
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');
    });
});

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
        document.querySelector('.tile.focused').classList.remove('focused');
        tile.classList.add('focused');
        console.log("Tile selected: " + tile.innerText);
    });
});
