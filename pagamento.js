// Carregar itens do carrinho
document.addEventListener('DOMContentLoaded', () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total-amount');
    
    if (carrinho.length === 0) {
        orderItems.innerHTML = '<p>Nenhum item no carrinho</p>';
        return;
    }
    
    // Renderizar itens do pedido
    orderItems.innerHTML = '';
    carrinho.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <span class="order-item-name">${item.nome} (${item.quantidade}x)</span>
            <span class="order-item-price">R$${(item.preco * item.quantidade).toFixed(2)}</span>
        `;
        
        orderItems.appendChild(orderItem);
    });
    
    // Calcular e mostrar total
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    orderTotal.textContent = `R$${total.toFixed(2)}`;
    
    // Configurar formulário de pagamento
    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validar dados do cartão (simplificado)
        const cartao = document.getElementById('cartao').value.replace(/\s/g, '');
        const validade = document.getElementById('validade').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!/^\d{16}$/.test(cartao)) {
            alert('Número do cartão inválido. Deve conter 16 dígitos.');
            return;
        }
        
        if (!/^\d{2}\/\d{2}$/.test(validade)) {
            alert('Data de validade inválida. Use o formato MM/AA.');
            return;
        }
        
        if (!/^\d{3,4}$/.test(cvv)) {
            alert('CVV inválido. Deve conter 3 ou 4 dígitos.');
            return;
        }
        
        // Simular processamento do pagamento
        alert('Pagamento processado com sucesso! Obrigado por sua compra.');
        
        // Limpar carrinho e redirecionar
        localStorage.removeItem('carrinho');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
});