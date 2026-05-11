// ============================================================
// SWOT Assessment App – โรงเรียนเจ้าพ่อหลวงอุปถัมภ์ ๑
// ============================================================

// ---------- DATA DEFINITION ----------

const SECTIONS = [
  // ===== ปัจจัยภายนอก (STEP) =====
  {
    id: 'S_social',
    code: 'S',
    title: 'ปัจจัยที่ 1: สังคมและวัฒนธรรม (Social)',
    abbr: 'S (Social)',
    type: 'external',
    weight: 0.30,
    items: [
      // โอกาส
      { id: 's1',  cat: 'O', text: 'โรงเรียนได้รับการสนับสนุนจากชุมชนในทุกด้าน' },
      { id: 's2',  cat: 'O', text: 'โรงเรียนได้รับการยอมรับและศรัทธาจากชุมชนและสังคม' },
      { id: 's3',  cat: 'O', text: 'ค่านิยมของผู้ปกครองนิยมให้บุตรหลานเรียนในโรงเรียน' },
      { id: 's4',  cat: 'O', text: 'โรงเรียนเป็นศูนย์กลางทางการศึกษาของชุมชน' },
      { id: 's5',  cat: 'O', text: 'ผู้ปกครองส่วนใหญ่มีการศึกษาระดับปานกลางค่อนข้างสูง' },
      { id: 's6',  cat: 'O', text: 'ชุมชนมีทัศนคติที่ดีต่อโรงเรียน' },
      { id: 's7',  cat: 'O', text: 'ผู้ปกครองและคนในชุมชนให้ความสนใจในด้านการปฏิรูปการศึกษา' },
      { id: 's8',  cat: 'O', text: 'สภาพครอบครัวของชุมชนส่วนใหญ่เป็นครอบครัวที่สมบูรณ์' },
      { id: 's9',  cat: 'O', text: 'ผู้ปกครองนิยมให้บุตรหลานเรียนในโรงเรียนใกล้บ้าน' },
      { id: 's10', cat: 'O', text: 'หน่วยงานและองค์กรทั้งภาครัฐและเอกชนให้การสนับสนุนกิจกรรมของโรงเรียน' },
      // อุปสรรค
      { id: 's11', cat: 'T', text: 'ผู้ปกครองไม่มีเวลาดูแลเอาใจใส่เด็กในความปกครองเท่าที่ควร' },
      { id: 's12', cat: 'T', text: 'รายได้ของชุมชน/ผู้ปกครองไม่แน่นอน ส่วนใหญ่มีอาชีพรับจ้าง' },
      { id: 's13', cat: 'T', text: 'มีการเคลื่อนย้ายของประชาชนเข้าออกพื้นที่บริการโรงเรียนค่อนข้างมาก' },
    ]
  },
  {
    id: 'S_tech',
    code: 'T',
    title: 'ปัจจัยที่ 2: เทคโนโลยี (Technology)',
    abbr: 'T (Technology)',
    type: 'external',
    weight: 0.25,
    items: [
      { id: 't1', cat: 'O', text: 'มีความต้องการบริโภคเทคโนโลยี ส่งผลให้โรงเรียนปรับหลักสูตรให้สอดคล้องกับความต้องการ' },
      { id: 't2', cat: 'O', text: 'นักเรียนสามารถนำนวัตกรรมและเทคโนโลยีมาใช้ในกระบวนการเรียนรู้ได้คล่องแคล่ว' },
      { id: 't3', cat: 'O', text: 'การให้บริการสื่อเทคโนโลยีและแหล่งเรียนรู้เพื่อสืบค้นข้อมูลแก่ครูและนักเรียนสะดวกสบาย' },
      { id: 't4', cat: 'T', text: 'บริเวณใกล้เคียงโรงเรียนมีแหล่งบริการทางเทคโนโลยีที่ชักจูงนักเรียนให้ใช้ในทางที่ไม่เหมาะสม' },
      { id: 't5', cat: 'T', text: 'นักเรียนบางส่วนนำสื่อเทคโนโลยีไปใช้ในทางที่ผิด' },
    ]
  },
  {
    id: 'S_econ',
    code: 'E',
    title: 'ปัจจัยที่ 3: เศรษฐกิจ (Economy)',
    abbr: 'E (Economy)',
    type: 'external',
    weight: 0.30,
    items: [
      { id: 'e1', cat: 'O', text: 'รายได้ของชุมชนอยู่ในเกณฑ์ดี' },
      { id: 'e2', cat: 'O', text: 'รายได้ผู้ปกครองอยู่ในระดับปานกลางค่อนข้างดี' },
      { id: 'e3', cat: 'O', text: 'เศรษฐกิจในชุมชนดีเอื้อประโยชน์ในการพัฒนาการศึกษาของโรงเรียน' },
      { id: 'e4', cat: 'T', text: 'ภาวะเศรษฐกิจถดถอยทำให้ผู้ปกครองจำนวนหนึ่งไม่สามารถสนับสนุนกิจกรรมของโรงเรียนได้' },
    ]
  },
  {
    id: 'S_pol',
    code: 'P',
    title: 'ปัจจัยที่ 4: การเมืองและกฎหมาย (Politics & Law)',
    abbr: 'P (Politics)',
    type: 'external',
    weight: 0.15,
    items: [
      { id: 'p1', cat: 'O', text: 'พระราชบัญญัติการศึกษาเอื้อต่อการเรียนการสอน' },
      { id: 'p2', cat: 'O', text: 'นโยบายให้โรงเรียนจัดการเรียนการสอนตามความต้องการของท้องถิ่น' },
      { id: 'p3', cat: 'O', text: 'นโยบายรัฐเรื่องการศึกษาภาคบังคับ' },
      { id: 'p4', cat: 'O', text: 'พระราชบัญญัติการศึกษาให้ทุกคนมีโอกาสศึกษาตามศักยภาพของแต่ละบุคคล' },
      { id: 'p5', cat: 'O', text: 'พรรคการเมืองมีส่วนสนับสนุนในด้านการศึกษา' },
      { id: 'p6', cat: 'T', text: 'นโยบายการเมืองด้านลดอัตรากำลัง ทำให้บางสาขาวิชาขาดบุคลากร' },
      { id: 'p7', cat: 'T', text: 'นโยบายรัฐบาลและพรรคการเมืองที่มีปัญหาทำให้นโยบายรัฐบาลไม่แน่นอน' },
      { id: 'p8', cat: 'T', text: 'การลดอัตรากำลังพลเป็นอุปสรรคการสรรหาผู้สอนให้ตรงตามวุฒิ' },
    ]
  },
  // ===== ปัจจัยภายใน (2S4M) =====
  {
    id: 'M_s1',
    code: 'S1',
    title: 'ปัจจัยที่ 5: โครงสร้างงานและนโยบาย (Structure : S1)',
    abbr: 'S1 โครงสร้าง',
    type: 'internal',
    weight: 0.16,
    items: [
      { id: 'i_s1_1', cat: 'S', text: 'โรงเรียนมีการกำหนดนโยบายได้ชัดเจน' },
      { id: 'i_s1_2', cat: 'S', text: 'นโยบายของโรงเรียนส่งเสริมนักเรียนให้มีความรู้ความสามารถตามศักยภาพ' },
      { id: 'i_s1_3', cat: 'S', text: 'กำหนดวิธีการปฏิบัติให้สอดคล้องกับนโยบายของโรงเรียน' },
      { id: 'i_s1_4', cat: 'S', text: 'โรงเรียนมีระบบการบริหารจัดการโดยใช้โรงเรียนเป็นฐาน' },
      { id: 'i_s1_5', cat: 'W', text: 'นักเรียนในห้องเรียนมีมากเกินไป' },
    ]
  },
  {
    id: 'M_s2',
    code: 'S2',
    title: 'ปัจจัยที่ 6: การให้บริการและผลผลิต (Service & Products : S2)',
    abbr: 'S2 บริการ/ผลผลิต',
    type: 'internal',
    weight: 0.16,
    items: [
      { id: 'i_s2_1', cat: 'S', text: 'การจัดสภาพแวดล้อมสะอาด สวยงาม ร่มรื่น เอื้อแก่การเรียนรู้' },
      { id: 'i_s2_2', cat: 'S', text: 'การให้บริการแหล่งการเรียนรู้อย่างหลากหลายภายในโรงเรียน' },
      { id: 'i_s2_3', cat: 'S', text: 'ผลสัมฤทธิ์ทางการเรียนของนักเรียนเป็นไปตามเกณฑ์มาตรฐาน' },
      { id: 'i_s2_4', cat: 'S', text: 'นักเรียนให้ความร่วมมือในกิจกรรมต่างๆ ที่โรงเรียนจัดให้และปฏิบัติตามกฎระเบียบ' },
      { id: 'i_s2_5', cat: 'S', text: 'การจัดกิจกรรมส่งเสริมพัฒนาบุคลิกภาพ สุขภาพและอนามัยของนักเรียน' },
      { id: 'i_s2_6', cat: 'W', text: 'การจัดบริการด้านสาธารณูปโภค ห้องน้ำ บริการน้ำดื่ม ยังไม่เพียงพอ' },
    ]
  },
  {
    id: 'M_m1',
    code: 'M1',
    title: 'ปัจจัยที่ 7: ด้านบุคลากร (Man : M1)',
    abbr: 'M1 บุคลากร',
    type: 'internal',
    weight: 0.19,
    items: [
      { id: 'i_m1_1', cat: 'S', text: 'บุคลากรมีความรู้ความสามารถ ประสบการณ์เหมาะสมกับการปฏิบัติงานตามหน้าที่' },
      { id: 'i_m1_2', cat: 'S', text: 'บุคลากรมีโอกาสได้รับการพัฒนาตนเองอย่างต่อเนื่อง' },
      { id: 'i_m1_3', cat: 'S', text: 'บุคลากรได้รับการเสริมแรงพอสมควรทำให้มีกำลังใจในการปฏิบัติงาน' },
      { id: 'i_m1_4', cat: 'W', text: 'อัตราส่วนครูต่อนักเรียนไม่เป็นไปตามเกณฑ์' },
      { id: 'i_m1_5', cat: 'W', text: 'บุคลากรไม่เพียงพอในบางสาขาวิชา เนื่องจากครูเกษียณอายุราชการจำนวนมาก' },
      { id: 'i_m1_6', cat: 'W', text: 'ครูบางกลุ่มสาระการเรียนรู้ขาดทักษะการใช้ภาษาต่างประเทศเพื่อการสื่อสาร' },
    ]
  },
  {
    id: 'M_m2',
    code: 'M2',
    title: 'ปัจจัยที่ 8: ด้านการเงิน (Money : M2)',
    abbr: 'M2 การเงิน',
    type: 'internal',
    weight: 0.16,
    items: [
      { id: 'i_m2_1', cat: 'S', text: 'การใช้เงินให้เกิดประโยชน์สูงสุดในการบริหารจัดการและพัฒนาการศึกษา' },
      { id: 'i_m2_2', cat: 'W', text: 'การเบิกจ่ายเงินไม่คล่องตัว' },
      { id: 'i_m2_3', cat: 'W', text: 'ทุนสำรองในการจัดสวัสดิการยังไม่เพียงพอ' },
    ]
  },
  {
    id: 'M_m3',
    code: 'M3',
    title: 'ปัจจัยที่ 9: วัสดุ/อุปกรณ์ (Material : M3)',
    abbr: 'M3 วัสดุ/อุปกรณ์',
    type: 'internal',
    weight: 0.16,
    items: [
      { id: 'i_m3_1', cat: 'S', text: 'จัดซื้อวัสดุ-อุปกรณ์ในการจัดการเรียนการสอนอย่างเพียงพอ' },
      { id: 'i_m3_2', cat: 'S', text: 'อาคารสถานที่เพียงพอและเหมาะสมกับจำนวนนักเรียน' },
      { id: 'i_m3_3', cat: 'S', text: 'อาคารสถานที่มีความพร้อมในการให้บริการแก่ชุมชนและองค์กรภายนอก' },
      { id: 'i_m3_4', cat: 'W', text: 'โสตทัศนูปกรณ์ยังไม่เพียงพอและขาดบุคลากรที่มีความสามารถเฉพาะทาง' },
      { id: 'i_m3_5', cat: 'W', text: 'วัสดุครุภัณฑ์ขาดคุณภาพและไม่ตรงตามความต้องการ ทำให้ไม่สามารถจัดการเรียนการสอนได้อย่างมีประสิทธิภาพ' },
    ]
  },
  {
    id: 'M_m4',
    code: 'M4',
    title: 'ปัจจัยที่ 10: ด้านบริหารจัดการ (Management : M4)',
    abbr: 'M4 บริหารจัดการ',
    type: 'internal',
    weight: 0.17,
    items: [
      { id: 'i_m4_1', cat: 'S', text: 'มีการติดตามและการปฏิบัติงานของครูเป็นประจำ' },
      { id: 'i_m4_2', cat: 'S', text: 'การประสานงานในการทำงานดีพอสมควร' },
      { id: 'i_m4_3', cat: 'S', text: 'การเผยแพร่และประชาสัมพันธ์ของโรงเรียนต่อชุมชนแพร่หลาย' },
      { id: 'i_m4_4', cat: 'S', text: 'มีการวางแผนการบริหารงานชัดเจนและดำเนินงานตามแผน' },
      { id: 'i_m4_5', cat: 'S', text: 'การมีส่วนร่วมในการจัดการศึกษาของผู้มีส่วนได้ส่วนเสียมีความเข้มแข็ง' },
    ]
  },
];

