"use strict";

import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const match = html.match(/\/\/ BEGIN-TIME-LOGIC([\s\S]*?)\/\/ END-TIME-LOGIC/);
assert.ok(match, "index.html must contain a BEGIN-TIME-LOGIC / END-TIME-LOGIC block");

eval(match[1]);
const reset = globalThis.RESET_LOGIC;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

function utc(y, monthIndex, d, h = 0, m = 0, s = 0) {
  return Date.UTC(y, monthIndex, d, h, m, s);
}

test("weekly reset moment is derived from the correct constants", () => {
  assert.equal(reset.RESET_DAY_UTC, 2);
  assert.equal(reset.RESET_HOUR_UTC, 8);
});

test("mid-week timestamps belong to the previous Tuesday reset", () => {
  // Wednesday 2026-07-15 10:00 UTC sits inside the week started 2026-07-14 08:00
  const week = reset.currentWeek(utc(2026, 6, 15, 10));
  assert.equal(week.id, "2026-07-14");
  assert.equal(week.start, utc(2026, 6, 14, 8));
  assert.equal(week.end, week.start + WEEK);
});

test("just before Tuesday 08:00 still belongs to the prior week", () => {
  const week = reset.currentWeek(utc(2026, 6, 14, 7, 59, 59));
  assert.equal(week.id, "2026-07-07");
  assert.equal(week.start, utc(2026, 6, 7, 8));
});

test("exactly at Tuesday 08:00 a new week begins", () => {
  const week = reset.currentWeek(utc(2026, 6, 14, 8, 0, 0));
  assert.equal(week.id, "2026-07-14");
  assert.equal(week.start, utc(2026, 6, 14, 8));
});

test("Monday well before the reset belongs to the previous week", () => {
  const week = reset.currentWeek(utc(2026, 6, 13, 12));
  assert.equal(week.id, "2026-07-07");
});

test("Sunday belongs to the week anchored the previous Tuesday", () => {
  const week = reset.currentWeek(utc(2026, 6, 19, 23)); // Sunday
  assert.equal(week.id, "2026-07-14");
});

test("Saturday morning belongs to the same week run", () => {
  const week = reset.currentWeek(utc(2026, 6, 18, 9)); // Saturday
  assert.equal(week.id, "2026-07-14");
});

test("weeks chain seamlessly across a week boundary", () => {
  const a = reset.currentWeek(utc(2026, 6, 14, 9)); // Tue after reset
  const b = reset.currentWeek(utc(2026, 6, 21, 9)); // following Tue after reset
  assert.equal(b.start, a.start + WEEK);
  assert.equal(b.id, "2026-07-21");
  // one tick before that reset still resolves to the previous week
  assert.equal(reset.currentWeek(utc(2026, 6, 21, 7, 59, 59)).start, a.start);
});

test("nextReset matches currentWeek.end", () => {
  const now = utc(2026, 6, 15, 10);
  assert.equal(reset.nextReset(now), reset.currentWeek(now).end);
});

test("countdown parts and formatting are correct", () => {
  const now = utc(2026, 6, 14, 8);
  const target = utc(2026, 6, 21, 8);
  const parts = reset.countdownParts(now, target);
  assert.deepEqual(parts, { days: 7, hours: 0, minutes: 0, seconds: 0 });

  const now2 = utc(2026, 6, 18, 20, 30, 45); // Sat 20:30:45
  const target2 = utc(2026, 6, 21, 8, 0, 0);
  assert.deepEqual(reset.countdownParts(now2, target2), { days: 2, hours: 11, minutes: 29, seconds: 15 });

  assert.equal(reset.formatCountdown(now, target), "7d 00h 00m");
  assert.equal(reset.formatCountdown(now2, target2), "2d 11h 29m");
});

test("formatCountdown clamps negative differences to zero", () => {
  assert.equal(reset.formatCountdown(utc(2026, 6, 21, 9), utc(2026, 6, 21, 8)), "0d 00h 00m");
});

test("weekIdFor produces zero-padded ISO dates", () => {
  assert.equal(reset.weekIdFor(utc(2026, 0, 5)), "2026-01-05");
  assert.equal(reset.weekIdFor(utc(2026, 10, 26)), "2026-11-26");
});

test("weekStartsWithOffset moves in exact 7-day units", () => {
  const now = utc(2026, 6, 15, 10);
  const base = reset.currentWeek(now);
  assert.equal(reset.weekStartsWithOffset(now, -1), base.start - WEEK);
  assert.equal(reset.weekStartsWithOffset(now, 0), base.start);
});

test("weeks cover every timestamp exactly once (no gaps or overlaps)", () => {
  const start = utc(2026, 5, 1);
  const step = HOUR;
  let lastId = null;
  let changes = 0;
  for (let t = start; t < start + 15 * DAY; t += step) {
    const id = reset.currentWeek(t).id;
    if (id !== lastId) {
      changes += 1;
      lastId = id;
    }
  }
  assert.equal(changes, 3, "hourly sweep over 15 days should cross exactly 3 week boundaries");
});

test("the sampled start is always a Tuesday at 08:00 UTC", () => {
  for (let offsets = 0; offsets < 6; offsets += 1) {
    const t = utc(2026, 6, 8, 12) + offsets * WEEK;
    const d = new Date(reset.currentWeek(t).start);
    assert.equal(d.getUTCDay(), 2, "reset must fall on Tuesday");
    assert.equal(d.getUTCHours(), 8, "reset must fall at 08:00 UTC");
    assert.equal(d.getUTCMinutes(), 0);
    assert.equal(d.getUTCSeconds(), 0);
  }
});
