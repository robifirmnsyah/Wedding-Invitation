import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdminSession, validAdminSession } from '../src/lib/admin-session.ts';
test('admin session rejects missing, forged, modified and expired tokens',async()=>{
 process.env.FYNNA_PIPIN_SESSION_SECRET='test-only-secret-with-at-least-thirty-two-characters';
 const token=await createAdminSession();
 assert.equal(await validAdminSession(token),true);
 assert.equal(await validAdminSession(undefined),false);
 assert.equal(await validAdminSession('forged'),false);
 assert.equal(await validAdminSession(token+'extra'),false);
 assert.equal(await validAdminSession('1:'+token.split(':')[1]),false);
 process.env.FYNNA_PIPIN_SESSION_SECRET='a-different-test-only-secret-with-thirty-two-characters';
 assert.equal(await validAdminSession(token),false);
 delete process.env.FYNNA_PIPIN_SESSION_SECRET;
 assert.equal(await validAdminSession(token),false);
});
