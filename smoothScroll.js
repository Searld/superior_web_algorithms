document.querySelectorAll('#navbar .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Плавная прокрутка с центрированием
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'  // Элемент будет по центру экрана
        });

        // Для Bootstrap Scrollspy (обновление активного пункта)
        const navbarLinks = document.querySelectorAll('#navbar .nav-link');
        navbarLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});