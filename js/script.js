// Script para Automação Comercial - WhatsApp Integration
// Implementa funcionalidades dos botões e envio para WhatsApp

class AutomacaoComercial {
    constructor() {
        this.whatsappNumber = '5511999999999'; // Substitua pelo número real
        this.selectedService = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupServiceSelection();
        this.setupScrollEffects();
    }

    // Configurar event listeners para todos os botões
    setupEventListeners() {
        // Botões de navegação/menu
        document.addEventListener('click', (e) => {
            const target = e.target;

            // Botões de navegação
            if (target.matches('.nav-link, .menu-item, .navbar-nav a')) {
                this.handleNavigation(e);
            }

            // Botões de contato/WhatsApp
            if (target.matches('.btn-whatsapp, .contact-btn, .whatsapp-btn, [data-whatsapp]')) {
                this.handleWhatsAppContact(e);
            }

            // Botões de serviços
            if (target.matches('.service-btn, .product-btn, [data-service]')) {
                this.handleServiceSelection(e);
            }

            // Botões "Saiba Mais" ou "Ver Detalhes"
            if (target.matches('.btn-details, .more-info, [data-details]')) {
                this.handleShowDetails(e);
            }

            // Botões "Solicitar Orçamento"
            if (target.matches('.btn-quote, .quote-btn, [data-quote]')) {
                this.handleQuoteRequest(e);
            }

            // Botões CTA (Call to Action)
            if (target.matches('.btn-cta, .cta-button, .action-btn')) {
                this.handleCTAAction(e);
            }
        });

        // Formulários
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Botões mobile menu
        const mobileMenuToggle = document.querySelector('.navbar-toggler, .menu-toggle, .mobile-menu-btn');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu);
        }
    }

    // Navegação suave entre seções
    handleNavigation(event) {
        event.preventDefault();
        const target = event.target;
        let targetSection = target.getAttribute('href') || target.getAttribute('data-target');
        
        if (targetSection && targetSection.startsWith('#')) {
            this.scrollToSection(targetSection);
            this.updateActiveNav(target);
            this.closeMobileMenu();
        }
    }

    scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header, .navbar')?.offsetHeight || 80;
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav(activeLink) {
        // Remove active de todos os links
        document.querySelectorAll('.nav-link, .menu-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adiciona active no link clicado
        activeLink.classList.add('active');
    }

    // Contato via WhatsApp
    handleWhatsAppContact(event) {
        event.preventDefault();
        const target = event.target;
        const serviceId = target.getAttribute('data-service') || target.getAttribute('data-product');
        const customMessage = target.getAttribute('data-message');
        
        this.openWhatsApp(serviceId, customMessage);
    }

    openWhatsApp(serviceId = null, customMessage = null) {
        let message = customMessage || "Olá! Tenho interesse em conhecer mais sobre os serviços de automação comercial.";
        
        if (serviceId) {
            const serviceElement = document.querySelector(`[data-service="${serviceId}"], [data-product="${serviceId}"]`);
            if (serviceElement) {
                const serviceName = this.getServiceName(serviceElement);
                message = `Olá! Tenho interesse no serviço: ${serviceName}`;
            }
        }

        if (this.selectedService) {
            message = `Olá! Tenho interesse no serviço: ${this.selectedService.name}`;
        }
        
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        this.showNotification('Redirecionando para WhatsApp...', 'success');
    }

    getServiceName(element) {
        return element.querySelector('.service-title, .product-title, h3, h4, .title')?.textContent ||
               element.querySelector('.card-title, .service-name')?.textContent ||
               'Serviço de Automação';
    }

    // Seleção de serviços
    handleServiceSelection(event) {
        event.preventDefault();
        const target = event.target;
        const serviceCard = target.closest('.service-card, .product-card, .card');
        const serviceId = target.getAttribute('data-service') || serviceCard?.getAttribute('data-service');
        
        if (serviceCard) {
            this.selectService(serviceId, serviceCard);
        }
    }

    selectService(serviceId, element) {
        // Remove seleção anterior
        document.querySelectorAll('.service-card, .product-card, .card').forEach(card => {
            card.classList.remove('selected', 'active');
        });

        // Adiciona seleção atual
        element.classList.add('selected');
        
        this.selectedService = {
            id: serviceId,
            name: this.getServiceName(element),
            element: element
        };

        this.updateSelectedServiceInfo();
        this.showNotification('Serviço selecionado!', 'info');
    }

    updateSelectedServiceInfo() {
        const selectedInfo = document.querySelector('.selected-service-info, .service-selected');
        if (selectedInfo && this.selectedService) {
            selectedInfo.innerHTML = `
                <div class="alert alert-success">
                    <strong>Serviço Selecionado:</strong> ${this.selectedService.name}
                </div>
            `;
            selectedInfo.style.display = 'block';
        }
    }

    setupServiceSelection() {
        const serviceCards = document.querySelectorAll('.service-card, .product-card, .card');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.getAttribute('data-service') || 
                                card.getAttribute('data-product') ||
                                card.querySelector('[data-service]')?.getAttribute('data-service');
                
                if (serviceId) {
                    this.selectService(serviceId, card);
                }
            });
        });
    }

    // Mostrar detalhes
    handleShowDetails(event) {
        event.preventDefault();
        const target = event.target;
        const serviceId = target.getAttribute('data-service') || target.getAttribute('data-details');
        
        this.showServiceDetails(serviceId);
    }

    showServiceDetails(serviceId) {
        const serviceElement = document.querySelector(`[data-service="${serviceId}"]`);
        if (!serviceElement) return;

        const modal = this.createModal();
        const serviceData = this.extractServiceData(serviceElement);
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>${serviceData.name}</h4>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>${serviceData.description}</p>
                    <div class="service-details">
                        ${serviceData.features ? `
                            <h5>Principais Recursos:</h5>
                            <ul>
                                ${serviceData.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${serviceData.benefits ? `
                            <h5>Benefícios:</h5>
                            <ul>
                                ${serviceData.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success btn-whatsapp" data-service="${serviceId}">
                        💬 Tenho Interesse - WhatsApp
                    </button>
                    <button class="btn btn-primary btn-quote" data-service="${serviceId}">
                        📋 Solicitar Orçamento
                    </button>
                </div>
            </div>
        `;

        this.showModal(modal, serviceId);
    }

    extractServiceData(element) {
        return {
            name: this.getServiceName(element),
            description: element.querySelector('.service-description, .description, p')?.textContent || 
                        'Serviço de automação comercial personalizado para sua empresa.',
            features: this.extractListItems(element, '.features li, .service-features li'),
            benefits: this.extractListItems(element, '.benefits li, .service-benefits li')
        };
    }

    extractListItems(element, selector) {
        const items = element.querySelectorAll(selector);
        return Array.from(items).map(item => item.textContent.trim()).filter(text => text);
    }

    // Solicitar orçamento
    handleQuoteRequest(event) {
        event.preventDefault();
        const target = event.target;
        const serviceId = target.getAttribute('data-service') || target.getAttribute('data-quote');
        
        this.openQuoteForm(serviceId);
    }

    openQuoteForm(serviceId) {
        if (serviceId) {
            this.selectServiceById(serviceId);
        }
        this.scrollToSection('#contact, #contato, #orcamento');
    }

    selectServiceById(serviceId) {
        const serviceElement = document.querySelector(`[data-service="${serviceId}"]`);
        if (serviceElement) {
            this.selectService(serviceId, serviceElement);
        }
    }

    // Call to Action
    handleCTAAction(event) {
        event.preventDefault();
        const target = event.target;
        const action = target.getAttribute('data-action') || 'contact';
        
        switch (action) {
            case 'whatsapp':
                this.openWhatsApp();
                break;
            case 'quote':
                this.scrollToSection('#contact, #contato, #orcamento');
                break;
            case 'services':
                this.scrollToSection('#services, #servicos, #produtos');
                break;
            default:
                this.openWhatsApp();
        }
    }

    // Validação de formulário
    setupFormValidation() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Campos obrigatórios
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        }
        // Email
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
        }
        // Telefone
        else if ((field.type === 'tel' || field.name === 'phone' || field.name === 'telefone') && value) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (value.length < 10 || !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Telefone inválido';
            }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, message) {
        let errorElement = field.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 5px;';
            field.parentNode.appendChild(errorElement);
        }
        
        if (isValid) {
            field.classList.remove('is-invalid', 'error');
            field.classList.add('is-valid');
            errorElement.style.display = 'none';
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid', 'error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid', 'error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Submissão do formulário
    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        if (this.validateForm(form)) {
            const formData = this.getFormData(form);
            this.sendToWhatsApp(formData);
        }
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Adicionar serviço selecionado
        if (this.selectedService) {
            data.selectedService = this.selectedService;
        }

        return data;
    }

    sendToWhatsApp(formData) {
        const message = this.formatWhatsAppMessage(formData);
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            window.open(whatsappUrl, '_blank');
            this.showNotification('Redirecionando para WhatsApp...', 'success');
            this.resetForm();
        }, 1500);
    }

    formatWhatsAppMessage(data) {
        let message = "🏢 *Solicitação de Automação Comercial* 🏢\n\n";
        
        // Informações pessoais
        if (data.name || data.nome) message += `👤 *Nome:* ${data.name || data.nome}\n`;
        if (data.email) message += `📧 *Email:* ${data.email}\n`;
        if (data.phone || data.telefone) message += `📱 *Telefone:* ${data.phone || data.telefone}\n`;
        if (data.company || data.empresa) message += `🏢 *Empresa:* ${data.company || data.empresa}\n`;
        if (data.city || data.cidade) message += `🏙️ *Cidade:* ${data.city || data.cidade}\n`;
        
        // Serviço selecionado
        if (data.selectedService) {
            message += `\n🔧 *Serviço de Interesse:*\n`;
            message += `• ${data.selectedService.name}\n`;
        }
        
        // Tipo de interesse
        if (data.interest || data.interesse) {
            message += `\n🎯 *Tipo de Interest:* ${data.interest || data.interesse}\n`;
        }
        
        // Mensagem personalizada
        if (data.message || data.mensagem) {
            message += `\n💬 *Mensagem:*\n${data.message || data.mensagem}\n`;
        }
        
        message += `\n⏰ Enviado em: ${new Date().toLocaleString('pt-BR')}`;
        
        return message;
    }

    // Menu mobile
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.navbar-collapse, .mobile-menu, .nav-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show');
            mobileMenu.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('.navbar-collapse, .mobile-menu, .nav-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('show', 'active');
        }
    }

    // Efeitos de scroll
    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
            this.handleScrollAnimations();
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in, .slide-up, .animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active', 'animated');
            }
        });
    }

    // Utilitários
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 1050;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        `;
        return modal;
    }

    showModal(modal, serviceId) {
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // Event listeners
        modal.querySelector('.close-modal').onclick = () => this.closeModal(modal);
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal(modal);
        };

        const whatsappBtn = modal.querySelector('.btn-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.onclick = () => {
                this.openWhatsApp(serviceId);
                this.closeModal(modal);
            };
        }

        const quoteBtn = modal.querySelector('.btn-quote');
        if (quoteBtn) {
            quoteBtn.onclick = () => {
                this.openQuoteForm(serviceId);
                this.closeModal(modal);
            };
        }

        // Adicionar estilos do modal
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                }
                .modal-header {
                    padding: 1rem;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body {
                    padding: 1rem;
                }
                .modal-footer {
                    padding: 1rem;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    gap: 0.5rem;
                    justify-content: flex-end;
                }
                .close-modal {
                    font-size: 24px;
                    cursor: pointer;
                    border: none;
                    background: none;
                }
                .btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .btn-success { background: #28a745; color: white; }
                .btn-primary { background: #007bff; color: white; }
            `;
            document.head.appendChild(style);
        }
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    text-align: center;
                ">
                    <div style="
                        border: 3px solid #f3f3f3;
                        border-radius: 50%;
                        border-top: 3px solid #007bff;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    "></div>
                    <p>Preparando mensagem...</p>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            document.body.removeChild(loading);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    resetForm() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.reset();
            form.querySelectorAll('.is-valid, .is-invalid, .error').forEach(field => {
                field.classList.remove('is-valid', 'is-invalid', 'error');
            });
            form.querySelectorAll('.error-message').forEach(error => {
                error.style.display = 'none';
            });
        });
    }

    // Configurar número do WhatsApp
    setWhatsAppNumber(number) {
        this.whatsappNumber = number;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.automacaoComercial = new AutomacaoComercial();
    
    // Configurar número do WhatsApp (IMPORTANTE: Substitua pelo número real)
    // window.automacaoComercial.setWhatsAppNumber('5511999999999');
});

// Funções globais para uso direto no HTML
window.contactWhatsApp = (serviceId, message) => {
    if (window.automacaoComercial) {
        window.automacaoComercial.openWhatsApp(serviceId, message);
    }
};

window.selectService = (serviceId) => {
    if (window.automacaoComercial) {
        window.automacaoComercial.selectServiceById(serviceId);
    }
};

window.showServiceDetails = (serviceId) => {
    if (window.automacaoComercial) {
        window.automacaoComercial.showServiceDetails(serviceId);
    }
};

window.requestQuote = (serviceId) => {
    if (window.automacaoComercial) {
        window.automacaoComercial.openQuoteForm(serviceId);
    }
};
