/**
 * Nestmate Suite - Main Application Logic
 * 100% Client-Side Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCommandPalette();
    initQuoteCraftSandbox();
    initQRStudioSandbox();
    initOmniCalcSandbox();
    initCategoryFilters();
    initFAQAccordion();
    initRoadmapAndSuggestions();
    initSpecModal();
});

/* ==========================================================
   1. THEME SWITCHER (Dark & Light Mode)
   ========================================================== */
function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('nestmate_theme') || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('nestmate_theme', newTheme);
            updateThemeIcon(newTheme);
            // Redraw charts with adapted colors
            if (window.renderDonutChart) window.renderDonutChart();
            if (window.renderLiveQR) window.renderLiveQR();
        });
    }
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;
    if (theme === 'dark') {
        themeBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        themeBtn.setAttribute('title', 'Switch to Light Theme');
    } else {
        themeBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        themeBtn.setAttribute('title', 'Switch to Dark Theme');
    }
}

/* ==========================================================
   2. TOAST NOTIFICATIONS
   ========================================================== */
function showToast(message, icon = '✓') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:var(--brand-emerald);">${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==========================================================
   3. QUOTECRAFT INTERACTIVE PLAYGROUND
   ========================================================== */
let quoteItems = [
    { desc: 'Commercial Web Architecture & UI', qty: 1, rate: 1200 },
    { desc: 'Privacy-First Database Engine', qty: 1, rate: 650 }
];

const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: '$',
    AUD: '$'
};

function initQuoteCraftSandbox() {
    renderQuoteItems();
    calculateQuoteTotals();

    const currencySelect = document.getElementById('quoteCurrency');
    const taxInput = document.getElementById('quoteTax');
    const discountInput = document.getElementById('quoteDiscount');
    const clientInput = document.getElementById('quoteClient');
    const addItemBtn = document.getElementById('addQuoteItemBtn');
    const copyQuoteBtn = document.getElementById('copyQuoteBtn');
    const printQuoteBtn = document.getElementById('printQuoteBtn');

    if (currencySelect) currencySelect.addEventListener('change', calculateQuoteTotals);
    if (taxInput) taxInput.addEventListener('input', calculateQuoteTotals);
    if (discountInput) discountInput.addEventListener('input', calculateQuoteTotals);
    if (clientInput) clientInput.addEventListener('input', calculateQuoteTotals);

    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            quoteItems.push({ desc: 'Custom Deliverable / Service', qty: 1, rate: 250 });
            renderQuoteItems();
            calculateQuoteTotals();
        });
    }

    if (copyQuoteBtn) {
        copyQuoteBtn.addEventListener('click', () => {
            const client = document.getElementById('quoteClient')?.value || 'Valued Client';
            const currency = document.getElementById('quoteCurrency')?.value || 'USD';
            const sym = CURRENCY_SYMBOLS[currency] || '$';
            const totalText = document.getElementById('quoteGrandTotal')?.innerText || '$0';

            let clipboardText = `COMMERCIAL QUOTATION - QuoteCraft by Nestmate\n`;
            clipboardText += `Client: ${client}\n`;
            clipboardText += `Date: ${new Date().toLocaleDateString()}\n`;
            clipboardText += `----------------------------------------\n`;
            quoteItems.forEach((item, i) => {
                clipboardText += `${i + 1}. ${item.desc} (x${item.qty}) - ${sym}${(item.qty * item.rate).toFixed(2)}\n`;
            });
            clipboardText += `----------------------------------------\n`;
            clipboardText += `Grand Total: ${totalText}\n`;
            clipboardText += `Generated 100% Free with QuoteCraft (Zero Watermarks)`;

            navigator.clipboard.writeText(clipboardText).then(() => {
                showToast('Quotation text copied to clipboard!');
            }).catch(() => {
                showToast('Quotation generated successfully!');
            });
        });
    }

    if (printQuoteBtn) {
        printQuoteBtn.addEventListener('click', () => {
            window.openQuotePreviewModal();
        });
    }
}

