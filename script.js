// Lista de produtos
const produtos = [
    { nome: 'Smartphone', preco: 1200, categoria: 'eletronicos', imagem: 'images/Celular 2.webp' },
    { nome: 'Camiseta Básica', preco: 49.9, categoria: 'roupas', imagem: 'images/Camisa 4.webp' },
    { nome: 'Detergente Líquido', preco: 5.5, categoria: 'limpeza', imagem: 'images/Detergente.webp' },
    { nome: 'Arroz Branco 5kg', preco: 25, categoria: 'alimenticio', imagem: 'images/Arroz tio jõa.webp' },
    { nome: 'Fone Bluetooth', preco: 89.9, categoria: 'eletronicos', imagem: 'images/Fone Bluetooth.webp' },
    { nome: 'Tênis Esportivo', preco: 149.9, categoria: 'roupas', imagem: 'images/tênis esportivo.webp' },
    { nome: 'Café Torrado 500g', preco: 14.9, categoria: 'alimenticio', imagem: 'images/Café torrado.webp' },
    { nome: 'Sabão em Pó 1kg', preco: 9.9, categoria: 'limpeza', imagem: 'images/sabão em pó.webp' },
    { nome: 'Ipad', preco: 8500, categoria: 'eletronicos', imagem: 'images/ipadd.webp' },
    { nome: 'Mochila', preco: 320, categoria: 'roupas', imagem: 'images/mochila.webp' },
    { nome: 'Fogão', preco: 840, categoria: 'eletronicos', imagem: 'images/fogao.webp'},
    { nome: 'Controle Joystick Ipega', preco: 150, categoria: 'eletronicos', imagem: 'images/controle.webp'},
    { nome: 'Moletom Masculino', preco: 350, categoria: 'roupas', imagem: 'images/moletom.webp'},
    { nome: 'Notebook Dell Latitude', preco: 4562, categoria: 'eletronicos', imagem: 'images/not1.webp'},
];

// Carrinho de compras
let carrinho = [];

// Elementos DOM
const productsContainer = document.getElementById('products-container');
const categoryFilters = document.getElementById('category-filters');
const priceFilters = document.getElementById('price-filters');
const searchInput = document.getElementById('search-input');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('finalizar-compra');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(produtos);
    setupCategoryFilters();
    setupEventListeners();
    
    // Carregar carrinho do localStorage se existir
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        updateCartCount();
    }
});

// Renderizar produtos
function renderProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<div class="no-products">Nenhum produto encontrado</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=Produto+sem+imagem'">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-price">R$${product.preco.toFixed(2)}</p>
                <span class="product-category">${formatCategory(product.categoria)}</span>
                <button class="add-to-cart" data-id="${product.nome}">Adicionar ao Carrinho</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Adicionar event listeners aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.getAttribute('data-id');
            addToCart(productName);
        });
    });
}

// Formatar categoria para exibição
function formatCategory(category) {
    const categoriesMap = {
        'eletronicos': 'Eletrônicos',
        'roupas': 'Roupas',
        'limpeza': 'Limpeza',
        'alimenticio': 'Alimentício'
    };
    
    return categoriesMap[category] || category;
}

// Configurar filtros de categoria
function setupCategoryFilters() {
    // Obter categorias únicas
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    
    categorias.forEach(categoria => {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="checkbox" name="category" value="${categoria}" checked>
            ${formatCategory(categoria)}
        `;
        categoryFilters.appendChild(label);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros
    document.querySelectorAll('#category-filters input, #price-filters input').forEach(input => {
        input.addEventListener('change', filterProducts);
    });
    
    // Busca
    searchInput.addEventListener('input', filterProducts);
    
    // Carrinho
    cartButton.addEventListener('click', openCartModal);
    closeModal.addEventListener('click', closeCartModal);
    
    // Fechar modal ao clicar fora
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Finalizar compra
    checkoutButton.addEventListener('click', finalizarCompra);
}

// Filtrar produtos
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(cb => cb.value);
    const selectedPriceRange = document.querySelector('input[name="price-range"]:checked').value;
    
    const filtered = produtos.filter(product => {
        // Filtro por busca
        const matchesSearch = product.nome.toLowerCase().includes(searchTerm);
        
        // Filtro por categoria
        const matchesCategory = selectedCategories.includes(product.categoria);
        
        // Filtro por preço
        let matchesPrice = true;
        if (selectedPriceRange !== 'all') {
            const [min, max] = selectedPriceRange.split('-');
            
            if (max) {
                matchesPrice = product.preco >= Number(min) && product.preco <= Number(max);
            } else {
                matchesPrice = product.preco >= Number(min.replace('+', ''));
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    renderProducts(filtered);
}

// Adicionar ao carrinho
function addToCart(productName) {
    const product = produtos.find(p => p.nome === productName);
    
    if (!product) return;
    
    const existingItem = carrinho.find(item => item.nome === productName);
    
    if (existingItem) {
        existingItem.quantidade += 1;
    } else {
        carrinho.push({
            ...product,
            quantidade: 1
        });
    }
    
    updateCartCount();
    showCartNotification();
    
    // Salvar carrinho no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Atualizar contador do carrinho
function updateCartCount() {
    const totalItems = carrinho.reduce((total, item) => total + item.quantidade, 0);
    cartCount.textContent = totalItems;
}

// Mostrar notificação de item adicionado
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span class="notification-icon">✓</span>
        <span>Item adicionado ao carrinho!</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

// Abrir modal do carrinho
function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fechar modal do carrinho
function closeCartModal() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Renderizar itens do carrinho
function renderCartItems() {
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<div class="no-products">Seu carrinho está vazio</div>';
        cartTotal.innerHTML = `
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-amount">R$0.00</span>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    
    carrinho.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80?text=Produto+sem+imagem'">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.nome}</h3>
                <p class="cart-item-price">R$${item.preco.toFixed(2)}</p>
                <p class="cart-item-quantity">Quantidade: ${item.quantidade}</p>
            </div>
            <button class="remove-item" data-id="${item.nome}">&times;</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Adicionar event listeners aos botões de remover
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.getAttribute('data-id');
            removeFromCart(productName);
        });
    });
    
    // Atualizar total
    updateCartTotal();
}

// Remover do carrinho
function removeFromCart(productName) {
    carrinho = carrinho.filter(item => item.nome !== productName);
    renderCartItems();
    updateCartCount();
    
    // Atualizar localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Atualizar total do carrinho
function updateCartTotal() {
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    cartTotal.innerHTML = `
        <span class="cart-total-label">Total:</span>
        <span class="cart-total-amount">R$${total.toFixed(2)}</span>
    `;
}

// Finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        showNotification('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    // Redirecionar para página de pagamento
    window.location.href = 'pagamento.html';
}

// Mostrar notificação personalizada
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? '✓' : '!';
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}