export function msToMinutes(ms) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor(( ms % 60000 ) / 1000);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}