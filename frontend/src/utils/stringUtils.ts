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