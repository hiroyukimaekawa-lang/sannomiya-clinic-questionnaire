/**
 * クリニックアンケート共通回答保存用 Google Apps Script
 *
 * 保存先:
 * https://docs.google.com/spreadsheets/d/14y5eVdeMwXSABHr4GBvZDzz38RdqXovvzHQmWuEkddQ/edit
 *
 * 1つのWebアプリURLを三宮胃腸内科・水谷眼科診療所の両方で使用できます。
 */
var SPREADSHEET_ID = '14y5eVdeMwXSABHr4GBvZDzz38RdqXovvzHQmWuEkddQ';

var CLINICS = {
  sannomiya: {
    sheetName: '三宮胃腸内科',
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
    sheetName: '水谷眼科診療所',
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

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('送信データがありません。');
    }

    var data = JSON.parse(e.postData.contents);
    var clinicKey = String(data.clinicKey || inferClinicKey_(data));
    var config = CLINICS[clinicKey];
    if (!config) {
      throw new Error('保存先の医院を判定できません。');
    }

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
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

    return jsonResponse_({ result: 'success', clinic: clinicKey });
  } catch (error) {
    return jsonResponse_({ result: 'error', message: String(error) });
  }
}

function doGet() {
  return jsonResponse_({
    status: 'ok',
    message: 'クリニックアンケート共通受信エンドポイント'
  });
}

function inferClinicKey_(data) {
  if (Object.prototype.hasOwnProperty.call(data, 'visitPurpose')) return 'sannomiya';
  if (Object.prototype.hasOwnProperty.call(data, 'waitingTimeRating')) return 'mizutani';
  return '';
}

function appendSannomiya_(sheet, data) {
  var waiting = Number(data.waitingTimeScore != null ? data.waitingTimeScore : data.medicalCareScore);
  var staff = Number(data.staffResponseScore);
  validateScore_(waiting, '待ち時間満足度');
  validateScore_(staff, 'スタッフ対応満足度');

  sheet.appendRow([
    data.submittedAt ? new Date(data.submittedAt) : new Date(),
    String(data.visitPurpose || ''),
    waiting,
    staff,
    Number.isFinite(Number(data.totalScore)) ? Number(data.totalScore) : waiting + staff,
    Number.isFinite(Number(data.averageScore)) ? Number(data.averageScore) : (waiting + staff) / 2,
    String(data.reason || ''),
    String(data.comments || '').slice(0, 1000)
  ]);
}

function appendMizutani_(sheet, data) {
  var waiting = Number(data.waitingTimeRating != null ? data.waitingTimeRating : data.medicalCareRating);
  var staff = Number(data.staffRating);
  validateScore_(waiting, '待ち時間満足度');
  validateScore_(staff, 'スタッフ対応満足度');

  var reasons = Array.isArray(data.reasons) ? data.reasons.join('、') : String(data.reasons || '');

  sheet.appendRow([
    data.submittedAt ? new Date(data.submittedAt) : new Date(),
    String(data.gender || ''),
    String(data.ageGroup || ''),
    waiting,
    staff,
    Number.isFinite(Number(data.totalScore)) ? Number(data.totalScore) : waiting + staff,
    Number.isFinite(Number(data.averageScore)) ? Number(data.averageScore) : Number(((waiting + staff) / 2).toFixed(2)),
    reasons,
    String(data.otherReason || ''),
    String(data.comments || '').slice(0, 1000)
  ]);
}

function validateScore_(score, label) {
  if (!Number.isFinite(score) || score < 1 || score > 10) {
    throw new Error(label + 'が不正です。');
  }
}

function ensureHeaders_(sheet, headers) {
  var current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var isEmpty = current.every(function(value) { return value === ''; });

  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }

  if (current.join('\t') !== headers.join('\t')) {
    throw new Error('スプレッドシートのヘッダーが想定と一致しません: ' + sheet.getName());
  }
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
