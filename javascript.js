// =====================================================
// FRESHMART GROCERY SHOP BILLING SYSTEM
// JavaScript Validation
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------------------------
    // Get HTML Elements
    // -------------------------------------------------

    const customerName = document.getElementById("customerName");
    const customerPhone = document.getElementById("customerPhone");
    const billDate = document.getElementById("billDate");
    const billTime = document.getElementById("billTime");

    const productSearch = document.getElementById("productSearch");
    const categorySelect = document.getElementById("categorySelect");
    const productSelect = document.getElementById("productSelect");
    const quantity = document.getElementById("quantity");

    const amountPaid = document.getElementById("amountPaid");

    const addToCartBtn = document.getElementById("addToCartBtn");
    const generateBillBtn = document.getElementById("generateBillBtn");
    const printBillBtn = document.getElementById("printBillBtn");
    const clearCartBtn = document.getElementById("clearCartBtn");
    const newBillBtn = document.getElementById("newBillBtn");

    const cartItems = document.getElementById("cartItems");
    const emptyCartNotice = document.getElementById("emptyCartNotice");

    const grandTotal = document.getElementById("grandTotal");
    const changeAmount = document.getElementById("changeAmount");


    // =================================================
    // 1. CUSTOMER NAME VALIDATION
    // =================================================

    customerName.addEventListener("input", function () {

        // Allow only letters and spaces
        this.value = this.value.replace(/[^a-zA-Z\s]/g, "");

        if (this.value.trim().length < 2) {
            this.setCustomValidity(
                "Customer name must contain at least 2 characters."
            );
        } else {
            this.setCustomValidity("");
        }
    });


    // =================================================
    // 2. CUSTOMER MOBILE NUMBER VALIDATION
    // =================================================

    customerPhone.addEventListener("input", function () {

        // Allow only numbers
        this.value = this.value.replace(/[^0-9]/g, "");

        if (this.value.length !== 10) {

            this.setCustomValidity(
                "Mobile number must contain exactly 10 digits."
            );

        } else if (!/^[6-9][0-9]{9}$/.test(this.value)) {

            this.setCustomValidity(
                "Enter a valid Indian mobile number."
            );

        } else {

            this.setCustomValidity("");
        }
    });


    // =================================================
    // 3. DATE VALIDATION
    // =================================================

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;

    // Prevent future date
    billDate.max = todayDate;

    billDate.addEventListener("change", function () {

        if (this.value > todayDate) {

            alert("Bill date cannot be a future date.");

            this.value = todayDate;
        }
    });


    // =================================================
    // 4. TIME VALIDATION
    // =================================================

    billTime.addEventListener("change", function () {

        if (this.value === "") {

            alert("Please select bill time.");

        }
    });


    // =================================================
    // 5. PRODUCT SEARCH VALIDATION
    // =================================================

    productSearch.addEventListener("input", function () {

        // Remove unwanted special characters
        this.value = this.value.replace(/[^a-zA-Z0-9\s-]/g, "");

    });


    // =================================================
    // 6. CATEGORY VALIDATION
    // =================================================

    categorySelect.addEventListener("change", function () {

        if (this.value === "") {

            this.setCustomValidity(
                "Please select a product category."
            );

        } else {

            this.setCustomValidity("");
        }
    });


    // =================================================
    // 7. PRODUCT VALIDATION
    // =================================================

    productSelect.addEventListener("change", function () {

        if (this.value === "") {

            this.setCustomValidity(
                "Please select a product."
            );

        } else {

            this.setCustomValidity("");
        }
    });


    // =================================================
    // 8. QUANTITY VALIDATION
    // =================================================

    quantity.addEventListener("input", function () {

        let qty = Number(this.value);

        if (qty < 1 || !Number.isInteger(qty)) {

            this.setCustomValidity(
                "Quantity must be a positive whole number."
            );

        } else {

            this.setCustomValidity("");
        }
    });


    // =================================================
    // 9. AMOUNT PAID VALIDATION
    // =================================================

    amountPaid.addEventListener("input", function () {

        let paid = Number(this.value);

        if (paid < 0) {

            this.setCustomValidity(
                "Amount paid cannot be negative."
            );

            return;
        }

        this.setCustomValidity("");

        calculateChange();
    });


    // =================================================
    // 10. CALCULATE CHANGE
    // =================================================

    function calculateChange() {

        let totalText = grandTotal.textContent;

        // Remove ₹ symbol and comma
        let total = parseFloat(
            totalText.replace(/[₹,]/g, "")
        ) || 0;

        let paid = parseFloat(amountPaid.value) || 0;

        let change = paid - total;

        if (change >= 0) {

            changeAmount.value =
                "₹" + change.toFixed(2);

        } else {

            changeAmount.value =
                "₹0.00";
        }
    }


    // =================================================
    // 11. ADD TO CART VALIDATION
    // =================================================

    addToCartBtn.addEventListener("click", function () {

        // Check customer name
        if (customerName.value.trim() === "") {

            alert("Please enter customer name.");
            customerName.focus();
            return;
        }

        // Check product
        if (productSelect.value === "") {

            alert("Please select a product.");
            productSelect.focus();
            return;
        }

        // Check category
        if (categorySelect.value === "") {

            alert("Please select a category.");
            categorySelect.focus();
            return;
        }

        // Check quantity
        let qty = Number(quantity.value);

        if (qty < 1 || !Number.isInteger(qty)) {

            alert("Please enter a valid quantity.");
            quantity.focus();
            return;
        }

        alert("Product validation successful. Product can be added to cart.");

    });


    // =================================================
    // 12. CHECK WHETHER CART IS EMPTY
    // =================================================

    function isCartEmpty() {

        return cartItems.children.length === 0;
    }


    // =================================================
    // 13. GENERATE BILL VALIDATION
    // =================================================

    generateBillBtn.addEventListener("click", function () {

        // Customer name
        if (customerName.value.trim() === "") {

            alert("Please enter customer name.");
            customerName.focus();
            return;
        }


        // Mobile number
        if (
            customerPhone.value !== "" &&
            !/^[6-9][0-9]{9}$/.test(customerPhone.value)
        ) {

            alert("Please enter a valid 10-digit mobile number.");
            customerPhone.focus();
            return;
        }


        // Date
        if (billDate.value === "") {

            alert("Please select bill date.");
            billDate.focus();
            return;
        }


        // Time
        if (billTime.value === "") {

            alert("Please select bill time.");
            billTime.focus();
            return;
        }


        // Cart
        if (isCartEmpty()) {

            alert("Cannot generate bill. Please add at least one product.");
            return;
        }


        // Payment
        let total = parseFloat(
            grandTotal.textContent.replace(/[₹,]/g, "")
        ) || 0;

        let paid = parseFloat(amountPaid.value) || 0;


        if (amountPaid.value === "") {

            alert("Please enter amount paid.");
            amountPaid.focus();
            return;
        }


        if (paid < total) {

            alert(
                "Amount paid cannot be less than the grand total."
            );

            amountPaid.focus();
            return;
        }


        alert("Bill generated successfully!");

    });


    // =================================================
    // 14. PRINT BILL VALIDATION
    // =================================================

    printBillBtn.addEventListener("click", function () {

        if (isCartEmpty()) {

            alert("There are no products in the cart.");
            return;
        }


        let total = parseFloat(
            grandTotal.textContent.replace(/[₹,]/g, "")
        ) || 0;

        let paid = parseFloat(amountPaid.value) || 0;


        if (paid < total) {

            alert(
                "Please enter sufficient payment before printing the bill."
            );

            amountPaid.focus();
            return;
        }


        window.print();

    });


    // =================================================
    // 15. CLEAR CART CONFIRMATION
    // =================================================

    clearCartBtn.addEventListener("click", function () {

        if (isCartEmpty()) {

            alert("Cart is already empty.");
            return;
        }


        let confirmation = confirm(
            "Are you sure you want to clear the cart?"
        );


        if (confirmation) {

            cartItems.innerHTML = "";

            emptyCartNotice.style.display = "block";

            alert("Cart cleared successfully.");

        }

    });


    // =================================================
    // 16. NEW BILL VALIDATION
    // =================================================

    newBillBtn.addEventListener("click", function () {

        let confirmation = confirm(
            "Start a new bill? Current bill information will be cleared."
        );


        if (!confirmation) {
            return;
        }


        customerName.value = "";
        customerPhone.value = "";

        productSearch.value = "";
        categorySelect.value = "";
        productSelect.value = "";

        quantity.value = 1;

        amountPaid.value = "";

        changeAmount.value = "₹0.00";

        cartItems.innerHTML = "";

        emptyCartNotice.style.display = "block";

        alert("New bill started successfully.");

    });


    // =================================================
    // 17. PREVENT INVALID FORM SUBMISSION
    // =================================================

    const allInputs = document.querySelectorAll(
        "input, select"
    );

    allInputs.forEach(function (input) {

        input.addEventListener("blur", function () {

            this.checkValidity();

        });

    });


    // =================================================
    // 18. INITIAL DATE AND TIME
    // =================================================

    if (billDate.value === "") {

        billDate.value = todayDate;

    }


    const currentTime = new Date();

    const hours = String(
        currentTime.getHours()
    ).padStart(2, "0");

    const minutes = String(
        currentTime.getMinutes()
    ).padStart(2, "0");


    if (billTime.value === "") {

        billTime.value = `${hours}:${minutes}`;

    }


    // =================================================
    // 19. INITIAL CART MESSAGE
    // =================================================

    if (isCartEmpty()) {

        emptyCartNotice.style.display = "block";

    }

});