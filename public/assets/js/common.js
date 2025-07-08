/**
 * Common JavaScript utilities for the application
 */

// Common validation patterns
const validationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    name: /^[a-zA-Z\s'-]{2,50}$/,
    username: /^[a-zA-Z0-9_-]{3,20}$/,
    phone: /^\+?[0-9]{10,15}$/,
    numeric: /^[0-9]+$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    alphaNumeric: /^[a-zA-Z0-9\s]+$/,
};

// Error messages for different validation types
const errorMessages = {
    required: "This field is required.",
    email: "Please enter a valid email address.",
    password:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    confirmPassword: "Passwords do not match.",
    name: "Please enter a valid name.",
    username:
        "Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens.",
    phone: "Please enter a valid phone number.",
    min: "This field must have at least {0} characters.",
    max: "This field cannot exceed {0} characters.",
    numeric: "Please enter a valid number.",
    date: "Please enter a valid date in YYYY-MM-DD format.",
    alphaNumeric: "This field can only contain letters and numbers.",
};

/**
 * Initialize form validation for a specific form
 * @param {string} formId - The ID of the form to validate
 * @returns {boolean} Whether initialization was successful
 */
function initFormValidation(formId) {
    const form = document.getElementById(formId);

    if (!form) return false;

    // Get all form inputs
    const inputs = form.querySelectorAll("input, select, textarea");

    // Add blur event listeners to all inputs for real-time validation
    inputs.forEach((input) => {
        input.addEventListener("blur", function () {
            validateInput(input);
        });
    });

    return true;
}

/**
 * Validate a specific input based on its attributes
 * @param {HTMLElement} input - The input element to validate
 * @returns {boolean} Whether the input is valid
 */
function validateInput(input) {
    // Reset previous validation state
    const errorElement = document.getElementById(input.id + "Error");
    if (errorElement) {
        errorElement.style.display = "none";
    }

    // Skip validation if the input is disabled
    if (input.disabled) return true;

    // Required validation
    if (input.hasAttribute("required") && !input.value.trim()) {
        showError(input, errorMessages.required);
        return false;
    }

    // Skip further validation if field is empty and not required
    if (!input.value.trim() && !input.hasAttribute("required")) {
        return true;
    }

    // Email validation
    if (input.type === "email") {
        if (!validationPatterns.email.test(input.value)) {
            showError(input, errorMessages.email);
            return false;
        }
    }

    // Password validation
    if (input.type === "password" && input.id !== "confirmPassword") {
        if (
            input.getAttribute("data-validate") === "password" &&
            !validationPatterns.password.test(input.value)
        ) {
            showError(input, errorMessages.password);
            return false;
        }
    }

    // Confirm password validation
    if (input.id === "confirmPassword") {
        const passwordInput =
            document.getElementById("password") ||
            document.getElementById("newPassword");
        if (passwordInput && input.value !== passwordInput.value) {
            showError(input, errorMessages.confirmPassword);
            return false;
        }
    }

    // Name validation
    if (input.getAttribute("data-validate") === "name") {
        if (!validationPatterns.name.test(input.value)) {
            showError(input, errorMessages.name);
            return false;
        }
    }

    // Username validation
    if (input.getAttribute("data-validate") === "username") {
        if (!validationPatterns.username.test(input.value)) {
            showError(input, errorMessages.username);
            return false;
        }
    }

    // Phone validation
    if (
        input.type === "tel" ||
        input.getAttribute("data-validate") === "phone"
    ) {
        if (!validationPatterns.phone.test(input.value)) {
            showError(input, errorMessages.phone);
            return false;
        }
    }

    // Numeric validation
    if (input.getAttribute("data-validate") === "numeric") {
        if (!validationPatterns.numeric.test(input.value)) {
            showError(input, errorMessages.numeric);
            return false;
        }
    }

    // Min length validation
    if (input.hasAttribute("minlength")) {
        const minLength = parseInt(input.getAttribute("minlength"), 10);
        if (input.value.length < minLength) {
            showError(input, errorMessages.min.replace("{0}", minLength));
            return false;
        }
    }

    // Max length validation
    if (input.hasAttribute("maxlength")) {
        const maxLength = parseInt(input.getAttribute("maxlength"), 10);
        if (input.value.length > maxLength) {
            showError(input, errorMessages.max.replace("{0}", maxLength));
            return false;
        }
    }

    // Date validation
    if (
        input.type === "date" ||
        input.getAttribute("data-validate") === "date"
    ) {
        if (!validationPatterns.date.test(input.value)) {
            showError(input, errorMessages.date);
            return false;
        }
    }

    // Alpha-numeric validation
    if (input.getAttribute("data-validate") === "alphaNumeric") {
        if (!validationPatterns.alphaNumeric.test(input.value)) {
            showError(input, errorMessages.alphaNumeric);
            return false;
        }
    }

    // Custom pattern validation
    if (input.hasAttribute("pattern")) {
        const pattern = new RegExp(input.getAttribute("pattern"));
        if (!pattern.test(input.value)) {
            const customMessage =
                input.getAttribute("data-error-message") ||
                "Please match the requested format.";
            showError(input, customMessage);
            return false;
        }
    }

    return true;
}