const TYPE_LABEL = { S: 'จุดแข็ง', W: 'จุดอ่อน', O: 'โอกาส', T: 'อุปสรรค' };
const TYPE_CLASS = { S: 'strength', W: 'weakness', O: 'opportunity', T: 'threat' };

// ---------- STATE ----------
let scores = {};       // itemId → score (1–5)
let userInfo = {};
let currentSection = 0;

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('r-date').value = today;
});

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startAssessment() {
  const name = document.getElementById('r-name').value.trim();
  if (!name) { alert('กรุณากรอกชื่อ-สกุล'); return; }
  userInfo = {
    name,
    position: document.getElementById('r-position').value.trim(),
    dept: document.getElementById('r-dept').value.trim(),
    date: document.getElementById('r-date').value,
  };
  currentSection = 0;
  renderSection();
  showPage('page-assess');
}

// ---------- SECTION RENDER ----------
function renderSection() {
  const sec = SECTIONS[currentSection];
  const total = SECTIONS.length;

  // progress
  document.getElementById('progress-bar').style.width = `${((currentSection + 1) / total) * 100}%`;
  document.getElementById('section-label').textContent = sec.title;
  document.getElementById('section-count').textContent = `${currentSection + 1} / ${total}`;

  // prev/next buttons
  document.getElementById('btn-prev').style.display = currentSection === 0 ? 'none' : 'inline-block';
  document.getElementById('btn-next').textContent = currentSection === total - 1 ? 'ดูผลการประเมิน ✓' : 'ถัดไป →';

  // build content
  const container = document.getElementById('assess-content');
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = `section-header ${sec.type}`;
  header.innerHTML = `
    <h3>${sec.title}</h3>
    <span class="weight-badge">น้ำหนัก ${(sec.weight * 100).toFixed(0)}% (${sec.weight})</span>
  `;
  container.appendChild(header);

  // group items by cat
  const cats = [...new Set(sec.items.map(i => i.cat))];
  cats.forEach(cat => {
    const group = document.createElement('div');
    group.className = 'item-group';

    const title = document.createElement('div');
    title.className = `item-group-title ${TYPE_CLASS[cat]}`;
    title.textContent = `${TYPE_LABEL[cat]} (${cat})`;
    group.appendChild(title);

    sec.items.filter(it => it.cat === cat).forEach((item, idx) => {
      group.appendChild(buildItemRow(item, idx + 1));
    });

    container.appendChild(group);
  });
}

