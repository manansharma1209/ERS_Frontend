export const disableRightClick = (e) => {
  e.preventDefault();
  return false;
};

export const disableDevTools = () => {
  document.addEventListener('keydown', (e) => {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+U (view source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
  });
};