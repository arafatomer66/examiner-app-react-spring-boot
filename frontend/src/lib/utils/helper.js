function setLocalStorageWithExpiration(key, value, expirationMinutes = 0, expirationDays = 0) {
    const now = new Date().getTime();
    // Expiration time in milliseconds (expirationMinutes * 60 seconds * 1000 milliseconds)
    const expirationTimeMinutes = now + expirationMinutes * 60 * 1000;
    const expirationTimeDays = now + expirationDays * 24 * 60 * 60 * 1000;

    const item = {
        value: value,
        expirationMinutes: expirationMinutes,
        expirationDays: expirationTimeDays,
    };
    localStorage.setItem(key, item);
}

// function setLocalStorageWithExpiration(key, value, expirationMinutes = 0, expirationDays = 0) {

//     const tokenValue = JSON.parse(localStorage.getItem(key));
//     if (tokenValue === null) {
//         // Token has expired or doesn't exist
//     } else {
//         const now = new Date().getTime();
//         const expiration = JSON.parse(localStorage.getItem(key)).expiration;

//         if (now <= expiration) {
//             // Token is valid and within the 45-minute window
//             console.log(tokenValue);
//         } else {
//             // Token has expired
//             localStorage.removeItem(key);
//             // Handle the expired token here
//         }
//     }
// }

export const months = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];


export const getMonthFromInteger = (monthInteger) => {
    const monthName = months[monthInteger - 1]; // Subtract 1 because the array is 0-based
    return monthName;
}



