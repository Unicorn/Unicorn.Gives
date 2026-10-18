import { describe, it, expect } from 'vitest';
import {
	eventTeaser,
	formatClock,
	getOpenStatus,
	localClock,
	parseDailyHours,
} from './menuStatus';

const HORN_HOURS = '**Public Welcome:** 10 AM – 2 PM Daily\n\n**Member Access:** 24/7, 365 days a year';

describe('parseDailyHours', () => {
	it('reads the Horn contact hours', () => {
		expect(parseDailyHours(HORN_HOURS)).toEqual({ open: 600, close: 840 });
	});

	it('accepts minutes, hyphens and lowercase', () => {
		expect(parseDailyHours('9:30 am - 5:15 pm daily')).toEqual({ open: 570, close: 1035 });
	});

	it('returns null when there is no single daily range', () => {
		expect(parseDailyHours('Member Access: 24/7')).toBeNull();
		expect(parseDailyHours('Mon–Fri 9 AM – 5 PM')).toBeNull();
		expect(parseDailyHours(null)).toBeNull();
	});

	it('rejects ranges that cross midnight', () => {
		expect(parseDailyHours('8 PM – 2 AM Daily')).toBeNull();
	});
});

describe('getOpenStatus', () => {
	const hours = { open: 600, close: 840 };

	it('is open inside the range, with the closing time', () => {
		expect(getOpenStatus(hours, 600)).toEqual({ open: true, label: 'Open now · until 2 PM' });
		expect(getOpenStatus(hours, 839).open).toBe(true);
	});

	it('says when it opens before and after hours', () => {
		expect(getOpenStatus(hours, 480)).toEqual({ open: false, label: 'Opens 10 AM' });
		expect(getOpenStatus(hours, 840)).toEqual({ open: false, label: 'Opens 10 AM tomorrow' });
	});
});

describe('formatClock', () => {
	it('formats noon, midnight and minutes', () => {
		expect(formatClock(720)).toBe('12 PM');
		expect(formatClock(0)).toBe('12 AM');
		expect(formatClock(570)).toBe('9:30 AM');
	});
});

describe('localClock', () => {
	it('converts to the partner time zone', () => {
		// 2026-10-17 15:30 UTC is 11:30 in Detroit (EDT, UTC-4).
		expect(localClock(new Date('2026-10-17T15:30:00Z'), 'America/Detroit')).toEqual({
			date: '2026-10-17',
			minutes: 690,
		});
	});

	it('rolls the date back across midnight', () => {
		expect(localClock(new Date('2026-10-18T02:00:00Z'), 'America/Detroit').date).toBe('2026-10-17');
	});
});

describe('eventTeaser', () => {
	const today = '2026-10-17';

	it('calls out an evening event as tonight', () => {
		expect(eventTeaser({ title: 'Game Night', date: today, time: '7:00 PM' }, today)).toBe('Game Night tonight');
	});

	it('uses today for daytime or untimed events', () => {
		expect(eventTeaser({ title: 'Potluck', date: today, time: '12:00 PM' }, today)).toBe('Potluck today');
		expect(eventTeaser({ title: 'Potluck', date: today }, today)).toBe('Potluck today');
	});

	it('uses tomorrow across a month boundary', () => {
		expect(eventTeaser({ title: 'Bonfire', date: '2026-11-01' }, '2026-10-31')).toBe('Bonfire tomorrow');
	});

	it('ignores events further out', () => {
		expect(eventTeaser({ title: 'Bonfire', date: '2026-10-20' }, today)).toBeNull();
	});
});
