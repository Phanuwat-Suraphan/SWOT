// ============================================================
// แบบเก็บข้อมูลภาวะโภชนาการ ความรอบรู้ด้านอาหาร และพฤติกรรมการบริโภค
// โครงการเด็กไทยแก้มใส – เก็บข้อมูลส่งเขต
// ============================================================

// ---------- DATA DEFINITION ----------

const GRADES_ALL = ['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6', 'ม.1', 'ม.2', 'ม.3'];

// ช่วงประเมินนักเรียนกลุ่มเป้าหมาย (แบบ 2.1 และ 2.2) ก่อน–หลังทำโครงการ ในนักเรียนคนเดิม
const PHASES = [
  { v: 'pre', label: 'ก่อนทำกิจกรรม' },
  { v: 'post', label: 'หลังทำกิจกรรม' },
];

// ข้อมูลภาวะโภชนาการ ปีการศึกษา 2569 ส่งภาคเรียนละ 2 ครั้ง (ต้นเทอม–ปลายเทอม)
const NUT_ROUNDS = [
  { v: 't1s', term: 't1', label: 'ภาคเรียนที่ 1 ต้นเทอม' },
  { v: 't1e', term: 't1', label: 'ภาคเรียนที่ 1 ปลายเทอม' },
  { v: 't2s', term: 't2', label: 'ภาคเรียนที่ 2 ต้นเทอม' },
  { v: 't2e', term: 't2', label: 'ภาคเรียนที่ 2 ปลายเทอม' },
];
const NUT_TERMS = [
  { v: 't1', label: 'ภาคเรียนที่ 1 ปีการศึกษา 2569', due: 'ส่งภายในวันที่ 30 กันยายน 2569' },
  { v: 't2', label: 'ภาคเรียนที่ 2 ปีการศึกษา 2569', due: 'ส่งภายในวันที่ 15 มีนาคม 2570' },
];

// กลุ่มเป้าหมาย: นักเรียน 10 คนต่อระดับชั้น (ป.4–6 และ ม.1–3 สำหรับโรงเรียนขยายโอกาส)
const TARGET_PER_GRADE = 10;

// Google Sheet กลางของโรงเรียน: ใส่ URL เว็บแอป (/exec) ที่นี่ แล้วทุกเครื่องและทุกลิงก์จะส่งคำตอบเข้า Sheet เดียวกัน
// (รหัสสำหรับดึงข้อมูลไม่ได้อยู่ในโค้ด ครูใส่เองที่หน้าตั้งค่า)
const SHARED_SHEET_URL = '';

const DEFAULT_SETTINGS = {
  school: 'โรงเรียนวัดเสาหิน',
  address: 'ตำบลหนองหอย อำเภอเมือง จังหวัดเชียงใหม่',
  aff: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาเชียงใหม่ เขต 1',
  grades: ['อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'],
  studentGrades: ['ป.4', 'ป.5', 'ป.6'],
  sheetUrl: SHARED_SHEET_URL,
  readKey: '',
};

// ตารางข้อมูลภาวะโภชนาการ (ครูกรอกจำนวนนักเรียนแต่ละระดับชั้น)
const NUT_TABLES = [
  { key: 'h', title: 'ส่วนสูงตามเกณฑ์อายุ', cols: ['เตี้ย', 'ค่อนข้างเตี้ย', 'ส่วนสูงตามเกณฑ์', 'ค่อนข้างสูง', 'ส่วนสูงเกินเกณฑ์'] },
  { key: 'w', title: 'น้ำหนักตามเกณฑ์ส่วนสูง', cols: ['ผอม', 'ค่อนข้างผอม', 'สมส่วน', 'ท้วม', 'เริ่มอ้วน', 'อ้วน'] },
];

// ----- แบบ 2.1 ความรอบรู้ด้านอาหาร -----
const YN = [
  { v: 'yes', label: 'ใช่' },
  { v: 'no', label: 'ไม่ใช่' },
  { v: 'unsure', label: 'ไม่แน่ใจ' },
];

const FREQ = [
  { v: 1, label: 'ไม่เคย' },
  { v: 2, label: 'น้อยครั้ง', sub: '1–2 วัน' },
  { v: 3, label: 'บางครั้ง', sub: '3–4 วัน' },
  { v: 4, label: 'บ่อย', sub: '5–6 วัน' },
  { v: 5, label: 'ประจำ', sub: 'ทุกวัน/7 วัน' },
];

// เฉลยหมวด A: ทุกข้อเป็นข้อความที่ถูกต้อง จึงนับ "ใช่" เป็นคำตอบที่ถูก
const KNOWLEDGE = [
  'ผักควรกินมากกว่าผลไม้ในแต่ละวัน',
  'นมรสจืดมีประโยชน์มากกว่านมรสหวาน',
  'อาหารกึ่งสำเร็จรูป เช่น บะหมี่กึ่งสำเร็จรูป มีโซเดียมสูง',
  'อาหารปิ้ง–ย่างไหม้เกรียมเพิ่มความเสี่ยงในการก่อโรคมะเร็ง',
  'ควรใช้เขียง–มีดแยกคนละชุด สำหรับอาหารดิบและอาหารสุก',
  'การเลือกกินผักผลไม้พื้นบ้านช่วยลดเสี่ยงจากสารเคมีกำจัดศัตรูพืชที่มีพิษ',
  'ขนม 1 ห่อที่มี 2 หน่วยบริโภค ไม่ควรกินหมดในครั้งเดียว',
  'ชานม และ โกโก้เย็นมีน้ำตาลสูงมาก',
];
const ATTITUDES = [
  'การกินอาหารไม่สมดุล จะทำให้เสี่ยงต่อโรคอ้วน',
  'ฉันควรกินอาหารที่มีประโยชน์และปลอดภัยให้หลากหลายทุกวัน',
  'อาหารแปรรูปควรกินน้อยที่สุด เพราะมีโซเดียมสูง',
  'ผักผลไม้พื้นบ้านมีประโยชน์และปลอดภัยกว่าที่นำเข้าจากต่างประเทศ',
  'ฉันตั้งใจลดน้ำหวานและขนมหวาน',
];
const SKILLS = [
  'ฉันวางแผนให้ตัวเองกินอาหารครบ 5 หมู่ได้',
  'ฉันเตรียมของว่างสุขภาพ เช่น นมจืด ผลไม้ ถั่ว ได้',
  'ฉันล้างผักผลไม้ให้ปลอดภัยก่อนกิน',
  'ฉันอ่านฉลากโภชนาการก่อนซื้อขนม–เครื่องดื่ม',
  'ฉันมีความรู้และสามารถเลือกเมนูอาหารและเครื่องดื่มที่ลดหวาน อาหารลดไขมัน และ ลดเค็มได้',
];
const BEHAVIORS = [
  'ฉันดื่มน้ำเปล่าแทนน้ำหวาน',
  'ฉันกินผักผลไม้ทุกวัน',
  'ฉันหลีกเลี่ยงอาหารทอด–ไขมันสูง',
  'ฉันกินขนมกรุบกรอบน้อยลง',
  'ฉันเลือกกินอาหารกลางวันที่มีผักในโรงเรียน',
  'ฉันลดการเติมน้ำปลา–ซีอิ๊ว–น้ำตาลในอาหารทุกครั้ง',
  'ฉันออกกำลังกายอย่างน้อย 30 นาทีต่อวัน',
];

const numbered = (texts, prefix, start, extra) =>
  texts.map((text, i) => Object.assign({ id: prefix + (start + i), no: start + i, text }, extra));

// ----- แบบ 2.2 พฤติกรรมการบริโภค -----
const eatFreq = (id, no, text, short) => ({
  id, no, text, short, type: 'choice',
  options: [
    { v: 'daily', label: 'ก. กินทุกวัน', follow: [{ id: id + '_type', type: 'text', label: 'ส่วนมากจะกินประเภทไหน' }] },
    { v: 'some', label: 'ข. กินบางวัน', follow: [{ id: id + '_times', type: 'number', label: 'ใน 1 สัปดาห์กิน', unit: 'ครั้ง', min: 1, max: 50, required: true }] },
    { v: 'never', label: 'ไม่กิน' },
  ],
});

const addSeasoning = (id, no, text, short) => ({
  id, no, text, short, type: 'choice',
  options: [
    {
      v: 'yes', label: 'เติม', follow: [
        { id: id + '_food', type: 'text', label: 'เติมในอาหารประเภทไหนบ้าง' },
        { id: id + '_tsp', type: 'number', label: 'จำนวนที่เติม', unit: 'ช้อนชา', min: 0, max: 20, step: 0.5, required: true },
        { id: id + '_freq', type: 'choice', label: 'ความถี่ในการเติม', required: true, options: [{ v: 'always', label: 'ทุกครั้งที่กิน' }, { v: 'sometimes', label: 'บางครั้ง' }] },
      ],
    },
    { v: 'no', label: 'ไม่เติม' },
  ],
});

const THAI_LETTERS = ['ก', 'ข', 'ค', 'ง'];
const mcq = (id, no, text, options, key) => ({
  id, no, text, key, type: 'choice', vertical: true, csv: `อาหารปลอดภัย ข้อ ${no}`,
  options: options.map((label, i) => ({ v: THAI_LETTERS[i], label: `${THAI_LETTERS[i]}. ${label}` })),
});

