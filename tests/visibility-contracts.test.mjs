import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const homePage = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const projectsPage = readFileSync(new URL('../app/projects/page.tsx', import.meta.url), 'utf8');
const intakeForm = readFileSync(new URL('../components/ProjectIntakeForm.tsx', import.meta.url), 'utf8');
const gettingStarted = readFileSync(new URL('../app/getting-started/page.tsx', import.meta.url), 'utf8');

test('home page announces the visible project workflow update', () => {
  assert.match(homePage, /September 2026 update/);
  assert.match(homePage, /Projects are now searchable, revisable, and versioned/);
});

test('project list exposes an unmistakable route to editing and history', () => {
  assert.match(projectsPage, /What&apos;s new/);
  assert.match(projectsPage, /View &amp; Revise/);
  assert.match(projectsPage, /editing tools, and revision history/);
});

test('conditional Other inputs explain when and why they appear', () => {
  assert.match(intakeForm, /Choose Other to describe a technology that is not listed/);
  assert.match(intakeForm, /Choose Other to describe a model that is not listed/);
  assert.match(intakeForm, /This description will be retained in the project record and analysis/);
});

test('getting-started guide explains revision workflow', () => {
  assert.match(gettingStarted, /select View & Revise on a project/);
  assert.match(gettingStarted, /Revision History/);
});
