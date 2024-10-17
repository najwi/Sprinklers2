export function toTime(seconds: number | null | undefined): string | null {
	if (!seconds) return null;

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}`;
}

export function toSeconds(time: string | null | undefined): number | null {
	if (!time) return null;

	const [hours, minutes] = time.split(':').map(Number);
	const totalSeconds = hours * 3600 + minutes * 60;

	return totalSeconds;
}