const FORMS = {
  lit: {
    id: 'lit',
    code: '2.1',
    name: 'แบบ 2.1',
    icon: '📝',
    title: 'แบบประเมินความรอบรู้ด้านอาหาร (Food & Health Literacy) และพฤติกรรมการบริโภคอาหารแบบสมดุล (Balanced Diet Behaviors)',
    short: 'ความรอบรู้ด้านอาหารและพฤติกรรมการบริโภคอาหารแบบสมดุล (25 ข้อ)',
    audience: 'สำหรับนักเรียนอายุ 9–14 ปี (ก่อนและหลังทำกิจกรรม ปี 2569–2570) โครงการเด็กไทยแก้มใส – 4 จังหวัดนำร่อง',
    intro: 'แบบประเมินมี 4 ส่วน รวม 25 ข้อ ให้นักเรียนตอบให้ครบทุกข้อตามความเป็นจริง',
    sections: [
      {
        key: 'K', label: 'ความรู้', max: 8,
        title: 'ความรู้ด้านอาหารเพื่อสุขภาวะ (Food Knowledge)',
        hint: 'คำชี้แจง: ให้นักเรียนเลือกคำตอบ ใช่ / ไม่ใช่ / ไม่แน่ใจ จากแต่ละข้อคำถามให้ครบทุกข้อ',
        group: 'หมวด A: อาหารหลัก–สารอาหาร–การเลือกอาหาร (8 ข้อ)',
        questions: numbered(KNOWLEDGE, 'k', 1, { type: 'choice', options: YN, key: 'yes' }),
      },
      {
        key: 'A', label: 'ทัศนคติ',
        title: 'ส่วนที่ 3.2 ทัศนคติด้านอาหารเพื่อสุขภาพ (Attitudes) 5 ข้อ',
        hint: 'คำชี้แจง: ให้นักเรียนเลือกตอบ 1 – 5 (1 = ไม่เห็นด้วยอย่างยิ่ง, 5 = เห็นด้วยอย่างยิ่ง)',
        scale: { low: 'ไม่เห็นด้วยอย่างยิ่ง', high: 'เห็นด้วยอย่างยิ่ง' },
        questions: numbered(ATTITUDES, 'a', 9, { type: 'scale' }),
      },
      {
        key: 'S', label: 'ทักษะ',
        title: 'ส่วนที่ 3.3 ทักษะด้านอาหาร (Food Skills) – 5 ข้อ',
        hint: 'คำชี้แจง: ให้นักเรียนเลือกตอบ 1 – 5 (1 = ทำไม่ได้เลย, 5 = ทำได้ดีมาก)',
        scale: { low: 'ทำไม่ได้เลย', high: 'ทำได้ดีมาก' },
        questions: numbered(SKILLS, 's', 14, { type: 'scale' }),
      },
      {
        key: 'B', label: 'พฤติกรรม',
        title: 'ส่วนที่ 3.4 พฤติกรรมการกินและออกกำลังกาย ในรอบ 1 เดือนที่ผ่านมา (Food Behaviors) – 7 ข้อ',
        hint: 'คำชี้แจง: ให้นักเรียนเลือกความถี่ในการปฏิบัติเฉลี่ยต่อสัปดาห์ (ไม่เคย / น้อยครั้ง / บางครั้ง / บ่อย / ประจำ)',
        questions: numbered(BEHAVIORS, 'b', 19, { type: 'choice', options: FREQ, freq: true }),
      },
    ],
  },
  beh: {
    id: 'beh',
    code: '2.2',
    name: 'แบบ 2.2',
    icon: '🍱',
    title: 'แบบสำรวจพฤติกรรมการบริโภคและการดูแลสุขอนามัยนักเรียน',
    short: 'พฤติกรรมการบริโภคและการดูแลสุขอนามัย (11 ข้อ)',
    audience: 'โครงการเด็กไทยแก้มใส ปี 2569–2570',
    intro: 'แบบสำรวจมี 11 ข้อ แบ่งเป็น 4 หน้า ให้นักเรียนตอบตามความเป็นจริง ข้อที่เป็นตัวเลขให้กรอกเป็นตัวเลข',
    sections: [
      {
        title: '2.2 แบบสำรวจพฤติกรรมการบริโภคและการดูแลสุขอนามัยนักเรียน (ข้อ 1–2)',
        questions: [
          {
            id: 'q1', no: 1, type: 'choice', vertical: true, short: 'อาหารเช้า',
            text: 'นักเรียนควรได้กินอาหารเช้าที่มีกลุ่มอาหารอย่างน้อย 2 กลุ่ม คือ กลุ่มข้าว-แป้ง และเนื้อสัตว์ หรือ กลุ่มข้าว-แป้งและนม ทุกวัน ในความเป็นจริงนักเรียนได้กินแบบใด ต่อไปนี้',
            options: [
              { v: 'every', label: 'ได้กินทุกวัน' },
              { v: 'some', label: 'ได้กินบางวัน', follow: [{ id: 'q1_days', type: 'number', label: 'ระบุจำนวน', unit: 'วัน', min: 1, max: 6, required: true }] },
              { v: 'none', label: 'ไม่ได้กินอาหารเช้า', follow: [{ id: 'q1_reason', type: 'text', label: 'เพราะเหตุใด' }] },
            ],
          },
          {
            id: 'q1_food', no: '', type: 'texts', count: 3, minFilled: 1, short: 'อาหารเช้าที่กินบ่อย',
            text: 'อาหารเช้าที่ได้กินมีอะไรบ้าง ระบุชื่ออาหารที่กินบ่อยที่สุด 3 ลำดับ',
            requiredIf: a => a.q1 !== 'none',
          },
          {
            id: 'q2', no: 2, type: 'choice', vertical: true, short: 'อาหารหลัก 3 มื้อ',
            text: 'นักเรียนได้กินอาหารหลัก วันละ 3 มื้อ (เช้า กลางวัน เย็น) ทุกวัน หรือไม่ ? พฤติกรรมการกินอาหารหลักของนักเรียน ใน 1 สัปดาห์ นักเรียนได้กินอาหารหลักครบ 3 มื้อ (เช้า กลางวัน เย็น) หรือไม่',
            options: [
              { v: 'three', label: 'ได้กินอาหารหลักครบ 3 มื้อ' },
              { v: 'more', label: 'ได้กินอาหารมากกว่า 3 มื้อ' },
              {
                v: 'less', label: 'ได้กินอาหารหลักไม่ครบ 3 มื้อ', follow: [
                  { id: 'q2_missed', type: 'multi', label: 'ส่วนใหญ่ยังขาดมื้อไหน', required: true, options: [{ v: 'breakfast', label: 'เช้า' }, { v: 'lunch', label: 'กลางวัน' }, { v: 'dinner', label: 'เย็น' }] },
                  { id: 'q2_reason', type: 'text', label: 'ทำไมถึงไม่ได้กิน' },
                ],
              },
            ],
          },
        ],
      },
      {
        title: '2.2 แบบสำรวจพฤติกรรมการบริโภคและการดูแลสุขอนามัยนักเรียน (ข้อ 3–6)',
        hint: 'กรอกเป็นตัวเลข (ใส่ทศนิยมได้ เช่น 2.5)',
        questions: [
          { type: 'note', text: '3. ปริมาณอาหารที่นักเรียนได้กิน ในแต่ละกลุ่ม ดังต่อไปนี้ เป็นจำนวนเท่าใด' },
          { id: 'q3_1', no: '3.1', type: 'number', unit: 'ทัพพีต่อวัน', min: 0, max: 40, step: 0.5, rec: 8, short: 'กลุ่มข้าว-แป้ง (ทัพพี/วัน)', text: 'ควรได้กินอาหารกลุ่มข้าว-แป้ง วันละ 8 ทัพพีทุกวัน แต่นักเรียนได้กินจริง' },
          { id: 'q3_2', no: '3.2', type: 'number', unit: 'ทัพพีต่อวัน', min: 0, max: 40, step: 0.5, rec: 4, short: 'กลุ่มผัก (ทัพพี/วัน)', text: 'ควรได้กินอาหารกลุ่มผัก วันละ 4 ทัพพีทุกวัน แต่นักเรียนได้กินจริง' },
          { id: 'q3_3', no: '3.3', type: 'number', unit: 'ส่วนต่อวัน', min: 0, max: 40, step: 0.5, rec: 3, short: 'กลุ่มผลไม้ (ส่วน/วัน)', text: 'ควรได้กินอาหารกลุ่มผลไม้ วันละ 3 ส่วนทุกวัน แต่นักเรียนได้กินจริง' },
          { id: 'q3_4', no: '3.4', type: 'number', unit: 'ช้อนกินข้าว', min: 0, max: 60, step: 0.5, rec: 6, short: 'กลุ่มเนื้อสัตว์ (ช้อนกินข้าว/วัน)', text: 'ควรได้กินอาหารกลุ่มเนื้อสัตว์ วันละ 6 ช้อนกินข้าวทุกวัน แต่นักเรียนได้กินจริง' },
          { id: 'q4', no: 4, type: 'number', unit: 'วันต่อสัปดาห์', min: 0, max: 7, rec: 3, short: 'กินปลา (วัน/สัปดาห์)', text: 'กินปลา สัปดาห์ละอย่างน้อย 3 วัน ในความเป็นจริงนักเรียนได้กิน' },
          { id: 'q5', no: 5, type: 'number', unit: 'ฟองต่อสัปดาห์', min: 0, max: 30, rec: 7, short: 'กินไข่ (ฟอง/สัปดาห์)', text: 'กินไข่ วันละ 1 ฟอง ในความเป็นจริงนักเรียนได้กิน' },
          { type: 'note', text: '6. กินอาหารที่มีส่วนประกอบเป็น' },
          { id: 'q6_1', no: '6.1', type: 'number', unit: 'ครั้งต่อสัปดาห์', min: 0, max: 30, short: 'เมนูที่มีตับ (ครั้ง/สัปดาห์)', text: 'เมนูที่มีตับเป็นส่วนประกอบ จำนวน' },
          { id: 'q6_2', no: '6.2', type: 'number', unit: 'ครั้งต่อสัปดาห์', min: 0, max: 30, short: 'เมนูที่มีเลือด (ครั้ง/สัปดาห์)', text: 'เมนูที่มีเลือดเป็นส่วนประกอบ จำนวน' },
        ],
      },
      {
        title: '2.2 แบบสำรวจพฤติกรรมการบริโภคและการดูแลสุขอนามัยนักเรียน (ข้อ 7–9)',
        questions: [
          eatFreq('q7', 7, 'ขนมที่มีรสหวาน เช่น ไอศกรีม ช็อคโกแล็ต หมากฝรั่ง ลูกอม เจลลี่ หรือไม่ กินแบบไหน', 'ขนมรสหวาน'),
          eatFreq('q8', 8, 'เครื่องดื่มที่มีรสหวาน เช่น น้ำอัดลม น้ำหวาน โกโก้เย็น ชาเย็น น้ำปั่น น้ำผลไม้ นมเปรี้ยว กินแบบไหน', 'เครื่องดื่มรสหวาน'),
          eatFreq('q9', 9, 'ขนมขบเคี้ยว เช่น ปลาเส้นปรุงรส มันฝรั่งทอด ขนมปังแท่ง เป็นต้น กินแบบไหน', 'ขนมขบเคี้ยว'),
        ],
      },
      {
        title: '2.2 แบบสำรวจพฤติกรรมการบริโภคและการดูแลสุขอนามัยนักเรียน (ข้อ 10–11)',
        questions: [
          addSeasoning('q10', 10, 'ในการกินอาหาร นักเรียนมีการเติมเครื่องปรุงรสเค็ม เช่น น้ำปลา ซีอิ้ว ซอสปรุงรส ในอาหารที่ปรุงสุกแล้วหรือไม่', 'เติมเครื่องปรุงรสเค็ม'),
          addSeasoning('q11', 11, 'ในการกินอาหาร นักเรียนมีการเติมน้ำตาลในอาหารที่ปรุงสุกแล้ว หรือไม่', 'เติมน้ำตาล'),
        ],
      },
    ],
  },
  fs: {
    id: 'fs',
    code: '',
    name: 'คำถามอาหารปลอดภัย',
    icon: '🛡️',
    title: 'คำถามอาหารปลอดภัย 4 ข้อ',
    short: 'คำถามอาหารปลอดภัย 4 ข้อ (เลือกคำตอบที่ถูกที่สุด)',
    audience: 'นักเรียนกลุ่มเดียวกับที่ทำแบบ 2.1 และ 2.2 (ก่อนและหลังทำกิจกรรม)',
    intro: 'มีคำถาม 4 ข้อ ให้นักเรียนเลือกคำตอบที่ถูกที่สุด เพียงคำตอบเดียว',
    sections: [
      {
        key: 'F', label: 'อาหารปลอดภัย', max: 4,
        title: 'คำถามอาหารปลอดภัย 4 ข้อ',
        hint: 'ให้นักเรียนเลือกคำตอบที่ถูกที่สุด เพียงคำตอบเดียว',
        questions: [
          mcq('fs1', 1, 'ข้อใดจัดเป็นพฤติกรรมการเลือกซื้อผลิตภัณฑ์อาหาร/ขนม/เครื่องดื่มสำเร็จรูปของผู้ที่ได้ชื่อว่า “ฉลาดซื้อฉลาดกิน”', [
            'เลือกซื้อผลิตภัณฑ์ที่มีเครื่องหมาย อย. ระบุวันผลิต วันหมดอายุ และปริมาณสารอาหาร',
            'เลือกซื้อผลิตภัณฑ์ที่มีฉลากโภชนาการทางเลือกสุขภาพ',
            'อ่านฉลากอาหารทุกครั้งก่อนตัดสินใจซื้อผลิตภัณฑ์',
            'ถูกทุกข้อ',
          ], 'ง'),
          mcq('fs2', 2, 'หากนักเรียนต้องการซื้ออาหาร/ขนม/เครื่องดื่มสำเร็จรูปที่ผ่านเกณฑ์อาหารลดหวาน มัน เค็ม นักเรียนจะต้องสังเกตเครื่องหมายหรือสัญลักษณ์ใดบนผลิตภัณฑ์', [
            'เครื่องหมาย อย.',
            'เครื่องหมาย มอก.',
            'สัญลักษณ์ทางเลือกสุขภาพ',
            'เครื่องหมายการค้า',
          ], 'ค'),
          mcq('fs3', 3, 'ผลไม้ในข้อใดที่นักเรียนควรเลือกรับประทาน มีความเสี่ยงต่ำในการได้รับสารปนเปื้อนจากสารเคมีอันตราย', [
            'ผลไม้พื้นบ้านหลากหลายตามฤดูกาล',
            'ผลไม้ดอง ใส่สี',
            'ผลไม้ที่ปลูกเอง หรือปลูกจากสวนเกษตรอินทรีย์',
            'ถูก ทั้งข้อ ก. และข้อ ค.',
          ], 'ง'),
          mcq('fs4', 4, 'การรับประทานอาหารในข้อใดอาจก่อให้เกิดอาการปวดท้อง ท้องเสีย อาเจียน', [
            'ข้าวมันไก่ที่เนื้อไก่ยังเป็นสีชมพู สุกไม่ทั่ว',
            'ส้มตำปูปลาร้าดิบ หรือกุ้งดิบ',
            'สลัดผักสดที่ล้างไม่สะอาด',
            'ถูกทุกข้อ',
          ], 'ง'),
        ],
      },
    ],
  },
};

// ตอบโดยนักเรียนกลุ่มเป้าหมายคนเดิมทั้ง 3 ชุด (ป.4–6 ชั้นละ 10 คน)
const STUDENT_FORMS = ['lit', 'beh', 'fs'];
const FS_IDS = FORMS.fs.sections[0].questions.map(q => q.id);

// ---------- STATE ----------
const STORE_KEY = 'kks-survey-v1';
let db = loadDb();
let cur = null;          // แบบประเมินที่นักเรียนกำลังทำ
let lastStart = {};      // ชั้น/ช่วงล่าสุดของแต่ละแบบ (ใช้กับนักเรียนคนถัดไป)
let prefill = null;      // ข้อมูลนักเรียนที่ทำแบบหนึ่งเสร็จแล้วกำลังทำอีกแบบต่อ
let startPhase = '';
let nutPhase = 't1s';
let reportGrade = '';
let reportTerm = '';
let reportPaired = false;
let reportParts = { nut: true, lit: true, beh: true, fs: true };

const params = new URLSearchParams(location.search);
const studentMode = params.get('mode') === 'student';
const fixedPhase = PHASES.some(p => p.v === params.get('phase')) ? params.get('phase') : '';
const onlyForm = FORMS[params.get('form')] ? params.get('form') : '';

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  applyUrlParams();
  window.addEventListener('hashchange', route);
  if (onlyForm && !location.hash) location.replace('#start-' + onlyForm);
  route();
  if (db.settings.sheetUrl && db.records.some(r => !r.synced)) pushPending(true);

  // ใช้งานออฟไลน์ได้ และส่งข้อมูลที่ค้างทันทีที่กลับมาออนไลน์
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* เปิดแบบออนไลน์ได้ตามปกติ */ });
  }
  const bar = el('offline-bar');
  const setOnline = () => { bar.hidden = navigator.onLine; };
  window.addEventListener('offline', setOnline);
  window.addEventListener('online', () => {
    setOnline();
    if (db.settings.sheetUrl && db.records.some(r => !r.synced)) {
      pushPending(true).then(() => { updateDoneStatus(); if (location.hash === '#data') renderData(); });
    }
  });
  setOnline();
});

function applyUrlParams() {
  const s = db.settings;
  let changed = false;
  [['school', 'school'], ['address', 'address'], ['aff', 'aff'], ['sheet', 'sheetUrl']].forEach(([p, k]) => {
    if (params.has(p)) { s[k] = params.get(p).trim(); changed = true; }
  });
  if (params.has('grades')) {
    const g = params.get('grades').split(',').filter(x => GRADES_ALL.includes(x));
    if (g.length) { s.studentGrades = g; changed = true; }
  }
  if (changed) saveDb();
}

// ---------- STORAGE ----------
function loadDb() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { /* ใช้ค่าเริ่มต้น */ }
  d = d && typeof d === 'object' ? d : {};
  const settings = Object.assign({}, DEFAULT_SETTINGS, d.settings);
  // เครื่องที่เคยเปิดก่อนมี Sheet กลาง (บันทึก sheetUrl ว่างไว้) ให้ใช้ Sheet กลางด้วย คำตอบที่ค้างจะถูกส่งขึ้นเอง
  if (!settings.sheetUrl && SHARED_SHEET_URL) settings.sheetUrl = SHARED_SHEET_URL;
  return {
    settings,
    records: splitLegacyFs(Array.isArray(d.records) ? d.records : []),
    deleted: Array.isArray(d.deleted) ? d.deleted : [],
  };
}

// รุ่นแรกเก็บคำถามอาหารปลอดภัยไว้ในแบบ 2.2 แยกออกมาเป็นชุดของตัวเอง (นักเรียนคนเดิม ช่วงเดิม)
function splitLegacyFs(records) {
  const out = [];
  records.forEach(r => {
    if (!r || r.form !== 'beh' || !r.answers || !FS_IDS.some(k => k in r.answers)) { out.push(r); return; }
    const beh = Object.assign({}, r, { answers: Object.assign({}, r.answers), synced: false });
    const fs = Object.assign({}, r, { id: r.id + '-fs', form: 'fs', answers: {}, synced: false });
    FS_IDS.forEach(k => { if (k in beh.answers) { fs.answers[k] = beh.answers[k]; delete beh.answers[k]; } });
    out.push(beh);
    if (!records.some(x => x && x.id === fs.id)) out.push(fs);
  });
  return out;
}

function saveDb() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(db));
    return true;
  } catch (e) {
    toast('บันทึกลงเครื่องไม่สำเร็จ กรุณาส่งออกไฟล์สำรองไว้');
    return false;
  }
}

// ข้อมูลจากไฟล์สำรองหรือ Google Sheet มาจากภายนอก จึงคัดเฉพาะรูปแบบที่แอปใช้
function sanitizeRecord(r) {
  if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !/^[\w-]{1,64}$/.test(r.id)) return null;
  if (!['lit', 'beh', 'fs', 'nut'].includes(r.form)) return null;
  const str = v => (typeof v === 'string' || typeof v === 'number') ? String(v).slice(0, 120) : '';
  const a = r.answers && typeof r.answers === 'object' ? r.answers : {};
  const out = {
    id: r.id, form: r.form, ts: Number(r.ts) || 0, phase: str(r.phase),
    name: str(r.name), grade: str(r.grade), no: str(r.no), school: str(r.school), answers: {},
  };
  if (r.form === 'nut') {
    NUT_TABLES.forEach(t => {
      out.answers[t.key] = {};
      GRADES_ALL.forEach(g => {
        const row = a[t.key] && a[t.key][g];
        if (Array.isArray(row)) out.answers[t.key][g] = t.cols.map((_, i) => Math.max(0, Math.floor(Number(row[i]) || 0)));
      });
    });
  } else {
    Object.keys(a).forEach(k => {
      const v = a[k];
      if (typeof v === 'number' || typeof v === 'string') out.answers[k] = v;
      else if (Array.isArray(v)) out.answers[k] = v.filter(x => typeof x === 'string' || typeof x === 'number');
    });
  }
  return out;
}

// รวมข้อมูลจากไฟล์สำรองหรือ Google Sheet โดยยึดฉบับที่แก้ไขล่าสุด
function mergeRecords(list, synced) {
  let added = 0;
  splitLegacyFs(list.map(sanitizeRecord).filter(Boolean)).forEach(r => {
    if (db.deleted.includes(r.id)) return;
    const i = db.records.findIndex(x => x.id === r.id);
    const rec = Object.assign(r, { synced: !!synced });
    if (i < 0) { db.records.push(rec); added++; }
    else if ((r.ts || 0) > (db.records[i].ts || 0)) db.records[i] = rec;
    else if (synced && (r.ts || 0) === (db.records[i].ts || 0)) db.records[i].synced = true;
  });
  saveDb();
  return added;
}

// ---------- GOOGLE SHEET SYNC ----------
async function postSheet(body) {
  const res = await fetch(db.settings.sheetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'บันทึกไม่สำเร็จ');
  return data;
}

async function pushRecord(r) {
  if (!db.settings.sheetUrl) return false;
  try {
    const copy = Object.assign({}, r);
    delete copy.synced;
    await postSheet({ action: 'save', record: copy });
    r.synced = true;
    saveDb();
    return true;
  } catch (e) {
    return false;
  }
}

async function pushPending(silent) {
  const list = db.records.filter(r => !r.synced);
  let ok = 0;
  for (const r of list) if (await pushRecord(r)) ok++;
  if (!silent) toast(list.length ? `ส่งข้อมูลขึ้น Google Sheet สำเร็จ ${ok}/${list.length} รายการ` : 'ไม่มีข้อมูลค้างส่ง');
  return ok;
}

// หน้าของครูดึงคำตอบล่าสุดจาก Google Sheet ให้เองเมื่อเปิดหน้า (ไม่เกินทุก 30 วินาที)
let lastAutoPull = 0;
function autoPull() {
  const s = db.settings;
  if (studentMode || !s.sheetUrl || !s.readKey || !navigator.onLine || Date.now() - lastAutoPull < 30000) return;
  lastAutoPull = Date.now();
  pullSheet().then(list => {
    const before = JSON.stringify(db.records.map(r => [r.id, r.ts]));
    mergeRecords(list, true);
    const changed = JSON.stringify(db.records.map(r => [r.id, r.ts])) !== before;
    if (changed && ['', 'progress', 'report', 'data'].includes(location.hash.slice(1)) && !cur) route();
  }).catch(() => { /* ใช้ข้อมูลในเครื่องไปก่อน กดดึงข้อมูลเองได้ */ });
}

async function pullSheet() {
  const url = db.settings.sheetUrl;
  const q = new URLSearchParams({ action: 'list', key: db.settings.readKey || '' });
  const res = await fetch(url + (url.includes('?') ? '&' : '?') + q.toString());
  const data = await res.json();
  if (!data.ok || !Array.isArray(data.records)) throw new Error(data.error || 'รูปแบบข้อมูลไม่ถูกต้อง');
  return data.records;
}

