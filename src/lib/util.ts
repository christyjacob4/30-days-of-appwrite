import { marked } from "marked";

export function getVerboseDate(timestamp: number) {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    const date = new Date(timestamp);

    return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

export function markdownToText(markdown: string) {
    // TODO: Logic
    return markdown;
}

export function markdownToHTML(markdown: string) {
    // TODO: Logic
    return markdown;
}