/**
 * Show error message for an input
 * @param {HTMLElement} input - The input element with the error
 * @param {string} message - The error message to display
 */
function showError(input, message) {
    const errorElement = document.getElementById(input.id + "Error");

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    } else {
        // If no error element exists, create one
        const newErrorElement = document.createElement("span");
        newErrorElement.id = input.id + "Error";
        newErrorElement.className = "error-text";
        newErrorElement.textContent = message;
        newErrorElement.style.display = "block";

        // Insert after the input
        input.parentNode.insertBefore(newErrorElement, input.nextSibling);
    }

    // Add error class to input
    input.classList.add("error");
}

/**
 * Validate entire form
 * @param {string} formId - The ID of the form to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(formId) {
    const form = document.getElementById(formId);

    if (!form) return false;

    // Get all form inputs
    const inputs = form.querySelectorAll(
        "input:not([disabled]), select:not([disabled]), textarea:not([disabled])"
    );

    let isValid = true;

    // Validate each input
    inputs.forEach((input) => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Clear form errors
 * @param {string} formId - The ID of the form to clear errors from
 */
function clearFormErrors(formId) {
    const form = document.getElementById(formId);

    if (!form) return;

    // Remove all error messages
    const errorElements = form.querySelectorAll(".error-text");
    errorElements.forEach((element) => {
        element.style.display = "none";
    });

    // Remove error class from inputs
    const inputs = form.querySelectorAll(".error");
    inputs.forEach((input) => {
        input.classList.remove("error");
    });
}

/**
 * Reset form to initial state
 * @param {string} formId - The ID of the form to reset
 */
function resetForm(formId) {
    const form = document.getElementById(formId);

    if (!form) return;

    // Reset the form
    form.reset();

    // Clear any validation errors
    clearFormErrors(formId);
}

/**
 * Show a message with automatic timeout
 * @param {string} messageId - The ID of the message element
 * @param {string} text - Optional text to set in the message
 * @param {number} timeout - Time in milliseconds before hiding the message (0 for no auto-hide)
 */
function showMessage(messageId, text = null, timeout = 3000) {
    const messageElement = document.getElementById(messageId);

    if (!messageElement) return;

    // Set message text if provided
    if (text) {
        // Find span or other text container, or use the element itself
        const textContainer =
            messageElement.querySelector("[data-message-text]") ||
            messageElement;
        textContainer.textContent = text;
    }

    // Display the message
    messageElement.style.display = "block";

    // Auto-hide after timeout if specified
    if (timeout > 0) {
        setTimeout(() => {
            messageElement.style.display = "none";
        }, timeout);
    }
}

/**
 * Hide a message
 * @param {string} messageId - The ID of the message element to hide
 */
function hideMessage(messageId) {
    const messageElement = document.getElementById(messageId);

    if (messageElement) {
        messageElement.style.display = "none";
    }
}

/**
 * Display confirmation dialog
 * @param {string} modalId - The ID of the modal element
 * @param {object} options - Configuration options
 * @returns {Promise} A promise that resolves with true if confirmed, false otherwise
 */