// ---------- ROUTING ----------
const ROUTES = {
  '': renderHome,
  'nut': renderNut,
  'progress': renderProgress,
  'report': renderReport,
  'data': renderData,
  'settings': renderSettings,
  'start-lit': () => renderStart('lit'),
  'start-beh': () => renderStart('beh'),
  'start-fs': () => renderStart('fs'),
  'form': renderFormPage,
  'done': renderDone,
};

function go(r) {
  if (location.hash.slice(1) === r) route();
  else location.hash = r;
}

function route() {
  const r = location.hash.slice(1);
  if (cur && !cur.done && r !== 'form' && Object.keys(cur.answers).length) {
    if (!confirm('ออกจากแบบประเมิน? คำตอบที่ทำไว้จะหายไป')) {
      history.pushState(null, '', '#form');
      return;
    }
    cur = null;
    clearDraft();
  }
  (ROUTES[r] || renderHome)();
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
  window.scrollTo({ top: 0 });
}

// ---------- HOME ----------
function renderHome() {
  autoPull();
  const s = db.settings;
  const count = f => db.records.filter(r => r.form === f).length;
  const studentCards = STUDENT_FORMS
    .filter(f => !onlyForm || f === onlyForm)
    .map(f => menuCard(`#start-${f}`, FORMS[f].icon, FORMS[f].name, FORMS[f].short))
    .join('');
  const unsynced = db.records.filter(r => !r.synced).length;

  el('page-home').innerHTML = `
    <div class="card header-card">
      <div class="school-logo">🍎</div>
      <h1>แบบเก็บข้อมูลโครงการเด็กไทยแก้มใส</h1>
      <h2>ภาวะโภชนาการ · ความรอบรู้ด้านอาหาร · พฤติกรรมการบริโภค</h2>
      <p class="subtitle">${esc(s.school)}<br>${esc(s.aff)}</p>
    </div>
    <div class="card">
      <h3>สำหรับนักเรียน</h3>
      <div class="menu-list">${studentCards}</div>
      ${onlyForm ? '' : '<p class="muted status-line">นักเรียนแต่ละคนทำครบทั้ง 3 ชุด ใช้ชื่อเดียวกันทุกชุด</p>'}
    </div>
    ${studentMode ? `<p class="center"><a class="muted" href="./">สำหรับครู</a></p>` : `
    <div class="card info-card">
      <h4>กำหนดส่งข้อมูล</h4>
      <ul class="plain-list">
        <li><b>ข้อมูลภาวะโภชนาการ</b> ปีการศึกษา 2569 (ต้นเทอม–ปลายเทอม): ${NUT_TERMS.map(t => `${t.label.replace(' ปีการศึกษา 2569', '')} ${t.due}`).join(' · ')}</li>
        <li><b>แบบประเมินกลุ่มเป้าหมาย</b> (แบบ 2.1, แบบ 2.2 และคำถามอาหารปลอดภัย 4 ข้อ): นักเรียน ${TARGET_PER_GRADE} คนต่อระดับชั้น (ป.4–6 และโรงเรียนขยายโอกาสเพิ่ม ม.1–3) ประเมินก่อน–หลังทำโครงการในนักเรียนคนเดิม</li>
      </ul>
    </div>
    ${progressOverviewHtml()}
    <div class="card">
      <h3>สำหรับครู</h3>
      <div class="menu-list">
        ${menuCard('#progress', '📋', 'ติดตามความคืบหน้า', 'ใครทำแล้ว/ยังไม่ทำ ก่อน–หลัง เทียบเป้าหมาย 10 คนต่อชั้น และรายชื่อที่ต้องตาม')}
        ${menuCard('#nut', '📏', 'แบบ 1 ตารางข้อมูลภาวะโภชนาการ', 'กรอกจำนวนนักเรียนแยกตามระดับชั้น ภาคเรียนละ 2 ครั้ง (ต้นเทอม / ปลายเทอม)')}
        ${menuCard('#report', '📊', 'สรุปผลและพิมพ์รายงาน', 'ประมวลผลทุกแบบ เปรียบเทียบก่อน–หลังทำกิจกรรม พิมพ์หรือบันทึกเป็น PDF')}
        ${menuCard('#data', '🗂️', 'จัดการข้อมูล / ส่งออก Excel', 'ดูรายการคำตอบ ดาวน์โหลดไฟล์ CSV สำรองและรวมข้อมูลจากหลายเครื่อง')}
        ${menuCard('#settings', '⚙️', 'ตั้งค่า และลิงก์ให้นักเรียนตอบออนไลน์', 'ข้อมูลโรงเรียน ระดับชั้น เชื่อม Google Sheet สร้างลิงก์ / QR Code')}
      </div>
      <p class="muted status-line">ข้อมูลในเครื่องนี้: ${STUDENT_FORMS.map(f => `${FORMS[f].name} = ${count(f)} คน`).join(' · ')} · ตารางภาวะโภชนาการ = ${count('nut')} ชุด
      ${s.sheetUrl ? ` · ${unsynced ? `ค้างส่ง Google Sheet ${unsynced} รายการ` : 'ส่งขึ้น Google Sheet ครบแล้ว'}` : ' · ยังไม่ได้เชื่อม Google Sheet'}</p>
    </div>`}`;
  showPage('page-home');
}

// ---------- PROGRESS ----------
function targetGrades() {
  const s = db.settings;
  return GRADES_ALL.filter(g => s.studentGrades.includes(g) || db.records.some(r => r.form !== 'nut' && r.grade === g));
}

function meterHtml(n, target) {
  const w = target ? Math.min(100, (n * 100) / target) : 0;
  return `<span class="meter-wrap"><span class="meter"><span class="${n >= target ? 'full' : ''}" style="width:${w}%"></span></span><b>${n}/${target}</b></span>`;
}

function progressOverviewHtml() {
  const grades = GRADES_ALL.filter(g => db.settings.studentGrades.includes(g));
  const target = TARGET_PER_GRADE * grades.length;
  const count = (f, p) => sum(grades.map(g => byPhase(db.records.filter(r => r.form === f && r.grade === g))[p].length));
  const nutDone = NUT_ROUNDS.filter(r => nutRecord(r.v)).length;
  const rows = STUDENT_FORMS.flatMap(f => PHASES.map(p =>
    `<div class="ov-row"><span>${FORMS[f].name} ${p.label}</span>${meterHtml(count(f, p.v), target)}</div>`));
  return `
    <a class="card overview" href="#progress">
      <h3>ความคืบหน้า <small class="muted">(ชั้น ${grades.join(', ')})</small></h3>
      ${rows.join('')}
      <div class="ov-row"><span>ตารางภาวะโภชนาการ</span>${meterHtml(nutDone, NUT_ROUNDS.length)}</div>
      <span class="ov-more">ดูรายชื่อที่ต้องติดตาม →</span>
    </a>`;
}

function renderProgress() {
  autoPull();
  const s = db.settings;
  const grades = targetGrades();
  const data = {};
  STUDENT_FORMS.forEach(f => {
    const recs = db.records.filter(r => r.form === f);
    data[f] = { all: byPhase(recs), raw: recs, grade: {} };
    grades.forEach(g => { data[f].grade[g] = byPhase(recs.filter(r => r.grade === g)); });
  });
  const who = r => `${esc(r.name || '(ไม่มีชื่อ)')} <small>${esc(r.grade)}${r.no ? ' เลขที่ ' + esc(r.no) : ''}${r.missing ? ` · ยังไม่ทำ: ${esc(r.missing)}` : ''}</small>`;
  const byGradeName = list => list.slice().sort((a, b) =>
    GRADES_ALL.indexOf(a.grade) - GRADES_ALL.indexOf(b.grade) || String(a.no).localeCompare(String(b.no), 'th', { numeric: true }) || String(a.name).localeCompare(String(b.name), 'th'));
  const listBox = (title, list, note) => list.length
    ? `<div class="follow-box"><h4>${title} <span class="pill">${list.length} คน</span></h4>${note ? `<p class="muted">${note}</p>` : ''}<ul class="name-list">${byGradeName(list).map(r => `<li>${who(r)}</li>`).join('')}</ul></div>`
    : '';

  const checks = [];
  STUDENT_FORMS.forEach(f => {
    const name = FORMS[f].name;
    const g = data[f].all;
    const postKeys = new Set(g.post.map(pairKey));
    const preKeys = new Set(g.pre.map(pairKey));
    checks.push(listBox(`${name}: ทำก่อนทำกิจกรรมแล้ว ยังไม่ทำหลังทำกิจกรรม`, g.pre.filter(r => !postKeys.has(pairKey(r)))));
    checks.push(listBox(`${name}: ทำหลังทำกิจกรรม แต่ไม่พบคำตอบก่อนทำกิจกรรม`, g.post.filter(r => !preKeys.has(pairKey(r))),
      'อาจสะกดชื่อหรือเลือกชั้นไม่ตรงกับครั้งก่อน ตรวจสอบได้ที่หน้าจัดการข้อมูล'));
    const dup = [];
    PHASES.forEach(p => {
      const seen = {};
      data[f].raw.filter(r => r.phase === p.v).forEach(r => { const k = pairKey(r); seen[k] = (seen[k] || 0) + 1; });
      g[p.v].forEach(r => { if (seen[pairKey(r)] > 1) dup.push(Object.assign({}, r, { name: `${r.name} (${p.label} ${seen[pairKey(r)]} ครั้ง)` })); });
    });
    checks.push(listBox(`${name}: ตอบซ้ำในช่วงเดียวกัน`, dup, 'ระบบใช้คำตอบล่าสุดในการประมวลผล ลบคำตอบเกินได้ที่หน้าจัดการข้อมูล'));
  });
  // นักเรียนคนเดียวกันต้องทำครบทั้ง 3 ชุดในแต่ละช่วง
  PHASES.forEach(p => {
    const done = {};
    STUDENT_FORMS.forEach(f => data[f].all[p.v].forEach(r => {
      const k = pairKey(r);
      done[k] = done[k] || { rec: r, forms: new Set() };
      done[k].forms.add(f);
    }));
    const incomplete = Object.values(done)
      .filter(x => x.forms.size < STUDENT_FORMS.length)
      .map(x => Object.assign({}, x.rec, { missing: STUDENT_FORMS.filter(f => !x.forms.has(f)).map(f => FORMS[f].name).join(', ') }));
    checks.push(listBox(`${p.label}: ยังทำไม่ครบทั้ง 3 ชุด`, incomplete));
  });
  const checksHtml = checks.join('');

  el('page-progress').innerHTML = `
    <div class="card header-card">
      <div class="school-logo">📋</div>
      <h1>ติดตามความคืบหน้า</h1>
      <p class="subtitle">${esc(s.school)} · เป้าหมาย ${TARGET_PER_GRADE} คนต่อระดับชั้น ก่อน–หลังทำกิจกรรมในนักเรียนคนเดิม</p>
    </div>
    ${s.sheetUrl ? `<div class="card"><button class="btn-primary" id="prog-pull">⬇ ดึงข้อมูลล่าสุดจาก Google Sheet</button>
      <p class="muted center">ข้อมูลในหน้านี้มาจากเครื่องนี้ กดดึงข้อมูลเพื่อรวมคำตอบของนักเรียนทุกเครื่อง</p></div>` : ''}
    <div class="card">
      <h3>ตารางภาวะโภชนาการ ปีการศึกษา 2569</h3>
      <div class="round-grid">${NUT_ROUNDS.map(r => {
        const rec = nutRecord(r.v);
        const t = NUT_TERMS.find(x => x.v === r.term);
        return `<a class="round ${rec ? 'done' : ''}" href="#nut" data-round="${r.v}"><b>${rec ? '✓' : '○'} ${r.label}</b><small>${rec ? `บันทึก ${fmtTime(rec.ts)}` : t.due}</small></a>`;
      }).join('')}</div>
    </div>
    ${STUDENT_FORMS.map(f => `
    <div class="card">
      <h3>${esc(FORMS[f].name)} <small class="muted">${esc(FORMS[f].short)}</small></h3>
      <div class="table-scroll"><table class="report-factor-table progress-table">
        <thead><tr><th>ชั้น</th>${PHASES.map(p => `<th>${p.label}</th>`).join('')}<th>จับคู่ได้</th></tr></thead>
        <tbody>${grades.map(g => {
          const x = data[f].grade[g];
          return `<tr><td>${g}</td>${PHASES.map(p => `<td>${meterHtml(x[p.v].length, TARGET_PER_GRADE)}</td>`).join('')}<td>${pairedKeys(x).size}</td></tr>`;
        }).join('')}</tbody>
      </table></div>
    </div>`).join('')}
    <div class="card">
      <h3>รายชื่อที่ต้องติดตาม</h3>
      ${checksHtml || '<p class="ok-box">✓ ไม่มีรายการที่ต้องติดตาม</p>'}
    </div>
    <a class="back-link" href="#">← กลับหน้าหลัก</a>`;

  const pull = el('prog-pull');
  if (pull) pull.onclick = () => doPull(renderProgress);
  el('page-progress').querySelectorAll('[data-round]').forEach(a => { a.onclick = () => { nutPhase = a.dataset.round; }; });
  showPage('page-progress');
}

function menuCard(href, icon, title, desc) {
  return `<a class="menu-card" href="${href}"><span class="menu-icon">${icon}</span><span><b>${esc(title)}</b><small>${esc(desc)}</small></span></a>`;
}

