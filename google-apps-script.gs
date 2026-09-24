/**
 * Google Apps Script สำหรับรับข้อมูลจากแบบเก็บข้อมูลโครงการเด็กไทยแก้มใส
 *
 * วิธีติดตั้ง (ทำครั้งเดียว)
 * 1. สร้าง Google Sheet ใหม่ → เมนู ส่วนขยาย → Apps Script
 * 2. ลบโค้ดเดิมทั้งหมด วางโค้ดนี้ แล้วแก้ READ_KEY ด้านล่างเป็นรหัสลับของโรงเรียน → บันทึก
 * 3. ทำให้ใช้งานได้ → การทำให้ใช้งานได้รายการใหม่ → ประเภท: เว็บแอป
 *    เรียกใช้ในฐานะ: ฉัน · ผู้ที่มีสิทธิ์เข้าถึง: ทุกคน → ทำให้ใช้งานได้ → อนุญาตสิทธิ์
 * 4. คัดลอก URL ของเว็บแอป (ลงท้ายด้วย /exec) และรหัสลับ ไปใส่ในหน้า "ตั้งค่า" ของแบบเก็บข้อมูล
 *
 * ถ้าแก้โค้ดภายหลัง ต้องกด ทำให้ใช้งานได้ → จัดการการทำให้ใช้งานได้ → แก้ไข → เวอร์ชันใหม่
 */

// รหัสลับสำหรับดึง/ลบข้อมูล (นักเรียนส่งคำตอบได้โดยไม่ต้องใช้รหัส)
const READ_KEY = 'เปลี่ยนเป็นรหัสลับของโรงเรียน';

const SHEET_NAME = 'ข้อมูลดิบ';
const HEADERS = ['id', 'แบบ', 'ช่วง', 'ชื่อ – สกุล', 'ชั้น', 'เลขที่', 'โรงเรียน', 'เวลาที่ตอบ', 'เวลาที่ได้รับ', 'json'];

function doGet(e) {
  if (!validKey_(e.parameter.key)) return json_({ ok: false, error: 'รหัสสำหรับดึงข้อมูลไม่ถูกต้อง' });
  const sh = sheet_();
  const last = sh.getLastRow();
  const records = last < 2 ? [] : sh.getRange(2, HEADERS.length, last - 1, 1).getValues()
    .map(row => { try { return JSON.parse(row[0]); } catch (err) { return null; } })
    .filter(Boolean);
  return json_({ ok: true, records: records });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const body = JSON.parse(e.postData.contents);
    const sh = sheet_();

    if (body.action === 'delete') {
      if (!validKey_(body.key)) return json_({ ok: false, error: 'รหัสสำหรับลบข้อมูลไม่ถูกต้อง' });
      const row = findRow_(sh, body.id);
      if (row) sh.deleteRow(row);
      return json_({ ok: true });
    }

    const r = body.record;
    if (!r || !r.id || !r.form) return json_({ ok: false, error: 'ไม่มีข้อมูล' });
    delete r.synced;
    const values = [[
      r.id, r.form, r.phase || '', r.name || '', r.grade || '', r.no || '', r.school || '',
      new Date(r.ts || Date.now()), new Date(), JSON.stringify(r),
    ]];
    const row = findRow_(sh, r.id) || sh.getLastRow() + 1;
    sh.getRange(row, 1, 1, HEADERS.length).setValues(values);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function validKey_(key) {
  return String(key || '') === READ_KEY;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('@');
    sh.getRange('F:F').setNumberFormat('@');
  }
  return sh;
}

function findRow_(sh, id) {
  if (!id || sh.getLastRow() < 2) return 0;
  const cell = sh.getRange(2, 1, sh.getLastRow() - 1, 1)
    .createTextFinder(String(id)).matchEntireCell(true).findNext();
  return cell ? cell.getRow() : 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
