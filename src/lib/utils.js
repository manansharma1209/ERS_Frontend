import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Plane, 
  Laptop, 
  ShoppingBag, 
  Car, 
  Home 
} from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getCategoryIcon(category) {
  const icons = {
    TRAVEL: Plane,
    ELECTRONICS: Laptop,
    CLOTHES: ShoppingBag,
    VEHICLE: Car,
    ACCOMMODATION: Home,
  };
  return icons[category] || ShoppingBag;
}

export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function validateFileUpload(file, allowedTypes, maxSize) {
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.floor(maxSize / 1024 / 1024)}MB`
    };
  }

  return { valid: true, error: null };
}

export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
}

export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const valueA = typeof key === 'function' ? key(a) : a[key];
    const valueB = typeof key === 'function' ? key(b) : b[key];
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function createQueryString(params) {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export function parseQueryString(queryString) {
  if (!queryString) return {};
  return Object.fromEntries(
    queryString
      .substring(1)
      .split('&')
      .map(param => {
        const [key, value] = param.split('=');
        return [decodeURIComponent(key), decodeURIComponent(value)];
      })
  );
}

export function getFirstName(name) {
  if (!name) return '';
  return name.split(' ')[0];
}

export function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
}

export function getTokenExpirationTime(token) {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}