function buildItemRow(item, idx) {
  const row = document.createElement('div');
  row.className = `item-row ${TYPE_CLASS[item.cat]}`;

  const numEl = document.createElement('div');
  numEl.className = 'item-num';
  numEl.textContent = idx + '.';

  const textEl = document.createElement('div');
  textEl.className = 'item-text';
  textEl.textContent = item.text;

  const badge = document.createElement('span');
  badge.className = `item-type-badge badge-${item.cat}`;
  badge.textContent = TYPE_LABEL[item.cat];
  textEl.appendChild(document.createElement('br'));
  textEl.appendChild(badge);

  const scoreWrap = document.createElement('div');
  scoreWrap.className = 'item-score-wrap';

  const lbl = document.createElement('label');
  lbl.textContent = 'คะแนน';
  scoreWrap.appendChild(lbl);

  const scoreInput = document.createElement('div');
  scoreInput.className = 'score-input';

  for (let v = 1; v <= 5; v++) {
    const btn = document.createElement('button');
    btn.className = `score-btn sel-${item.cat}`;
    btn.textContent = v;
    btn.dataset.itemId = item.id;
    btn.dataset.val = v;
    if (scores[item.id] === v) btn.classList.add('selected');
    btn.addEventListener('click', () => selectScore(item.id, v, item.cat));
    scoreInput.appendChild(btn);
  }
  scoreWrap.appendChild(scoreInput);

  row.appendChild(numEl);
  row.appendChild(textEl);
  row.appendChild(scoreWrap);
  return row;
}