// ---------- STUDENT FORM: START ----------
function renderStart(fid) {
  const f = FORMS[fid];
  const s = db.settings;
  const pre = prefill && prefill.fid === fid ? prefill : null;
  prefill = null;
  const prev = pre || lastStart[fid] || {};
  startPhase = fixedPhase || prev.phase || '';
  const phaseHtml = fixedPhase
    ? `<p class="fixed-val">${phaseLabel(fixedPhase)}</p>`
    : `<div class="opt-row" id="st-phase">${PHASES.map(p => `<button type="button" class="opt-btn${p.v === startPhase ? ' selected' : ''}" data-phase="${p.v}">${p.label}</button>`).join('')}</div>`;

  const draft = loadDraft(fid);
  const draftHtml = draft ? `
    <div class="card draft-card">
      <h3>📝 มีแบบประเมินที่ทำค้างไว้</h3>
      <p>${esc(draft.name)} · ชั้น ${esc(draft.grade)} · ${phaseLabel(draft.phase)} · ตอบไปแล้ว ${Object.keys(draft.answers).length} ข้อ</p>
      <div class="btn-row">
        <button class="btn-primary" onclick="resumeDraft('${fid}')">ทำต่อจากเดิม →</button>
        <button class="btn-secondary" onclick="clearDraft(); renderStart('${fid}')">ไม่ใช่ของฉัน เริ่มใหม่</button>
      </div>
    </div>` : '';

  el('page-start').innerHTML = `
    <div class="card header-card">
      <div class="school-logo">${f.icon}</div>
      <h1>${f.code ? f.code + ' ' : ''}${esc(f.title)}</h1>
      <p class="subtitle">${esc(f.audience)}</p>
      <p class="subtitle">${esc(s.school)}</p>
    </div>
    ${draftHtml}
    <div class="card">
      <h3>ข้อมูลนักเรียน</h3>
      <div class="form-group">
        <label>ชื่อ – สกุล <span class="req">*</span></label>
        <input type="text" id="st-name" maxlength="80" placeholder="เช่น ด.ญ.ใจดี มีสุข" autocomplete="off" value="${pre ? esc(pre.name) : ''}">
        <small class="muted">ใช้จับคู่คำตอบก่อน–หลังทำกิจกรรมของนักเรียนคนเดิม กรุณาเขียนให้เหมือนกันทั้งสองครั้ง</small>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>ชั้น <span class="req">*</span></label>
          <select id="st-grade">
            <option value="">– เลือกชั้น –</option>
            ${s.studentGrades.map(g => `<option${g === prev.grade ? ' selected' : ''}>${g}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>เลขที่</label>
          <input type="text" id="st-no" inputmode="numeric" maxlength="5" placeholder="เช่น 12" value="${pre ? esc(pre.no) : ''}">
        </div>
      </div>
      <div class="form-group">
        <label>ช่วงการเก็บข้อมูล <span class="req">*</span></label>
        ${phaseHtml}
      </div>
      <button class="btn-primary" onclick="beginForm('${fid}')">เริ่มทำแบบประเมิน →</button>
    </div>
    <div class="card info-card">
      <h4>คำชี้แจง</h4>
      <p>${esc(f.intro)}</p>
    </div>
    <a class="back-link" href="#">← กลับหน้าหลัก</a>`;

  const ph = el('st-phase');
  if (ph) ph.addEventListener('click', e => {
    const b = e.target.closest('[data-phase]');
    if (!b) return;
    startPhase = b.dataset.phase;
    ph.querySelectorAll('.opt-btn').forEach(x => x.classList.toggle('selected', x === b));
  });
  showPage('page-start');
}

function beginForm(fid) {
  const name = el('st-name').value.trim().replace(/\s+/g, ' ');
  const grade = el('st-grade').value;
  if (!name) { toast('กรุณากรอกชื่อ – สกุล'); return; }
  if (!grade) { toast('กรุณาเลือกชั้น'); return; }
  if (!startPhase) { toast('กรุณาเลือกช่วงการเก็บข้อมูล'); return; }
  lastStart[fid] = { grade, phase: startPhase };
  clearDraft();
  cur = { form: FORMS[fid], name, grade, phase: startPhase, no: el('st-no').value.trim(), answers: {}, sec: 0, missing: new Set(), done: false };
  go('form');
}

// ---------- DRAFT (กันคำตอบหายเมื่อรีเฟรชหรือปิดหน้าโดยไม่ตั้งใจ) ----------
const DRAFT_KEY = 'kks-draft-v1';
const DRAFT_MAX_AGE = 24 * 60 * 60 * 1000;

function saveDraft() {
  if (!cur || cur.done) return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      fid: cur.form.id, name: cur.name, grade: cur.grade, phase: cur.phase, no: cur.no,
      answers: cur.answers, sec: cur.sec, ts: Date.now(),
    }));
  } catch (e) { /* ไม่มีที่เก็บก็ทำต่อได้ตามปกติ */ }
}

function loadDraft(fid) {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (!d || !FORMS[d.fid] || (fid && d.fid !== fid) || Date.now() - d.ts > DRAFT_MAX_AGE) return null;
    return d;
  } catch (e) { return null; }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
}

function resumeDraft(fid) {
  const d = loadDraft(fid);
  if (!d) { renderStart(fid); return; }
  const sec = Math.min(Math.max(0, d.sec | 0), FORMS[fid].sections.length - 1);
  cur = { form: FORMS[fid], name: d.name, grade: d.grade, phase: d.phase, no: d.no || '', answers: d.answers || {}, sec, missing: new Set(), done: false };
  go('form');
}

// ---------- STUDENT FORM: SECTIONS ----------
function renderFormPage() {
  if (!cur || cur.done) {
    const d = loadDraft();
    go(d ? 'start-' + d.fid : '');
    return;
  }
  el('page-form').innerHTML = `
    <div class="progress-bar-wrap"><div class="progress-bar" id="progress-bar"></div></div>
    <div class="top-nav">
      <span id="section-label"></span>
      <span id="section-count"></span>
    </div>
    <div id="form-content"></div>
    <div class="nav-buttons">
      <button class="btn-secondary" id="btn-prev">← ก่อนหน้า</button>
      <button class="btn-primary" id="btn-next">ถัดไป →</button>
    </div>`;
  el('btn-prev').onclick = prevSection;
  el('btn-next').onclick = nextSection;
  const c = el('form-content');
  c.addEventListener('click', onFormClick);
  c.addEventListener('input', onFormInput);
  renderSection();
  showPage('page-form');
}

function updateSectionCount() {
  const sec = cur.form.sections[cur.sec];
  const qs = visibleQuestions(sec, cur.answers);
  const done = qs.filter(q => isAnswered(q, cur.answers)).length;
  el('section-count').textContent = `ตอน ${cur.sec + 1}/${cur.form.sections.length} · ตอบแล้ว ${done}/${qs.length} ข้อ`;
}

function renderSection() {
  const f = cur.form;
  const sec = f.sections[cur.sec];
  const total = f.sections.length;

  el('progress-bar').style.width = `${((cur.sec + 1) / total) * 100}%`;
  el('section-label').textContent = `${f.name} · ชั้น ${cur.grade} · ${phaseLabel(cur.phase)}`;
  updateSectionCount();
  el('btn-prev').style.display = cur.sec === 0 ? 'none' : 'inline-block';
  el('btn-next').textContent = cur.sec === total - 1 ? 'ส่งคำตอบ ✓' : 'ถัดไป →';

  el('form-content').innerHTML = `
    <div class="card">
      <div class="section-header internal">
        <h3>${esc(sec.title)}</h3>
        ${sec.hint ? `<p class="sec-hint">${esc(sec.hint)}</p>` : ''}
      </div>
      ${sec.group ? `<div class="q-group">${esc(sec.group)}</div>` : ''}
      ${sec.questions.map(q => questionHtml(q, cur.answers, sec)).join('')}
    </div>`;
}

function questionHtml(q, a, sec) {
  if (q.showIf && !q.showIf(a)) return '';
  if (q.type === 'note') return `<div class="q-note">${esc(q.text)}</div>`;
  let body = '';
  if (q.type === 'choice') {
    body = `<div class="${q.vertical ? 'opt-col' : 'opt-row'}${q.freq ? ' freq' : ''}">${optButtons(q.id, q.options, a[q.id])}</div>${followHtml(q, a)}`;
  } else if (q.type === 'scale') {
    body = scaleHtml(q.id, sec.scale, a[q.id]);
  } else if (q.type === 'number') {
    body = numInput(q, a[q.id]);
  } else if (q.type === 'texts') {
    const v = Array.isArray(a[q.id]) ? a[q.id] : [];
    body = `<div class="texts">${Array.from({ length: q.count }, (_, i) =>
      `<label class="text-line"><span>${i + 1}.</span><input type="text" class="inp" maxlength="80" data-q="${q.id}" data-idx="${i}" value="${esc(v[i] || '')}"></label>`).join('')}</div>`;
  }
  const missing = cur && cur.missing.has(q.id) && !isAnswered(q, a);
  const no = q.no !== '' && q.no !== undefined ? `<span class="q-no">${q.no}.</span> ` : '';
  return `<div class="q${missing ? ' missing' : ''}" id="q-${q.id}"><div class="q-text">${no}${esc(q.text)}</div>${body}</div>`;
}

function optButtons(id, options, val, multi) {
  const sel = o => multi ? Array.isArray(val) && val.includes(o.v) : o.v === val;
  return options.map(o => `<button type="button" class="opt-btn${sel(o) ? ' selected' : ''}" data-q="${id}" data-v="${o.v}"${typeof o.v === 'number' ? ' data-num="1"' : ''}${multi ? ' data-multi="1"' : ''}>${esc(o.label)}${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</button>`).join('');
}

function followHtml(q, a) {
  const opt = q.options.find(o => o.v === a[q.id]);
  if (!opt || !opt.follow) return '';
  return `<div class="follow">${opt.follow.map(f => {
    let input;
    if (f.type === 'number') input = numInput(f, a[f.id]);
    else if (f.type === 'text') input = `<input type="text" class="inp" maxlength="120" data-q="${f.id}" value="${esc(a[f.id] || '')}">`;
    else input = `<div class="opt-row">${optButtons(f.id, f.options, a[f.id], f.type === 'multi')}</div>`;
    return `<div class="field"><label>${esc(f.label)}${f.required ? ' <span class="req">*</span>' : ''}</label>${input}</div>`;
  }).join('')}</div>`;
}

function numInput(f, v) {
  return `<span class="num-wrap"><input type="number" class="inp" inputmode="decimal" data-q="${f.id}" min="${f.min}" max="${f.max}" step="${f.step || 1}" placeholder="${f.min}–${f.max}" value="${v ?? ''}"><span class="unit">${esc(f.unit || '')}</span></span>`;
}

function scaleHtml(id, sc, v) {
  let btns = '';
  for (let i = 1; i <= 5; i++) {
    btns += `<button type="button" class="score-btn${v === i ? ' selected' : ''}" data-q="${id}" data-v="${i}" data-num="1">${i}</button>`;
  }
  return `<div class="scale"><div class="score-input">${btns}</div><div class="scale-labels"><span>1 = ${esc(sc.low)}</span><span>5 = ${esc(sc.high)}</span></div></div>`;
}

function onFormClick(e) {
  const b = e.target.closest('button[data-q]');
  if (!b) return;
  const id = b.dataset.q;
  const v = b.dataset.num ? Number(b.dataset.v) : b.dataset.v;
  if (b.dataset.multi) {
    const arr = Array.isArray(cur.answers[id]) ? cur.answers[id] : [];
    cur.answers[id] = arr.includes(v) ? arr.filter(x => x !== v) : arr.concat(v);
  } else {
    cur.answers[id] = v;
  }
  renderSection();
  saveDraft();
  scrollToNextQuestion(id, v);
}

// ตอบข้อหลักที่ไม่มีคำถามย่อยแล้ว เลื่อนไปข้อถัดไปที่ยังไม่ได้ตอบ
function scrollToNextQuestion(id, v) {
  const qs = visibleQuestions(cur.form.sections[cur.sec], cur.answers);
  const i = qs.findIndex(q => q.id === id);
  if (i < 0) return;
  const opt = (qs[i].options || []).find(o => o.v === v);
  if (opt && opt.follow) return;
  const next = qs.slice(i + 1).find(q => !isAnswered(q, cur.answers));
  const target = next ? el('q-' + next.id) : el('btn-next');
  if (!target) return;
  const top = target.getBoundingClientRect().top;
  if (top > window.innerHeight * 0.6 || top < 0) {
    window.scrollTo({ top: window.scrollY + top - window.innerHeight * 0.25, behavior: 'smooth' });
  }
}

function onFormInput(e) {
  const t = e.target;
  const id = t.dataset.q;
  if (!id) return;
  if (t.dataset.idx !== undefined) {
    const arr = Array.isArray(cur.answers[id]) ? cur.answers[id].slice() : [];
    arr[Number(t.dataset.idx)] = t.value;
    cur.answers[id] = arr;
  } else if (t.type === 'number') {
    cur.answers[id] = t.value === '' ? undefined : Number(t.value);
  } else {
    cur.answers[id] = t.value;
  }
  updateSectionCount();
  saveDraft();
}

function prevSection() {
  if (cur.sec > 0) { cur.sec--; renderSection(); saveDraft(); window.scrollTo({ top: 0 }); }
}

function nextSection() {
  if (!cur || cur.done) return;   // กันกดส่งซ้ำ
  const sec = cur.form.sections[cur.sec];
  const miss = missingIn(sec, cur.answers);
  if (miss.length) {
    cur.missing = new Set(miss);
    renderSection();
    const first = el('q-' + miss[0]);
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast(`ยังตอบไม่ครบหรือกรอกไม่ถูกต้อง ${miss.length} ข้อ`);
    return;
  }
  cur.missing = new Set();
  if (cur.sec < cur.form.sections.length - 1) {
    cur.sec++;
    renderSection();
    saveDraft();
    window.scrollTo({ top: 0 });
  } else {
    submitForm();
  }
}

// ---------- VALIDATION ----------
function visibleQuestions(sec, a) {
  return sec.questions.filter(q => q.type !== 'note' && !(q.showIf && !q.showIf(a)));
}

function missingIn(sec, a) {
  return visibleQuestions(sec, a).filter(q => !isAnswered(q, a)).map(q => q.id);
}

function isAnswered(q, a) {
  const v = a[q.id];
  if (q.type === 'texts') {
    if (q.requiredIf && !q.requiredIf(a)) return true;
    return (Array.isArray(v) ? v.filter(x => x && x.trim()).length : 0) >= (q.minFilled || 0);
  }
  if (q.type === 'number') return validNum(v, q);
  if (v === undefined || v === '') return false;
  if (q.type === 'choice') {
    const opt = q.options.find(o => o.v === v);
    return !!opt && (opt.follow || []).every(f => !f.required || fieldOk(f, a[f.id]));
  }
  return true;
}

function fieldOk(f, v) {
  if (f.type === 'number') return validNum(v, f);
  if (f.type === 'multi') return Array.isArray(v) && v.length > 0;
  return v !== undefined && String(v).trim() !== '';
}

function validNum(v, f) {
  return typeof v === 'number' && !isNaN(v) && v >= f.min && v <= f.max;
}

// เก็บเฉพาะคำตอบของข้อที่แสดงอยู่ (ตัดคำตอบย่อยของตัวเลือกที่ไม่ได้เลือกออก)
function cleanAnswers(form, a) {
  const out = {};
  form.sections.forEach(sec => visibleQuestions(sec, a).forEach(q => {
    if (a[q.id] === undefined) return;
    out[q.id] = q.type === 'texts' ? a[q.id].map(x => (x || '').trim()) : a[q.id];
    if (q.type !== 'choice') return;
    const opt = q.options.find(o => o.v === a[q.id]);
    (opt && opt.follow || []).forEach(f => {
      const v = a[f.id];
      if (v !== undefined && v !== '') out[f.id] = typeof v === 'string' ? v.trim() : v;
    });
  }));
  return out;
}

// ---------- SUBMIT ----------
function submitForm() {
  const rec = {
    id: uid(),
    form: cur.form.id,
    ts: Date.now(),
    phase: cur.phase,
    name: cur.name,
    grade: cur.grade,
    no: cur.no,
    school: db.settings.school,
    answers: cleanAnswers(cur.form, cur.answers),
    synced: false,
  };
  db.records.push(rec);
  saveDb();
  clearDraft();
  cur.done = true;
  cur.record = rec;
  go('done');
  if (db.settings.sheetUrl) pushRecord(rec).then(updateDoneStatus);
}

function renderDone() {
  if (!cur || !cur.done) { go(''); return; }
  const fid = cur.form.id;
  // นักเรียนคนเดียวกันทำครบทั้ง 3 ชุด ชวนทำชุดที่ยังไม่ได้ทำต่อโดยไม่ต้องกรอกข้อมูลซ้ำ
  const key = pairKey(cur.record);
  const remaining = STUDENT_FORMS.filter(f => !db.records.some(r => r.form === f && r.phase === cur.phase && pairKey(r) === key));
  const next = STUDENT_FORMS.slice(STUDENT_FORMS.indexOf(fid) + 1).concat(STUDENT_FORMS).find(f => remaining.includes(f));
  const otherHtml = onlyForm ? '' : next
    ? `<button class="btn-primary" onclick="continueOther('${next}')">${FORMS[next].icon} ทำ${FORMS[next].name} ต่อ (ใช้ชื่อเดิม) →</button>
       <p class="muted">ยังไม่ได้ทำ: ${remaining.map(f => FORMS[f].name).join(', ')}</p>`
    : `<p class="ok-box">✓ ${esc(cur.name)} ทำครบทั้ง 3 ชุดแล้ว (${phaseLabel(cur.phase)})</p>`;
  el('page-done').innerHTML = `
    <div class="card header-card green">
      <div class="school-logo">🎉</div>
      <h1>ส่งคำตอบเรียบร้อยแล้ว</h1>
      <p class="subtitle">ขอบคุณ ${esc(cur.name)} ที่ตอบ${cur.form.name} · ชั้น ${esc(cur.grade)} · ${phaseLabel(cur.phase)}</p>
    </div>
    <div class="card center">
      <p id="done-status" class="muted"></p>
      ${otherHtml}
      <button class="${otherHtml && next ? 'btn-secondary wide' : 'btn-primary'}" onclick="nextStudent('${fid}')">ทำ${cur.form.name} สำหรับนักเรียนคนถัดไป →</button>
      <p><a class="back-link" href="#">← กลับหน้าหลัก</a></p>
    </div>`;
  updateDoneStatus();
  showPage('page-done');
}

function continueOther(fid) {
  prefill = { fid, name: cur.name, grade: cur.grade, no: cur.no, phase: cur.phase };
  cur = null;
  go('start-' + fid);
}

function updateDoneStatus() {
  const box = el('done-status');
  if (!box || !cur || !cur.record) return;
  if (!db.settings.sheetUrl) box.textContent = 'บันทึกคำตอบไว้ในเครื่องนี้แล้ว';
  else box.textContent = cur.record.synced ? 'ส่งข้อมูลขึ้น Google Sheet แล้ว' : 'บันทึกไว้ในเครื่องแล้ว กำลังส่งขึ้น Google Sheet… (ถ้าไม่มีอินเทอร์เน็ต ระบบจะส่งให้อีกครั้งเมื่อเปิดหน้านี้)';
}

function nextStudent(fid) {
  cur = null;
  go('start-' + fid);
}

// ---------- NUTRITION TABLE ----------
function nutRecord(phase) {
  return db.records.find(r => r.form === 'nut' && r.phase === phase);
}

function nutGrades(data, grade) {
  const used = g => NUT_TABLES.some(t => (data[t.key] && data[t.key][g] || []).some(x => x > 0));
  return GRADES_ALL.filter(g => (db.settings.grades.includes(g) || used(g)) && (!grade || g === grade));
}

function renderNut() {
  const s = db.settings;
  const rec = nutRecord(nutPhase);
  const data = rec ? rec.answers : {};
  const grades = nutGrades(data);

  el('page-nut').innerHTML = `
    <div class="card header-card">
      <div class="school-logo">📏</div>
      <h1>ตารางข้อมูลภาวะโภชนาการ</h1>
      <p class="subtitle">${esc(s.school)} | ${esc(s.aff)}</p>
    </div>
    <div class="card">
      <div class="form-group">
        <label>ครั้งที่วัด (ปีการศึกษา 2569)</label>
        <div class="opt-row" id="nut-phase">${NUT_ROUNDS.map(p => `<button type="button" class="opt-btn${p.v === nutPhase ? ' selected' : ''}" data-phase="${p.v}">${p.label}${nutRecord(p.v) ? ' ✓' : ''}</button>`).join('')}</div>
        <small class="muted">${NUT_TERMS.map(t => `${t.label}: ${t.due}`).join(' · ')}</small>
      </div>
      <p class="muted">กรอกจำนวนนักเรียน (คน) แยกตามระดับชั้น ช่องที่ไม่มีให้เว้นว่างไว้ ระบบรวมยอดและคิดร้อยละให้อัตโนมัติ และบันทึกทุกครั้งที่พิมพ์
      (เพิ่ม/ลดระดับชั้นได้ที่หน้า <a href="#settings">ตั้งค่า</a>)</p>
      <div id="nut-tables">${NUT_TABLES.map(t => nutTableHtml(t, grades, data, true)).join('')}</div>
      <div id="nut-check"></div>
      <button class="btn-primary" id="nut-save">${s.sheetUrl ? 'บันทึกและส่งขึ้น Google Sheet' : 'บันทึกข้อมูล'}</button>
      <p class="muted center" id="nut-status">${rec ? `บันทึกล่าสุด ${fmtTime(rec.ts)}` : 'ยังไม่มีข้อมูลของครั้งนี้'}</p>
    </div>
    <a class="back-link" href="#">← กลับหน้าหลัก</a>`;

  el('nut-phase').addEventListener('click', e => {
    const b = e.target.closest('[data-phase]');
    if (b) { nutPhase = b.dataset.phase; renderNut(); }
  });
  el('nut-tables').addEventListener('input', onNutInput);
  el('nut-save').onclick = async () => {
    const r = saveNut();
    if (!db.settings.sheetUrl) { toast('บันทึกข้อมูลในเครื่องแล้ว'); return; }
    toast((await pushRecord(r)) ? 'ส่งข้อมูลขึ้น Google Sheet แล้ว' : 'บันทึกในเครื่องแล้ว แต่ส่งขึ้น Google Sheet ไม่สำเร็จ');
  };
  updateNutTotals();
  showPage('page-nut');
}

function nutTableHtml(t, grades, data, editable) {
  const rows = grades.map(g => {
    const vals = (data[t.key] && data[t.key][g]) || [];
    const cells = t.cols.map((_, ci) => editable
      ? `<td><input type="number" min="0" step="1" inputmode="numeric" data-t="${t.key}" data-g="${g}" data-c="${ci}" value="${vals[ci] || ''}"></td>`
      : `<td>${vals[ci] || '-'}</td>`).join('');
    return `<tr><td class="lbl">${g}</td>${cells}<td class="tot" data-rt="${t.key}|${g}">${sum(vals) || '-'}</td></tr>`;
  }).join('');
  const colTotals = t.cols.map((_, ci) => sum(grades.map(g => ((data[t.key] && data[t.key][g]) || [])[ci] || 0)));
  const grand = sum(colTotals);
  return `
    <h4 class="table-title">ตารางข้อมูลภาวะโภชนาการ: ${t.title}</h4>
    <div class="table-scroll">
      <table class="report-factor-table nut-table" data-table="${t.key}">
        <thead>
          <tr><th rowspan="2">ระดับชั้น</th><th colspan="${t.cols.length + 1}">ข้อมูลภาวะโภชนาการ (คน)</th></tr>
          <tr>${t.cols.map(c => `<th>${c}</th>`).join('')}<th>รวม</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr class="total-row"><td>รวม</td>${colTotals.map((v, ci) => `<td data-ct="${t.key}|${ci}">${v}</td>`).join('')}<td data-gt="${t.key}">${grand}</td></tr>
          <tr class="pct-row"><td>ร้อยละ</td>${colTotals.map((v, ci) => `<td data-cp="${t.key}|${ci}">${pctNum(v, grand)}</td>`).join('')}<td>${grand ? '100.00' : '-'}</td></tr>
        </tfoot>
      </table>
    </div>`;
}

function readNutForm() {
  const data = {};
  document.querySelectorAll('#page-nut input[data-t]').forEach(inp => {
    const t = inp.dataset.t, g = inp.dataset.g, c = Number(inp.dataset.c);
    const v = Math.max(0, Math.floor(Number(inp.value) || 0));
    data[t] = data[t] || {};
    data[t][g] = data[t][g] || NUT_TABLES.find(x => x.key === t).cols.map(() => 0);
    data[t][g][c] = v;
  });
  return data;
}

function saveNut() {
  const data = readNutForm();
  let rec = nutRecord(nutPhase);
  if (!rec) {
    rec = { id: 'nut-' + nutPhase, form: 'nut', phase: nutPhase, name: '', grade: '', no: '', school: db.settings.school };
    db.deleted = db.deleted.filter(id => id !== rec.id);
    db.records.push(rec);
  }
  Object.assign(rec, { ts: Date.now(), answers: data, synced: false });
  saveDb();
  const st = el('nut-status');
  if (st) st.textContent = `บันทึกล่าสุด ${fmtTime(rec.ts)}`;
  return rec;
}

function onNutInput(e) {
  if (!e.target.dataset.t) return;
  saveNut();
  updateNutTotals();
}

function updateNutTotals() {
  const data = readNutForm();
  const rowTotals = {};
  NUT_TABLES.forEach(t => {
    const rows = data[t.key] || {};
    Object.keys(rows).forEach(g => {
      const s = sum(rows[g]);
      rowTotals[g] = rowTotals[g] || {};
      rowTotals[g][t.key] = s;
      setText(`[data-rt="${t.key}|${g}"]`, s || '-');
    });
    const colTotals = t.cols.map((_, ci) => sum(Object.values(rows).map(r => r[ci])));
    const grand = sum(colTotals);
    colTotals.forEach((v, ci) => {
      setText(`[data-ct="${t.key}|${ci}"]`, v);
      setText(`[data-cp="${t.key}|${ci}"]`, pctNum(v, grand));
    });
    setText(`[data-gt="${t.key}"]`, grand);
    const pctTotal = document.querySelector(`#page-nut table[data-table="${t.key}"] .pct-row td:last-child`);
    if (pctTotal) pctTotal.textContent = grand ? '100.00' : '-';
  });
  const box = el('nut-check');
  if (box) box.innerHTML = nutMismatchHtml(rowTotals);
}

