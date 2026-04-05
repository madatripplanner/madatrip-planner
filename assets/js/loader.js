/**
 * Chargeur de composants HTML
 * Permet d'inclure header.html et footer.html dans toutes les pages
 */

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Réexécuter les scripts après chargement
        const scripts = document.getElementById(elementId).getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            eval(scripts[i].innerText);
        }
    } catch (error) {
        console.error(`Erreur lors du chargement de ${componentPath}:`, error);
    }
}

// Charger les composants au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('header-placeholder')) {
        loadComponent('header-placeholder', 'assets/components/header.html');
    }
    if (document.getElementById('footer-placeholder')) {
        loadComponent('footer-placeholder', 'assets/components/footer.html');
    }
});