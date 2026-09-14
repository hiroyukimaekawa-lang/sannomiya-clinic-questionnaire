/**
 * クリニックアンケート共通受信GAS
 *
 * 1つのWebアプリURLで受信し、clinicKeyごとに
 * 別々のGoogleスプレッドシートへ保存します。
 *
 * 三宮胃腸内科:
 * https://docs.google.com/spreadsheets/d/1fh82z4kOH10yH_dmuI8C9IzgTmEhnb-Li7HEWL5r9Uc/edit
 *
 * 水谷眼科診療所:
 * https://docs.google.com/spreadsheets/d/1Cf3UFjX5CNqQM-CCC-yWqJdptS7nz39qzxLh5-yZWDo/edit
 */
var VERSION = '2026-09-14-separated-sheets-v1';

var CLINICS = {
  sannomiya: {
    spreadsheetId: '1fh82z4kOH10yH_dmuI8C9IzgTmEhnb-Li7HEWL5r9Uc',
    sheetName: '回答一覧',
    headers: [
      '回答日時',
      '本日の来院目的',
      '待ち時間満足度',
      'スタッフ対応満足度',
      '合計スコア',
      '平均スコア',
      '当院を選んだ理由',
      '自由記述'
    ]
  },
  mizutani: {
    spreadsheetId: '1Cf3UFjX5CNqQM-CCC-yWqJdptS7nz39qzxLh5-yZWDo',
    sheetName: '回答一覧',
    headers: [
      '回答日時',
      '性別',
      '年代',
      '待ち時間満足度',
      'スタッフ対応満足度',
      '合計スコア',
      '平均スコア',
      '当院を選んだ理由',
      'その他理由',
      '自由記述'
    ]
  }
};

function doGet() {
  return jsonResponse_({
    status: 'ok',
    version: VERSION,
    message: 'クリニックアンケート共通受信エンドポイント（医院別スプレッドシート）'
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();

  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('送信データがありません。');
    }

    var data = JSON.parse(e.postData.contents);
    var clinicKey = String(data.clinicKey || '');
    var config = CLINICS[clinicKey];

    if (!config) {
      throw new Error('clinicKeyが不正です: ' + clinicKey);
    }

    lock.waitLock(10000);

    var spreadsheet = SpreadsheetApp.openById(config.spreadsheetId);
    var sheet = spreadsheet.getSheetByName(config.sheetName);

    if (!sheet) {
      throw new Error('保存先タブが見つかりません: ' + config.sheetName);
    }

    ensureHeaders_(sheet, config.headers);

    if (clinicKey === 'sannomiya') {
      appendSannomiya_(sheet, data);
    } else if (clinicKey === 'mizutani') {
      appendMizutani_(sheet, data);
    }

    SpreadsheetApp.flush();

    return jsonResponse_({
      result: 'success',
      clinic: clinicKey,
      version: VERSION
    });
  } catch (error) {
    return jsonResponse_({
      result: 'error',
      version: VERSION,
      message: error && error.message ? error.message : String(error)
    });
  } finally {
    try {
      if (lock.hasLock()) lock.releaseLock();
    } catch (ignore) {}
  }
}

function appendSannomiya_(sheet, data) {
  var waiting = toScore_(data.waitingTimeScore != null ? data.waitingTimeScore : data.medicalCareScore, '待ち時間満足度');
  var staff = toScore_(data.staffResponseScore, 'スタッフ対応満足度');
  var total = toFiniteNumberOr_(data.totalScore, waiting + staff);
  var average = toFiniteNumberOr_(data.averageScore, (waiting + staff) / 2);

  sheet.appendRow([
    parseDateOrNow_(data.submittedAt),
    String(data.visitPurpose || ''),
    waiting,
    staff,
    total,
    average,
    String(data.reason || ''),
    String(data.comments || '').slice(0, 1000)
  ]);
}

function appendMizutani_(sheet, data) {
  var waiting = toScore_(data.waitingTimeRating != null ? data.waitingTimeRating : data.medicalCareRating, '待ち時間満足度');
  var staff = toScore_(data.staffRating, 'スタッフ対応満足度');
  var total = toFiniteNumberOr_(data.totalScore, waiting + staff);
  var average = toFiniteNumberOr_(data.averageScore, Math.round(((waiting + staff) / 2) * 100) / 100);
  var reasons = Object.prototype.toString.call(data.reasons) === '[object Array]'
    ? data.reasons.join('、')
    : String(data.reasons || '');

  sheet.appendRow([
    parseDateOrNow_(data.submittedAt),
    String(data.gender || ''),
    String(data.ageGroup || ''),
    waiting,
    staff,
    total,
    average,
    reasons,
    String(data.otherReason || ''),
    String(data.comments || '').slice(0, 1000)
  ]);
}

function toScore_(value, label) {
  var score = Number(value);
  if (!isFinite(score) || score < 1 || score > 10) {
    throw new Error(label + 'が不正です。受信値: ' + String(value));
  }
  return score;
}

function toFiniteNumberOr_(value, fallback) {
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}

function parseDateOrNow_(value) {
  if (!value) return new Date();
  var date = new Date(value);
  return isNaN(date.getTime()) ? new Date() : date;
}

function ensureHeaders_(sheet, headers) {
  var current = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  var isEmpty = true;
  var i;

  for (i = 0; i < current.length; i++) {
    if (current[i] !== '') {
      isEmpty = false;
      break;
    }
  }

  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }

  if (current.join('\t') !== headers.join('\t')) {
    throw new Error('保存先ヘッダーが想定と一致しません: ' + sheet.getName());
  }
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
