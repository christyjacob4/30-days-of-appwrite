import { marked } from 'marked';

export function getVerboseDate(timestamp: number, long = false) {
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

	const date = new Date(timestamp * 1000);

	if (long) {
		return date.toString();
	}

	return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

export function markdownToText(markdown: string) {
	let html = marked.parse(markdown);
	html = html.split('&#39;').join("'");
	return html.replace(/<[^>]*>?/gm, '');
}

export function markdownToHTML(markdown: string) {
	return marked.parse(markdown);
}
