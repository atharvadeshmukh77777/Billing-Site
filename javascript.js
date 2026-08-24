/**
 * ============================================================================
 * FreshMart Grocery Store - POS Billing System
 * File: js/script.js
 * Description: Complete Vanilla JavaScript implementation for the FreshMart
 *              Grocery Shop Billing and Counter Application.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================================================
  // 1. DOM ELEMENT REFERENCES
  // ==========================================================================

  // Navigation Links
  const navHome = document.getElementById("navHome");
  const navBilling = document.getElementById("navBilling");
  const navProducts = document.getElementById("navProducts");
  const navAbout = document.getElementById("navAbout");
  const allNavLinks = [navHome, navBilling, navProducts, navAbout].filter(Boolean);

  // Sections
  const dashboardSection = document.getElementById("dashboard");
  const billingSection = document.getElementById("billing");
  const mainFooter = document.getElementById("mainFooter");

  // Header & Theme
  const darkModeToggle = document.getElementById("darkModeToggle");

  // Dashboard Stats
  const todaySalesEl = document.getElementById("todaySales");
  const totalBillsEl = document.getElementById("totalBills");
  const totalProductsEl = document.getElementById("totalProducts");
  const totalCustomersEl = document.getElementById("totalCustomers");

  // Customer & Bill Metadata Inputs
  const billNumberInput = document.getElementById("billNumber");
  const billDateInput = document.getElementById("billDate");
  const billTimeInput = document.getElementById("billTime");
  const customerNameInput = document.getElementById("customerName");
  const customerPhoneInput = document.getElementById("customerPhone");

  // Product Selection Controls
  const productSearchInput = document.getElementById("productSearch");
  const categorySelect = document.getElementById("categorySelect");
  const productSelect = document.getElementById("productSelect");
  const quantityInput = document.getElementById("quantity");
  const addToCartBtn = document.getElementById("addToCartBtn");

  // Cart Table & Notice
  const cartTable = document.getElementById("cartTable");
  const cartItemsTbody = document.getElementById("cartItems");
  const emptyCartNotice = document.getElementById("emptyCartNotice");

  // Billing Summary Display
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const gstEl = document.getElementById("gst");
  const otherChargesEl = document.getElementById("otherCharges");
  const grandTotalEl = document.getElementById("grandTotal");

  // Payment Controls
  const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const amountPaidInput = document.getElementById("amountPaid");
  const changeAmountInput = document.getElementById("changeAmount");

  // Action Buttons
  const addProductBtn = document.getElementById("addProductBtn");
  const updateCartBtn = document.getElementById("updateCartBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const generateBillBtn = document.getElementById("generateBillBtn");
  const printBillBtn = document.getElementById("printBillBtn");
  const newBillBtn = document.getElementById("newBillBtn");

  // Printable Invoice Elements
  const printBillNumberEl = document.getElementById("printBillNumber");
  const printBillDateEl = document.getElementById("printBillDate");
  const printBillTimeEl = document.getElementById("printBillTime");
  const printCustomerNameEl = document.getElementById("printCustomerName");
  const invoiceItemsTbody = document.getElementById("invoiceItems");
  const printSubtotalEl = document.getElementById("printSubtotal");
  const printDiscountEl = document.getElementById("printDiscount");
  const printGstEl = document.getElementById("printGst");
  const printOtherChargesEl = document.getElementById("printOtherCharges");
  const printGrandTotalEl = document.getElementById("printGrandTotal");
  const printPaymentMethodEl = document.getElementById("printPaymentMethod");
  const printAmountPaidEl = document.getElementById("printAmountPaid");
  const printChangeEl = document.getElementById("printChange");

  // ==========================================================================
  // 2. PRODUCT CATALOG DATA (PRICES IN INR)
  // ==========================================================================

  /**
   * Centralized product catalog with categories, display names, units, and rates.
   */
  const PRODUCT_CATALOG = {
    // Grains
    rice: { name: "Rice (Basmati/Kolam)", category: "grains", categoryName: "Grains", price: 60.0, unit: "1 kg", discountPercent: 0 },
    wheat: { name: "Wheat (Atta Whole Grain)", category: "grains", categoryName: "Grains", price: 45.0, unit: "1 kg", discountPercent: 0 },
    sugar: { name: "Refined Sugar", category: "grains", categoryName: "Grains", price: 42.0, unit: "1 kg", discountPercent: 0 },
    salt: { name: "Iodized Table Salt", category: "grains", categoryName: "Grains", price: 20.0, unit: "1 kg", discountPercent: 0 },
    "cooking-oil": { name: "Refined Cooking Oil", category: "grains", categoryName: "Grains", price: 140.0, unit: "1 L", discountPercent: 5 },

    // Dairy
    milk: { name: "Pasteurized Fresh Milk", category: "dairy", categoryName: "Dairy", price: 30.0, unit: "500 ml", discountPercent: 0 },
    bread: { name: "Whole Wheat Bread", category: "dairy", categoryName: "Dairy", price: 40.0, unit: "1 pack", discountPercent: 0 },

    // Snacks & Beverages
    biscuits: { name: "Assorted Biscuits & Cookies", category: "beverages", categoryName: "Snacks & Beverages", price: 25.0, unit: "1 pack", discountPercent: 0 },
    tea: { name: "Premium Assam Tea", category: "beverages", categoryName: "Snacks & Beverages", price: 120.0, unit: "250 g", discountPercent: 5 },
    coffee: { name: "Instant Filter Coffee", category: "beverages", categoryName: "Snacks & Beverages", price: 180.0, unit: "100 g", discountPercent: 5 },
    juice: { name: "Fresh Fruit Juice", category: "beverages", categoryName: "Snacks & Beverages", price: 95.0, unit: "1 L", discountPercent: 0 },

    // Fruits & Vegetables
    apples: { name: "Fresh Royal Apples", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 150.0, unit: "1 kg", discountPercent: 0 },
    bananas: { name: "Ripe Bananas", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 50.0, unit: "1 dozen", discountPercent: 0 },
    tomatoes: { name: "Farm Fresh Tomatoes", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 35.0, unit: "1 kg", discountPercent: 0 },
    potatoes: { name: "Organic Potatoes", category: "fruits-vegetables", categoryName: "Fruits & Vegetables", price: 30.0, unit: "1 kg", discountPercent: 0 },

    // Personal Care & Household
    soap: { name: "Herbal Bathing Soap", category: "personal-care", categoryName: "Personal Care", price: 45.0, unit: "1 bar", discountPercent: 0 },
    shampoo: { name: "Anti-Dandruff Shampoo", category: "personal-care", categoryName: "Personal Care", price: 160.0, unit: "180 ml", discountPercent: 5 },
    toothpaste: { name: "Fluoride Protection Toothpaste", category: "personal-care", categoryName: "Personal Care", price: 85.0, unit: "150 g", discountPercent: 0 },
    detergent: { name: "Washing Powder Detergent", category: "household-items", categoryName: "Household Items", price: 110.0, unit: "1 kg", discountPercent: 5 }
  };

  // Category Value Normalization Map (supports HTML option values)
  const CATEGORY_MAP = {
    "grains": ["rice", "wheat", "sugar", "salt", "cooking-oil"],
    "dairy": ["milk", "bread"],
    "beverages": ["biscuits", "tea", "coffee", "juice"],
    "snacks": ["biscuits"],
    "fruits-vegetables": ["apples", "bananas", "tomatoes", "potatoes"],
    "personal-care": ["soap", "shampoo", "toothpaste"],
    "household-items": ["detergent"]
  };

  // ==========================================================================
  // 3. APPLICATION STATE
  // ==========================================================================

  let cart = []; // Array of { id, key, name, category, quantity, price, discount, total }
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
    BILL_NUMBER: "freshmart_last_bill_number",
    TODAY_SALES: "freshmart_today_sales",
    TOTAL_BILLS: "freshmart_total_bills",
    TOTAL_CUSTOMERS: "freshmart_total_customers"
  };

  // ==========================================================================
  // 4. STORAGE HELPERS
  // ==========================================================================

  function getStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`localStorage read error for ${key}:`, e);
      return defaultValue;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`localStorage write error for ${key}:`, e);
    }
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATION & INLINE ERROR HELPERS
  // ==========================================================================

  /**
   * Display a clean, non-intrusive feedback toast on screen.
   */
  function showToast(message, type = "info") {
    // Remove existing toast if any
    const existing = document.querySelector(".freshmart-toast");
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement("div");
    toast.className = `freshmart-toast ${type === "error" ? "toast-error" : type === "success" ? "toast-success" : ""}`;
    
    let icon = "ℹ️";
    if (type === "error") icon = "⚠️";
    if (type === "success") icon = "✅";

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

  function setFieldError(inputEl, errorMessage) {
    if (!inputEl) return;
    inputEl.classList.add("input-error");
    
    // Check if error message element already exists
    let errorSpan = inputEl.parentElement.querySelector(".field-error-msg");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "field-error-msg";
      inputEl.parentElement.appendChild(errorSpan);
    }
    errorSpan.textContent = errorMessage;
  }

  function clearFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove("input-error");
    const errorSpan = inputEl.parentElement.querySelector(".field-error-msg");
    if (errorSpan) {
      errorSpan.remove();
    }
  }

  function clearAllFieldErrors() {
    document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
    document.querySelectorAll(".field-error-msg").forEach((el) => el.remove());
  }

  // ==========================================================================
  // 6. INITIALIZATION & DATE/TIME HANDLING
  // ==========================================================================

  /**
   * Formats a number to Indian Rupee standard with 2 decimal places.
   */
  function formatINR(amount) {
    const num = Number(amount) || 0;
    return `₹${Math.max(0, num).toFixed(2)}`;
  }

  /**
   * Sets current date and current time into inputs and ensures max date constraint.
   */
  function setCurrentDateTime() {
    const now = new Date();
    
    // YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // HH:MM (24-hour)
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    if (billDateInput) {
      billDateInput.value = formattedDate;
      billDateInput.max = formattedDate; // Disallow future dates
    }

    if (billTimeInput) {
      billTimeInput.value = formattedTime;
    }
  }

  /**
   * Manages Bill Number sequence starting from BILL-1001.
   */
  function initializeBillNumber() {
    let lastNumber = getStorage(STORAGE_KEYS.BILL_NUMBER, 1001);
    if (typeof lastNumber !== "number" || isNaN(lastNumber)) {
      lastNumber = 1001;
    }
    if (billNumberInput) {
      billNumberInput.value = `BILL-${lastNumber}`;
    }
    return lastNumber;
  }

  function incrementBillNumber() {
    let currentNumber = getStorage(STORAGE_KEYS.BILL_NUMBER, 1001);
    if (typeof currentNumber !== "number" || isNaN(currentNumber)) {
      currentNumber = 1001;
    }
    const nextNumber = currentNumber + 1;
    setStorage(STORAGE_KEYS.BILL_NUMBER, nextNumber);
    if (billNumberInput) {
      billNumberInput.value = `BILL-${nextNumber}`;
    }
    return nextNumber;
  }

  /**
   * Loads dashboard overview metrics from storage and updates the UI.
   */
  function loadDashboardMetrics() {
    const todaySales = getStorage(STORAGE_KEYS.TODAY_SALES, 0);
    const totalBills = getStorage(STORAGE_KEYS.TOTAL_BILLS, 0);
    const totalCustomers = getStorage(STORAGE_KEYS.TOTAL_CUSTOMERS, 0);
    const totalProductsCount = Object.keys(PRODUCT_CATALOG).length;

    if (todaySalesEl) todaySalesEl.textContent = formatINR(todaySales);
    if (totalBillsEl) totalBillsEl.textContent = totalBills.toString();
    if (totalCustomersEl) totalCustomersEl.textContent = totalCustomers.toString();
    if (totalProductsEl) totalProductsEl.textContent = totalProductsCount.toString();
  }

  function updateDashboardMetricsOnBill(grandTotalAmount) {
    let todaySales = Number(getStorage(STORAGE_KEYS.TODAY_SALES, 0)) + Number(grandTotalAmount);
    let totalBills = Number(getStorage(STORAGE_KEYS.TOTAL_BILLS, 0)) + 1;
    let totalCustomers = Number(getStorage(STORAGE_KEYS.TOTAL_CUSTOMERS, 0)) + 1;

    setStorage(STORAGE_KEYS.TODAY_SALES, todaySales);
    setStorage(STORAGE_KEYS.TOTAL_BILLS, totalBills);
    setStorage(STORAGE_KEYS.TOTAL_CUSTOMERS, totalCustomers);

    loadDashboardMetrics();
  }

  // ==========================================================================
  // 7. NAVIGATION & SMOOTH SCROLLING
  // ==========================================================================

  function setActiveNavLink(clickedLink) {
    allNavLinks.forEach((link) => link.classList.remove("active"));
    if (clickedLink) {
      clickedLink.classList.add("active");
    }
  }

  if (navHome) {
    navHome.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveNavLink(navHome);
      if (dashboardSection) {
        dashboardSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (navBilling) {
    navBilling.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveNavLink(navBilling);
      if (billingSection) {
        billingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (navProducts) {
    navProducts.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveNavLink(navProducts);
      const productCard = document.querySelector(".product-selection-card");
      if (productCard) {
        productCard.scrollIntoView({ behavior: "smooth", block: "center" });
        if (productSearchInput) {
          setTimeout(() => productSearchInput.focus(), 300);
        }
      } else if (billingSection) {
        billingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (navAbout) {
    navAbout.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveNavLink(navAbout);
      if (mainFooter) {
        mainFooter.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        showToast("FreshMart Grocery Store - Premium POS & Billing Counter. 123 Market Street.", "info");
      }
    });
  }

  // ScrollSpy to update active navigation tab automatically
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + 150;
    const dashboardTop = dashboardSection ? dashboardSection.offsetTop : 0;
    const billingTop = billingSection ? billingSection.offsetTop : 0;
    const footerTop = mainFooter ? mainFooter.offsetTop : 0;

    if (footerTop && scrollPosition >= footerTop - 200) {
      setActiveNavLink(navAbout);
    } else if (billingTop && scrollPosition >= billingTop - 100) {
      setActiveNavLink(navBilling);
    } else if (dashboardTop) {
      setActiveNavLink(navHome);
    }
  });

  // ==========================================================================
  // 8. DARK MODE TOGGLE & PERSISTENCE
  // ==========================================================================

  function applyDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      if (darkModeToggle) {
        const icon = darkModeToggle.querySelector(".dark-mode-icon");
        const label = darkModeToggle.querySelector(".dark-mode-label");
        if (icon) icon.textContent = "☀️";
        if (label) label.textContent = "Light Mode";
      }
    } else {
      document.body.classList.remove("dark-mode");
      if (darkModeToggle) {
        const icon = darkModeToggle.querySelector(".dark-mode-icon");
        const label = darkModeToggle.querySelector(".dark-mode-label");
        if (icon) icon.textContent = "🌙";
        if (label) label.textContent = "Dark Mode";
      }
    }
  }

  // Restore dark mode on initial load
  const savedDarkMode = getStorage(STORAGE_KEYS.DARK_MODE, false);
  applyDarkMode(savedDarkMode);

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isCurrentlyDark = document.body.classList.contains("dark-mode");
      const newDarkModeState = !isCurrentlyDark;
      applyDarkMode(newDarkModeState);
      setStorage(STORAGE_KEYS.DARK_MODE, newDarkModeState);
    });
  }

  // ==========================================================================
  // 9. PRODUCT SEARCH & CATEGORY FILTERING
  // ==========================================================================

  // Store original options for dynamic filtering
  const originalProductOptions = productSelect ? Array.from(productSelect.querySelectorAll("option, optgroup")) : [];

  /**
   * Filters the product dropdown based on selected category.
   */
  function filterProductsByCategory(selectedCategory) {
    if (!productSelect) return;

    clearFieldError(categorySelect);
    clearFieldError(productSelect);

    // Reset dropdown
    productSelect.innerHTML = '<option value="" selected>-- Select Product --</option>';

    if (!selectedCategory) {
      // Re-populate all optgroups
      populateAllProductOptions();
      return;
    }

    // Find allowed product keys
    const allowedKeys = CATEGORY_MAP[selectedCategory] || [];
    
    // Create an optgroup for matching category
    const optgroup = document.createElement("optgroup");
    const categoryName = categorySelect.options[categorySelect.selectedIndex]?.text || "Filtered Products";
    optgroup.label = categoryName;

    Object.keys(PRODUCT_CATALOG).forEach((key) => {
      const item = PRODUCT_CATALOG[key];
      if (item.category === selectedCategory || allowedKeys.includes(key)) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${item.name} (${formatINR(item.price)}/${item.unit})`;
        optgroup.appendChild(opt);
      }
    });

    if (optgroup.children.length > 0) {
      productSelect.appendChild(optgroup);
    }
  }

  function populateAllProductOptions() {
    if (!productSelect) return;
    productSelect.innerHTML = '<option value="" selected>-- Select Product --</option>';

    const categories = [
      { label: "Grains", keys: ["rice", "wheat", "sugar", "salt", "cooking-oil"] },
      { label: "Dairy", keys: ["milk", "bread"] },
      { label: "Snacks & Beverages", keys: ["biscuits", "tea", "coffee", "juice"] },
      { label: "Fruits & Vegetables", keys: ["apples", "bananas", "tomatoes", "potatoes"] },
      { label: "Personal Care & Household", keys: ["soap", "shampoo", "toothpaste", "detergent"] }
    ];

    categories.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      group.keys.forEach((key) => {
        const item = PRODUCT_CATALOG[key];
        if (item) {
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = `${item.name} (${formatINR(item.price)}/${item.unit})`;
          optgroup.appendChild(opt);
        }
      });
      productSelect.appendChild(optgroup);
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      filterProductsByCategory(e.target.value);
    });
  }

  // Real-time Product Search Filter
  if (productSearchInput) {
    productSearchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      clearFieldError(productSearchInput);

      if (!query) {
        if (categorySelect && categorySelect.value) {
          filterProductsByCategory(categorySelect.value);
        } else {
          populateAllProductOptions();
        }
        return;
      }

      // Filter products matching search
      productSelect.innerHTML = '<option value="" selected>-- Select Product --</option>';
      const optgroup = document.createElement("optgroup");
      optgroup.label = `Search Results for "${query}"`;

      let matchFound = false;
      let firstMatchedCategory = "";
      let firstMatchedProductKey = "";

      Object.keys(PRODUCT_CATALOG).forEach((key) => {
        const item = PRODUCT_CATALOG[key];
        const matchName = item.name.toLowerCase().includes(query);
        const matchCategory = item.categoryName.toLowerCase().includes(query);
        const matchKey = key.toLowerCase().includes(query);

        if (matchName || matchCategory || matchKey) {
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = `${item.name} (${formatINR(item.price)}/${item.unit})`;
          optgroup.appendChild(opt);

          if (!matchFound) {
            matchFound = true;
            firstMatchedCategory = item.category;
            firstMatchedProductKey = key;
          }
        }
      });

      if (matchFound) {
        productSelect.appendChild(optgroup);
        productSelect.value = firstMatchedProductKey;
        if (categorySelect && firstMatchedCategory) {
          categorySelect.value = firstMatchedCategory;
        }
      } else {
        const noOpt = document.createElement("option");
        noOpt.disabled = true;
        noOpt.textContent = "No matching products found";
        productSelect.appendChild(noOpt);
      }
    });
  }

  // When product is selected, auto-sync category
  if (productSelect) {
    productSelect.addEventListener("change", (e) => {
      const selectedKey = e.target.value;
      clearFieldError(productSelect);
      if (selectedKey && PRODUCT_CATALOG[selectedKey]) {
        const item = PRODUCT_CATALOG[selectedKey];
        if (categorySelect) {
          categorySelect.value = item.category;
          clearFieldError(categorySelect);
        }
      }
    });
  }

  // ==========================================================================
  // 10. INPUT VALIDATION FUNCTIONS
  // ==========================================================================

  function validateCustomerName(showInlineError = true) {
    if (!customerNameInput) return false;
    const val = customerNameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]{2,}$/;

    if (!val) {
      if (showInlineError) setFieldError(customerNameInput, "Customer name is required.");
      return false;
    }
    if (val.length < 2) {
      if (showInlineError) setFieldError(customerNameInput, "Name must be at least 2 characters.");
      return false;
    }
    if (!nameRegex.test(val)) {
      if (showInlineError) setFieldError(customerNameInput, "Only alphabets and spaces allowed.");
      return false;
    }

    clearFieldError(customerNameInput);
    return true;
  }

  function validateCustomerPhone(showInlineError = true) {
    if (!customerPhoneInput) return true;
    const val = customerPhoneInput.value.trim();

    // Optional field for walk-ins
    if (val === "") {
      clearFieldError(customerPhoneInput);
      return true;
    }

    // Must be valid Indian 10-digit number starting with 6, 7, 8, 9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(val)) {
      if (showInlineError) {
        setFieldError(customerPhoneInput, "Must be a 10-digit Indian mobile no. (starts with 6, 7, 8, 9).");
      }
      return false;
    }

    clearFieldError(customerPhoneInput);
    return true;
  }

  function validateBillDateTime(showInlineError = true) {
    let isValid = true;

    if (!billDateInput || !billDateInput.value) {
      setCurrentDateTime();
    } else {
      const selectedDate = new Date(billDateInput.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        if (showInlineError) setFieldError(billDateInput, "Bill date cannot be in the future.");
        isValid = false;
      } else {
        clearFieldError(billDateInput);
      }
    }

    if (!billTimeInput || !billTimeInput.value) {
      setCurrentDateTime();
    } else {
      clearFieldError(billTimeInput);
    }

    return isValid;
  }

  function validateProductSelection(showInlineError = true) {
    let isValid = true;

    if (!categorySelect || !categorySelect.value) {
      if (showInlineError) setFieldError(categorySelect, "Please select a product category.");
      isValid = false;
    } else {
      clearFieldError(categorySelect);
    }

    if (!productSelect || !productSelect.value) {
      if (showInlineError) setFieldError(productSelect, "Please select a product item.");
      isValid = false;
    } else {
      clearFieldError(productSelect);
    }

    const qty = quantityInput ? Number(quantityInput.value) : 0;
    const wholeNumberRegex = /^[1-9]\d*$/;
    if (!quantityInput || !wholeNumberRegex.test(quantityInput.value.trim()) || qty < 1) {
      if (showInlineError) setFieldError(quantityInput, "Quantity must be a whole number ≥ 1.");
      isValid = false;
    } else {
      clearFieldError(quantityInput);
    }

    return isValid;
  }

  function validatePayment(showInlineError = true) {
    if (cart.length === 0) {
      if (showInlineError) showToast("Cart is empty. Add products before checkout.", "error");
      return false;
    }

    const grandTotal = currentTotals.grandTotal;
    const amountPaidVal = amountPaidInput ? Number(amountPaidInput.value) : 0;

    if (isNaN(amountPaidVal) || amountPaidVal < 0) {
      if (showInlineError) setFieldError(amountPaidInput, "Amount paid cannot be negative.");
      return false;
    }

    if (amountPaidVal < grandTotal) {
      const diff = grandTotal - amountPaidVal;
      if (showInlineError) {
        setFieldError(amountPaidInput, `Insufficient payment. ₹${diff.toFixed(2)} more required.`);
        showToast(`Amount paid (₹${amountPaidVal.toFixed(2)}) is less than Grand Total (₹${grandTotal.toFixed(2)}).`, "error");
      }
      return false;
    }

    clearFieldError(amountPaidInput);
    return true;
  }

  // Real-time input validation listeners
  if (customerNameInput) {
    customerNameInput.addEventListener("input", () => validateCustomerName(false));
    customerNameInput.addEventListener("blur", () => validateCustomerName(true));
  }

  if (customerPhoneInput) {
    customerPhoneInput.addEventListener("input", () => validateCustomerPhone(false));
    customerPhoneInput.addEventListener("blur", () => validateCustomerPhone(true));
  }

  if (quantityInput) {
    quantityInput.addEventListener("input", () => {
      clearFieldError(quantityInput);
      if (Number(quantityInput.value) < 1) {
        quantityInput.value = "1";
      }
    });
  }

  // ==========================================================================
  // 11. CART MANAGEMENT & TOTAL CALCULATIONS
  // ==========================================================================

  /**
   * Recalculates Subtotal, Discounts, GST (5%), and Grand Total.
   */
  function calculateBillingTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    cart.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const itemDiscount = item.discount || 0;
      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
    });

    const taxable = Math.max(0, subtotal - totalDiscount);
    const gst = taxable * 0.05; // 5% GST
    const otherCharges = 0.0;
    const grandTotal = taxable + gst + otherCharges;

    currentTotals = {
      subtotal,
      discount: totalDiscount,
      taxable,
      gst,
      otherCharges,
      grandTotal
    };

    // Update UI Summary Elements
    if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
    if (discountEl) discountEl.textContent = formatINR(totalDiscount);
    if (gstEl) gstEl.textContent = formatINR(gst);
    if (otherChargesEl) otherChargesEl.textContent = formatINR(otherCharges);
    if (grandTotalEl) grandTotalEl.textContent = formatINR(grandTotal);

    updatePaymentChange();
  }

  /**
   * Calculates and updates the customer's change amount in real time.
   */
  function updatePaymentChange() {
    if (!amountPaidInput || !changeAmountInput) return;

    const amountPaid = Number(amountPaidInput.value);
    const grandTotal = currentTotals.grandTotal;

    if (isNaN(amountPaid) || amountPaidInput.value === "") {
      changeAmountInput.value = formatINR(0);
      return;
    }

    if (amountPaid >= grandTotal) {
      const change = amountPaid - grandTotal;
      changeAmountInput.value = formatINR(change);
      clearFieldError(amountPaidInput);
    } else {
      changeAmountInput.value = formatINR(0);
    }
  }

  if (amountPaidInput) {
    amountPaidInput.addEventListener("input", updatePaymentChange);
  }

  // Listen to payment radio changes to assist quick fill
  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "UPI" || radio.value === "Card") {
        // Auto-fill exact grand total for digital transactions if empty or smaller
        if (currentTotals.grandTotal > 0 && (!amountPaidInput.value || Number(amountPaidInput.value) < currentTotals.grandTotal)) {
          amountPaidInput.value = currentTotals.grandTotal.toFixed(2);
          updatePaymentChange();
        }
      }
    });
  });

  /**
   * Re-renders the shopping cart table rows.
   */
  function renderCartTable() {
    if (!cartItemsTbody) return;

    cartItemsTbody.innerHTML = "";

    if (cart.length === 0) {
      if (emptyCartNotice) emptyCartNotice.style.display = "block";
      calculateBillingTotals();
      return;
    }

    if (emptyCartNotice) emptyCartNotice.style.display = "none";

    cart.forEach((item, index) => {
      const tr = document.createElement("tr");

      const srNo = index + 1;
      const itemTotal = (item.price * item.quantity) - item.discount;

      tr.innerHTML = `
        <td><strong>${srNo}</strong></td>
        <td>${item.name} <span style="font-size:0.75rem; color:var(--text-muted);">(${item.unit})</span></td>
        <td>${item.categoryName}</td>
        <td>
          <input type="number" class="form-control cart-qty-inline" data-index="${index}" value="${item.quantity}" min="1" step="1" style="width:70px; padding:4px 8px; text-align:center;">
        </td>
        <td>${formatINR(item.price)}</td>
        <td>${formatINR(item.discount)}</td>
        <td><strong>${formatINR(itemTotal)}</strong></td>
        <td>
          <button type="button" class="btn-delete-row" data-index="${index}" title="Remove Item">✕ Remove</button>
        </td>
      `;

      cartItemsTbody.appendChild(tr);
    });

    // Attach row remove listeners
    cartItemsTbody.querySelectorAll(".btn-delete-row").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemIdx = Number(e.currentTarget.getAttribute("data-index"));
        removeItemFromCart(itemIdx);
      });
    });

    // Attach inline quantity change listeners
    cartItemsTbody.querySelectorAll(".cart-qty-inline").forEach((input) => {
      input.addEventListener("change", (e) => {
        const itemIdx = Number(e.target.getAttribute("data-index"));
        const newQty = parseInt(e.target.value, 10);
        if (isNaN(newQty) || newQty < 1) {
          e.target.value = cart[itemIdx].quantity;
          showToast("Quantity must be a positive whole number ≥ 1.", "error");
          return;
        }
        updateItemQuantity(itemIdx, newQty);
      });
    });

    calculateBillingTotals();
  }

  function addItemToCart(productKey, quantity) {
    const product = PRODUCT_CATALOG[productKey];
    if (!product) return;

    // Check if item already exists in cart
    const existingIndex = cart.findIndex((item) => item.key === productKey);

    if (existingIndex > -1) {
      // Increase quantity of existing item
      cart[existingIndex].quantity += quantity;
      
      // Calculate discount (apply discount rule: product discount percentage or 5% on 5+ qty)
      const baseDiscountPercent = product.discountPercent || (cart[existingIndex].quantity >= 5 ? 5 : 0);
      const gross = product.price * cart[existingIndex].quantity;
      cart[existingIndex].discount = Math.min(gross, (gross * baseDiscountPercent) / 100);
      cart[existingIndex].total = gross - cart[existingIndex].discount;

      showToast(`Updated quantity for ${product.name} (Total: ${cart[existingIndex].quantity})`, "success");
    } else {
      // Add new cart item
      const baseDiscountPercent = product.discountPercent || (quantity >= 5 ? 5 : 0);
      const gross = product.price * quantity;
      const discount = Math.min(gross, (gross * baseDiscountPercent) / 100);

      cart.push({
        id: "ITEM-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        key: productKey,
        name: product.name,
        category: product.category,
        categoryName: product.categoryName,
        unit: product.unit,
        quantity: quantity,
        price: product.price,
        discount: discount,
        total: gross - discount
      });

      showToast(`Added ${quantity} × ${product.name} to cart.`, "success");
    }

    renderCartTable();
    
    // Reset product input quantity back to 1
    if (quantityInput) quantityInput.value = "1";
  }

  function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1)[0];
      showToast(`Removed "${removed.name}" from cart.`, "info");
      renderCartTable();
    }
  }

  function updateItemQuantity(index, newQuantity) {
    if (index >= 0 && index < cart.length && newQuantity >= 1) {
      const item = cart[index];
      item.quantity = newQuantity;
      const product = PRODUCT_CATALOG[item.key] || item;
      const baseDiscountPercent = product.discountPercent || (newQuantity >= 5 ? 5 : 0);
      const gross = item.price * newQuantity;
      item.discount = Math.min(gross, (gross * baseDiscountPercent) / 100);
      item.total = gross - item.discount;
      
      renderCartTable();
      showToast(`Updated "${item.name}" quantity to ${newQuantity}.`, "success");
    }
  }

  // ==========================================================================
  // 12. BUTTON ACTIONS & INTERACTIONS
  // ==========================================================================

  // Add to Cart Button
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const isValid = validateProductSelection(true);
      if (!isValid) return;

      const productKey = productSelect.value;
      const qty = parseInt(quantityInput.value, 10);
      addItemToCart(productKey, qty);
    });
  }

  // Focus on Add Product
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      if (categorySelect) {
        categorySelect.scrollIntoView({ behavior: "smooth", block: "center" });
        categorySelect.focus();
      }
    });
  }

  // Update Cart Button
  if (updateCartBtn) {
    updateCartBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Cart is empty. Nothing to update.", "info");
        return;
      }
      renderCartTable();
      showToast("Cart recalculations synchronized successfully.", "success");
    });
  }

  // Clear Cart Button
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        showToast("Cart is already empty.", "info");
        return;
      }

      if (window.confirm("Are you sure you want to clear all items from the cart?")) {
        cart = [];
        renderCartTable();
        if (amountPaidInput) amountPaidInput.value = "";
        if (changeAmountInput) changeAmountInput.value = formatINR(0);
        showToast("Cart has been cleared.", "info");
      }
    });
  }

  // New Bill Button
  if (newBillBtn) {
    newBillBtn.addEventListener("click", () => {
      if (cart.length > 0) {
        if (!window.confirm("Start a new bill? Any unsaved cart items will be cleared.")) {
          return;
        }
      }

      // Reset cart and customer details
      cart = [];
      renderCartTable();
      clearAllFieldErrors();

      if (customerNameInput) customerNameInput.value = "";
      if (customerPhoneInput) customerPhoneInput.value = "";
      if (productSearchInput) productSearchInput.value = "";
      if (categorySelect) categorySelect.value = "";
      populateAllProductOptions();
      if (quantityInput) quantityInput.value = "1";
      if (amountPaidInput) amountPaidInput.value = "";
      if (changeAmountInput) changeAmountInput.value = formatINR(0);

      // Refresh date/time and increment bill number
      setCurrentDateTime();
      incrementBillNumber();

      showToast("Started new fresh bill session.", "success");

      // Scroll to billing top
      if (billingSection) {
        billingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // ==========================================================================
  // 13. BILL GENERATION & INVOICE POPULATION
  // ==========================================================================

  function getSelectedPaymentMethod() {
    let method = "Cash";
    paymentMethodRadios.forEach((radio) => {
      if (radio.checked) {
        method = radio.value;
      }
    });
    return method;
  }

  /**
   * Generates and populates the printable invoice DOM structure.
   */
  function generateInvoiceData() {
    const billNo = billNumberInput ? billNumberInput.value : "BILL-1001";
    const billDate = billDateInput ? billDateInput.value : new Date().toISOString().split("T")[0];
    const billTime = billTimeInput ? billTimeInput.value : new Date().toLocaleTimeString();
    const custName = customerNameInput && customerNameInput.value.trim() ? customerNameInput.value.trim() : "Walk-in Customer";
    const paymentMethod = getSelectedPaymentMethod();
    const amountPaid = amountPaidInput ? Number(amountPaidInput.value) || currentTotals.grandTotal : currentTotals.grandTotal;
    const change = Math.max(0, amountPaid - currentTotals.grandTotal);

    // Update Printable Section Header
    if (printBillNumberEl) printBillNumberEl.textContent = billNo;
    if (printBillDateEl) printBillDateEl.textContent = billDate;
    if (printBillTimeEl) printBillTimeEl.textContent = billTime;
    if (printCustomerNameEl) printCustomerNameEl.textContent = custName;

    // Populate Invoice Item Rows
    if (invoiceItemsTbody) {
      invoiceItemsTbody.innerHTML = "";
      cart.forEach((item) => {
        const itemTotal = (item.price * item.quantity) - item.discount;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${formatINR(item.price)}</td>
          <td>${formatINR(item.discount)}</td>
          <td>${formatINR(itemTotal)}</td>
        `;
        invoiceItemsTbody.appendChild(row);
      });
    }

    // Populate Calculation Summaries
    if (printSubtotalEl) printSubtotalEl.textContent = formatINR(currentTotals.subtotal);
    if (printDiscountEl) printDiscountEl.textContent = formatINR(currentTotals.discount);
    if (printGstEl) printGstEl.textContent = formatINR(currentTotals.gst);
    if (printOtherChargesEl) printOtherChargesEl.textContent = formatINR(currentTotals.otherCharges);
    if (printGrandTotalEl) printGrandTotalEl.textContent = formatINR(currentTotals.grandTotal);

    // Populate Payment Details
    if (printPaymentMethodEl) printPaymentMethodEl.textContent = paymentMethod;
    if (printAmountPaidEl) printAmountPaidEl.textContent = formatINR(amountPaid);
    if (printChangeEl) printChangeEl.textContent = formatINR(change);
  }

  // Generate Bill Button Click
  if (generateBillBtn) {
    generateBillBtn.addEventListener("click", () => {
      // Validate all aspects
      const isNameValid = validateCustomerName(true);
      const isPhoneValid = validateCustomerPhone(true);
      const isDateTimeValid = validateBillDateTime(true);
      const isPaymentValid = validatePayment(true);

      if (!isNameValid || !isPhoneValid || !isDateTimeValid || !isPaymentValid) {
        showToast("Please complete and correct the required fields before generating bill.", "error");
        return;
      }

      // Generate invoice
      generateInvoiceData();

      // Update dashboard
      updateDashboardMetricsOnBill(currentTotals.grandTotal);

      showToast(`Bill ${billNumberInput.value} generated successfully!`, "success");

      // Smooth scroll to the printable bill preview
      const printableBill = document.getElementById("printableBill");
      if (printableBill) {
        printableBill.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Print Bill Button Click
  if (printBillBtn) {
    printBillBtn.addEventListener("click", () => {
      const isNameValid = validateCustomerName(true);
      const isPhoneValid = validateCustomerPhone(true);
      const isPaymentValid = validatePayment(true);

      if (!isNameValid || !isPhoneValid || !isPaymentValid) {
        showToast("Please fix validation errors before printing bill.", "error");
        return;
      }

      // Ensure latest data is populated
      generateInvoiceData();

      // Call browser native print
      setTimeout(() => {
        window.print();
      }, 150);
    });
  }

  // ==========================================================================
  // 14. INITIAL BOOTSTRAP EXECUTION
  // ==========================================================================

  function initApp() {
    setCurrentDateTime();
    initializeBillNumber();
    populateAllProductOptions();
    loadDashboardMetrics();
    renderCartTable();
  }

  initApp();
});