function selectScore(itemId, val, cat) {
  scores[itemId] = val;
  // update UI
  document.querySelectorAll(`.score-btn[data-item-id="${itemId}"]`).forEach(btn => {
    btn.classList.remove('selected');
    if (parseInt(btn.dataset.val) === val) btn.classList.add('selected');
  });
}

function prevSection() {
  if (currentSection > 0) { currentSection--; renderSection(); }
}

function nextSection() {
  if (currentSection < SECTIONS.length - 1) {
    currentSection++;
    renderSection();
  } else {
    buildReport();
    showPage('page-report');
  }
}

// ---------- CALCULATIONS ----------
function calcResults() {
  const result = {};

  SECTIONS.forEach(sec => {
    let sumS = 0, countS = 0, sumW = 0, countW = 0;
    let sumO = 0, countO = 0, sumT = 0, countT = 0;

    sec.items.forEach(item => {
      const score = scores[item.id] || 3; // default 3 if unanswered
      if (item.cat === 'S') { sumS += score; countS++; }
      else if (item.cat === 'W') { sumW += score; countW++; }
      else if (item.cat === 'O') { sumO += score; countO++; }
      else if (item.cat === 'T') { sumT += score; countT++; }
    });

    const avgS = countS ? sumS / countS : 0;
    const avgW = countW ? sumW / countW : 0;
    const avgO = countO ? sumO / countO : 0;
    const avgT = countT ? sumT / countT : 0;

    result[sec.id] = {
      section: sec,
      avgS, avgW, avgO, avgT,
      countS, countW, countO, countT,
      weightedS: avgS * sec.weight,
      weightedW: avgW * sec.weight,
      weightedO: avgO * sec.weight,
      weightedT: avgT * sec.weight,
    };
  });

  // totals
  let totalS = 0, totalW = 0, totalO = 0, totalT = 0;
  Object.values(result).forEach(r => {
    totalS += r.weightedS;
    totalW += r.weightedW;
    totalO += r.weightedO;
    totalT += r.weightedT;
  });

  return { sections: result, totalS, totalW, totalO, totalT, axisX: totalS - totalW, axisY: totalO - totalT };
}