function nutMismatchHtml(rowTotals) {
  const bad = Object.keys(rowTotals).filter(g => {
    const h = rowTotals[g].h || 0, w = rowTotals[g].w || 0;
    return h && w && h !== w;
  });
  if (!bad.length) return '';
  return `<div class="warn-box"><b>⚠ ตรวจสอบจำนวนนักเรียน</b> ยอดรวมของสองตารางควรเท่ากัน (นักเรียนกลุ่มเดียวกัน)<ul>${bad.map(g =>
    `<li>${g}: ตารางส่วนสูง ${rowTotals[g].h} คน แต่ตารางน้ำหนัก ${rowTotals[g].w} คน</li>`).join('')}</ul></div>`;
}

function nutRowTotals(data, grades) {
  const out = {};
  grades.forEach(g => {
    out[g] = {};
    NUT_TABLES.forEach(t => { out[g][t.key] = sum((data[t.key] && data[t.key][g]) || []); });
  });
  return out;
}

// ---------- STATISTICS ----------
function mean(xs) { return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN; }
function sd(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
}
function sum(xs) { return xs.reduce((s, x) => s + (Number(x) || 0), 0); }
function fmt(x, d = 2) { return isNaN(x) ? '–' : x.toFixed(d); }
function pctNum(k, n) { return n ? (k * 100 / n).toFixed(2) : '-'; }
function pct(k, n) { return n ? `${k} (${(k * 100 / n).toFixed(1)}%)` : '–'; }
function signed(x) { return isNaN(x) ? '–' : (x > 0 ? '+' : '') + x.toFixed(2); }

// เกณฑ์แปลความหมายค่าเฉลี่ย 5 ระดับ
function level(m) {
  if (isNaN(m)) return '';
  if (m >= 4.21) return 'มากที่สุด';
  if (m >= 3.41) return 'มาก';
  if (m >= 2.61) return 'ปานกลาง';
  if (m >= 1.81) return 'น้อย';
  return 'น้อยที่สุด';
}

function nums(recs, id) {
  return recs.map(r => r.answers[id]).filter(v => typeof v === 'number' && !isNaN(v));
}

function sectionScore(sec, a) {
  if (sec.max) return sec.questions.filter(q => q.key && a[q.id] === q.key).length;
  const xs = sec.questions.map(q => a[q.id]).filter(v => typeof v === 'number');
  return xs.length ? mean(xs) : NaN;
}

function scoreList(recs, sec) {
  return recs.map(r => sectionScore(sec, r.answers)).filter(x => !isNaN(x));
}

function meanCell(xs, max) {
  if (!xs.length) return '–';
  const m = mean(xs);
  return max
    ? `${fmt(m)} <small>(S.D. ${fmt(sd(xs))}) · ${(m * 100 / max).toFixed(1)}%</small>`
    : `${fmt(m)} <small>(S.D. ${fmt(sd(xs))}) · ${level(m)}</small>`;
}

function topTexts(values, n = 8) {
  const counts = {};
  values.forEach(v => {
    const k = String(v || '').trim().replace(/\s+/g, ' ');
    if (k) counts[k] = (counts[k] || 0) + 1;
  });
  const list = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
  return list.length ? list.map(([k, c]) => `${esc(k)} (${c})`).join(', ') : '–';
}

// ใช้ชั้น + ชื่อ (ตัดคำนำหน้าและช่องว่าง) จับคู่คำตอบก่อน–หลังของนักเรียนคนเดิม
function pairKey(r) {
  const name = String(r.name || '')
    .replace(/^\s*(เด็กชาย|เด็กหญิง|ด\.\s*ช\.|ด\.\s*ญ\.|นางสาว|น\.\s*ส\.|นาย)\s*/, '')
    .replace(/\s+/g, '');
  return `${r.grade}|${name || 'เลขที่ ' + (r.no || r.id)}`;
}

// แยกตามช่วง และถ้านักเรียนตอบซ้ำในช่วงเดียวกัน ใช้คำตอบล่าสุด
function byPhase(recs) {
  const g = {};
  PHASES.forEach(p => {
    const latest = new Map();
    recs.filter(r => r.phase === p.v).forEach(r => {
      const k = pairKey(r);
      if (!latest.has(k) || r.ts > latest.get(k).ts) latest.set(k, r);
    });
    g[p.v] = Array.from(latest.values());
  });
  return g;
}

function pairedKeys(g) {
  const post = new Set(g.post.map(pairKey));
  return new Set(g.pre.map(pairKey).filter(k => post.has(k)));
}

function pairedOnly(g) {
  const keys = pairedKeys(g);
  return { pre: g.pre.filter(r => keys.has(pairKey(r))), post: g.post.filter(r => keys.has(pairKey(r))) };
}

