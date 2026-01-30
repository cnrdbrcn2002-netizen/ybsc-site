import React, { useState, useEffect } from 'react';
import { productsData } from '../data/products';

const ShopPage = () => {
    // State
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceSort, setPriceSort] = useState('DEFAULT'); // 'DEFAULT', 'LOW_HIGH', 'HIGH_LOW'
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile/Desktop toggle
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [modalSelectedSize, setModalSelectedSize] = useState(null); // Local state for modal size selection
    const [tilt, setTilt] = useState({});

    // Constants
    const allCategories = ['TSHIRTS', 'HOODIES', 'ZIPS', 'ACCESSORIES', 'HATS'];
    const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];
    const APP_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // Standard apparel sizes
    const CART_STORAGE_KEY = 'JFR_UNIT_CART';

    // Cart Animation State
    const [cartAnimation, setCartAnimation] = useState('IDLE'); // 'IDLE', 'PLAYING', 'DONE'

    // CART STATE
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // CHECKOUT STATE
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    // Persist Cart
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    // Price Helper
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^\d]/g, ''));
    };

    // Derived Total
    const totalPrice = cartItems.reduce((sum, item) => sum + item.priceRaw, 0);

    // Actions
    const addToCart = (product, selectedSize) => {
        const newItem = {
            cartId: Date.now(), // Unique ID for this instance
            id: product.id,
            name: product.name,
            price: product.price,
            priceRaw: parsePrice(product.price),
            size: selectedSize || 'OS',
            image: product.images[0]
        };

        // Animation Trigger
        setCartAnimation('PLAYING');
        setTimeout(() => {
            setCartItems(prev => [...prev, newItem]);
            setIsCartOpen(true); // Auto open cart to show result
            setCartAnimation('IDLE');
        }, 2200); // Wait for package to drop and cart to zoom out slightly
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    // STRICT VALIDATION HELPERS // SIKI DOĞRULAMA
    const validateName = (name) => {
        if (!name) return false;
        const trimmed = name.trim();
        // En az 2 kelime (Ad Soyad) ve toplamda en az 5 karakter
        if (trimmed.length < 5 || !trimmed.includes(' ')) return false;
        // Sadece harfler ve boşluk (Basit kontrol, özel karakterleri engelle)
        const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
        return nameRegex.test(trimmed);
    };

    const validatePhone = (phone) => {
        if (!phone) return false;
        // Sadece rakamları al
        const digits = phone.replace(/\D/g, '');
        // Türkiye formatı: 05xx veya 5xx ile başlamalı ve toplam 10-11 hane olmalı
        // 5XXXXXXXXX (10 hane) veya 05XXXXXXXXX (11 hane)
        const phoneRegex = /^(0?5\d{9})$/;
        return phoneRegex.test(digits);
    };

    const validateEmail = (email) => {
        if (!email) return true; // Opsiyonel ise true, zorunlu ise regex
        // Strict email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateAddress = (address) => {
        if (!address) return false;
        // Adres çok kısa olmamalı, "asdasd" gibi girişleri engellemek için min 15 karakter
        return address.trim().length >= 15;
    };

    const [errors, setErrors] = useState({});

    const handleCheckoutChange = (e) => {
        const { name, value } = e.target;
        setCheckoutForm(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing (improves UX)
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let errorMsg = '';

        if (name === 'name' && !validateName(value)) {
            errorMsg = 'Geçersiz isim. En az 2 kelime giriniz.';
        } else if (name === 'phone' && !validatePhone(value)) {
            errorMsg = 'Geçersiz numara. Başında 0 olmadan 10 veya 05 ile başlayan 11 hane giriniz.';
        } else if (name === 'email' && value && !validateEmail(value)) {
            errorMsg = 'Geçersiz e-posta formatı.';
        } else if (name === 'address' && !validateAddress(value)) {
            errorMsg = 'Adres çok kısa. Lütfen detaylı açık adres giriniz.';
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleOrderSubmit = (e) => {
        e.preventDefault();

        // 1. HONEYPOT CHECK (Anti-Spam)
        // If the hidden '_gotcha' field has any value, it's a bot.
        if (checkoutForm._gotcha) {
            console.warn("🤖 Bot detected! Submission silently rejected.");
            // Fake success to fool the bot
            alert("Siparişiniz başarıyla alındı! (Bot Trap)");
            return;
        }

        const { name, phone, email, address } = checkoutForm;
        const newErrors = {};

        // 1. İSİM KONTROLÜ
        if (!validateName(name)) {
            newErrors.name = 'Geçersiz isim. En az 2 kelime giriniz.';
        }

        // 2. TELEFON KONTROLÜ
        if (!validatePhone(phone)) {
            newErrors.phone = 'Geçersiz numara. Başında 0 olmadan 10 veya 05 ile başlayan 11 hane giriniz.';
        }

        // 3. EMAIL KONTROLÜ (Opsiyonel ama girildiyse doğru olmalı)
        if (email && !validateEmail(email)) {
            newErrors.email = 'Geçersiz e-posta formatı.';
        }

        // 4. ADRES KONTROLÜ
        if (!validateAddress(address)) {
            newErrors.address = 'Adres çok kısa. Lütfen detaylı açık adres giriniz.';
        }

        // If any errors, update state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // CALCULATE TOTAL
        const totalPrice = cartItems.reduce((sum, item) => sum + item.priceRaw, 0);
        const date = new Date().toLocaleString('tr-TR');

        // PREPARE WHATSAPP MESSAGE
        let message = `*Y.B.S.C // NEW ORDER*\n`;
        message += `--------------------------------\n`;
        message += `👤 *MÜŞTERİ:* ${name.trim().toUpperCase()}\n`;
        message += `📞 *TELEFON:* ${phone.replace(/\D/g, '')}\n`; // Temizlenmiş numara
        message += `✉️ *EMAIL:* ${email || 'BELİRTİLMEDİ'}\n`;
        message += `📍 *ADRES:* ${address.trim()}\n`;
        if (checkoutForm.notes) message += `📝 *NOT:* ${checkoutForm.notes}\n`;
        message += `--------------------------------\n`;
        message += `*SİPARİŞ DETAYI:*\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (${item.size}) - ${item.price}\n`;
        });

        message += `--------------------------------\n`;
        message += `💰 *TOPLAM TUTAR:* ${totalPrice.toLocaleString('tr-TR')} TL\n`;
        message += `📅 *TARİH:* ${date}\n`;
        message += `--------------------------------\n`;
        message += `*DURUM:* ÖDEME BEKLENİYOR...`;

        // ENCODE URL
        const encodedMessage = encodeURIComponent(message);
        // REPLACE WITH YOUR ACTUAL BUSINESS NUMBER (e.g., 905551234567)
        const phoneNumber = '905536412497';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // OPEN WHATSAPP
        window.open(whatsappUrl, '_blank');

        // OPTIONAL: CLEAR CART OR CLOSE
        // setCartItems([]); 
        // setShowCheckout(false);
        // setIsCartOpen(false);
    };

    // Filtering Logic
    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const filteredProducts = productsData.filter(product => {
        // Category Match
        const catMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);

        // Size Match
        const sizeMatch = selectedSizes.length === 0 || product.sizes.some(s => selectedSizes.includes(s));

        return catMatch && sizeMatch;
    }).sort((a, b) => {
        if (priceSort === 'DEFAULT') return 0;
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
        return priceSort === 'LOW_HIGH' ? priceA - priceB : priceB - priceA;
    });


    // 3D Tilt Logic
    const handleMouseMove = (e, id) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        setTilt(prev => ({ ...prev, [id]: { rotateX, rotateY } }));
    };

    const handleMouseLeave = (id) => {
        setTilt(prev => ({ ...prev, [id]: { rotateX: 0, rotateY: 0 } }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: '#050505',
            color: '#fff',
            fontFamily: 'var(--font-main)',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '100px',
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Background Grid */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            {/* Header Area */}
            <div style={{ padding: '0 5vw', marginBottom: '40px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Mr+Dafoe&display=swap');`}
                </style>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                        <h1 style={{
                            fontSize: '3rem',
                            margin: 0,
                            WebkitTextStroke: '1px #fff',
                            color: 'transparent',
                            letterSpacing: '5px'
                        }}>ARMORY // SHOP</h1>
                        <p style={{ color: '#666', fontFamily: 'var(--font-tech)', letterSpacing: '2px', marginTop: '5px' }}>
                            {filteredProducts.length} UNITS AVAILABLE
                        </p>

                        {/* Tech Designer Signature */}
                        <div style={{
                            position: 'absolute',
                            bottom: '18px', // Moved up further as requested
                            left: '100%',
                            marginLeft: '8px', // Closer to P as requested
                            fontFamily: '"Courier New", monospace',
                            fontWeight: '100',
                            fontSize: '0.85rem', // Matched with Beat section
                            color: '#fff',
                            letterSpacing: '1px',
                            whiteSpace: 'nowrap',
                            opacity: 0.8
                        }}>
                            // designed by Alpi
                        </div>


                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {/* CART TOGGLE */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="cart-toggle-btn"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--color-red)',
                                color: 'var(--color-red)',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-tech)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s'
                            }}>
                            CART ({cartItems.length})
                        </button>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            style={{
                                background: 'transparent',
                                border: '1px solid #333',
                                color: '#fff',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                display: 'none'
                            }}>
                            FILTER
                        </button>

                        <select
                            value={priceSort}
                            onChange={(e) => setPriceSort(e.target.value)}
                            style={{
                                background: '#000',
                                border: '1px solid #333',
                                color: '#fff',
                                padding: '10px 15px',
                                fontFamily: 'var(--font-tech)',
                                cursor: 'pointer'
                            }}>
                            <option value="DEFAULT">SORT: FEATURED</option>
                            <option value="LOW_HIGH">PRICE: LOW TO HIGH</option>
                            <option value="HIGH_LOW">PRICE: HIGH TO LOW</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div style={{
                display: 'flex',
                flex: 1,
                gap: '50px',
                padding: '0 5vw 50px 5vw',
                position: 'relative',
                zIndex: 2
            }}>

                {/* Left Sidebar: Filters */}
                <div style={{
                    width: '250px',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    borderRight: '1px solid #111',
                    paddingRight: '20px'
                }}>
                    {/* Categories */}
                    <div>
                        <h3 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '20px', letterSpacing: '2px' }}>CATEGORY</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {allCategories.map(cat => (
                                <label key={cat} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    color: selectedCategories.includes(cat) ? '#fff' : '#555',
                                    transition: 'color 0.2s'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                        style={{ accentColor: 'var(--color-red)' }}
                                    />
                                    <span style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem' }}>{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <h3 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '20px', letterSpacing: '2px' }}>SIZE</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            {allSizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => toggleSize(size)}
                                    style={{
                                        background: selectedSizes.includes(size) ? '#fff' : 'transparent',
                                        color: selectedSizes.includes(size) ? '#000' : '#555',
                                        border: `1px solid ${selectedSizes.includes(size) ? '#fff' : '#333'}`,
                                        padding: '10px 0',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-tech)',
                                        fontSize: '0.8rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Product Grid */}
                <div style={{ flex: 1 }}>
                    {filteredProducts.length === 0 ? (
                        <div style={{
                            height: '400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed #333',
                            color: '#444',
                            fontFamily: 'var(--font-tech)',
                            letterSpacing: '2px'
                        }}>
                            NO UNITS FOUND WITH CURRENT PARAMETERS.
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '30px',
                            perspective: '1500px'
                        }}>
                            {filteredProducts.map((product, index) => {
                                const isHovered = tilt[product.id]?.rotateX !== undefined && tilt[product.id]?.rotateX !== 0;

                                return (
                                    <div
                                        onMouseMove={(e) => handleMouseMove(e, product.id)}
                                        onMouseLeave={() => handleMouseLeave(product.id)}
                                        onClick={() => {
                                            setQuickViewProduct(product);
                                            // Auto-select size if only one option (e.g. OS) or if 'HATS'/'ACCESSORIES'
                                            if (product.category === 'HATS' || product.category === 'ACCESSORIES' || product.sizes.length === 1) {
                                                setModalSelectedSize(product.sizes[0]);
                                            } else {
                                                setModalSelectedSize(null);
                                            }
                                        }}
                                        style={{
                                            background: '#0a0a0a',
                                            border: '1px solid #222',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            height: '450px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transformStyle: 'preserve-3d',
                                            transform: `perspective(1000px) 
                                                        rotateX(${tilt[product.id]?.rotateX || 0}deg) 
                                                        rotateY(${tilt[product.id]?.rotateY || 0}deg)
                                                        translateY(${isHovered ? '-5px' : '0'})`,
                                            transition: 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
                                            animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`,
                                            opacity: 0,
                                            boxShadow: isHovered ? '0 0 20px rgba(255, 0, 0, 0.15)' : 'none',
                                            borderColor: isHovered ? 'var(--color-red)' : '#222'
                                        }}
                                    >
                                        {/* Image Container with Hover Swap */}
                                        <div style={{
                                            width: '100%',
                                            height: '320px',
                                            overflow: 'hidden',
                                            borderBottom: '1px solid #222',
                                            position: 'relative',
                                            background: '#000'
                                        }}>
                                            {/* Back Image (Reveals on hover) */}
                                            {product.images[1] && (
                                                <img
                                                    src={product.images[1]}
                                                    alt={product.name}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                                                        opacity: isHovered ? 1 : 0,
                                                        transition: 'opacity 0.4s ease',
                                                        filter: 'grayscale(0%)'
                                                    }}
                                                />
                                            )}

                                            {/* Front Image (Fades out or stays if no back image) */}
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                                                    opacity: isHovered && product.images[1] ? 0 : 1,
                                                    transition: 'opacity 0.4s ease, filter 0.3s ease',
                                                    filter: isHovered && !product.images[1] ? 'grayscale(0%)' : 'grayscale(100%) contrast(1.1)'
                                                    // Logic: If swapping to back image, we don't care about front filter. 
                                                    // If NO back image, we colorize front image on hover.
                                                }}
                                            />

                                            {/* Scanline Effect */}
                                            {isHovered && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, width: '100%', height: '100%',
                                                    background: 'linear-gradient(to bottom, transparent 40%, rgba(255,0,0,0.1) 50%, transparent 60%)',
                                                    zIndex: 5,
                                                    animation: 'scanline 1.5s linear infinite',
                                                    pointerEvents: 'none'
                                                }} />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0', color: '#fff', letterSpacing: '1px' }}>{product.name}</h3>
                                                <p style={{ margin: 0, fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-tech)' }}>
                                                    {product.category} // {product.sizes.length} SIZES
                                                </p>
                                            </div>
                                            <div style={{ alignSelf: 'flex-start', border: '1px solid #333', padding: '4px 8px', fontSize: '0.8rem', fontFamily: 'var(--font-tech)', fontWeight: 'bold' }}>
                                                {product.price}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Signature */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '100px 0 50px 0',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{
                    fontFamily: '"Mr Dafoe", cursive',
                    fontSize: '4rem',
                    color: '#fff',
                    textShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 40px #00f3ff',
                    animation: 'hologram-flicker 4s infinite',
                    transform: 'rotate(-5deg)',
                    opacity: 0.9
                }}>
                    JuanFruan
                </div>
            </div>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(10px)',
                    animation: 'fadeIn 0.3s ease'
                }} onClick={() => setQuickViewProduct(null)}>
                    <div style={{
                        background: '#050505',
                        border: '1px solid var(--color-red)',
                        width: '95%',
                        maxWidth: '1200px',
                        height: '80vh',
                        display: 'flex',
                        boxShadow: '0 0 50px rgba(255, 0, 51, 0.1)',
                        animation: 'scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        overflow: 'hidden'
                    }} onClick={(e) => e.stopPropagation()}>

                        {/* Left: Images Gallery */}
                        <div style={{ flex: '1.5', borderRight: '1px solid #222', overflowY: 'auto', background: '#000' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px' }}>
                                {quickViewProduct.images.map((img, idx) => (
                                    <img key={idx} src={img} alt="" style={{ width: '100%', display: 'block' }} />
                                ))}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div style={{ flex: '1', padding: '60px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                            <h2 style={{ fontSize: '3.5rem', margin: '0 0 20px 0', lineHeight: 0.9 }}>{quickViewProduct.name}</h2>
                            <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-tech)', color: 'var(--color-red)', marginBottom: '40px' }}>
                                {quickViewProduct.price}
                            </div>

                            <p style={{ lineHeight: 1.8, color: '#aaa', marginBottom: '40px' }}>{quickViewProduct.description}</p>

                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-tech)', color: '#666', marginBottom: '10px' }}>SELECT SIZE</div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {(() => {
                                        // Dynamic Logic: If product has 'OS' or is strictly one size that is OS, treat as One Size
                                        const isOneSize = quickViewProduct.sizes.length === 1 && quickViewProduct.sizes[0] === 'OS';
                                        const sizesToRender = isOneSize ? ['OS'] : APP_SIZES;

                                        return sizesToRender.map(size => {
                                            const isAvailable = quickViewProduct.sizes.includes(size);
                                            const isSelected = modalSelectedSize === size;

                                            return (
                                                <button key={size}
                                                    disabled={!isAvailable}
                                                    onClick={() => isAvailable && setModalSelectedSize(size)}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        background: isSelected ? '#fff' : 'transparent',
                                                        border: `1px solid ${isSelected ? '#fff' : (isAvailable ? '#444' : '#222')}`,
                                                        color: isSelected ? '#000' : (isAvailable ? '#fff' : '#444'),
                                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                        fontFamily: 'var(--font-tech)',
                                                        textDecoration: isAvailable ? 'none' : 'line-through',
                                                        opacity: isAvailable ? 1 : 0.5,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.2s',
                                                        fontWeight: isSelected ? 'bold' : 'normal',
                                                        boxShadow: isSelected ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                                                    }}
                                                    onMouseEnter={e => isAvailable && !isSelected && (e.target.style.borderColor = "#fff")}
                                                    onMouseLeave={e => isAvailable && !isSelected && (e.target.style.borderColor = "#444")}>
                                                    {size}
                                                </button>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>

                            {/* ANIMATED CART BUTTON */}
                            <div style={{ marginTop: 'auto', position: 'relative', height: '60px', overflow: 'hidden' }}>
                                {cartAnimation === 'IDLE' && (
                                    <button
                                        onClick={() => {
                                            if (!modalSelectedSize) {
                                                // Shake animation or alert here
                                                alert('LÜTFEN BEDEN SEÇİNİZ // PLEASE SELECT A SIZE');
                                                return;
                                            }
                                            addToCart(quickViewProduct, modalSelectedSize);
                                        }}
                                        className="cyber-btn"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'var(--color-red)',
                                            color: '#000',
                                            border: 'none',
                                            fontFamily: 'var(--font-main)',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                                            transition: 'all 0.2s',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px'
                                        }}>
                                        SEPETE EKLE
                                    </button>
                                )}

                                {cartAnimation === 'PLAYING' && (
                                    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                        {/* Package Icon */}
                                        <div className="anim-package">📦</div>

                                        {/* Cart Icon */}
                                        <div className="anim-cart">
                                            🛒
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CART SIDEBAR PANEL */}
            {isCartOpen && (
                <>
                    <div
                        onClick={() => setIsCartOpen(false)}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1099
                        }}
                    ></div>
                    <div style={{
                        position: 'fixed', top: 0, right: 0,
                        width: '400px', maxWidth: '85vw', height: '100%',
                        background: '#050505', borderLeft: '2px solid var(--color-red)',
                        zIndex: 1100, display: 'flex', flexDirection: 'column',
                        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '-10px 0 40px rgba(255, 0, 51, 0.2)'
                    }}>
                        {/* Cart Header */}
                        <div style={{ padding: '30px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px' }}>MY_LOOT // SEPET</h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {/* Cart Items */}
                        {/* Cart Items OR Checkout Form */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {showCheckout ? (
                                <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'var(--font-tech)', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                        LÜTFEN BİLGİLERİ EKSİKSİZ GİRİNİZ // FILL DETAILS
                                    </div>

                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="AD SOYAD // FULL NAME *"
                                            value={checkoutForm.name}
                                            onChange={handleCheckoutChange}
                                            onBlur={handleBlur}
                                            required
                                            style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: errors.name ? '1px solid #ff0033' : '1px solid #444',
                                                color: 'white', padding: '12px',
                                                fontFamily: 'var(--font-tech)', outline: 'none', borderRadius: '4px',
                                                width: '100%',
                                                transition: 'border-color 0.3s'
                                            }}
                                        />
                                        {errors.name && (
                                            <div style={{
                                                color: '#ff0033', fontSize: '0.75rem', marginTop: '5px',
                                                fontFamily: 'var(--font-tech)', display: 'flex', alignItems: 'center', gap: '5px'
                                            }}>
                                                <span>⚠</span> {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    {/* HONEYPOT FIELD (Hidden from humans, visible to bots) */}
                                    <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                                        <input
                                            type="text"
                                            name="_gotcha"
                                            tabIndex="-1"
                                            value={checkoutForm._gotcha || ''}
                                            onChange={handleCheckoutChange}
                                            autoComplete="off"
                                        />
                                        <label htmlFor="_gotcha">Do not fill this field</label>
                                    </div>

                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="TELEFON // PHONE *"
                                            value={checkoutForm.phone}
                                            onChange={handleCheckoutChange}
                                            onBlur={handleBlur}
                                            required
                                            style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: errors.phone ? '1px solid #ff0033' : '1px solid #444',
                                                color: 'white', padding: '12px',
                                                fontFamily: 'var(--font-tech)', outline: 'none', borderRadius: '4px',
                                                width: '100%',
                                                transition: 'border-color 0.3s'
                                            }}
                                        />
                                        {errors.phone && (
                                            <div style={{
                                                color: '#ff0033', fontSize: '0.75rem', marginTop: '5px',
                                                fontFamily: 'var(--font-tech)', display: 'flex', alignItems: 'center', gap: '5px'
                                            }}>
                                                <span>⚠</span> {errors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="EMAIL ADRESİ"
                                            value={checkoutForm.email}
                                            onChange={handleCheckoutChange}
                                            onBlur={handleBlur}
                                            style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: errors.email ? '1px solid #ff0033' : '1px solid #444',
                                                color: 'white', padding: '12px',
                                                fontFamily: 'var(--font-tech)', outline: 'none', borderRadius: '4px',
                                                width: '100%',
                                                transition: 'border-color 0.3s'
                                            }}
                                        />
                                        {errors.email && (
                                            <div style={{
                                                color: '#ff0033', fontSize: '0.75rem', marginTop: '5px',
                                                fontFamily: 'var(--font-tech)', display: 'flex', alignItems: 'center', gap: '5px'
                                            }}>
                                                <span>⚠</span> {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ position: 'relative' }}>
                                        <textarea
                                            name="address"
                                            placeholder="TESLİMAT ADRESİ // FULL ADDRESS *"
                                            value={checkoutForm.address}
                                            onChange={handleCheckoutChange}
                                            onBlur={handleBlur}
                                            required
                                            rows="3"
                                            style={{
                                                background: 'rgba(0,0,0,0.5)',
                                                border: errors.address ? '1px solid #ff0033' : '1px solid #444',
                                                color: 'white', padding: '12px',
                                                fontFamily: 'var(--font-tech)', outline: 'none', borderRadius: '4px', resize: 'vertical',
                                                width: '100%',
                                                transition: 'border-color 0.3s'
                                            }}
                                        />
                                        {errors.address && (
                                            <div style={{
                                                color: '#ff0033', fontSize: '0.75rem', marginTop: '5px',
                                                fontFamily: 'var(--font-tech)', display: 'flex', alignItems: 'center', gap: '5px'
                                            }}>
                                                <span>⚠</span> {errors.address}
                                            </div>
                                        )}
                                    </div>

                                    <textarea
                                        name="notes"
                                        placeholder="SİPARİŞ NOTU (Beden detayları vb.)"
                                        value={checkoutForm.notes}
                                        onChange={handleCheckoutChange}
                                        rows="2"
                                        style={{
                                            background: 'rgba(0,0,0,0.5)', border: '1px solid #444', color: 'white', padding: '12px',
                                            fontFamily: 'var(--font-tech)', outline: 'none', borderRadius: '4px', resize: 'vertical',
                                            width: '100%',
                                            transition: 'border-color 0.3s'
                                        }}
                                    />

                                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '10px' }}>
                                        * İşaretli alanlar zorunludur. Siparişiniz WhatsApp üzerinden onaylanacaktır.
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {cartItems.length === 0 ? (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ fontSize: '3rem', opacity: 0.3 }}>∅</div>
                                            <div>NO_UNITS_ACQUIRED</div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {cartItems.map(item => (
                                                <div key={item.cartId} style={{ display: 'flex', gap: '15px', background: '#0a0a0a', padding: '10px', border: '1px solid #222' }}>
                                                    <div style={{ width: '60px', height: '60px', background: '#000' }}>
                                                        <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: 'var(--font-tech)' }}>SIZE: <span style={{ color: '#fff' }}>{item.size}</span></div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                                        <div style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', color: 'var(--color-red)' }}>{item.price}</div>
                                                        <button
                                                            onClick={() => removeFromCart(item.cartId)}
                                                            style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.8rem' }}
                                                            onMouseEnter={e => e.target.style.color = 'red'}
                                                            onMouseLeave={e => e.target.style.color = '#444'}
                                                        >
                                                            REMOVE
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Cart Footer */}
                        <div style={{ padding: '30px', borderTop: '1px solid #222', background: '#080808', position: 'relative', zIndex: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'var(--font-tech)', fontSize: '1.2rem' }}>
                                <span>TOTAL:</span>
                                <span style={{ color: 'var(--color-red)' }}>{totalPrice.toLocaleString('tr-TR')} TL</span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (showCheckout) {
                                        // Form validasyonu için manuel kontrol gerekebilir, ancak şimdilik mevcut mantığı koruyoruz
                                        const syntheticEvent = { preventDefault: () => { } };
                                        handleOrderSubmit(syntheticEvent);
                                    } else {
                                        if (cartItems.length > 0) setShowCheckout(true);
                                    }
                                }}
                                className="cyber-btn"
                                style={{
                                    width: '100%', padding: '15px',
                                    background: showCheckout ? '#39ff14' : '#fff',
                                    color: '#000', border: 'none',
                                    fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
                                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                                    opacity: (!showCheckout && cartItems.length === 0) ? 0.5 : 1,
                                    pointerEvents: (!showCheckout && cartItems.length === 0) ? 'none' : 'auto'
                                }}>
                                {showCheckout ? 'SİPARİŞİ TAMAMLA // COMPLETE ORDER' : 'CHECKOUT // ÖDEME'}
                            </button>
                            {showCheckout && (
                                <button
                                    onClick={() => setShowCheckout(false)}
                                    style={{
                                        marginTop: '10px', width: '100%', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem'
                                    }}>
                                    &lt; GERİ DÖN
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .cart-toggle-btn:hover {
                    background: rgba(255, 0, 51, 0.1) !important;
                    box-shadow: 0 0 15px rgba(255, 0, 51, 0.3);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes scanline {
                    0% { top: -20%; opacity: 0; }
                    100% { top: 120%; opacity: 0; }
                }
                @keyframes hologram-flicker {
                    0%, 100% { opacity: 0.9; text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff; }
                    50% { opacity: 0.5; text-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff; }
                    52% { opacity: 0.1; text-shadow: none; }
                    54% { opacity: 0.9; text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff; }
                    70% { transform: rotate(-5deg) skewX(2deg); }
                    72% { transform: rotate(-5deg) skewX(-2deg); }
                    74% { transform: rotate(-5deg) skewX(0); }
                }

                /* Cart Animation Keyframes */
                .anim-package {
                    position: absolute;
                    font-size: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: dropPackage 0.6s cubic-bezier(0.5, 0, 0.75, 0) forwards;
                    z-index: 10;
                }

                .anim-cart {
                    font-size: 3rem;
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    animation: cartSlide 1.5s ease-in-out forwards 0.6s; /* Starts after package drop */
                }

                @keyframes dropPackage {
                    0% { top: -50px; opacity: 0; transform: translateX(-50%) rotate(0deg); }
                    60% { top: 10px; opacity: 1; transform: translateX(-50%) rotate(10deg); }
                    80% { top: 15px; transform: translateX(-50%) rotate(-5deg); }
                    100% { top: 20px; opacity: 0; transform: translateX(-50%) scale(0.5); } /* Disappear into cart */
                }

                @keyframes cartSlide {
                    0% { left: 50%; transform: translateX(-50%) scale(1); }
                    20% { left: 50%; transform: translateX(-50%) scale(1.2) rotate(-5deg); filter: blur(0px); } /* Catch impact */
                    40% { left: 50%; transform: translateX(-50%) scale(1) rotate(5deg); } /* Recover */
                    100% { left: -100px; transform: translateX(-100px) skewX(-20deg); opacity: 0; filter: blur(5px); } /* Zoom out left */
                }
                
                .cyber-btn:hover {
                    box-shadow: 0 0 20px var(--color-red);
                    text-shadow: 0 0 5px white;
                }
            `}</style>
        </div>
    );
};

export default ShopPage;
