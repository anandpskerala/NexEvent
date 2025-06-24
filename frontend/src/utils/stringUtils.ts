export const captialize = (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
}

export const formatPrice = (currency: string, eventType: string, price?: string) => {
    let currencyStr = "$";
    if (currency == "INR") {
        currencyStr = "₹";
    }

    let result = "Free";
    if (eventType == "paid") {
        result = `${currencyStr}${price}`;
    }
    return result;
}

export const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export const formatTime = (time: string) => {
    return time || 'TBA';
};

export const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    return `${formattedDate} • ${formattedTime}`;
};

export const formatTimeAgo = (isoDate: string): string => {
    const now = new Date();
    const past = new Date(isoDate);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day(s) ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} week(s) ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} month(s) ago`;

    return `${Math.floor(diff / 31536000)} year(s) ago`;
};
