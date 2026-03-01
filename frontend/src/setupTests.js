import '@testing-library/jest-dom';

// Mock IntersectionObserver which isn't available in jsdom
class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
}

window.IntersectionObserver = IntersectionObserver;