// ---------- REPORT ----------
function buildReport() {
  const data = calcResults();

  document.getElementById('report-name-header').textContent =
    `${userInfo.name}${userInfo.position ? ' | ' + userInfo.position : ''}${userInfo.dept ? ' | ' + userInfo.dept : ''} | ${formatDate(userInfo.date)}`;

  buildFactorTables(data);
  buildSummaryBoxes(data);
  drawTOWSChart(data.axisX, data.axisY);
  buildTOWSTable();
}

function buildFactorTables(data) {
  const container = document.getElementById('report-tables');
  container.innerHTML = '';

  ['external', 'internal'].forEach(type => {
    const heading = document.createElement('h4');
    heading.style.cssText = 'margin:16px 0 8px;color:var(--primary);';
    heading.textContent = type === 'external' ? 'ปัจจัยภายนอก (STEP)' : 'ปัจจัยภายใน (2S4M)';
    container.appendChild(heading);

    const table = document.createElement('table');
    table.className = 'report-factor-table';
    table.innerHTML = `<thead><tr>
      <th>ปัจจัย</th><th>น้ำหนัก</th>
      <th>คะแนนเฉลี่ย จุดแข็ง/โอกาส</th><th>น้ำหนักคะแนน</th>
      <th>คะแนนเฉลี่ย จุดอ่อน/อุปสรรค</th><th>น้ำหนักคะแนน</th>
    </tr></thead><tbody></tbody>`;
    const tbody = table.querySelector('tbody');

    let totWS = 0, totWW = 0;

    SECTIONS.filter(s => s.type === type).forEach(sec => {
      const r = data.sections[sec.id];
      const posCat = type === 'internal' ? 'จุดแข็ง' : 'โอกาส';
      const negCat = type === 'internal' ? 'จุดอ่อน' : 'อุปสรรค';
      const posAvg = type === 'internal' ? r.avgS : r.avgO;
      const negAvg = type === 'internal' ? r.avgW : r.avgT;
      const posW   = type === 'internal' ? r.weightedS : r.weightedO;
      const negW   = type === 'internal' ? r.weightedW : r.weightedT;

      totWS += posW; totWW += negW;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:left">${sec.abbr}</td>
        <td>${sec.weight}</td>
        <td>${posAvg.toFixed(2)}</td><td>${posW.toFixed(3)}</td>
        <td>${negAvg.toFixed(2)}</td><td>${negW.toFixed(3)}</td>
      `;
      tbody.appendChild(tr);
    });

    const diff = totWS - totWW;
    const totalTr = document.createElement('tr');
    totalTr.className = 'total-row';
    const label = type === 'internal' ? `รวม (จุดแข็ง – จุดอ่อน = ${diff >= 0 ? '+' : ''}${diff.toFixed(3)})` : `รวม (โอกาส – อุปสรรค = ${diff >= 0 ? '+' : ''}${diff.toFixed(3)})`;
    totalTr.innerHTML = `<td colspan="2" style="text-align:left">${label}</td>
      <td></td><td><strong>${totWS.toFixed(3)}</strong></td>
      <td></td><td><strong>${totWW.toFixed(3)}</strong></td>`;
    tbody.appendChild(totalTr);

    container.appendChild(table);
  });
}

function buildSummaryBoxes(data) {
  const container = document.getElementById('report-summary');
  const { totalS, totalW, totalO, totalT, axisX, axisY } = data;

  container.innerHTML = `
    <div class="summary-grid">
      <div class="summary-box S">
        <h4>จุดแข็ง (S)</h4>
        <div class="big-num">${totalS.toFixed(3)}</div>
      </div>
      <div class="summary-box W">
        <h4>จุดอ่อน (W)</h4>
        <div class="big-num">${totalW.toFixed(3)}</div>
      </div>
      <div class="summary-box O">
        <h4>โอกาส (O)</h4>
        <div class="big-num">${totalO.toFixed(3)}</div>
      </div>
      <div class="summary-box T">
        <h4>อุปสรรค (T)</h4>
        <div class="big-num">${totalT.toFixed(3)}</div>
      </div>
    </div>
    <div class="axis-result">
      <div class="axis-box">
        <h4>แกน X (S – W)</h4>
        <div class="axis-val">${axisX >= 0 ? '+' : ''}${axisX.toFixed(3)}</div>
      </div>
      <div class="axis-box">
        <h4>แกน Y (O – T)</h4>
        <div class="axis-val">${axisY >= 0 ? '+' : ''}${axisY.toFixed(3)}</div>
      </div>
    </div>
  `;
}

// ---------- TOWS CANVAS ----------
function drawTOWSChart(x, y) {
  const canvas = document.getElementById('tows-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const scale = 80; // px per unit

  ctx.clearRect(0, 0, W, H);

  // Quadrant backgrounds
  const qColors = ['#fffde7', '#e8f5e9', '#fce4ec', '#e3f2fd'];
  const qLabels = ['QUESTION MARK\n(WO)', '⭐ STARS (ดาวรุ่ง)\n(SO)', '💀 DOGS\n(WT)', '🐄 CASH COWS\n(ST)'];
  const qX = [-1, 1, -1, 1];
  const qY = [1, 1, -1, -1]; // canvas Y is inverted

  [0, 1, 2, 3].forEach(i => {
    const qx = qX[i] > 0 ? cx : 0;
    const qy = qY[i] < 0 ? cy : 0;
    ctx.fillStyle = qColors[i];
    ctx.fillRect(qx, qy, cx, cy);
    ctx.fillStyle = '#00000022';
    ctx.font = 'bold 13px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    const lx = qx + cx / 2;
    const ly = qy + cy / 2;
    qLabels[i].split('\n').forEach((line, li) => {
      ctx.fillText(line, lx, ly - 6 + li * 18);
    });
  });

  // Grid lines
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  for (let v = -3; v <= 3; v++) {
    if (v === 0) continue;
    ctx.beginPath(); ctx.moveTo(cx + v * scale, 0); ctx.lineTo(cx + v * scale, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy + v * scale); ctx.lineTo(W, cy + v * scale); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 14px Sarabun, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('จุดแข็ง →', W - 48, cy - 10);
  ctx.fillText('← จุดอ่อน', 46, cy - 10);
  ctx.textAlign = 'center';
  ctx.save(); ctx.translate(14, cy); ctx.rotate(-Math.PI / 2);
  ctx.fillText('โอกาส ↑', 40, 0);
  ctx.restore();
  ctx.save(); ctx.translate(14, cy); ctx.rotate(-Math.PI / 2);
  ctx.fillText('↓ อุปสรรค', -50, 0);
  ctx.restore();

  // Tick marks & values
  ctx.fillStyle = '#666';
  ctx.font = '11px Sarabun, sans-serif';
  ctx.textAlign = 'center';
  for (let v = -3; v <= 3; v++) {
    if (v === 0) continue;
    ctx.fillText(v, cx + v * scale, cy + 14);
    ctx.textAlign = 'right';
    ctx.fillText(-v, cx - 6, cy - v * scale + 4);
    ctx.textAlign = 'center';
  }

  // Draw egg ellipse (oval representing spread)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#1a5276';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 2.8 * scale, 2.2 * scale, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = '#1a5276';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Plot point
  const px = cx + x * scale;
  const py = cy - y * scale; // canvas Y inverted

  // shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.3)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, 2 * Math.PI);
  ctx.stroke();

  // label
  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 12px Sarabun, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`(${x >= 0 ? '+' : ''}${x.toFixed(2)}, ${y >= 0 ? '+' : ''}${y.toFixed(2)})`, px, py - 16);

  // Determine quadrant
  let cls, msg;
  if (x >= 0 && y >= 0) { cls = 'stars'; msg = '⭐ STARS – ดาวรุ่ง (SO) : มีจุดแข็ง + โอกาส ใช้กลยุทธ์เชิงรุก (Aggressive Strategy)'; }
  else if (x < 0 && y >= 0) { cls = 'qmark'; msg = '❓ QUESTION MARK (WO) : มีโอกาสแต่มีจุดอ่อน ใช้กลยุทธ์พัฒนา (Turnaround Strategy)'; }
  else if (x >= 0 && y < 0) { cls = 'cows'; msg = '🐄 CASH COWS (ST) : มีจุดแข็งแต่มีภัยคุกคาม ใช้กลยุทธ์แข่งขัน (Diversification Strategy)'; }
  else { cls = 'dogs'; msg = '💀 DOGS (WT) : มีจุดอ่อน + ภัยคุกคาม ใช้กลยุทธ์ตั้งรับ (Defensive Strategy)'; }

  const lbl = document.getElementById('tows-position');
  lbl.className = `tows-label ${cls}`;
  lbl.textContent = msg;
}

function buildTOWSTable() {
  document.getElementById('report-tows-table').innerHTML = `
    <table class="tows-table">
      <thead>
        <tr>
          <th>TOWS</th>
          <th>S – จุดแข็ง (Strengths)</th>
          <th>W – จุดอ่อน (Weaknesses)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>O – โอกาส<br>(Opportunities)</th>
          <td class="so">
            <strong>SO – กลยุทธ์เชิงรุก</strong>
            <ul>
              <li>ขยายกิจกรรมอนุรักษ์วิถีม้งและวัฒนธรรมท้องถิ่น</li>
              <li>พัฒนาการจัดการเรียนรู้แบบ Active Learning</li>
              <li>เพิ่มทักษะดิจิทัลและภาษาต่างประเทศให้ครู</li>
            </ul>
          </td>
          <td class="wo">
            <strong>WO – กลยุทธ์พัฒนา</strong>
            <ul>
              <li>เพิ่มอัตรากำลังครูในสาขาขาดแคลน</li>
              <li>พัฒนาแหล่งเรียนรู้และระบบสารสนเทศ</li>
              <li>จัดระบบงบประมาณให้คล่องตัวยิ่งขึ้น</li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>T – อุปสรรค<br>(Threats)</th>
          <td class="st">
            <strong>ST – กลยุทธ์แข่งขัน</strong>
            <ul>
              <li>ใช้จุดแข็งของนโยบายโรงเรียนรับนโยบายใหม่ภาครัฐ</li>
              <li>สร้างนวัตกรรม STRONG Model เพื่อรับการเปลี่ยนแปลง</li>
              <li>เสริมสร้างเครือข่ายชุมชนและผู้ปกครอง</li>
            </ul>
          </td>
          <td class="wt">
            <strong>WT – กลยุทธ์ตั้งรับ</strong>
            <ul>
              <li>ลดภาระงานครูที่ไม่จำเป็น</li>
              <li>ขอสนับสนุนงบประมาณและครุภัณฑ์จากหน่วยงานต้น</li>
              <li>พัฒนารูปแบบการสนับสนุนเด็กพิเศษเรียนร่วม</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

// ---------- UTILS ----------
function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(day)} ${months[parseInt(m)]} ${parseInt(y) + 543}`;
}
