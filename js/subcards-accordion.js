const toggle = document.querySelector('.subcards-toggle');
const grids = Array.from(document.querySelectorAll('.subcard-content'));

if (!(toggle instanceof HTMLButtonElement) || grids.length !== 3) {
    throw new Error('The DMC subcard grids or their toggle are missing.');
}

toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';

    grids.forEach((grid) => {
        grid.hidden = !expanded;
    });

    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute(
        'aria-label',
        toggle.dataset[expanded ? 'labelExpanded' : 'labelCollapsed']
    );
});