function showConfirmDialog(modalId, options = {}) {
    return new Promise((resolve) => {
        const modal = document.getElementById(modalId);
        if (!modal) {
            resolve(false);
            return;
        }

        // Set title and message if provided
        if (options.title) {
            const titleEl = modal.querySelector(".modal-title");
            if (titleEl) titleEl.textContent = options.title;
        }

        if (options.message) {
            const bodyEl = modal.querySelector(".modal-body");
            if (bodyEl) bodyEl.textContent = options.message;
        }

        // Show the modal
        modal.classList.add("show");

        // Get confirm and cancel buttons
        const confirmButton = modal.querySelector("[data-confirm]");
        const cancelButton = modal.querySelector("[data-cancel]");

        // Handle confirmation
        const handleConfirm = () => {
            modal.classList.remove("show");
            confirmButton?.removeEventListener("click", handleConfirm);
            cancelButton?.removeEventListener("click", handleCancel);
            resolve(true);
        };

        // Handle cancellation
        const handleCancel = () => {
            modal.classList.remove("show");
            confirmButton?.removeEventListener("click", handleConfirm);
            cancelButton?.removeEventListener("click", handleCancel);
            resolve(false);
        };

        // Add event listeners
        if (confirmButton)
            confirmButton.addEventListener("click", handleConfirm);
        if (cancelButton) cancelButton.addEventListener("click", handleCancel);

        // Handle clicking outside the modal to cancel
        const handleOutsideClick = (e) => {
            if (e.target === modal) {
                handleCancel();
            }
        };

        window.addEventListener("click", handleOutsideClick, { once: true });
    });
}

/**
 * Handle file upload with preview
 * @param {string} inputId - The ID of the file input element
 * @param {string} previewId - The ID of the img element for preview
 * @param {string} uploadContainerId - The ID of the upload container
 */
function setupFileUpload(inputId, previewId, uploadContainerId) {
    const fileInput = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const container = document.getElementById(uploadContainerId);

    if (!fileInput || !preview) return;

    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";

                // Hide upload content if container exists
                if (container) {
                    const uploadContent =
                        container.querySelector(".upload-content");
                    if (uploadContent) {
                        uploadContent.style.display = "none";
                    }
                }
            };
            reader.readAsDataURL(file);

            // Clear any validation errors
            const errorElement = document.getElementById(
                fileInput.id + "Error"
            );
            if (errorElement) {
                errorElement.style.display = "none";
            }
        }
    });
}

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {string} currency - The currency code
 * @param {string} locale - The locale to use
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currency = "USD", locale = "en-US") {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
}

/**
 * Format a date
 * @param {Date|string} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @param {string} locale - The locale to use
 * @returns {string} Formatted date string
 */
function formatDate(date, options = {}, locale = "en-US") {
    const defaultOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
    };

    const dateObj = date instanceof Date ? date : new Date(date);

    return new Intl.DateTimeFormat(locale, {
        ...defaultOptions,
        ...options,
    }).format(dateObj);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {function} fn - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {function} The debounced function
 */
function debounce(fn, delay = 300) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * Initialize data table with sorting and pagination
 * @param {string} tableId - The ID of the table element
 * @param {object} options - Configuration options
 */
function initDataTable(tableId, options = {}) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const defaultOptions = {
        perPage: 10,
        pagination: true,
        sortable: true,
    };

    const settings = { ...defaultOptions, ...options };

    // Implementation for sortable data tables and pagination would go here
    // This is a placeholder for a more complex implementation
}

/**
 * Export public methods and constants
 */
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validationPatterns,
        errorMessages,
        initFormValidation,
        validateInput,
        validateForm,
        showError,
        clearFormErrors,
        resetForm,
        showMessage,
        hideMessage,
        showConfirmDialog,
        setupFileUpload,
        formatCurrency,
        formatDate,
        debounce,
        initDataTable,
    };
}

// Xử lý dropdown menu
document.addEventListener("DOMContentLoaded", function () {
    // Xử lý user profile dropdown
    const userProfileDropdown = document.getElementById("userProfileDropdown");

    if (userProfileDropdown) {
        // Toggle dropdown khi click
        userProfileDropdown.addEventListener("click", function (e) {
            // Ngăn việc click vào dropdown-item đóng dropdown
            if (e.target.closest(".dropdown-item")) {
                return;
            }

            this.classList.toggle("active");
        });

        // Đóng dropdown khi click ra ngoài
        document.addEventListener("click", function (e) {
            if (!e.target.closest("#userProfileDropdown")) {
                userProfileDropdown.classList.remove("active");
            }
        });
    }
});


const menuItems = document.querySelectorAll("menu-item");
