import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const c = JSON.parse(fs.readFileSync('config/wedding.json','utf8'));
test('customer information and WIB dates match the supplied form',()=>{
 assert.equal(c.couple.bride.fullName,'Saufynna Ruhadyah');
 assert.equal(c.couple.groom.fullName,'Pipin Koswara');
 assert.equal(new Date(c.event.akad.date).toISOString(),'2027-01-05T01:00:00.000Z');
 assert.equal(new Date(c.event.resepsi.date).toISOString(),'2027-01-05T04:00:00.000Z');
 assert.equal(c.countdownTarget,c.event.akad.date);
 assert.deepEqual(c.gift.banks.map(x=>x.number),['2832922120','1310017275878']);
 assert.equal(c.gift.qris,'');
});
test('all customer photo and audio paths resolve to real assets',()=>{
 const assets=[c.hero.photo,c.couple.bride.photo,c.couple.groom.photo,c.music,...c.gallery.map(x=>x.src)];
 for(const asset of assets) assert.ok(fs.statSync(path.join('public',asset)).size>1000,asset);
 assert.equal(c.gallery.length,5);
 assert.ok(c.music.includes('because-you-loved-me'));
});
test('calendar encodes the correct UTC instants and reception end',()=>{
 const ics=fs.readFileSync('public/fynna-pipin.ics','utf8');
 assert.ok(ics.includes('DTSTART:20270105T010000Z'));
 assert.ok(ics.includes('DTSTART:20270105T040000Z'));
 assert.ok(ics.includes('DTEND:20270105T070000Z'));
 assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,2);
});
test('storage cannot silently fall back to old customer credentials',()=>{
 const storage=fs.readFileSync('src/lib/google-sheets.ts','utf8');
 for(const variable of ['GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY','GOOGLE_SERVICE_ACCOUNT_EMAIL','GOOGLE_SHEETS_SPREADSHEET_ID']) assert.ok(!storage.includes(`requiredEnv("${variable}")`));
 assert.ok(storage.includes('FYNNA_PIPIN_SPREADSHEET_ID'));
 assert.ok(!storage.includes('USER_ENTERED'));
});
