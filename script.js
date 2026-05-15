document.addEventListener('DOMContentLoaded', () => {
    const tiles = document.querySelectorAll('.tile');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    let currentIndex = 0;

    // Focus Management
    function updateFocus(index) {
        // Remove focus from all
        tiles.forEach(tile => tile.classList.remove('focused'));
        
        // Add focus to current
        const activeTile = tiles[index];
        activeTile.classList.add('focused');

        // Update Hero Content
        heroTitle.innerText = activeTile.getAttribute('data-name');
        heroDesc.innerText = activeTile.getAttribute('data-desc');

        // Scroll into view if needed (for larger grids)
        activeTile.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Remote Control / Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
                if (currentIndex < tiles.length - 1) {
                    currentIndex++;
                    updateFocus(currentIndex);
                }
                break;
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    currentIndex--;
                    updateFocus(currentIndex);
                }
                break;
            case 'Enter':
                const gameName = tiles[currentIndex].getAttribute('data-name');
                console.log('Launching game:', gameName);
                // Trigger transition to mini-game here
                break;
        }
    });

    // Optional: Mouse support for testing
    tiles.forEach((tile, index) => {
        tile.addEventListener('mouseenter', () => {
            currentIndex = index;
            updateFocus(currentIndex);
        });
    });
});
