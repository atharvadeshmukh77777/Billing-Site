/**
 * ============================================================================
 * FreshMart Grocery Store - POS Billing System & Validation Engine
 * File: public/javascript.js
 * Description: Complete Vanilla JavaScript implementation with exposed
 *              validation rules, dynamic product catalog, cart engine,
 *              invoice generator, and responsive UI interactions.
 * ============================================================================
 */

(function (global) {
  "use strict";

  // ==========================================================================
  // 1. EXPOSED VALIDATION RULES & ENGINE (Can be fetched anywhere via window)
  // ==========================================================================

  const FreshMartValidationRules = {
    rules: {
      customerName: {
        required: true,
        minLength: 2,
        maxLength: 60,
        pattern: /^[A-Za-z\s]{2,60}$/,
        message: "Customer name must be at least 2 alphabetic characters (spaces allowed)."
      },
      customerPhone: {
        required: false, // Optional for walk-in customers
        pattern: /^[6-9]\d{9}$/,
        message: "Customer phone must be a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)."
      },
      billDate: {
        required: true,
        disallowFuture: true,
        message: "Bill date cannot be in the future."
      },
      category: {
        required: true,
        message: "Please select a product category."
      },
      product: {
        required: true,
        message: "Please select a grocery item to add."
      },
      quantity: {
        required: true,
        min: 1,
        max: 9999,
        isInteger: true,
        message: "Quantity must be a positive whole number (minimum 1)."
      },
      payment: {
        required: true,
        minAmount: "grandTotal",
        message: "Amount paid must be greater than or equal to the Grand Total."
      }
    },

    /**
     * Get all validation rule definitions.
     */
    getRules: function () {
      return { ...this.rules };
    },

    /**
     * Validate an individual field.
     * @param {string} fieldName - customerName, customerPhone, billDate, category, product, quantity, payment
     * @param {any} value - Value to validate
     * @param {object} context - Optional context like { grandTotal: 150 }
     * @returns {{ valid: boolean, message: string }}
     */
    validateField: function (fieldName, value, context = {}) {
      const rule = this.rules[fieldName];
      if (!rule) {
        return { valid: true, message: "" };
      }

      const strVal = value !== null && value !== undefined ? String(value).trim() : "";

      // Required check
      if (rule.required && strVal === "") {
        return { valid: false, message: rule.message };
      }

      // Customer Name
      if (fieldName === "customerName") {
        if (!rule.pattern.test(strVal)) {
          return { valid: false, message: rule.message };
        }
      }

      // Customer Phone (only if not empty)
      if (fieldName === "customerPhone" && strVal !== "") {
        if (!rule.pattern.test(strVal)) {
          return { valid: false, message: rule.message };
        }
      }

      // Bill Date
      if (fieldName === "billDate" && strVal !== "") {
        const inputDate = new Date(strVal);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (inputDate > today) {
          return { valid: false, message: rule.message };
        }
      }

      // Quantity
      if (fieldName === "quantity") {
        const num = Number(strVal);
        if (isNaN(num) || !Number.isInteger(num) || num < rule.min) {
          return { valid: false, message: rule.message };
        }
      }

      // Category & Product
      if ((fieldName === "category" || fieldName === "product") && strVal === "") {
        return { valid: false, message: rule.message };
      }

      // Payment
      if (fieldName === "payment") {
        const paid = Number(strVal);
        const grandTotal = Number(context.grandTotal) || 0;
        if (isNaN(paid) || paid < grandTotal) {
          return {
            valid: false,
            message: `Amount paid (₹${(paid || 0).toFixed(2)}) is less than Grand Total (₹${grandTotal.toFixed(2)}).`
          };
        }
      }

      return { valid: true, message: "" };
    },

    /**
     * Validate an entire form data dictionary.
     * @param {object} formData
     * @returns {{ valid: boolean, errors: object }}
     */
    validateAll: function (formData) {
      const errors = {};
      let valid = true;

      for (const field in formData) {
        if (this.rules[field]) {
          const res = this.validateField(field, formData[field], formData);
          if (!res.valid) {
            errors[field] = res.message;
            valid = false;
          }
        }
      }

      return { valid, errors };
    }
  };

  // Expose rules to global window
  global.FreshMartValidationRules = FreshMartValidationRules;

  // ==========================================================================
  // 2. PRODUCT CATALOG DATA (PRICES IN INR)
  // ==========================================================================

  const PRODUCT_CATALOG = {
    // Grains
    rice: { name: "Rice", category: "grains", categoryName: "Grains", price: 60.0, unit: "1 kg", icon: "🍚", discountPercent: 0 },
    wheat: { name: "Wheat", category: "grains", categoryName: "Grains", price: 45.0, unit: "1 kg", icon: "🌾", discountPercent: 0 },
    sugar: { name: "Sugar", category: "grains", categoryName: "Grains", price: 50.0, unit: "1 kg", icon: "🧂", discountPercent: 0 },
    salt: { name: "Salt", category: "grains", categoryName: "Grains", price: 20.0, unit: "1 kg", icon: "🧂", discountPercent: 0 },
    "cooking-oil": { name: "Cooking Oil", category: "grains", categoryName: "Grains", price: 140.0, unit: "1 L", icon: "🛢️", discountPercent: 5 },

    // Dairy
    milk: { name: "Milk", category: "dairy", categoryName: "Dairy", price: 30.0, unit: "1 L", icon: "🥛", discountPercent: 0 },
    bread: { name: "Bread", category: "dairy", categoryName: "Dairy", price: 40.0, unit: "1 pack", icon: "🍞", discountPercent: 0 },

    // Snacks & Beverages
    biscuits: { name: "Biscuits", category: "snacks", categoryName: "Snacks", price: 30.0, unit: "1 pack", icon: "🍪", discountPercent: 0 },
    tea: { name: "Tea", category: "beverages", categoryName: "Beverages", price: 120.0, unit: "250 g", icon: "🍵", discountPercent: 5 },
    coffee: { name: "Coffee", category: "beverages", categoryName: "Beverages", price: 180.0, unit: "100 g", icon: "☕", discountPercent: 5 },
    juice: { name: "Juice", category: "beverages", categoryName: "Beverages", price: 95.0, unit: "1 L", icon: "🧃", discountPercent: 0 },

    // Fruits & Vegetables
    apples: { name: "Apples", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 120.0, unit: "1 kg", icon: "🍎", discountPercent: 0 },
    bananas: { name: "Bananas", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 50.0, unit: "1 dozen", icon: "🍌", discountPercent: 0 },
    tomatoes: { name: "Tomatoes", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 40.0, unit: "1 kg", icon: "🍅", discountPercent: 0 },
    potatoes: { name: "Potatoes", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 30.0, unit: "1 kg", icon: "🥔", discountPercent: 0 },

    // Personal Care & Household
    soap: { name: "Soap", category: "personal-care", categoryName: "Personal Care", price: 40.0, unit: "1 bar", icon: "🧼", discountPercent: 0 },
    shampoo: { name: "Shampoo", category: "personal-care", categoryName: "Personal Care", price: 150.0, unit: "180 ml", icon: "🧴", discountPercent: 5 },
    toothpaste: { name: "Toothpaste", category: "personal-care", categoryName: "Personal Care", price: 85.0, unit: "150 g", icon: "🪥", discountPercent: 0 },
    detergent: { name: "Detergent", category: "household-items", categoryName: "Household Items", price: 180.0, unit: "1 kg", icon: "🧺", discountPercent: 5 }
  };

  const CATEGORY_MAP = {
    "grains": ["rice", "wheat", "sugar", "salt", "cooking-oil"],
    "dairy": ["milk", "bread"],
    "beverages": ["tea", "coffee", "juice"],
    "snacks": ["biscuits"],
    "fruits-vegetables": ["apples", "bananas", "tomatoes", "potatoes"],
    "personal-care": ["soap", "shampoo", "toothpaste"],
    "household-items": ["detergent"]
  };

  // ==========================================================================
  // 3. MAIN APPLICATION CONTROLLER
  // ==========================================================================

  document.addEventListener("DOMContentLoaded", () => {
    // --- DOM REFERENCES ---
    const navLinks = document.querySelectorAll(".nav-link");
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Dashboard
    const todaySalesEl = document.getElementById("todaySales");
    const totalBillsEl = document.getElementById("totalBills");
    const totalProductsEl = document.getElementById("totalProducts");
    const totalCustomersEl = document.getElementById("totalCustomers");

    // Bill Info
    const billNumberInput = document.getElementById("billNumber");
    const billDateInput = document.getElementById("billDate");
    const billTimeInput = document.getElementById("billTime");
    const customerNameInput = document.getElementById("customerName");
    const customerPhoneInput = document.getElementById("customerPhone");

    // Product Selection
    const productSearchInput = document.getElementById("productSearch");
    const categorySelect = document.getElementById("categorySelect");
    const productSelect = document.getElementById("productSelect");
    const quantityInput = document.getElementById("quantity");
    const addToCartBtn = document.getElementById("addToCartBtn");

    // Products Page Section
    const productPageSearch = document.getElementById("productPageSearch");
    const productPageCategory = document.getElementById("productPageCategory");
    const productCards = document.querySelectorAll(".product-card");
    const addProductButtons = document.querySelectorAll(".add-product-btn");

    // Cart Table
    const cartItemsTbody = document.getElementById("cartItems");
    const emptyCartNotice = document.getElementById("emptyCartNotice");

    // Billing Summary
    const subtotalEl = document.getElementById("subtotal");
    const discountEl = document.getElementById("discount");
    const gstEl = document.getElementById("gst");
    const otherChargesEl = document.getElementById("otherCharges");
    const grandTotalEl = document.getElementById("grandTotal");

    // Payment
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const amountPaidInput = document.getElementById("amountPaid");
    const changeAmountInput = document.getElementById("changeAmount");

    // Actions
    const clearCartBtn = document.getElementById("clearCartBtn");
    const generateBillBtn = document.getElementById("generateBillBtn");
    const printBillBtn = document.getElementById("printBillBtn");
    const newBillBtn = document.getElementById("newBillBtn");

    // Printable Invoice
    const printableBillSection = document.getElementById("printableBill");
    const printBillNumberEl = document.getElementById("printBillNumber");
    const printBillDateEl = document.getElementById("printBillDate");
    const printBillTimeEl = document.getElementById("printBillTime");
    const printCustomerNameEl = document.getElementById("printCustomerName");
    const invoiceItemsTbody = document.getElementById("invoiceItems");
    const printSubtotalEl = document.getElementById("printSubtotal");
    const printDiscountEl = document.getElementById("printDiscount");
    const printGstEl = document.getElementById("printGst");
    const printGrandTotalEl = document.getElementById("printGrandTotal");
    const printPaymentMethodEl = document.getElementById("printPaymentMethod");
    const printAmountPaidEl = document.getElementById("printAmountPaid");
    const printChangeEl = document.getElementById("printChange");

    // --- APPLICATION STATE ---
    let cart = [];
    let currentTotals = {
      subtotal: 0,
      discount: 0,
      taxable: 0,
      gst: 0,
      otherCharges: 0,
      grandTotal: 0
    };

    const STORAGE_KEYS = {
      DARK_MODE: "freshmart_dark_mode",
      BILL_NUMBER: "freshmart_bill_number",
      TODAY_SALES: "freshmart_today_sales",
      TOTAL_BILLS: "freshmart_total_bills",
      TOTAL_CUSTOMERS: "freshmart_total_customers"
    };

    // --- LOCAL STORAGE HELPERS ---
    function getStorage(key, fallback) {
      try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    function setStorage(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {}
    }

    // --- CURRENCY FORMATTER ---
    function formatINR(amount) {
      const num = Number(amount) || 0;
      return `₹${Math.max(0, num).toFixed(2)}`;
    }

    // --- TOAST NOTIFICATIONS ---
    function showToast(message, type = "info") {
      const existing = document.querySelector(".freshmart-toast");
      if (existing) existing.remove();

      const toast = document.createElement("div");
      toast.className = `freshmart-toast ${type === "error" ? "toast-error" : type === "success" ? "toast-success" : ""}`;
      const icon = type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️";
      toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
      document.body.appendChild(toast);

      setTimeout(() => {
        if (toast && toast.parentNode) {
          toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          toast.style.opacity = "0";
          toast.style.transform = "translateY(10px)";
          setTimeout(() => toast.remove(), 300);
        }
      }, 3500);
    }

    // --- FIELD ERROR HELPERS ---
    function setFieldError(el, msg) {
      if (!el) return;
      el.classList.add("input-error");
      let span = el.parentElement.querySelector(".field-error-msg");
      if (!span) {
        span = document.createElement("span");
        span.className = "field-error-msg";
        el.parentElement.appendChild(span);
      }
      span.textContent = msg;
    }

    function clearFieldError(el) {
      if (!el) return;
      el.classList.remove("input-error");
      const span = el.parentElement.querySelector(".field-error-msg");
      if (span) span.remove();
    }

    function clearAllErrors() {
      document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
      document.querySelectorAll(".field-error-msg").forEach((el) => el.remove());
    }

    // --- DATE & TIME ---
    function setCurrentDateTime() {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const curDate = `${yyyy}-${mm}-${dd}`;

      const hh = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      const curTime = `${hh}:${min}`;

      if (billDateInput) {
        billDateInput.value = curDate;
        billDateInput.max = curDate; // Prevent future dates
      }
      if (billTimeInput) {
        billTimeInput.value = curTime;
      }
    }

    // --- BILL NUMBER MANAGEMENT ---
    function initBillNumber() {
      const lastNum = getStorage(STORAGE_KEYS.BILL_NUMBER, 1001);
      if (billNumberInput) {
        billNumberInput.value = `BILL-${lastNum}`;
      }
      return lastNum;
    }

    function incrementBillNumber() {
      const current = getStorage(STORAGE_KEYS.BILL_NUMBER, 1001);
      const next = Number(current) + 1;
      setStorage(STORAGE_KEYS.BILL_NUMBER, next);
      if (billNumberInput) {
        billNumberInput.value = `BILL-${next}`;
      }
      return next;
    }

    // --- DASHBOARD METRICS ---
    function loadDashboardMetrics() {
      const sales = getStorage(STORAGE_KEYS.TODAY_SALES, 0);
      const bills = getStorage(STORAGE_KEYS.TOTAL_BILLS, 0);
      const customers = getStorage(STORAGE_KEYS.TOTAL_CUSTOMERS, 0);
      const productsCount = Object.keys(PRODUCT_CATALOG).length;

      if (todaySalesEl) todaySalesEl.textContent = formatINR(sales);
      if (totalBillsEl) totalBillsEl.textContent = bills.toString();
      if (totalCustomersEl) totalCustomersEl.textContent = customers.toString();
      if (totalProductsEl) totalProductsEl.textContent = productsCount.toString();
    }

    function updateDashboardOnBill(amount) {
      const sales = Number(getStorage(STORAGE_KEYS.TODAY_SALES, 0)) + Number(amount);
      const bills = Number(getStorage(STORAGE_KEYS.TOTAL_BILLS, 0)) + 1;
      const customers = Number(getStorage(STORAGE_KEYS.TOTAL_CUSTOMERS, 0)) + 1;

      setStorage(STORAGE_KEYS.TODAY_SALES, sales);
      setStorage(STORAGE_KEYS.TOTAL_BILLS, bills);
      setStorage(STORAGE_KEYS.TOTAL_CUSTOMERS, customers);

      loadDashboardMetrics();
    }

    // --- DARK MODE ---
    function setDarkMode(isDark) {
      if (isDark) {
        document.body.classList.add("dark-mode");
        if (darkModeToggle) {
          darkModeToggle.innerHTML = "<span>☀️</span><span>Light Mode</span>";
        }
      } else {
        document.body.classList.remove("dark-mode");
        if (darkModeToggle) {
          darkModeToggle.innerHTML = "<span>🌙</span><span>Dark Mode</span>";
        }
      }
    }

    const savedDark = getStorage(STORAGE_KEYS.DARK_MODE, false);
    setDarkMode(savedDark);

    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", () => {
        const isDark = !document.body.classList.contains("dark-mode");
        setDarkMode(isDark);
        setStorage(STORAGE_KEYS.DARK_MODE, isDark);
      });
    }

    // --- NAVIGATION HIGHLIGHT ---
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });

    // --- PRODUCT DROPDOWN & FILTERING ---
    function populateProductOptions(category = "") {
      if (!productSelect) return;
      productSelect.innerHTML = '<option value="">-- Select Product --</option>';

      const categories = [
        { label: "Grains", keys: ["rice", "wheat", "sugar", "salt", "cooking-oil"] },
        { label: "Dairy", keys: ["milk", "bread"] },
        { label: "Snacks", keys: ["biscuits"] },
        { label: "Beverages", keys: ["tea", "coffee", "juice"] },
        { label: "Fruits & Vegetables", keys: ["apples", "bananas", "tomatoes", "potatoes"] },
        { label: "Personal Care", keys: ["soap", "shampoo", "toothpaste"] },
        { label: "Household Items", keys: ["detergent"] }
      ];

      categories.forEach((cat) => {
        if (!category || category === "all" || cat.label.toLowerCase().includes(category.replace("-", " ")) || (CATEGORY_MAP[category] && cat.keys.some(k => CATEGORY_MAP[category].includes(k)))) {
          const optgroup = document.createElement("optgroup");
          optgroup.label = cat.label;
          cat.keys.forEach((key) => {
            const prod = PRODUCT_CATALOG[key];
            if (prod) {
              const opt = document.createElement("option");
              opt.value = key;
              opt.textContent = `${prod.name} (${formatINR(prod.price)} / ${prod.unit})`;
              optgroup.appendChild(opt);
            }
          });
          if (optgroup.children.length > 0) {
            productSelect.appendChild(optgroup);
          }
        }
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("change", (e) => {
        clearFieldError(categorySelect);
        populateProductOptions(e.target.value);
      });
    }

    // Search inside Billing panel
    if (productSearchInput) {
      productSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          populateProductOptions(categorySelect ? categorySelect.value : "");
          return;
        }

        productSelect.innerHTML = '<option value="">-- Select Product --</option>';
        const optgroup = document.createElement("optgroup");
        optgroup.label = `Results for "${query}"`;

        let found = false;
        Object.keys(PRODUCT_CATALOG).forEach((key) => {
          const item = PRODUCT_CATALOG[key];
          if (item.name.toLowerCase().includes(query) || key.toLowerCase().includes(query) || item.categoryName.toLowerCase().includes(query)) {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = `${item.name} (${formatINR(item.price)} / ${item.unit})`;
            optgroup.appendChild(opt);
            found = true;
          }
        });

        if (found) {
          productSelect.appendChild(optgroup);
          productSelect.selectedIndex = 1; // Select first match
          const matchedKey = productSelect.value;
          if (matchedKey && PRODUCT_CATALOG[matchedKey] && categorySelect) {
            categorySelect.value = PRODUCT_CATALOG[matchedKey].category;
          }
        }
      });
    }

    if (productSelect) {
      productSelect.addEventListener("change", (e) => {
        clearFieldError(productSelect);
        const item = PRODUCT_CATALOG[e.target.value];
        if (item && categorySelect) {
          categorySelect.value = item.category;
          clearFieldError(categorySelect);
        }
      });
    }

    // --- PRODUCTS PAGE (SECTION 3) FILTERING & ADD TO BILL ---
    function filterProductsGrid() {
      const query = productPageSearch ? productPageSearch.value.trim().toLowerCase() : "";
      const cat = productPageCategory ? productPageCategory.value : "all";

      productCards.forEach((card) => {
        const name = (card.getAttribute("data-name") || "").toLowerCase();
        const cardCat = (card.getAttribute("data-category") || "").toLowerCase();
        const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";

        const matchesQuery = !query || name.includes(query) || title.includes(query);
        const matchesCategory = cat === "all" || cardCat === cat;

        if (matchesQuery && matchesCategory) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    }

    if (productPageSearch) {
      productPageSearch.addEventListener("input", filterProductsGrid);
    }
    if (productPageCategory) {
      productPageCategory.addEventListener("change", filterProductsGrid);
    }

    // "Add to Bill" button on product grid cards
    addProductButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const prodKey = e.currentTarget.getAttribute("data-product");
        if (prodKey && PRODUCT_CATALOG[prodKey]) {
          addItemToCart(prodKey, 1);
          showToast(`Added 1 × ${PRODUCT_CATALOG[prodKey].name} to Bill!`, "success");
        }
      });
    });

    // --- REAL-TIME INPUT VALIDATION LISTENERS ---
    if (customerNameInput) {
      customerNameInput.addEventListener("input", () => {
        const val = customerNameInput.value.trim();
        if (val) {
          const res = FreshMartValidationRules.validateField("customerName", val);
          if (!res.valid) setFieldError(customerNameInput, res.message);
          else clearFieldError(customerNameInput);
        } else {
          clearFieldError(customerNameInput);
        }
      });
      customerNameInput.addEventListener("blur", () => {
        const res = FreshMartValidationRules.validateField("customerName", customerNameInput.value);
        if (!res.valid) setFieldError(customerNameInput, res.message);
        else clearFieldError(customerNameInput);
      });
    }

    if (customerPhoneInput) {
      customerPhoneInput.addEventListener("input", () => {
        const val = customerPhoneInput.value.trim();
        if (val) {
          const res = FreshMartValidationRules.validateField("customerPhone", val);
          if (!res.valid) setFieldError(customerPhoneInput, res.message);
          else clearFieldError(customerPhoneInput);
        } else {
          clearFieldError(customerPhoneInput);
        }
      });
    }

    if (quantityInput) {
      quantityInput.addEventListener("input", () => {
        const res = FreshMartValidationRules.validateField("quantity", quantityInput.value);
        if (!res.valid) setFieldError(quantityInput, res.message);
        else clearFieldError(quantityInput);
      });
    }

    // --- CART CALCULATIONS ---
    function calculateTotals() {
      let subtotal = 0;
      let totalDiscount = 0;

      cart.forEach((item) => {
        const itemGross = item.price * item.quantity;
        const itemDisc = item.discount || 0;
        subtotal += itemGross;
        totalDiscount += itemDisc;
      });

      const taxable = Math.max(0, subtotal - totalDiscount);
      const gst = taxable * 0.05; // 5% GST
      const otherCharges = 0;
      const grandTotal = taxable + gst + otherCharges;

      currentTotals = {
        subtotal,
        discount: totalDiscount,
        taxable,
        gst,
        otherCharges,
        grandTotal
      };

      if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
      if (discountEl) discountEl.textContent = formatINR(totalDiscount);
      if (gstEl) gstEl.textContent = formatINR(gst);
      if (otherChargesEl) otherChargesEl.textContent = formatINR(otherCharges);
      if (grandTotalEl) grandTotalEl.textContent = formatINR(grandTotal);

      updateChangeAmount();
    }

    function updateChangeAmount() {
      if (!amountPaidInput || !changeAmountInput) return;
      const paid = Number(amountPaidInput.value);
      const grandTotal = currentTotals.grandTotal;

      if (isNaN(paid) || amountPaidInput.value === "") {
        changeAmountInput.value = formatINR(0);
        return;
      }

      if (paid >= grandTotal) {
        changeAmountInput.value = formatINR(paid - grandTotal);
        clearFieldError(amountPaidInput);
      } else {
        changeAmountInput.value = formatINR(0);
      }
    }

    if (amountPaidInput) {
      amountPaidInput.addEventListener("input", updateChangeAmount);
    }

    paymentRadios.forEach((r) => {
      r.addEventListener("change", () => {
        if ((r.value === "UPI" || r.value === "Card") && currentTotals.grandTotal > 0) {
          if (!amountPaidInput.value || Number(amountPaidInput.value) < currentTotals.grandTotal) {
            amountPaidInput.value = currentTotals.grandTotal.toFixed(2);
            updateChangeAmount();
          }
        }
      });
    });

    // --- CART RENDERING ---
    function renderCart() {
      if (!cartItemsTbody) return;
      cartItemsTbody.innerHTML = "";

      if (cart.length === 0) {
        if (emptyCartNotice) emptyCartNotice.style.display = "block";
        calculateTotals();
        return;
      }

      if (emptyCartNotice) emptyCartNotice.style.display = "none";

      cart.forEach((item, index) => {
        const tr = document.createElement("tr");
        const srNo = index + 1;
        const total = (item.price * item.quantity) - item.discount;

        tr.innerHTML = `
          <td><strong>${srNo}</strong></td>
          <td>${item.name} <small style="color:#64748b;">(${item.unit})</small></td>
          <td>${item.categoryName}</td>
          <td>
            <input type="number" class="form-control cart-qty-inline" data-index="${index}" value="${item.quantity}" min="1" step="1" style="width:70px; padding:6px; text-align:center;">
          </td>
          <td>${formatINR(item.price)}</td>
          <td>${formatINR(item.discount)}</td>
          <td><strong>${formatINR(total)}</strong></td>
          <td>
            <button type="button" class="btn-delete-row" data-index="${index}">✕ Remove</button>
          </td>
        `;
        cartItemsTbody.appendChild(tr);
      });

      // Remove row handlers
      cartItemsTbody.querySelectorAll(".btn-delete-row").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = Number(e.currentTarget.getAttribute("data-index"));
          const removed = cart.splice(idx, 1)[0];
          showToast(`Removed "${removed.name}" from cart.`, "info");
          renderCart();
        });
      });

      // Inline Quantity Change Handlers
      cartItemsTbody.querySelectorAll(".cart-qty-inline").forEach((input) => {
        input.addEventListener("change", (e) => {
          const idx = Number(e.target.getAttribute("data-index"));
          const qty = parseInt(e.target.value, 10);
          if (isNaN(qty) || qty < 1) {
            e.target.value = cart[idx].quantity;
            showToast("Quantity must be at least 1.", "error");
            return;
          }
          cart[idx].quantity = qty;
          const gross = cart[idx].price * qty;
          const discPercent = cart[idx].discountPercent || (qty >= 5 ? 5 : 0);
          cart[idx].discount = (gross * discPercent) / 100;
          renderCart();
          showToast(`Updated quantity for ${cart[idx].name} to ${qty}.`, "success");
        });
      });

      calculateTotals();
    }

    function addItemToCart(productKey, quantity) {
      const prod = PRODUCT_CATALOG[productKey];
      if (!prod) return;

      const existingIndex = cart.findIndex((item) => item.key === productKey);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
        const gross = prod.price * cart[existingIndex].quantity;
        const discPercent = prod.discountPercent || (cart[existingIndex].quantity >= 5 ? 5 : 0);
        cart[existingIndex].discount = (gross * discPercent) / 100;
        showToast(`Updated ${prod.name} quantity to ${cart[existingIndex].quantity}.`, "success");
      } else {
        const gross = prod.price * quantity;
        const discPercent = prod.discountPercent || (quantity >= 5 ? 5 : 0);
        const discount = (gross * discPercent) / 100;

        cart.push({
          key: productKey,
          name: prod.name,
          category: prod.category,
          categoryName: prod.categoryName,
          unit: prod.unit,
          price: prod.price,
          quantity: quantity,
          discountPercent: discPercent,
          discount: discount
        });
        showToast(`Added ${quantity} × ${prod.name} to cart.`, "success");
      }

      renderCart();
      if (quantityInput) quantityInput.value = "1";
    }

    // --- ADD TO CART BUTTON CLICK ---
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        let valid = true;

        if (!categorySelect || !categorySelect.value) {
          setFieldError(categorySelect, FreshMartValidationRules.rules.category.message);
          valid = false;
        } else {
          clearFieldError(categorySelect);
        }

        if (!productSelect || !productSelect.value) {
          setFieldError(productSelect, FreshMartValidationRules.rules.product.message);
          valid = false;
        } else {
          clearFieldError(productSelect);
        }

        const qtyVal = quantityInput ? quantityInput.value : "";
        const qtyRes = FreshMartValidationRules.validateField("quantity", qtyVal);
        if (!qtyRes.valid) {
          setFieldError(quantityInput, qtyRes.message);
          valid = false;
        } else {
          clearFieldError(quantityInput);
        }

        if (!valid) return;

        addItemToCart(productSelect.value, parseInt(qtyVal, 10));
      });
    }

    // --- CLEAR CART BUTTON ---
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          showToast("Cart is already empty.", "info");
          return;
        }
        cart = [];
        renderCart();
        if (amountPaidInput) amountPaidInput.value = "";
        if (changeAmountInput) changeAmountInput.value = formatINR(0);
        showToast("All items have been removed from the cart.", "success");
      });
    }

    // --- NEW BILL BUTTON ---
    if (newBillBtn) {
      newBillBtn.addEventListener("click", () => {
        cart = [];
        renderCart();
        clearAllErrors();

        if (customerNameInput) customerNameInput.value = "";
        if (customerPhoneInput) customerPhoneInput.value = "";
        if (productSearchInput) productSearchInput.value = "";
        if (categorySelect) categorySelect.value = "";
        populateProductOptions();
        if (quantityInput) quantityInput.value = "1";
        if (amountPaidInput) amountPaidInput.value = "";
        if (changeAmountInput) changeAmountInput.value = formatINR(0);

        // Reset payment method radio to Cash (default)
        paymentRadios.forEach((r) => {
          if (r.value === "Cash") r.checked = true;
        });

        // Clear printable invoice display
        if (invoiceItemsTbody) invoiceItemsTbody.innerHTML = "";
        if (printSubtotalEl) printSubtotalEl.textContent = formatINR(0);
        if (printDiscountEl) printDiscountEl.textContent = formatINR(0);
        if (printGstEl) printGstEl.textContent = formatINR(0);
        if (printGrandTotalEl) printGrandTotalEl.textContent = formatINR(0);
        if (printAmountPaidEl) printAmountPaidEl.textContent = formatINR(0);
        if (printChangeEl) printChangeEl.textContent = formatINR(0);

        setCurrentDateTime();
        incrementBillNumber();

        showToast("New bill created successfully!", "success");
        const billingSec = document.getElementById("billing");
        if (billingSec) billingSec.scrollIntoView({ behavior: "smooth" });
      });
    }

    // --- INVOICE GENERATION ---
    function getSelectedPaymentMethod() {
      let method = "Cash";
      paymentRadios.forEach((r) => {
        if (r.checked) method = r.value;
      });
      return method;
    }

    function populateInvoice() {
      const billNo = billNumberInput ? billNumberInput.value : "BILL-1001";
      const billDate = billDateInput ? billDateInput.value : "-";
      const billTime = billTimeInput ? billTimeInput.value : "-";
      const custName = customerNameInput && customerNameInput.value.trim() ? customerNameInput.value.trim() : "Walk-in Customer";
      const method = getSelectedPaymentMethod();
      const amountPaid = amountPaidInput ? Number(amountPaidInput.value) || currentTotals.grandTotal : currentTotals.grandTotal;
      const change = Math.max(0, amountPaid - currentTotals.grandTotal);

      if (printBillNumberEl) printBillNumberEl.textContent = billNo;
      if (printBillDateEl) printBillDateEl.textContent = billDate;
      if (printBillTimeEl) printBillTimeEl.textContent = billTime;
      if (printCustomerNameEl) printCustomerNameEl.textContent = custName;

      if (invoiceItemsTbody) {
        invoiceItemsTbody.innerHTML = "";
        cart.forEach((item) => {
          const total = (item.price * item.quantity) - item.discount;
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatINR(item.price)}</td>
            <td>${formatINR(total)}</td>
          `;
          invoiceItemsTbody.appendChild(tr);
        });
      }

      if (printSubtotalEl) printSubtotalEl.textContent = formatINR(currentTotals.subtotal);
      if (printDiscountEl) printDiscountEl.textContent = formatINR(currentTotals.discount);
      if (printGstEl) printGstEl.textContent = formatINR(currentTotals.gst);
      if (printGrandTotalEl) printGrandTotalEl.textContent = formatINR(currentTotals.grandTotal);

      if (printPaymentMethodEl) printPaymentMethodEl.textContent = method;
      if (printAmountPaidEl) printAmountPaidEl.textContent = formatINR(amountPaid);
      if (printChangeEl) printChangeEl.textContent = formatINR(change);
    }

    // --- GENERATE BILL BUTTON ---
    if (generateBillBtn) {
      generateBillBtn.addEventListener("click", () => {
        let hasError = false;

        // Validate Customer Name
        const nameRes = FreshMartValidationRules.validateField("customerName", customerNameInput ? customerNameInput.value : "");
        if (!nameRes.valid) {
          setFieldError(customerNameInput, nameRes.message);
          hasError = true;
        } else {
          clearFieldError(customerNameInput);
        }

        // Validate Customer Phone
        const phoneRes = FreshMartValidationRules.validateField("customerPhone", customerPhoneInput ? customerPhoneInput.value : "");
        if (!phoneRes.valid) {
          setFieldError(customerPhoneInput, phoneRes.message);
          hasError = true;
        } else {
          clearFieldError(customerPhoneInput);
        }

        // Validate Cart
        if (cart.length === 0) {
          showToast("Please add items to cart before generating a bill.", "error");
          hasError = true;
        }

        // Validate Payment
        const paymentRes = FreshMartValidationRules.validateField("payment", amountPaidInput ? amountPaidInput.value : 0, { grandTotal: currentTotals.grandTotal });
        if (!paymentRes.valid) {
          setFieldError(amountPaidInput, paymentRes.message);
          showToast(paymentRes.message, "error");
          hasError = true;
        } else {
          clearFieldError(amountPaidInput);
        }

        if (hasError) return;

        populateInvoice();
        updateDashboardOnBill(currentTotals.grandTotal);

        showToast(`Bill ${billNumberInput ? billNumberInput.value : ""} generated successfully!`, "success");

        if (printableBillSection) {
          printableBillSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    // --- PRINT BILL BUTTON ---
    if (printBillBtn) {
      printBillBtn.addEventListener("click", () => {
        if (cart.length === 0) {
          showToast("Cannot print empty bill. Please add items and generate bill first.", "error");
          return;
        }

        populateInvoice();
        showToast("Bill has been printed successfully!", "success");

        setTimeout(() => {
          try {
            window.print();
          } catch (e) {
            console.warn("Print trigger encountered an issue:", e);
          }
        }, 150);
      });
    }

    // --- INITIAL BOOTSTRAP ---
    function init() {
      setCurrentDateTime();
      initBillNumber();
      populateProductOptions();
      loadDashboardMetrics();
      renderCart();
    }

    init();
  });

  // Global helper namespace for fetching catalog or rules externally
  global.FreshMart = {
    validationRules: FreshMartValidationRules,
    catalog: PRODUCT_CATALOG,
    categories: CATEGORY_MAP
  };

})(window);