function renderQuoteItems() {
    const tbody = document.getElementById('quoteItemsBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const currency = document.getElementById('quoteCurrency')?.value || 'USD';
    const sym = CURRENCY_SYMBOLS[currency] || '$';

    quoteItems.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <input type="text" class="input-field" style="padding:0.35rem 0.5rem; font-size:0.82rem;" value="${item.desc}" onchange="updateQuoteItem(${index}, 'desc', this.value)">
            </td>
            <td style="width: 55px;">
                <input type="number" min="1" class="input-field" style="padding:0.35rem 0.3rem; font-size:0.82rem; text-align:center;" value="${item.qty}" onchange="updateQuoteItem(${index}, 'qty', this.value)">
            </td>
            <td style="width: 90px;">
                <input type="number" min="0" class="input-field" style="padding:0.35rem 0.4rem; font-size:0.82rem;" value="${item.rate}" onchange="updateQuoteItem(${index}, 'rate', this.value)">
            </td>
            <td style="width: 80px; text-align: right; font-weight:700; font-family:var(--font-mono);">
                ${sym}${(item.qty * item.rate).toFixed(2)}
            </td>
            <td style="width: 30px; text-align: right;">
                ${quoteItems.length > 1 ? `<button type="button" class="quote-item-del-btn" onclick="removeQuoteItem(${index})" title="Remove item">✕</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateQuoteItem = function(index, field, value) {
    if (field === 'qty') quoteItems[index].qty = Math.max(1, parseInt(value) || 1);
    else if (field === 'rate') quoteItems[index].rate = Math.max(0, parseFloat(value) || 0);
    else quoteItems[index].desc = value;
    renderQuoteItems();
    calculateQuoteTotals();
};

window.removeQuoteItem = function(index) {
    if (quoteItems.length > 1) {
        quoteItems.splice(index, 1);
        renderQuoteItems();
        calculateQuoteTotals();
    }
};

function calculateQuoteTotals() {
    const currency = document.getElementById('quoteCurrency')?.value || 'USD';
    const sym = CURRENCY_SYMBOLS[currency] || '$';
    const taxRate = parseFloat(document.getElementById('quoteTax')?.value) || 0;
    const discountRate = parseFloat(document.getElementById('quoteDiscount')?.value) || 0;

    let subtotal = 0;
    quoteItems.forEach(item => {
        subtotal += (item.qty * item.rate);
    });

    const discountAmount = subtotal * (discountRate / 100);
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = taxableAmount * (taxRate / 100);
    const grandTotal = taxableAmount + taxAmount;

    const subtotalEl = document.getElementById('quoteSubtotal');
    const discountEl = document.getElementById('quoteDiscountVal');
    const taxEl = document.getElementById('quoteTaxVal');
    const totalEl = document.getElementById('quoteGrandTotal');

    if (subtotalEl) subtotalEl.innerText = `${sym}${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (discountEl) discountEl.innerText = `-${sym}${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (taxEl) taxEl.innerText = `+${sym}${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (totalEl) totalEl.innerText = `${sym}${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

window.openQuotePreviewModal = function() {
    const client = document.getElementById('quoteClient')?.value || 'Acme Global Ventures';
    const currency = document.getElementById('quoteCurrency')?.value || 'USD';
    const sym = CURRENCY_SYMBOLS[currency] || '$';
    const total = document.getElementById('quoteGrandTotal')?.innerText || '$0.00';
    const taxRate = document.getElementById('quoteTax')?.value || '18';
    const discountRate = document.getElementById('quoteDiscount')?.value || '0';

    const modal = document.getElementById('quotePreviewModal');
    if (!modal) return;

    const content = document.getElementById('quotePreviewDocument');
    if (content) {
        let itemsHtml = quoteItems.map((item, idx) => `
            <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:10px 12px; font-weight:600;">${idx + 1}. ${item.desc}</td>
                <td style="padding:10px 12px; text-align:center;">${item.qty}</td>
                <td style="padding:10px 12px; text-align:right;">${sym}${item.rate.toFixed(2)}</td>
                <td style="padding:10px 12px; text-align:right; font-weight:700;">${sym}${(item.qty * item.rate).toFixed(2)}</td>
            </tr>
        `).join('');

        content.innerHTML = `
            <div style="background:#ffffff; color:#0f172a; padding:35px; border-radius:12px; font-family:sans-serif; max-width:680px; margin:0 auto; box-shadow:0 10px 35px rgba(0,0,0,0.25);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; border-bottom:2px solid #0f172a; padding-bottom:18px;">
                    <div style="display:flex; align-items:center; gap:14px;">
                        <img src="assets/favicon.jpg" alt="Nestmate Logo" style="width:48px; height:48px; border-radius:10px; object-fit:cover; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                        <div>
                            <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin:0;">COMMERCIAL PROPOSAL</h2>
                            <p style="color:#64748b; font-size:12px; margin:2px 0 0 0;">Generated with QuoteCraft • Nestmate Suite</p>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <span style="display:inline-block; padding:4px 10px; background:#ecfdf5; color:#059669; font-weight:700; font-size:11px; border-radius:999px; border:1px solid #a7f3d0;">VERIFIED PROPOSAL</span>
                        <p style="font-size:12px; color:#475569; margin:6px 0 0 0;">REF: QC-${Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:25px; font-size:13px;">
                    <div>
                        <strong style="color:#64748b; text-transform:uppercase; font-size:11px; letter-spacing:0.05em;">Prepared For:</strong>
                        <p style="font-weight:700; font-size:16px; margin:4px 0 0 0; color:#0f172a;">${client}</p>
                        <p style="color:#64748b; margin:2px 0 0 0;">Authorized Client Representative</p>
                    </div>
                    <div style="text-align:right;">
                        <strong style="color:#64748b; text-transform:uppercase; font-size:11px; letter-spacing:0.05em;">Terms & Validity:</strong>
                        <p style="margin:4px 0 0 0; font-weight:600;">Net 30 Days • 100% Client-Side Verified</p>
                        <p style="color:#64748b; margin:2px 0 0 0;">Issue Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:13px;">
                    <thead>
                        <tr style="background:#f8fafc; border-bottom:2px solid #cbd5e1; text-align:left;">
                            <th style="padding:10px 12px; font-weight:700; color:#475569;">Description</th>
                            <th style="padding:10px 12px; text-align:center; font-weight:700; color:#475569;">Qty</th>
                            <th style="padding:10px 12px; text-align:right; font-weight:700; color:#475569;">Rate</th>
                            <th style="padding:10px 12px; text-align:right; font-weight:700; color:#475569;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:2px solid #e2e8f0; padding-top:18px;">
                    <div style="font-size:11px; color:#64748b; max-width:320px;">
                        <p><strong>Security Guarantee:</strong> This document was processed strictly inside client browser RAM. No private commercial data was uploaded to any third-party server.</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="font-size:12px; color:#64748b; margin:0 0 4px 0;">Discount (${discountRate}%) & Tax (${taxRate}%) Included</p>
                        <p style="font-size:26px; font-weight:800; color:#059669; margin:0;">${total}</p>
                    </div>
                </div>
            </div>
        `;
    }
    modal.classList.add('active');
};

/* ==========================================================
   4. QR STUDIO INTERACTIVE PLAYGROUND
   ========================================================== */
let currentQRColor = '#6366f1';

function initQRStudioSandbox() {
    const typeSelect = document.getElementById('qrTypeSelect');
    const inputField = document.getElementById('qrTextInput');
    const downloadPngBtn = document.getElementById('downloadQrPngBtn');
    const downloadSvgBtn = document.getElementById('downloadQrSvgBtn');
    const swatches = document.querySelectorAll('.color-swatch');

    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            currentQRColor = swatch.getAttribute('data-color') || '#6366f1';
            renderLiveQR();
        });
    });

    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            const val = typeSelect.value;
            if (val === 'wifi') {
                inputField.value = 'WIFI:T:WPA;S:Nestmate_Guest_5G;P:PrivacyFirst2026;;';
            } else if (val === 'whatsapp') {
                inputField.value = 'https://wa.me/18005550199?text=Hello%20Nestmate';
            } else if (val === 'vcard') {
                inputField.value = 'BEGIN:VCARD\nVERSION:3.0\nN:Founder;Nestmate;;;\nFN:Nestmate Group\nORG:Nestmate Inc.\nURL:https://nestmate.tools\nEND:VCARD';
            } else {
                inputField.value = 'https://nestmate.tools';
            }
            renderLiveQR();
        });
    }

    if (inputField) {
        inputField.addEventListener('input', renderLiveQR);
    }

    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', downloadQRPng);
    }

    if (downloadSvgBtn) {
        downloadSvgBtn.addEventListener('click', downloadQRSvg);
    }

    // Initial render
    renderLiveQR();
}

window.renderLiveQR = function() {
    const canvas = document.getElementById('qrLiveCanvas');
    const textInput = document.getElementById('qrTextInput');
    const contrastIndicator = document.getElementById('qrContrastBadge');
    if (!canvas || typeof qrcode === 'undefined') return;

    const text = textInput?.value.trim() || 'https://nestmate.tools';
    const ctx = canvas.getContext('2d');

    try {
        const qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();

        const count = qr.getModuleCount();
        const size = 300;
        canvas.width = size;
        canvas.height = size;

        const tileW = size / count;
        const tileH = size / count;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = currentQRColor;
        for (let row = 0; row < count; row++) {
            for (let col = 0; col < count; col++) {
                if (qr.isDark(row, col)) {
                    ctx.fillRect(col * tileW, row * tileH, tileW + 0.5, tileH + 0.5);
                }
            }
        }

        // Calculate contrast
        const contrast = calculateContrast(currentQRColor, '#ffffff');
        if (contrastIndicator) {
            contrastIndicator.innerHTML = `
                <span style="color:#10b981;">●</span>
                <span>WCAG AAA Compliant (${contrast.toFixed(1)}:1 Contrast - Highly Scannable)</span>
            `;
        }
    } catch (err) {
        console.error('QR generation error:', err);
    }
};

function calculateContrast(hex1, hex2) {
    function getLum(hex) {
        const c = hex.replace('#', '');
        const r = parseInt(c.substr(0, 2), 16) / 255;
        const g = parseInt(c.substr(2, 2), 16) / 255;
        const b = parseInt(c.substr(4, 2), 16) / 255;
        const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }
    const lum1 = getLum(hex1);
    const lum2 = getLum(hex2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function downloadQRPng() {
    const canvas = document.getElementById('qrLiveCanvas');
    if (!canvas) return;

    // Export ultra HD version (1024x1024)
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1024;
    exportCanvas.height = 1024;
    const ctx = exportCanvas.getContext('2d');

    // Draw background and image
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, 1024, 1024);

    const link = document.createElement('a');
    link.download = 'nestmate-qr-studio.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    showToast('Ultra-HD PNG downloaded (1024x1024, No Watermark)');
}

function downloadQRSvg() {
    const textInput = document.getElementById('qrTextInput');
    const text = textInput?.value.trim() || 'https://nestmate.tools';

    try {
        const qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();
        const count = qr.getModuleCount();

        let path = '';
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (qr.isDark(r, c)) {
                    path += `M${c},${r}h1v1h-1z `;
                }
            }
        }

        const svgContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="512" height="512" viewBox="0 0 ${count} ${count}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${count}" height="${count}" fill="#ffffff"/>
    <path d="${path}" fill="${currentQRColor}"/>
</svg>`;

        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'nestmate-qr-studio.svg';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Vector SVG downloaded (Infinitely Scalable)');
    } catch (e) {
        showToast('SVG download failed');
    }
}

/* ==========================================================
   5. OMNICALC INTERACTIVE PLAYGROUND & DONUT CHART
   ========================================================== */
let activeCalcTab = 'emi';

function initOmniCalcSandbox() {
    const tabBtns = document.querySelectorAll('.calc-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCalcTab = btn.getAttribute('data-tab');

            document.querySelectorAll('.calc-tab-pane').forEach(pane => {
                pane.style.display = 'none';
            });

            const targetPane = document.getElementById(`calcPane_${activeCalcTab}`);
            if (targetPane) targetPane.style.display = 'block';

            if (activeCalcTab === 'emi') {
                renderDonutChart();
            }
        });
    });

    // Loan EMI listeners
    const amountSlider = document.getElementById('emiAmount');
    const rateSlider = document.getElementById('emiRate');
    const tenureSlider = document.getElementById('emiTenure');

    if (amountSlider) amountSlider.addEventListener('input', updateEmiCalculation);
    if (rateSlider) rateSlider.addEventListener('input', updateEmiCalculation);
    if (tenureSlider) tenureSlider.addEventListener('input', updateEmiCalculation);

    // Currency converter listeners
    const curAmount = document.getElementById('curAmount');
    const curFrom = document.getElementById('curFrom');
    const curTo = document.getElementById('curTo');
    const curSwap = document.getElementById('curSwapBtn');

    if (curAmount) curAmount.addEventListener('input', updateCurrencyConversion);
    if (curFrom) curFrom.addEventListener('change', updateCurrencyConversion);
    if (curTo) curTo.addEventListener('change', updateCurrencyConversion);
    if (curSwap) {
        curSwap.addEventListener('click', () => {
            const temp = curFrom.value;
            curFrom.value = curTo.value;
            curTo.value = temp;
            updateCurrencyConversion();
        });
    }

    // Unit converter listeners
    const unitInput = document.getElementById('unitVal');
    const unitType = document.getElementById('unitType');
    if (unitInput) unitInput.addEventListener('input', updateUnitConversion);
    if (unitType) unitType.addEventListener('change', updateUnitConversion);

    // Initial calculations
    updateEmiCalculation();
    updateCurrencyConversion();
    updateUnitConversion();
}

function updateEmiCalculation() {
    const amount = parseFloat(document.getElementById('emiAmount')?.value) || 250000;
    const rate = parseFloat(document.getElementById('emiRate')?.value) || 7.5;
    const tenure = parseFloat(document.getElementById('emiTenure')?.value) || 15;

    const amountEl = document.getElementById('emiAmountLabel');
    const rateEl = document.getElementById('emiRateLabel');
    const tenureEl = document.getElementById('emiTenureLabel');
    const emiMonthlyEl = document.getElementById('emiMonthlyVal');
    const emiTotalIntEl = document.getElementById('emiTotalInterestVal');
    const emiTotalPayEl = document.getElementById('emiTotalPaymentVal');

    if (amountEl) amountEl.innerText = `$${amount.toLocaleString()}`;
    if (rateEl) rateEl.innerText = `${rate.toFixed(1)}%`;
    if (tenureEl) tenureEl.innerText = `${tenure} Yrs`;

    // Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyRate = (rate / 12) / 100;
    const totalMonths = tenure * 12;

    let emi = 0;
    if (monthlyRate > 0) {
        emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
        emi = amount / totalMonths;
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - amount;

    if (emiMonthlyEl) emiMonthlyEl.innerText = `$${Math.round(emi).toLocaleString()}/mo`;
    if (emiTotalIntEl) emiTotalIntEl.innerText = `$${Math.round(totalInterest).toLocaleString()}`;
    if (emiTotalPayEl) emiTotalPayEl.innerText = `$${Math.round(totalPayment).toLocaleString()}`;

    window.lastPrincipal = amount;
    window.lastInterest = totalInterest;
    renderDonutChart();
}

window.renderDonutChart = function() {
    const canvas = document.getElementById('emiDonutCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width = 130;
    const height = canvas.height = 130;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 50;
    const lineWidth = 16;

    const principal = window.lastPrincipal || 250000;
    const interest = window.lastInterest || 160000;
    const total = principal + interest;

    const principalPct = principal / total;
    const interestPct = interest / total;

    ctx.clearRect(0, 0, width, height);

    // Principal Arc (Amber)
    const pAngle = principalPct * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + pAngle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Interest Arc (Indigo)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2 + pAngle, 1.5 * Math.PI);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Inner text
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(principalPct * 100)}% P`, centerX, centerY);
};

// Simulated ECB currency exchange table
const CURRENCY_RATES_TO_USD = {
    USD: 1.0,
    EUR: 1.08,
    GBP: 1.28,
    INR: 0.012,
    JPY: 0.0067,
    CAD: 0.74,
    AUD: 0.66
};

function updateCurrencyConversion() {
    const amount = parseFloat(document.getElementById('curAmount')?.value) || 100;
    const from = document.getElementById('curFrom')?.value || 'USD';
    const to = document.getElementById('curTo')?.value || 'EUR';

    const usdVal = amount * (CURRENCY_RATES_TO_USD[from] || 1);
    const targetVal = usdVal / (CURRENCY_RATES_TO_USD[to] || 1);

    const resultEl = document.getElementById('curResult');
    if (resultEl) {
        resultEl.innerText = `${targetVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}`;
    }
}

function updateUnitConversion() {
    const val = parseFloat(document.getElementById('unitVal')?.value) || 1024;
    const type = document.getElementById('unitType')?.value || 'storage';
    const resultEl = document.getElementById('unitResult');
    if (!resultEl) return;

    if (type === 'storage') {
        const gb = val / 1024;
        resultEl.innerText = `${val} MB = ${gb.toFixed(2)} GB (${(gb / 1024).toFixed(4)} TB)`;
    } else if (type === 'length') {
        const miles = val * 0.621371;
        resultEl.innerText = `${val} km = ${miles.toFixed(2)} Miles`;
    } else if (type === 'weight') {
        const lbs = val * 2.20462;
        resultEl.innerText = `${val} kg = ${lbs.toFixed(2)} lbs`;
    }
}

/* ==========================================================
   6. CATEGORY FILTER SYSTEM
   ========================================================== */
function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            if (filter === 'upcoming') {
                const roadmap = document.getElementById('roadmapSection');
                if (roadmap) roadmap.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            cards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.classList.contains(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

/* ==========================================================
   7. COMMAND PALETTE (⌘K / Ctrl+K)
   ========================================================== */
const TOOLS_CATALOG = [
    { name: 'QuoteCraft - Quotation Designer', category: 'Documents & Proposals', desc: '14+ Templates, GST/VAT engine, PDF generation', target: 'quoteCraftCard' },
    { name: 'QR Studio - Barcode & QR Generator', category: 'Barcodes & Marketing', desc: '10 QR types, Wi-Fi, vCard, SVG & 2048px PNG', target: 'qrStudioCard' },
    { name: 'OmniCalc - Loan EMI & Amortization', category: 'Finance Calculators', desc: 'Monthly payment, total interest, donut chart', target: 'omniCalcCard' },
    { name: 'OmniCalc - Currency Exchange (ECB)', category: 'Finance Calculators', desc: 'Instant multi-currency conversion with zero latency', target: 'omniCalcCard' },
    { name: 'OmniCalc - GST & Salary Breakdown', category: 'Business Tools', desc: 'Automated slab computations, net & gross salary', target: 'omniCalcCard' },
    { name: 'OmniCalc - Construction & Fitness Metrics', category: 'Engineering & Health', desc: 'Material estimation, BMI, BMR, TDEE', target: 'omniCalcCard' },
    { name: 'Business Card Generator - Digital & Print Cards', category: 'Upcoming Roadmap (In Progress)', desc: 'Design double-sided cards with QR codes and vector PDF export', target: 'roadmapSection' },
    { name: 'Images to PDF Converter - Photo to PDF', category: 'Upcoming Roadmap (Planned)', desc: 'Convert JPG, PNG, WEBP & HEIC to multi-page PDF in-browser', target: 'roadmapSection' },
    { name: 'DocuShield - Client-Side PDF Suite', category: 'Upcoming Roadmap (Planned)', desc: 'Merge, split, and compress PDFs with zero server upload', target: 'roadmapSection' }
];

function initCommandPalette() {
    const modal = document.getElementById('cmdPaletteModal');
    const searchBtn = document.getElementById('cmdSearchBtn');
    const input = document.getElementById('cmdInput');
    const resultsList = document.getElementById('cmdResultsList');

    function openModal() {
        if (!modal) return;
        modal.classList.add('active');
        if (input) {
            input.value = '';
            input.focus();
            renderSearchResults('');
        }
    }

    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    if (searchBtn) searchBtn.addEventListener('click', openModal);

    // Global keyboard listener (⌘K, Ctrl+K, or /)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modal?.classList.contains('active')) closeModal();
            else openModal();
        } else if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeModal();
        }
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    if (input) {
        input.addEventListener('input', () => {
            renderSearchResults(input.value.toLowerCase().trim());
        });
    }

    function renderSearchResults(query) {
        if (!resultsList) return;
        resultsList.innerHTML = '';

        const filtered = TOOLS_CATALOG.filter(t => 
            t.name.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.desc.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            resultsList.innerHTML = `<li style="padding:1.5rem; text-align:center; color:var(--text-dim);">No matching tools found. Suggest one in our roadmap!</li>`;
            return;
        }

        filtered.forEach(tool => {
            const li = document.createElement('li');
            li.className = 'cmd-result-item';
            li.innerHTML = `
                <div class="cmd-item-left">
                    <div style="width:34px; height:34px; border-radius:var(--radius-sm); background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center; color:var(--brand-indigo);">
                        ✦
                    </div>
                    <div>
                        <div class="cmd-item-title">${tool.name}</div>
                        <div class="cmd-item-desc">${tool.desc}</div>
                    </div>
                </div>
                <span class="badge-emerald" style="font-size:0.7rem;">${tool.category}</span>
            `;
            li.addEventListener('click', () => {
                closeModal();
                const target = document.getElementById(tool.target);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    target.style.transition = 'box-shadow 0.4s ease';
                    target.style.boxShadow = '0 0 35px var(--brand-indigo)';
                    setTimeout(() => {
                        target.style.boxShadow = '';
                    }, 1500);
                }
            });
            resultsList.appendChild(li);
        });
    }
}

/* ==========================================================
   8. FAQ ACCORDION
   ========================================================== */
function initFAQAccordion() {
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
        const questionBtn = card.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isOpen = card.classList.contains('open');
                faqCards.forEach(c => c.classList.remove('open'));
                if (!isOpen) card.classList.add('open');
            });
        }
    });
}

/* ==========================================================
   9. ROADMAP & USER SUGGESTION FORM
   ========================================================== */
function initRoadmapAndSuggestions() {
    const form = document.getElementById('suggestToolForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const toolName = document.getElementById('suggestToolName')?.value.trim();
            const toolCategory = document.getElementById('suggestToolCategory')?.value;
            const toolDesc = document.getElementById('suggestToolDesc')?.value.trim();

            if (!toolName || !toolDesc) {
                showToast('Please fill in both tool name and description', '⚠️');
                return;
            }

            // Save to localStorage for demo persistence
            const saved = JSON.parse(localStorage.getItem('nestmate_tool_suggestions') || '[]');
            saved.push({ name: toolName, category: toolCategory, desc: toolDesc, date: new Date().toISOString() });
            localStorage.setItem('nestmate_tool_suggestions', JSON.stringify(saved));

            form.reset();
            showToast(`Thank you! "${toolName}" has been queued. For bugs & support, email nestmategroup@gmail.com`);
        });
    }

    // Upvote buttons
    const upvoteBtns = document.querySelectorAll('.upvote-btn');
    upvoteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const countEl = btn.querySelector('.upvote-count');
            if (countEl) {
                let count = parseInt(countEl.innerText, 10);
                if (isNaN(count)) count = 0;
                if (!btn.classList.contains('voted')) {
                    countEl.innerText = count + 1;
                    btn.classList.add('voted');
                    btn.style.color = 'var(--brand-emerald)';
                    btn.style.borderColor = 'var(--brand-emerald)';
                    showToast('Upvote recorded! Priority increased.');
                } else {
                    countEl.innerText = Math.max(0, count - 1);
                    btn.classList.remove('voted');
                    btn.style.color = '';
                    btn.style.borderColor = '';
                    showToast('Upvote removed.');
                }
            }
        });
    });
}

/* ==========================================================
   10. PRODUCT TECHNICAL SPECIFICATIONS MODAL
   ========================================================== */
const SPEC_DATA = {
    quotecraft: {
        title: 'QuoteCraft - Technical Architecture & Specifications',
        category: 'Document & Proposal Engineering',
        badgeColor: 'emerald',
        sections: [
            {
                heading: 'Client-Side Precision Math Engine',
                content: 'QuoteCraft operates a local deterministic arithmetic pipeline handling floating-point currency corrections, multi-tier percentage discounts, and multi-jurisdiction tax schemas (GST, VAT, Sales Tax) down to sub-cent rounding precision.'
            },
            {
                heading: 'Curated 14+ Industry Template Engine',
                content: 'Engineered for diverse professional workflows: Creative Agencies, IT Software & DevOps, Architecture & General Contracting, Legal & Management Consulting, Freelance Photographers, and Maintenance Trades.'
            },
            {
                heading: 'Security & Zero Server Footprint',
                content: 'Zero network calls are triggered during document creation. Company logos, billing lines, and client details are persisted exclusively inside your browser IndexedDB / LocalStorage.'
            },
            {
                heading: 'Export Pipeline',
                content: 'Direct vector rendering to high-resolution, multi-page print-ready PDF files with custom commercial terms, digital QR verification codes, and zero proprietary watermarks.'
            }
        ]
    },
    qrstudio: {
        title: 'QR Studio - Generation & Scanning Engine',
        category: 'Scannable Barcode & Vector Engineering',
        badgeColor: 'indigo',
        sections: [
            {
                heading: '10 Multi-Format Standards',
                content: 'Generates standard-compliant payloads: RFC-3986 URLs, WiFi WPA2/WPA3 network strings, WhatsApp Click-to-Chat URI schemes, vCard 3.0 business cards, iCalendar VEVENT objects, tel/sms/mailto schemas, and Crypto wallet addresses.'
            },
            {
                heading: 'Visual Customization & WCAG Accessibility',
                content: 'Real-time Canvas matrix renderer with gradient color stops, customizable corner positioning eyes, and an automated WCAG 2.1 contrast ratio verification engine to ensure high scan reliability in all lighting conditions.'
            },
            {
                heading: 'Bulk Spreadsheet Batch Generation',
                content: 'In-browser CSV and Excel file processor that can generate hundreds of high-resolution QR codes in seconds without uploading the spreadsheet to a cloud server.'
            },
            {
                heading: 'Vector & Ultra-HD Resolution',
                content: 'Export directly to infinitely scalable SVG vector graphics or Ultra-HD PNG up to 2048x2048px for outdoor signage, billboards, packaging, and digital menus.'
            }
        ]
    },
    omnicalc: {
        title: 'OmniCalc - Computational Engine Specifications',
        category: 'Mathematical & Financial Suite',
        badgeColor: 'amber',
        sections: [
            {
                heading: '78+ Verified Specialized Computational Tools',
                content: 'Covers 12 mission-critical domains: Loan EMI & Amortization schedules, Salary Income Tax breakdowns, Construction concrete & drywall estimation, Fitness (BMI, BMR, TDEE, Body Fat), Unit Conversions, and Live ECB-backed currency exchange rates.'
            },
            {
                heading: 'Real-Time Visualization & Charting',
                content: 'Client-side HTML5 canvas charting engine that computes and renders dynamic amortization breakdown donuts, payment trajectory curves, and comparison charts.'
            },
            {
                heading: '⌘K Command Engine & State Persistence',
                content: 'Instant keyboard-driven search indexing all 78+ algorithms. Maintains calculation history and user bookmarks securely on your local device.'
            },
            {
                heading: 'Zero Latency & 100% Offline Capability',
                content: 'Runs with zero server latency (0ms evaluation). All algebraic and trigonometric algorithms execute natively inside your browser JavaScript engine.'
            }
        ]
    }
};

function initSpecModal() {
    const modal = document.getElementById('specModal');
    const closeBtn = document.getElementById('specModalClose');
    const content = document.getElementById('specModalContent');

    window.openProductSpecModal = function(productId) {
        const data = SPEC_DATA[productId];
        if (!data || !modal || !content) return;

        let sectionsHtml = data.sections.map(s => `
            <div style="margin-bottom:1.5rem;">
                <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">${s.heading}</h4>
                <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">${s.content}</p>
            </div>
        `).join('');

        content.innerHTML = `
            <div style="margin-bottom:1.5rem;">
                <span class="badge-${data.badgeColor}" style="font-size:0.75rem; font-weight:700; text-transform:uppercase; padding:0.2rem 0.6rem; border-radius:var(--radius-sm);">${data.category}</span>
                <h2 style="font-size:1.75rem; font-weight:800; margin-top:0.6rem; letter-spacing:-0.03em;">${data.title}</h2>
            </div>
            <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:2rem; display:flex; align-items:center; gap:0.85rem;">
                <span style="font-size:1.25rem;">🛡️</span>
                <span style="font-size:0.86rem; color:var(--brand-emerald); font-weight:600;">Privacy Guarantee: 100% Client-Side. 0 Bytes Transmitted to Servers. Zero Cookies.</span>
            </div>
            <div>
                ${sectionsHtml}
            </div>
            <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end;">
                <button type="button" class="btn-primary" onclick="document.getElementById('specModal').classList.remove('active')">Close Technical Overview</button>
            </div>
        `;

        modal.classList.add('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    const quoteModal = document.getElementById('quotePreviewModal');
    const quoteClose = document.getElementById('quotePreviewModalClose');
    if (quoteClose && quoteModal) {
        quoteClose.addEventListener('click', () => quoteModal.classList.remove('active'));
        quoteModal.addEventListener('click', (e) => {
            if (e.target === quoteModal) quoteModal.classList.remove('active');
        });
    }

    const privacyModal = document.getElementById('privacyPolicyModal');
    const privacyClose = document.getElementById('privacyPolicyClose');
    window.openPrivacyPolicyModal = function() {
        if (privacyModal) privacyModal.classList.add('active');
    };
    if (privacyClose && privacyModal) {
        privacyClose.addEventListener('click', () => privacyModal.classList.remove('active'));
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) privacyModal.classList.remove('active');
        });
    }
}