// ตารางเปรียบเทียบก่อน–หลัง: rows = [{ label, cell(recs), num?(recs), sub?, head? }]
function compareTable(rows, groups, withDiff) {
  const cols = PHASES.filter(p => groups[p.v].length);
  if (!cols.length) return '<p class="muted">ยังไม่มีข้อมูล</p>';
  const showDiff = withDiff && cols.length === 2;
  const span = cols.length + 1 + (showDiff ? 1 : 0);
  const head = `<tr><th>รายการ</th>${cols.map(p => `<th>${p.label}<br><small>n = ${groups[p.v].length}</small></th>`).join('')}${showDiff ? '<th>ผลต่าง<br><small>(หลัง − ก่อน)</small></th>' : ''}</tr>`;
  const body = rows.map(r => r.head
    ? `<tr class="group-row"><td colspan="${span}">${r.label}</td></tr>`
    : `<tr><td class="lbl${r.sub ? ' sub' : ''}">${r.label}</td>${cols.map(p => `<td>${r.cell(groups[p.v])}</td>`).join('')}${showDiff ? `<td>${r.num ? signed(r.num(groups.post) - r.num(groups.pre)) : ''}</td>` : ''}</tr>`).join('');
  return `<div class="table-scroll"><table class="report-factor-table rep-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
}

// ---------- CHARTS ----------
// ภาวะโภชนาการเป็นข้อมูลแบบสองขั้ว: ต่ำกว่าเกณฑ์ = โทนน้ำเงิน, ตามเกณฑ์ = เทา, สูงกว่าเกณฑ์ = โทนแดง (อ่อน → เข้มตามความรุนแรง)
const NUT_COLORS = {
  h: ['#1c5cab', '#86b6ef', '#d9d8d2', '#ef9793', '#b3261e'],
  w: ['#1c5cab', '#86b6ef', '#d9d8d2', '#ef9793', '#e34948', '#9e1c1b'],
};
const DARK_FILLS = ['#1c5cab', '#b3261e', '#e34948', '#9e1c1b'];
const SERIES = ['#2a78d6', '#eb6834'];   // ก่อน / หลังทำกิจกรรม

function legendHtml(items) {
  return `<div class="chart-legend">${items.map(([label, color]) =>
    `<span><i style="background:${color}"></i>${esc(label)}</span>`).join('')}</div>`;
}

// แท่งร้อยละแบบซ้อน: rows = [{ label, sub, values }]
function stackedChartHtml(t, rows) {
  const colors = NUT_COLORS[t.key];
  const bars = rows.map(row => {
    const n = sum(row.values);
    const segs = n ? t.cols.map((c, i) => {
      const v = row.values[i] || 0;
      if (!v) return '';
      const p = (v * 100) / n;
      const ink = DARK_FILLS.includes(colors[i]) ? '#fff' : '#0b0b0b';
      return `<span style="flex-grow:${v};background:${colors[i]};color:${ink}" title="${esc(row.label)} · ${c} ${v} คน (${p.toFixed(1)}%)">${p >= 8 ? Math.round(p) + '%' : ''}</span>`;
    }).join('') : '<em>ไม่มีข้อมูล</em>';
    return `<div class="st-row"><div class="st-label">${esc(row.label)}<small>${n} คน</small></div><div class="st-bar">${segs}</div></div>`;
  }).join('');
  return `<figure class="chart">
    <figcaption>${t.title} (ร้อยละของนักเรียน)</figcaption>
    ${legendHtml(t.cols.map((c, i) => [c, colors[i]]))}
    ${bars}
  </figure>`;
}

// แท่งแนวนอนเทียบก่อน–หลัง: cats = [{ label, values: { pre, post } }] ค่าเป็นร้อยละ 0–100
function compareChartHtml(title, cats, groups, unit = '%') {
  const cols = PHASES.filter(p => groups[p.v].length);
  if (!cols.length) return '';
  const rows = cats.map(c => `<div class="hb-row">
      <div class="hb-label">${c.label}</div>
      <div class="hb-bars">${cols.map(p => {
        const v = c.values[p.v];
        const color = SERIES[PHASES.indexOf(p)];
        return `<div class="hb-line"><span class="hb-bar" style="width:${isNaN(v) ? 0 : Math.max(0.5, v)}%;background:${color}" title="${p.label}: ${isNaN(v) ? '–' : v.toFixed(1) + unit}"></span><span class="hb-val">${isNaN(v) ? '–' : v.toFixed(1) + unit}</span></div>`;
      }).join('')}</div>
    </div>`).join('');
  return `<figure class="chart">
    <figcaption>${title}</figcaption>
    ${legendHtml(cols.map(p => [`${p.label} (n = ${groups[p.v].length})`, SERIES[PHASES.indexOf(p)]]))}
    <div class="hb-axis"><span>0</span><span>25</span><span>50</span><span>75</span><span>100${unit}</span></div>
    ${rows}
  </figure>`;
}

// ตัวชี้วัดแบบ 2.2 ที่ "ยิ่งมากยิ่งดี" (ร้อยละของผู้ตอบ)
const BEH_INDICATORS = [
  { label: 'กินอาหารเช้าทุกวัน', id: 'q1', ok: v => v === 'every' },
  { label: 'กินอาหารหลักครบ 3 มื้อ', id: 'q2', ok: v => v === 'three' || v === 'more' },
  { label: 'กินข้าว-แป้งถึงเกณฑ์ (8 ทัพพี/วัน)', id: 'q3_1', ok: v => v >= 8 },
  { label: 'กินผักถึงเกณฑ์ (4 ทัพพี/วัน)', id: 'q3_2', ok: v => v >= 4 },
  { label: 'กินผลไม้ถึงเกณฑ์ (3 ส่วน/วัน)', id: 'q3_3', ok: v => v >= 3 },
  { label: 'กินเนื้อสัตว์ถึงเกณฑ์ (6 ช้อนกินข้าว/วัน)', id: 'q3_4', ok: v => v >= 6 },
  { label: 'กินปลาถึงเกณฑ์ (3 วัน/สัปดาห์)', id: 'q4', ok: v => v >= 3 },
  { label: 'กินไข่ถึงเกณฑ์ (7 ฟอง/สัปดาห์)', id: 'q5', ok: v => v >= 7 },
  { label: 'ไม่ได้กินขนมรสหวานทุกวัน', id: 'q7', ok: v => v !== 'daily' },
  { label: 'ไม่ได้ดื่มเครื่องดื่มรสหวานทุกวัน', id: 'q8', ok: v => v !== 'daily' },
  { label: 'ไม่ได้กินขนมขบเคี้ยวทุกวัน', id: 'q9', ok: v => v !== 'daily' },
  { label: 'ไม่เติมเครื่องปรุงรสเค็ม', id: 'q10', ok: v => v === 'no' },
  { label: 'ไม่เติมน้ำตาล', id: 'q11', ok: v => v === 'no' },
];

function indicatorPct(recs, ind) {
  const answered = recs.filter(r => r.answers[ind.id] !== undefined);
  return answered.length ? (answered.filter(r => ind.ok(r.answers[ind.id])).length * 100) / answered.length : NaN;
}

const FS_SEC = FORMS.fs.sections[0];

function fsAllCorrectPct(recs) {
  const FS = FS_SEC;
  const xs = scoreList(recs, FS);
  return xs.length ? (xs.filter(x => x === FS.max).length * 100) / xs.length : NaN;
}

// ---------- AUTO SUMMARY ----------
function nutSummaryLines() {
  const rounds = NUT_ROUNDS.filter(p => (!reportTerm || p.term === reportTerm) && nutRecord(p.v));
  if (!rounds.length) return [];
  const totals = r => {
    const rec = nutRecord(r.v);
    const grades = nutGrades(rec.answers, reportGrade);
    return Object.fromEntries(NUT_TABLES.map(t => [t.key, t.cols.map((_, i) => sum(grades.map(g => ((rec.answers[t.key] || {})[g] || [])[i] || 0)))]));
  };
  const pctOf = (arr, idx) => { const n = sum(arr); return n ? (sum(idx.map(i => arr[i])) * 100) / n : NaN; };
  const lines = [];
  const last = rounds[rounds.length - 1];
  const T = totals(last);
  lines.push(`ภาวะโภชนาการ ${last.label}: น้ำหนักตามเกณฑ์ส่วนสูง (${sum(T.w)} คน) สมส่วนร้อยละ ${fmt(pctOf(T.w, [2]), 1)} ผอมและค่อนข้างผอมร้อยละ ${fmt(pctOf(T.w, [0, 1]), 1)} ท้วม เริ่มอ้วนและอ้วนร้อยละ ${fmt(pctOf(T.w, [3, 4, 5]), 1)} · ส่วนสูงตามเกณฑ์อายุ (${sum(T.h)} คน) ส่วนสูงตามเกณฑ์ร้อยละ ${fmt(pctOf(T.h, [2]), 1)} เตี้ยและค่อนข้างเตี้ยร้อยละ ${fmt(pctOf(T.h, [0, 1]), 1)}`);
  if (rounds.length > 1) {
    const F = totals(rounds[0]);
    const d = pctOf(T.w, [2]) - pctOf(F.w, [2]);
    lines.push(`เทียบกับ${rounds[0].label} สัดส่วนนักเรียนสมส่วน${d >= 0 ? 'เพิ่มขึ้น' : 'ลดลง'} ${fmt(Math.abs(d), 1)} จุดร้อยละ (จาก ${fmt(pctOf(F.w, [2]), 1)} เป็น ${fmt(pctOf(T.w, [2]), 1)})`);
  }
  return lines;
}

function litSummaryLines(g) {
  const cols = PHASES.filter(p => g[p.v].length);
  if (!cols.length) return [];
  const secs = FORMS.lit.sections;
  const part = (sec, p) => {
    const m = mean(scoreList(g[p], sec));
    return sec.max ? `${fmt(m)} คะแนน (จาก ${sec.max})` : `${fmt(m)} (${level(m)})`;
  };
  if (cols.length === 1) {
    const p = cols[0].v;
    return [`แบบ 2.1 ${cols[0].label} (n = ${g[p].length}): ${secs.map(sec => `${sec.label}เฉลี่ย ${part(sec, p)}`).join(' · ')}`];
  }
  return [`แบบ 2.1 เปรียบเทียบก่อน (n = ${g.pre.length}) และหลังทำกิจกรรม (n = ${g.post.length}): ` + secs.map(sec => {
    const a = mean(scoreList(g.pre, sec)), b = mean(scoreList(g.post, sec));
    const trend = isNaN(a) || isNaN(b) ? '' : b > a ? 'เพิ่มขึ้น' : b < a ? 'ลดลง' : 'เท่าเดิม';
    return `${sec.label}${trend} จาก ${part(sec, 'pre')} เป็น ${part(sec, 'post')}`;
  }).join(' · ')];
}

function behSummaryLines(g) {
  const cols = PHASES.filter(p => g[p.v].length);
  if (!cols.length) return [];
  const picks = [0, 1, 3, 4].map(i => BEH_INDICATORS[i]);
  const val = (p, ind) => fmt(indicatorPct(g[p], ind), 1);
  if (cols.length === 1) {
    const p = cols[0].v;
    return [`แบบ 2.2 ${cols[0].label} (n = ${g[p].length}): ${picks.map(ind => `${ind.label}ร้อยละ ${val(p, ind)}`).join(' · ')}`];
  }
  return [`แบบ 2.2 ก่อน → หลังทำกิจกรรม: ${picks.map(ind => `${ind.label} ${val('pre', ind)}% → ${val('post', ind)}%`).join(' · ')}`];
}

function fsSummaryLines(g) {
  const cols = PHASES.filter(p => g[p.v].length);
  if (!cols.length) return [];
  const m = p => fmt(mean(scoreList(g[p], FS_SEC)));
  const all = p => fmt(fsAllCorrectPct(g[p]), 1);
  if (cols.length === 1) {
    const p = cols[0].v;
    return [`คำถามอาหารปลอดภัย ${cols[0].label} (n = ${g[p].length}): ตอบถูกเฉลี่ย ${m(p)} ข้อ (จาก 4) ตอบถูกครบ 4 ข้อร้อยละ ${all(p)}`];
  }
  return [`คำถามอาหารปลอดภัย ก่อน → หลังทำกิจกรรม: ตอบถูกเฉลี่ย ${m('pre')} → ${m('post')} ข้อ (จาก 4) · ตอบถูกครบ 4 ข้อ ${all('pre')}% → ${all('post')}%`];
}

// ---------- REPORT ----------
function renderReport() {
  autoPull();
  const s = db.settings;
  const recs = db.records.filter(r => r.form !== 'nut' && (!reportGrade || r.grade === reportGrade));
  const allLit = byPhase(recs.filter(r => r.form === 'lit'));
  const allBeh = byPhase(recs.filter(r => r.form === 'beh'));
  const allFs = byPhase(recs.filter(r => r.form === 'fs'));
  const lit = reportPaired ? pairedOnly(allLit) : allLit;
  const beh = reportPaired ? pairedOnly(allBeh) : allBeh;
  const fs = reportPaired ? pairedOnly(allFs) : allFs;
  const studentGrades = GRADES_ALL.filter(g => s.studentGrades.includes(g) || db.records.some(r => r.form !== 'nut' && r.grade === g));
  const gradeOpts = GRADES_ALL.filter(g => s.grades.includes(g) || studentGrades.includes(g));
  const term = NUT_TERMS.find(t => t.v === reportTerm);
  const partBox = (k, label) => `<label class="check"><input type="checkbox" data-part="${k}"${reportParts[k] ? ' checked' : ''}> ${label}</label>`;
  const pairedNote = g => reportPaired
    ? `<p class="muted">ประมวลผลเฉพาะนักเรียนที่ตอบครบทั้งก่อนและหลังทำกิจกรรม (จับคู่ได้ ${g.pre.length} คน)</p>`
    : `<p class="muted">จับคู่นักเรียนคนเดิมที่ตอบทั้งก่อนและหลังทำกิจกรรมได้ ${pairedKeys(g).size} คน</p>`;

  el('page-report').innerHTML = `
    <div class="card no-print">
      <div class="report-filter">
        <label>ระดับชั้น
          <select id="rep-grade">
            <option value="">ทุกระดับชั้น</option>
            ${gradeOpts.map(g => `<option${g === reportGrade ? ' selected' : ''}>${g}</option>`).join('')}
          </select>
        </label>
        <label>ภาวะโภชนาการ
          <select id="rep-term">
            <option value="">ทุกครั้งที่บันทึก</option>
            ${NUT_TERMS.map(t => `<option value="${t.v}"${t.v === reportTerm ? ' selected' : ''}>${t.label}</option>`).join('')}
          </select>
        </label>
      </div>
      <div class="check-row" id="rep-parts">
        <span>ส่วนที่แสดง/พิมพ์:</span>
        ${partBox('nut', 'ภาวะโภชนาการ')}${partBox('lit', 'แบบ 2.1')}${partBox('beh', 'แบบ 2.2')}${partBox('fs', 'อาหารปลอดภัย')}
      </div>
      <label class="check"><input type="checkbox" id="rep-paired"${reportPaired ? ' checked' : ''}> ประมวลผลเฉพาะนักเรียนที่ตอบครบทั้งก่อนและหลังทำกิจกรรม (นักเรียนคนเดิม)</label>
      ${s.sheetUrl ? '<p class="muted">รายงานนี้ใช้ข้อมูลในเครื่องนี้ ถ้านักเรียนตอบจากหลายเครื่อง ให้กด “ดึงข้อมูลจาก Google Sheet” ที่หน้า <a href="#data">จัดการข้อมูล</a> ก่อน</p>' : ''}
      <button class="btn-primary" onclick="window.print()">🖨 พิมพ์ / บันทึกเป็น PDF</button>
    </div>

    <div class="card report-head">
      <h1>รายงานสรุปผลการเก็บข้อมูล โครงการเด็กไทยแก้มใส ปี 2569–2570</h1>
      <p><b>${esc(s.school)}</b>${s.address ? ` ${esc(s.address)}` : ''}</p>
      <p>${esc(s.aff)}</p>
      <p class="muted">ระดับชั้น: ${reportGrade || 'ทุกระดับชั้น'}${reportParts.nut && term ? ` · ภาวะโภชนาการ ${term.label}` : ''} · ประมวลผลเมื่อ ${fmtTime(Date.now())}</p>
    </div>

    ${(() => {
      const lines = [
        ...(reportParts.nut ? nutSummaryLines() : []),
        ...(reportParts.lit ? litSummaryLines(lit) : []),
        ...(reportParts.beh ? behSummaryLines(beh) : []),
        ...(reportParts.fs ? fsSummaryLines(fs) : []),
      ];
      return lines.length ? `<div class="card summary-card"><h3>สรุปผลโดยย่อ</h3><ul>${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>` : '';
    })()}

    ${reportParts.nut ? `
    <div class="card">
      <h3>1. ข้อมูลภาวะโภชนาการของนักเรียน ปีการศึกษา 2569</h3>
      ${nutReportHtml()}
    </div>` : ''}

    ${reportParts.lit || reportParts.beh || reportParts.fs ? `
    <div class="card">
      <h3>2. แบบประเมินกลุ่มเป้าหมาย: จำนวนนักเรียนที่ตอบ (คน)</h3>
      ${countTableHtml(studentGrades.filter(g => !reportGrade || g === reportGrade))}
    </div>` : ''}

    ${reportParts.lit ? `
    <div class="card">
      <h3>2.1 ความรอบรู้ด้านอาหาร (Food &amp; Health Literacy) และพฤติกรรมการบริโภคอาหารแบบสมดุล</h3>
      ${pairedNote(reportPaired ? lit : allLit)}
      ${litReportHtml(lit)}
    </div>` : ''}

    ${reportParts.beh ? `
    <div class="card">
      <h3>2.2 พฤติกรรมการบริโภคและการดูแลสุขอนามัยนักเรียน</h3>
      ${pairedNote(reportPaired ? beh : allBeh)}
      ${behReportHtml(beh)}
    </div>` : ''}

    ${reportParts.fs ? `
    <div class="card">
      <h3>คำถามอาหารปลอดภัย 4 ข้อ</h3>
      ${pairedNote(reportPaired ? fs : allFs)}
      ${fsReportHtml(fs)}
    </div>` : ''}

    <div class="card report-sign">
      <p>ลงชื่อ ............................................... ผู้รายงาน</p>
      <p>(...............................................)</p>
      <p>ตำแหน่ง ...............................................</p>
    </div>

    <div class="report-actions no-print">
      <a class="btn-secondary" href="#">← กลับหน้าหลัก</a>
      <button class="btn-primary" onclick="window.print()">🖨 พิมพ์รายงาน</button>
    </div>`;

  el('rep-grade').onchange = e => { reportGrade = e.target.value; renderReport(); };
  el('rep-term').onchange = e => { reportTerm = e.target.value; renderReport(); };
  el('rep-paired').onchange = e => { reportPaired = e.target.checked; renderReport(); };
  el('rep-parts').onchange = e => {
    if (e.target.dataset.part) { reportParts[e.target.dataset.part] = e.target.checked; renderReport(); }
  };
  showPage('page-report');
}

function countTableHtml(grades) {
  const groups = {};
  grades.forEach(g => STUDENT_FORMS.forEach(f => {
    groups[g + f] = byPhase(db.records.filter(r => r.form === f && r.grade === g));
  }));
  const cell = (g, f, k) => {
    const x = groups[g + f];
    return k === 'pair' ? pairedKeys(x).size : x[k].length;
  };
  const cols = [];
  STUDENT_FORMS.forEach(f => ['pre', 'post', 'pair'].forEach(k => cols.push({ f, k })));
  const label = { pre: 'ก่อน', post: 'หลัง', pair: 'จับคู่ได้' };
  return `<div class="table-scroll"><table class="report-factor-table">
    <thead>
      <tr><th rowspan="2">ระดับชั้น</th>${STUDENT_FORMS.map(f => `<th colspan="3">${FORMS[f].name}</th>`).join('')}<th rowspan="2">เป้าหมาย</th></tr>
      <tr>${cols.map(c => `<th>${label[c.k]}</th>`).join('')}</tr>
    </thead>
    <tbody>${grades.map(g => `<tr><td>${g}</td>${cols.map(c => `<td>${cell(g, c.f, c.k) || '-'}</td>`).join('')}<td>${TARGET_PER_GRADE}</td></tr>`).join('')}</tbody>
    <tfoot><tr class="total-row"><td>รวม</td>${cols.map(c => `<td>${sum(grades.map(g => cell(g, c.f, c.k)))}</td>`).join('')}<td>${TARGET_PER_GRADE * grades.length}</td></tr></tfoot>
  </table></div>
  <p class="muted note">กลุ่มเป้าหมาย: นักเรียน ${TARGET_PER_GRADE} คนต่อระดับชั้น ประเมินก่อน–หลังทำโครงการในนักเรียนคนเดิม (จับคู่จากชั้นและชื่อ – สกุล ถ้าตอบซ้ำใช้คำตอบล่าสุด)</p>`;
}

function nutReportHtml() {
  const rounds = NUT_ROUNDS.filter(p => (!reportTerm || p.term === reportTerm) && nutRecord(p.v));
  const rowOf = (data, g, t) => ((data[t.key] || {})[g]) || [];
  const totalOf = (data, grades, t) => t.cols.map((_, i) => sum(grades.map(g => rowOf(data, g, t)[i] || 0)));
  const parts = rounds.map(p => {
    const rec = nutRecord(p.v);
    const grades = nutGrades(rec.answers, reportGrade);
    const charts = NUT_TABLES.map(t => stackedChartHtml(t, [
      ...grades.map(g => ({ label: g, values: rowOf(rec.answers, g, t) })),
      ...(grades.length > 1 ? [{ label: 'รวม', values: totalOf(rec.answers, grades, t) }] : []),
    ])).join('');
    return `<h4 class="phase-title">${p.label} <small class="muted">(บันทึกล่าสุด ${fmtTime(rec.ts)})</small></h4>
      ${NUT_TABLES.map(t => nutTableHtml(t, grades, rec.answers, false)).join('')}
      ${nutMismatchHtml(nutRowTotals(rec.answers, grades))}
      <div class="chart-pair">${charts}</div>`;
  }).join('');
  if (!parts) return '<p class="muted">ยังไม่มีข้อมูล (กรอกได้ที่เมนู “แบบ 1 ตารางข้อมูลภาวะโภชนาการ”)</p>';
  const compare = rounds.length > 1 ? `
    <h4 class="phase-title">เปรียบเทียบระหว่างครั้งที่วัด${reportGrade ? ` (ชั้น ${reportGrade})` : ' (รวมทุกชั้น)'}</h4>
    <div class="chart-pair">${NUT_TABLES.map(t => stackedChartHtml(t, rounds.map(p => {
      const rec = nutRecord(p.v);
      return { label: p.label.replace('ภาคเรียนที่ ', 'ภาค '), values: totalOf(rec.answers, nutGrades(rec.answers, reportGrade), t) };
    }))).join('')}</div>` : '';
  return parts + compare;
}

function litReportHtml(g) {
  const secs = FORMS.lit.sections;
  const summary = [
    { label: 'จำนวนผู้ตอบ (คน)', cell: r => r.length },
    ...secs.map(sec => ({
      label: sec.max ? `${sec.label} (คะแนนเต็ม ${sec.max})` : `${sec.label} (ค่าเฉลี่ยเต็ม 5)`,
      cell: r => meanCell(scoreList(r, sec), sec.max),
      num: r => mean(scoreList(r, sec)),
    })),
  ];

  const K = secs[0];
  const knowRows = K.questions.map(q => ({
    label: `${q.no}. ${esc(q.text)}`,
    cell: r => {
      const n = r.filter(x => x.answers[q.id] !== undefined).length;
      const c = v => r.filter(x => x.answers[q.id] === v).length;
      return n ? `ตอบถูก ${(c(q.key) * 100 / n).toFixed(1)}%<br><small>ใช่ ${c('yes')} · ไม่ใช่ ${c('no')} · ไม่แน่ใจ ${c('unsure')}</small>` : '–';
    },
    num: r => {
      const n = r.filter(x => x.answers[q.id] !== undefined).length;
      return n ? r.filter(x => x.answers[q.id] === q.key).length * 100 / n : NaN;
    },
  }));

  const scaleRows = secs.slice(1).flatMap(sec => [
    { head: true, label: esc(sec.title) },
    ...sec.questions.map(q => ({
      label: `${q.no}. ${esc(q.text)}`,
      cell: r => meanCell(nums(r, q.id)),
      num: r => mean(nums(r, q.id)),
    })),
    { label: `<b>เฉลี่ยรวมด้าน${sec.label}</b>`, cell: r => meanCell(scoreList(r, sec)), num: r => mean(scoreList(r, sec)) },
  ]);

  const chart = compareChartHtml('คะแนนเฉลี่ยแต่ละด้าน คิดเป็นร้อยละของคะแนนเต็ม', secs.map(sec => ({
    label: `${sec.label} <small>(เต็ม ${sec.max || 5})</small>`,
    values: Object.fromEntries(PHASES.map(p => [p.v, (mean(scoreList(g[p.v], sec)) * 100) / (sec.max || 5)])),
  })), g);

  return `
    <h4 class="table-title">สรุปภาพรวม</h4>
    ${compareTable(summary, g, true)}
    ${chart}
    <h4 class="table-title">ความรู้ด้านอาหารเพื่อสุขภาวะ (ร้อยละผู้ตอบถูก)</h4>
    ${compareTable(knowRows, g, true)}
    <h4 class="table-title">ส่วนที่ 3.2–3.4 ทัศนคติ ทักษะ และพฤติกรรม (ค่าเฉลี่ยรายข้อ)</h4>
    ${compareTable(scaleRows, g, true)}
    <p class="muted note">หมายเหตุ: ส่วนที่ 3.1 นับคำตอบ “ใช่” เป็นคำตอบที่ถูก (ทุกข้อเป็นข้อความที่ถูกต้อง) · ส่วนที่ 3.4 แปลงความถี่เป็นคะแนน ไม่เคย = 1, น้อยครั้ง = 2, บางครั้ง = 3, บ่อย = 4, ประจำ = 5 ·
    เกณฑ์แปลความหมายค่าเฉลี่ย 4.21–5.00 มากที่สุด, 3.41–4.20 มาก, 2.61–3.40 ปานกลาง, 1.81–2.60 น้อย, 1.00–1.80 น้อยที่สุด</p>`;
}

function behReportHtml(g) {
  const F = FORMS.beh;
  const Q = id => F.sections.flatMap(s => s.questions).find(q => q.id === id);
  const answered = (r, id) => r.filter(x => x.answers[id] !== undefined);
  const dist = (id, v) => ({
    cell: r => pct(r.filter(x => x.answers[id] === v).length, answered(r, id).length),
    num: r => { const n = answered(r, id).length; return n ? r.filter(x => x.answers[id] === v).length * 100 / n : NaN; },
  });
  const optRows = q => q.options.map(o => Object.assign({ label: esc(o.label), sub: true }, dist(q.id, o.v)));
  const numRow = (label, id, rec, sub) => ({
    label, sub,
    cell: r => {
      const xs = nums(r, id);
      if (!xs.length) return '–';
      const ok = rec ? ` · ถึงเกณฑ์ ${(xs.filter(x => x >= rec).length * 100 / xs.length).toFixed(1)}%` : '';
      return `${fmt(mean(xs))} <small>(S.D. ${fmt(sd(xs))})${ok}</small>`;
    },
    num: r => mean(nums(r, id)),
  });
  const textRow = (label, id) => ({ label, sub: true, cell: r => `<small>${topTexts(r.flatMap(x => [].concat(x.answers[id] || [])))}</small>` });

  const rows = [];
  const q1 = Q('q1');
  rows.push({ head: true, label: '1. การกินอาหารเช้าที่มีกลุ่มอาหารอย่างน้อย 2 กลุ่ม' }, ...optRows(q1),
    numRow('จำนวนวันที่ได้กิน (เฉพาะผู้ที่กินบางวัน)', 'q1_days', 0, true),
    textRow('เหตุผลที่ไม่ได้กินอาหารเช้า', 'q1_reason'),
    textRow('อาหารเช้าที่กินบ่อยที่สุด', 'q1_food'));

  const q2 = Q('q2');
  rows.push({ head: true, label: '2. การกินอาหารหลักครบ 3 มื้อ' }, ...optRows(q2));
  [['breakfast', 'เช้า'], ['lunch', 'กลางวัน'], ['dinner', 'เย็น']].forEach(([v, t]) => rows.push({
    label: `ขาดมื้อ${t}`, sub: true,
    cell: r => pct(r.filter(x => (x.answers.q2_missed || []).includes(v)).length, answered(r, 'q2').length),
  }));
  rows.push(textRow('เหตุผลที่ไม่ได้กิน', 'q2_reason'));

  rows.push({ head: true, label: '3–6. ปริมาณอาหารที่ได้กิน (ค่าเฉลี่ย · ร้อยละที่ถึงเกณฑ์แนะนำ)' });
  ['q3_1', 'q3_2', 'q3_3', 'q3_4', 'q4', 'q5', 'q6_1', 'q6_2'].forEach(id => {
    const q = Q(id);
    rows.push(numRow(`${q.no}. ${q.short}${q.rec ? ` <small>เกณฑ์ ${q.rec}</small>` : ''}`, id, q.rec, true));
  });

  ['q7', 'q8', 'q9'].forEach(id => {
    const q = Q(id);
    rows.push({ head: true, label: `${q.no}. ${q.short}` }, ...optRows(q),
      numRow('จำนวนครั้งต่อสัปดาห์ (เฉพาะผู้ที่กินบางวัน)', id + '_times', 0, true),
      textRow('ประเภทที่กินบ่อย (ผู้ที่กินทุกวัน)', id + '_type'));
  });

  ['q10', 'q11'].forEach(id => {
    const q = Q(id);
    rows.push({ head: true, label: `${q.no}. ${q.short}ในอาหารที่ปรุงสุกแล้ว` }, ...optRows(q),
      numRow('จำนวนที่เติม (ช้อนชา)', id + '_tsp', 0, true),
      Object.assign({ label: 'เติมทุกครั้งที่กิน', sub: true }, dist(id + '_freq', 'always')),
      Object.assign({ label: 'เติมบางครั้ง', sub: true }, dist(id + '_freq', 'sometimes')),
      textRow('อาหารที่เติม', id + '_food'));
  });

  const chart = compareChartHtml('ตัวชี้วัดพฤติกรรมการบริโภค (ร้อยละของนักเรียน ยิ่งมากยิ่งดี)',
    BEH_INDICATORS.map(ind => ({ label: esc(ind.label), values: Object.fromEntries(PHASES.map(p => [p.v, indicatorPct(g[p.v], ind)])) })), g);

  return `${chart}
    ${compareTable(rows, g, true)}
    <p class="muted note">หมายเหตุ: ตัวเลขในวงเล็บของคำตอบปลายเปิดคือจำนวนนักเรียนที่ตอบ · ผลต่างของข้อที่เป็นร้อยละคือจำนวนจุดร้อยละที่เปลี่ยนไป · ตัวชี้วัดในกราฟคิดจากคำตอบของแต่ละข้อ (ไม่ใช่ข้อคำถามเพิ่ม)</p>`;
}

function fsReportHtml(g) {
  const answered = (r, id) => r.filter(x => x.answers[id] !== undefined);
  const pctCorrect = (r, q) => { const n = answered(r, q.id).length; return n ? (r.filter(x => x.answers[q.id] === q.key).length * 100) / n : NaN; };
  const rows = FS_SEC.questions.map(q => ({
    label: `${q.no}. ${esc(q.text)} <small>(เฉลย ${q.key})</small>`,
    cell: r => {
      const n = answered(r, q.id).length;
      if (!n) return '–';
      const c = v => r.filter(x => x.answers[q.id] === v).length;
      return `ตอบถูก ${fmt(pctCorrect(r, q), 1)}%<br><small>${THAI_LETTERS.map(l => `${l} ${c(l)}`).join(' · ')}</small>`;
    },
    num: r => pctCorrect(r, q),
  }));
  rows.push(
    { label: '<b>คะแนนเฉลี่ย (เต็ม 4)</b>', cell: r => meanCell(scoreList(r, FS_SEC), 4), num: r => mean(scoreList(r, FS_SEC)) },
    { label: '<b>ตอบถูกครบ 4 ข้อ</b>', cell: r => { const v = fsAllCorrectPct(r); return isNaN(v) ? '–' : `${fmt(v, 1)}%`; }, num: r => fsAllCorrectPct(r) },
  );
  const chart = compareChartHtml('ร้อยละของนักเรียนที่ตอบถูก', [
    ...FS_SEC.questions.map(q => ({ label: `ข้อ ${q.no}`, values: Object.fromEntries(PHASES.map(p => [p.v, pctCorrect(g[p.v], q)])) })),
    { label: 'ตอบถูกครบ 4 ข้อ', values: Object.fromEntries(PHASES.map(p => [p.v, fsAllCorrectPct(g[p.v])])) },
  ], g);
  return `${chart}${compareTable(rows, g, true)}`;
}

// ---------- DATA MANAGEMENT ----------
function renderData() {
  autoPull();
  const s = db.settings;
  const recs = db.records.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const unsynced = db.records.filter(r => !r.synced).length;
  const formName = f => f === 'nut' ? 'ภาวะโภชนาการ' : FORMS[f] ? FORMS[f].name : f;
  const LIMIT = 300;

  el('page-data').innerHTML = `
    <div class="card header-card">
      <div class="school-logo">🗂️</div>
      <h1>จัดการข้อมูล</h1>
      <p class="subtitle">ข้อมูลในเครื่องนี้ทั้งหมด ${db.records.length} รายการ</p>
    </div>
    <div class="card">
      <h3>ส่งออกเป็นไฟล์ Excel (CSV)</h3>
      <div class="btn-row">
        <button class="btn-secondary" onclick="exportCsv('nut')">📏 ตารางภาวะโภชนาการ</button>
        <button class="btn-secondary" onclick="exportCsv('lit')">📝 คำตอบแบบ 2.1</button>
        <button class="btn-secondary" onclick="exportCsv('beh')">🍱 คำตอบแบบ 2.2</button>
        <button class="btn-secondary" onclick="exportCsv('fs')">🛡️ คำตอบคำถามอาหารปลอดภัย</button>
      </div>
      <p class="muted">เปิดไฟล์ CSV ด้วย Excel หรือ Google Sheets ได้ทันที (รองรับภาษาไทย)</p>
    </div>
    <div class="card">
      <h3>Google Sheet</h3>
      ${s.sheetUrl ? `
        <div class="btn-row">
          <button class="btn-secondary" onclick="doPull()">⬇ ดึงข้อมูลจาก Google Sheet</button>
          <button class="btn-secondary" onclick="doPush()">⬆ ส่งข้อมูลที่ค้าง (${unsynced})</button>
        </div>
        <p class="muted">ดึงข้อมูลที่นักเรียนตอบจากทุกเครื่องมารวมในเครื่องนี้ แล้วไปที่หน้าสรุปผลเพื่อพิมพ์รายงาน</p>`
      : '<p class="muted">ยังไม่ได้เชื่อม Google Sheet (ตั้งค่าได้ที่หน้า <a href="#settings">ตั้งค่า</a>) ถ้าไม่เชื่อม ข้อมูลจะอยู่ในเครื่องที่ใช้ตอบเท่านั้น</p>'}
    </div>
    <div class="card">
      <h3>สำรอง / รวมข้อมูลจากหลายเครื่อง</h3>
      <div class="btn-row">
        <button class="btn-secondary" onclick="exportJson()">💾 ดาวน์โหลดไฟล์สำรอง</button>
        <button class="btn-secondary" onclick="el('import-file').click()">📂 นำเข้าไฟล์สำรอง</button>
      </div>
      <input type="file" id="import-file" accept=".json,application/json" multiple hidden>
      <p class="muted">กรณีไม่ใช้ Google Sheet: ให้ทุกเครื่องที่นักเรียนใช้ตอบกด “ดาวน์โหลดไฟล์สำรอง” แล้วนำไฟล์ทั้งหมดมา “นำเข้า” ในเครื่องของครู ระบบจะรวมข้อมูลโดยไม่ซ้ำกัน</p>
    </div>
    <div class="card">
      <h3>รายการข้อมูล</h3>
      ${recs.length ? `<div class="table-scroll"><table class="report-factor-table rec-table">
        <thead><tr><th>วันเวลา</th><th>แบบ</th><th>ชื่อ – สกุล</th><th>ชั้น</th><th>เลขที่</th><th>ช่วง</th>${s.sheetUrl ? '<th>Sheet</th>' : ''}<th></th></tr></thead>
        <tbody>${recs.slice(0, LIMIT).map(r => `<tr>
          <td>${fmtTime(r.ts)}</td><td>${formName(r.form)}</td><td class="lbl">${esc(r.name || '-')}</td><td>${esc(r.grade || '-')}</td><td>${esc(r.no || '-')}</td><td>${phaseLabel(r.phase)}</td>
          ${s.sheetUrl ? `<td>${r.synced ? '✓' : 'ค้าง'}</td>` : ''}
          <td><button class="link-btn" data-del="${esc(r.id)}">ลบ</button></td></tr>`).join('')}</tbody>
      </table></div>${recs.length > LIMIT ? `<p class="muted">แสดง ${LIMIT} รายการล่าสุด จากทั้งหมด ${recs.length} รายการ</p>` : ''}` : '<p class="muted">ยังไม่มีข้อมูล</p>'}
      <button class="btn-danger" onclick="clearAll()">ลบข้อมูลทั้งหมดในเครื่องนี้</button>
    </div>
    <a class="back-link" href="#">← กลับหน้าหลัก</a>`;

  el('import-file').onchange = importJson;
  el('page-data').querySelectorAll('[data-del]').forEach(b => { b.onclick = () => deleteRecord(b.dataset.del); });
  showPage('page-data');
}

async function deleteRecord(id) {
  const r = db.records.find(x => x.id === id);
  if (!r || !confirm('ลบข้อมูลรายการนี้?')) return;
  db.records = db.records.filter(x => x.id !== id);
  db.deleted.push(id);
  saveDb();
  renderData();
  if (db.settings.sheetUrl) {
    try { await postSheet({ action: 'delete', id, key: db.settings.readKey || '' }); toast('ลบข้อมูลแล้ว (รวมทั้งใน Google Sheet)'); }
    catch (e) { toast('ลบในเครื่องแล้ว แต่ลบใน Google Sheet ไม่สำเร็จ'); }
  }
}

function clearAll() {
  if (!db.records.length) return;
  if (!confirm('ลบข้อมูลทั้งหมดในเครื่องนี้? (ข้อมูลใน Google Sheet จะไม่ถูกลบ) แนะนำให้ดาวน์โหลดไฟล์สำรองก่อน')) return;
  db.records = [];
  db.deleted = [];
  saveDb();
  renderData();
}

async function doPull(rerender = renderData) {
  toast('กำลังดึงข้อมูล…');
  try {
    const list = await pullSheet();
    const added = mergeRecords(list, true);
    toast(`ดึงข้อมูลสำเร็จ พบ ${list.length} รายการ (ใหม่ ${added} รายการ)`);
    rerender();
  } catch (e) {
    toast(/รหัส/.test(e.message)
      ? 'ดึงข้อมูลไม่สำเร็จ: รหัสสำหรับดึงข้อมูลไม่ตรงกับ READ_KEY (แก้ได้ที่หน้าตั้งค่า)'
      : 'ดึงข้อมูลไม่สำเร็จ: ตรวจสอบ URL ของ Google Apps Script และอินเทอร์เน็ต');
  }
}

async function doPush() {
  toast('กำลังส่งข้อมูล…');
  await pushPending(false);
  renderData();
}

function exportJson() {
  const payload = { app: STORE_KEY, exportedAt: new Date().toISOString(), school: db.settings.school, records: db.records };
  download(`สำรองข้อมูล-เด็กไทยแก้มใส-${fileStamp()}.json`, JSON.stringify(payload), 'application/json');
}

function importJson(e) {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  Promise.all(files.map(f => f.text())).then(texts => {
    let found = 0, added = 0;
    texts.forEach(t => {
      try {
        const d = JSON.parse(t);
        const list = Array.isArray(d) ? d : d.records;
        if (!Array.isArray(list)) return;
        found += list.length;
        added += mergeRecords(list, false);
      } catch (err) { /* ข้ามไฟล์ที่อ่านไม่ได้ */ }
    });
    toast(`นำเข้า ${files.length} ไฟล์ พบ ${found} รายการ (ใหม่ ${added} รายการ)`);
    renderData();
  });
}

// ---------- CSV EXPORT ----------
function formColumns(form) {
  const cols = [];
  const optLabel = (opts, v) => { const o = opts.find(x => x.v === v); return o ? o.label : v; };
  form.sections.forEach(sec => sec.questions.forEach(q => {
    if (q.type === 'note') return;
    const name = `${q.no ? q.no + '. ' : ''}${q.short || q.text}`;
    if (q.type === 'texts') {
      for (let i = 0; i < q.count; i++) cols.push({ h: `${name} ลำดับ ${i + 1}`, get: a => (a[q.id] || [])[i] });
    } else if (q.type === 'choice') {
      cols.push({ h: name, get: a => a[q.id] === undefined ? '' : optLabel(q.options, a[q.id]) });
      q.options.forEach(o => (o.follow || []).forEach(f => cols.push({
        h: `${q.no}. ${q.short || ''} – ${f.label}${f.unit ? ` (${f.unit})` : ''}`,
        get: a => {
          const v = a[f.id];
          if (v === undefined) return '';
          if (f.type === 'multi') return v.map(x => optLabel(f.options, x)).join(', ');
          if (f.type === 'choice') return optLabel(f.options, v);
          return v;
        },
      })));
    } else {
      cols.push({ h: name + (q.unit ? ` (${q.unit})` : ''), get: a => a[q.id] });
    }
  }));
  form.sections.filter(sec => sec.key).forEach(sec => cols.push({
    h: sec.max ? `คะแนน${sec.label} (เต็ม ${sec.max})` : `ค่าเฉลี่ย${sec.label}`,
    get: a => { const x = sectionScore(sec, a); return isNaN(x) ? '' : (sec.max ? x : x.toFixed(2)); },
  }));
  return cols;
}

function exportCsv(fid) {
  const s = db.settings;
  let rows;
  if (fid === 'nut') {
    rows = [['โรงเรียน', 'ครั้งที่วัด', 'ระดับชั้น', ...NUT_TABLES[0].cols, 'รวม (ส่วนสูง)', ...NUT_TABLES[1].cols, 'รวม (น้ำหนัก)']];
    NUT_ROUNDS.forEach(p => {
      const rec = nutRecord(p.v);
      if (!rec) return;
      nutGrades(rec.answers).forEach(g => {
        const h = (rec.answers.h && rec.answers.h[g]) || [];
        const w = (rec.answers.w && rec.answers.w[g]) || [];
        rows.push([rec.school || s.school, p.label, g, ...NUT_TABLES[0].cols.map((_, i) => h[i] || 0), sum(h), ...NUT_TABLES[1].cols.map((_, i) => w[i] || 0), sum(w)]);
      });
    });
  } else {
    const cols = formColumns(FORMS[fid]);
    rows = [['รหัส', 'วันเวลา', 'โรงเรียน', 'ช่วง', 'ชื่อ – สกุล', 'ชั้น', 'เลขที่', ...cols.map(c => c.h)]];
    db.records.filter(r => r.form === fid).sort((a, b) => a.ts - b.ts).forEach(r => {
      rows.push([r.id, fmtTime(r.ts), r.school || s.school, phaseLabel(r.phase), r.name, r.grade, r.no, ...cols.map(c => c.get(r.answers))]);
    });
  }
  if (rows.length < 2) { toast('ยังไม่มีข้อมูล'); return; }
  const name = { nut: 'ภาวะโภชนาการ', lit: 'แบบ2.1-ความรอบรู้ด้านอาหาร', beh: 'แบบ2.2-พฤติกรรมการบริโภค', fs: 'คำถามอาหารปลอดภัย' }[fid];
  download(`${name}-${fileStamp()}.csv`, '\uFEFF' + rows.map(r => r.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
}

function csvCell(v) {
  if (v === undefined || v === null) return '';
  let s = String(v);
  if (typeof v === 'string' && /^[=+\-@]/.test(s)) s = "'" + s; // กันสูตรใน Excel
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- SETTINGS ----------
function renderSettings() {
  const s = db.settings;
  el('page-settings').innerHTML = `
    <div class="card header-card">
      <div class="school-logo">⚙️</div>
      <h1>ตั้งค่า</h1>
    </div>
    <div class="card">
      <h3>ข้อมูลโรงเรียน</h3>
      <div class="form-group"><label>ชื่อโรงเรียน</label><input type="text" id="set-school" value="${esc(s.school)}"></div>
      <div class="form-group"><label>ที่ตั้ง (ตำบล อำเภอ จังหวัด)</label><input type="text" id="set-address" value="${esc(s.address)}"></div>
      <div class="form-group"><label>สังกัด</label><input type="text" id="set-aff" value="${esc(s.aff)}"></div>
      <div class="form-group">
        <label>ระดับชั้นในตารางภาวะโภชนาการ (ทุกชั้นที่เปิดสอน)</label>
        <div class="check-grid" id="set-grades">${GRADES_ALL.map(g => `<label class="check"><input type="checkbox" value="${g}"${s.grades.includes(g) ? ' checked' : ''}> ${g}</label>`).join('')}</div>
      </div>
      <div class="form-group">
        <label>ระดับชั้นกลุ่มเป้าหมายที่ทำแบบ 2.1 และ 2.2 (ชั้นละ ${TARGET_PER_GRADE} คน)</label>
        <div class="check-grid" id="set-student-grades">${GRADES_ALL.map(g => `<label class="check"><input type="checkbox" value="${g}"${s.studentGrades.includes(g) ? ' checked' : ''}> ${g}</label>`).join('')}</div>
        <small class="muted">ป.4–6 และโรงเรียนขยายโอกาสเพิ่ม ม.1–3</small>
      </div>
      <button class="btn-primary" onclick="saveSettings()">บันทึกการตั้งค่า</button>
    </div>

    <div class="card">
      <h3>การเชื่อม Google Sheet (ให้นักเรียนตอบออนไลน์จากหลายเครื่อง)</h3>
      <div class="form-group">
        <label>URL ของ Google Apps Script</label>
        <input type="url" id="set-sheet" value="${esc(s.sheetUrl)}" placeholder="https://script.google.com/macros/s/…/exec">
      </div>
      <div class="form-group">
        <label>รหัสสำหรับดึงข้อมูล (ต้องตรงกับ READ_KEY ในโค้ด Apps Script)</label>
        <input type="text" id="set-key" value="${esc(s.readKey)}" autocomplete="off">
        <small class="muted">รหัสนี้เก็บไว้เฉพาะเครื่องครู ไม่ถูกใส่ในลิงก์ของนักเรียน ทำให้คนอื่นอ่านข้อมูลนักเรียนไม่ได้</small>
      </div>
      <div class="btn-row">
        <button class="btn-primary" onclick="saveSettings()">บันทึกการตั้งค่า</button>
        <button class="btn-secondary" onclick="testSheet()">ทดสอบการเชื่อมต่อ</button>
      </div>
      <p class="muted" id="sheet-test"></p>
    </div>

    <div class="card">
      <h3>ลิงก์และ QR Code ให้นักเรียนตอบออนไลน์</h3>
      <div class="form-group"><label>แบบที่ให้ตอบ</label>
        <select id="share-form"><option value="">ให้เลือกเองทั้ง 3 ชุด</option><option value="lit">เฉพาะแบบ 2.1</option><option value="beh">เฉพาะแบบ 2.2</option><option value="fs">เฉพาะคำถามอาหารปลอดภัย</option></select>
      </div>
      <div class="form-group"><label>ช่วงการเก็บข้อมูล</label>
        <select id="share-phase"><option value="">ให้นักเรียนเลือกเอง</option>${PHASES.map(p => `<option value="${p.v}">${p.label}</option>`).join('')}</select>
      </div>
      <div class="share-box">
        <input type="text" id="share-link" readonly>
        <button class="btn-secondary" onclick="copyText(el('share-link').value)">คัดลอกลิงก์</button>
      </div>
      <div id="qr" class="qr"></div>
      <p class="muted">${s.sheetUrl ? 'ลิงก์นี้ส่งคำตอบของนักเรียนขึ้น Google Sheet ของโรงเรียนโดยอัตโนมัติ' : '⚠ ยังไม่ได้เชื่อม Google Sheet: คำตอบจะเก็บไว้เฉพาะในเครื่องที่นักเรียนใช้ตอบ เหมาะกับการให้นักเรียนตอบในห้องคอมพิวเตอร์แล้วรวมไฟล์สำรองภายหลัง'}</p>
    </div>

    <div class="card">
      <h3>วิธีเชื่อม Google Sheet (ทำครั้งเดียว)</h3>
      <ol class="steps">
        <li>สร้าง Google Sheet ใหม่ (ใช้บัญชี Google ของโรงเรียน/ครู)</li>
        <li>เมนู <b>ส่วนขยาย → Apps Script</b> ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดด้านล่าง</li>
        <li>แก้บรรทัด <code>const READ_KEY = '…'</code> เป็นรหัสลับของโรงเรียน (เช่น ตัวอักษรภาษาอังกฤษผสมตัวเลข 8 ตัวขึ้นไป) แล้วกดบันทึก</li>
        <li>กด <b>ทำให้ใช้งานได้ → การทำให้ใช้งานได้รายการใหม่</b> เลือกประเภท <b>เว็บแอป</b></li>
        <li>ตั้งค่า “เรียกใช้ในฐานะ” = <b>ฉัน</b> และ “ผู้ที่มีสิทธิ์เข้าถึง” = <b>ทุกคน</b> แล้วกดทำให้ใช้งานได้ และกดอนุญาตสิทธิ์</li>
        <li>คัดลอก URL ของเว็บแอป (ลงท้ายด้วย <code>/exec</code>) และรหัสลับ มาวางในช่องด้านบน กดบันทึก แล้วกดทดสอบการเชื่อมต่อ</li>
      </ol>
      <div class="btn-row"><button class="btn-secondary" onclick="copyText(el('gas-code').textContent)">คัดลอกโค้ด Apps Script</button></div>
      <pre class="code" id="gas-code">กำลังโหลดโค้ด…</pre>
      <p class="muted">ข้อมูลทั้งหมดอยู่ใน Google Sheet ของโรงเรียนเอง นักเรียนส่งคำตอบได้อย่างเดียว การดึงหรือลบข้อมูลต้องใช้รหัสลับ</p>
    </div>
    <a class="back-link" href="#">← กลับหน้าหลัก</a>`;

  el('share-form').onchange = updateShareLink;
  el('share-phase').onchange = updateShareLink;
  updateShareLink();
  fetch('google-apps-script.gs')
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(t => { el('gas-code').textContent = t; })
    .catch(() => { el('gas-code').textContent = 'โหลดโค้ดไม่สำเร็จ: เปิดไฟล์ google-apps-script.gs ใน GitHub แทน'; });
  showPage('page-settings');
}

function readSettingsForm() {
  const checked = id => GRADES_ALL.filter(g => el(id).querySelector(`input[value="${g}"]`).checked);
  return {
    school: el('set-school').value.trim(),
    address: el('set-address').value.trim(),
    aff: el('set-aff').value.trim(),
    grades: checked('set-grades'),
    studentGrades: checked('set-student-grades'),
    sheetUrl: el('set-sheet').value.trim(),
    readKey: el('set-key').value.trim(),
  };
}

function saveSettings() {
  const s = readSettingsForm();
  if (!s.grades.length || !s.studentGrades.length) { toast('กรุณาเลือกระดับชั้นอย่างน้อย 1 ชั้น'); return; }
  if (s.sheetUrl && !/^https:\/\/script\.google(usercontent)?\.com\//.test(s.sheetUrl)) {
    toast('URL ต้องขึ้นต้นด้วย https://script.google.com/');
    return;
  }
  db.settings = s;
  saveDb();
  toast('บันทึกการตั้งค่าแล้ว');
  renderSettings();
}

async function testSheet() {
  const url = el('set-sheet').value.trim();
  const box = el('sheet-test');
  if (!url) { box.textContent = 'กรุณาวาง URL ก่อน'; return; }
  box.textContent = 'กำลังทดสอบ…';
  const saved = { sheetUrl: db.settings.sheetUrl, readKey: db.settings.readKey };
  db.settings.sheetUrl = url;
  db.settings.readKey = el('set-key').value.trim();
  try {
    const list = await pullSheet();
    box.textContent = `✓ เชื่อมต่อสำเร็จ ใน Google Sheet มีข้อมูล ${list.length} รายการ (อย่าลืมกดบันทึกการตั้งค่า)`;
  } catch (e) {
    // ข้อความจาก Apps Script บอกสาเหตุตรง ๆ ส่วนข้อผิดพลาดเครือข่าย/หน้าเข้าสู่ระบบ Google ใช้คำแนะนำทั่วไป
    box.textContent = e instanceof TypeError || e instanceof SyntaxError
      ? '✗ เชื่อมต่อไม่สำเร็จ ตรวจสอบว่าวาง URL ที่ลงท้ายด้วย /exec และตั้ง “ผู้ที่มีสิทธิ์เข้าถึง” เป็น “ทุกคน”'
      : '✗ ' + e.message;
  } finally {
    Object.assign(db.settings, saved);
  }
}

function updateShareLink() {
  const s = db.settings;
  const p = new URLSearchParams({ mode: 'student', school: s.school, grades: s.studentGrades.join(',') });
  if (s.sheetUrl) p.set('sheet', s.sheetUrl);
  if (el('share-form').value) p.set('form', el('share-form').value);
  if (el('share-phase').value) p.set('phase', el('share-phase').value);
  const link = `${location.origin}${location.pathname}?${p.toString()}`;
  el('share-link').value = link;
  const box = el('qr');
  box.innerHTML = '';
  if (typeof QRCode === 'undefined') return;
  try {
    new QRCode(box, { text: link, width: 260, height: 260, correctLevel: QRCode.CorrectLevel.L });
  } catch (e) {
    box.innerHTML = '<p class="muted">ลิงก์ยาวเกินกว่าจะสร้าง QR Code ได้</p>';
  }
}

function copyText(t) {
  const done = () => toast('คัดลอกแล้ว');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(t).then(done, () => fallbackCopy(t, done));
  } else {
    fallbackCopy(t, done);
  }
}

function fallbackCopy(t, done) {
  const ta = document.createElement('textarea');
  ta.value = t;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast('คัดลอกไม่สำเร็จ'); }
  ta.remove();
}

// ---------- UTILS ----------
function el(id) { return document.getElementById(id); }

function setText(sel, v) {
  const n = document.querySelector('#page-nut ' + sel);
  if (n) n.textContent = v;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function phaseLabel(v) {
  const p = PHASES.concat(NUT_ROUNDS).find(x => x.v === v);
  return p ? p.label : '-';
}

function fmtTime(ts) {
  if (!ts) return '-';
  return new Date(ts).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fileStamp() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear() + 543}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

let toastTimer;
function toast(msg) {
  const t = el('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}
