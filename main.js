// 1. Инициализация иконок
lucide.createIcons();

// 2. Логика Header (изменение цвета при скролле)
const header = document.getElementById('main-header');
const logoText = document.getElementById('logo-text');
const links = document.querySelectorAll('.nav-link');
const menuIcon = document.getElementById('menu-icon'); // Для мобильного меню (если добавишь позже)

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.remove('bg-transparent', 'py-5');
        header.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md', 'py-3');
        
        logoText.classList.remove('text-white');
        logoText.classList.add('text-slate-800');
        
        links.forEach(link => {
            link.classList.remove('text-white/90');
            link.classList.add('text-slate-600');
        });

        if (menuIcon) {
            menuIcon.classList.remove('text-white');
            menuIcon.classList.add('text-slate-800');
        }
    } else {
        header.classList.add('bg-transparent', 'py-5');
        header.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md', 'py-3');
        
        logoText.classList.add('text-white');
        logoText.classList.remove('text-slate-800');

        links.forEach(link => {
            link.classList.add('text-white/90');
            link.classList.remove('text-slate-600');
        });

        if (menuIcon) {
            menuIcon.classList.add('text-white');
            menuIcon.classList.remove('text-slate-800');
        }
    }
});

// Закрыть меню при клике на ссылку (защита от ошибки, если меню нет)
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// 3. Логика формы: Выбор материала (Custom Radio Buttons)
const matBtns = document.querySelectorAll('.mat-btn');
const materialInput = document.getElementById('materialInput');

matBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Сбрасываем стили у всех кнопок
        matBtns.forEach(b => {
            b.className = "mat-btn text-xs py-2 rounded-md border transition-all bg-white text-slate-600 border-slate-200 hover:border-blue-400";
        });
        // Устанавливаем стиль активной кнопки
        btn.className = "mat-btn text-xs py-2 rounded-md border transition-all bg-blue-600 text-white border-blue-600";
        // Обновляем скрытый input
        materialInput.value = btn.getAttribute('data-val');
    });
});

// 4. Логика формы: Слайдер объема партии (вызывается из HTML oninput)
window.updateBatchDisplay = function(val) {
    document.getElementById('batchSizeDisplay').innerText = parseInt(val).toLocaleString() + ' шт.';
};

// 5. Логика формы: Отправка и генерация Excel
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const additives = formData.getAll('additives');
    
    // Подготовка данных
    const data = {
        "Дата заказа": new Date().toLocaleString('ru-RU'),
        "Тип напитка": formData.get('drinkType'),
        "База": formData.get('isAlcoholic') === 'Да' ? "Алкогольная" : "Безалкогольная",
        "Объем тары": formData.get('volume') + ' л',
        "Материал": formData.get('material'),
        "Добавки": additives.length > 0 ? additives.join(", ") : "Нет",
        "Объем партии": formData.get('batchSize'),
        "Заказчик": formData.get('contactName'),
        "Телефон": formData.get('phone'),
        "Email": formData.get('email')
    };

    // Генерация Excel через SheetJS
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([data]);
    
    // Настраиваем ширину колонок для красоты в Excel
    ws['!cols'] =[
        {wch: 20}, {wch: 15}, {wch: 15}, {wch: 10}, 
        {wch: 15}, {wch: 30}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 25}
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Заказ");
    XLSX.writeFile(wb, "Заказ_ФрутДроп.xlsx");

    // Визуальное подтверждение успеха на кнопке
    const btn = document.getElementById('submitBtn');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = '<i data-lucide="check"></i> Заявка сохранена!';
    btn.classList.remove('bg-slate-900', 'hover:bg-blue-700');
    btn.classList.add('bg-green-600', 'shadow-green-600/30');
    lucide.createIcons(); // перерисовываем новую иконку

    // Возвращаем кнопку в исходное состояние через 3 секунды
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.add('bg-slate-900', 'hover:bg-blue-700');
        btn.classList.remove('bg-green-600', 'shadow-green-600/30');
        lucide.createIcons();
    }, 3000);
});