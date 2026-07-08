import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolvePublicPath } from '../server.js';

test('serves root from index.html', () => {
  assert.ok(resolvePublicPath('/')?.endsWith('/public/index.html'));
});

test('rejects path traversal', () => {
  assert.equal(resolvePublicPath('/../server.js'), null);
});
