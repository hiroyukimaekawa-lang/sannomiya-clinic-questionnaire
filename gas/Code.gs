/**
 * クリニックアンケート共通受信GAS（高速化版）
 * 1つのWebアプリURLで受信し、clinicKeyごとに別々のスプレッドシートへ保存します。
 */
var VERSION = '2026-09-14-separated-sheets-v2';

var CLINICS = {
  sannomiya: {
    spreadsheetId: '1fh82z4kOH10yH_dmuI8C9IzgTmEhnb-Li7HEWL5r9Uc',
    sheetName: '回答一覧'
  },
  mizutani: {
    spreadsheetId: '1Cf3UFjX5CNqQM-CCC-yWqJdptS7nz39qzxLh5-yZWDo',
    sheetName: '回答一覧'
  }
};

function doGet() {
  return jsonResponse_({
    status: 'ok',
    version: VERSION,
    message: 'クリニックアンケート共通受信エンドポイント（高速化・医院別スプレッドシート）'
  });
}

function doPost(e) {
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

    var sheet = SpreadsheetApp
      .openById(config.spreadsheetId)
      .getSheetByName(config.sheetName);

    if (!sheet) {
      throw new Error('保存先タブが見つかりません: ' + config.sheetName);
    }

    if (clinicKey === 'sannomiya') {
      appendSannomiya_(sheet, data);
    } else {
      appendMizutani_(sheet, data);
    }

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
  }
}

function appendSannomiya_(sheet, data) {
  var waiting = toScore_(data.waitingTimeScore != null ? data.waitingTimeScore : data.medicalCareScore, '待ち時間満足度');
  var staff = toScore_(data.staffResponseScore, 'スタッフ対応満足度');

  sheet.appendRow([
    parseDateOrNow_(data.submittedAt),
    String(data.visitPurpose || ''),
    waiting,
    staff,
    toFiniteNumberOr_(data.totalScore, waiting + staff),
    toFiniteNumberOr_(data.averageScore, (waiting + staff) / 2),
    String(data.reason || ''),
    String(data.comments || '').slice(0, 1000)
  ]);
}

function appendMizutani_(sheet, data) {
  var waiting = toScore_(data.waitingTimeRating != null ? data.waitingTimeRating : data.medicalCareRating, '待ち時間満足度');
  var staff = toScore_(data.staffRating, 'スタッフ対応満足度');
  var reasons = Object.prototype.toString.call(data.reasons) === '[object Array]'
    ? data.reasons.join('、')
    : String(data.reasons || '');

  sheet.appendRow([
    parseDateOrNow_(data.submittedAt),
    String(data.gender || ''),
    String(data.ageGroup || ''),
    waiting,
    staff,
    toFiniteNumberOr_(data.totalScore, waiting + staff),
    toFiniteNumberOr_(data.averageScore, Math.round(((waiting + staff) / 2) * 100) / 100),
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

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
