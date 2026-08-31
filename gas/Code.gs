/**
 * 三宮胃腸内科 患者様アンケート回答保存用 Google Apps Script
 * このコードは回答先スプレッドシートに紐づけたApps Scriptで使用します。
 * Spreadsheet IDや架空URLの設定は不要です。
 */
var SHEET_HEADERS = [
  '回答日時',
  '本日の来院目的',
  '診療内容満足度',
  'スタッフ対応満足度',
  '合計スコア',
  '平均スコア',
  '当院を選んだ理由',
  '自由記述',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse_({ result: 'error', message: 'リクエスト本文がありません。' });
    }

    var data = JSON.parse(e.postData.contents);
    var requiredFields = ['visitPurpose', 'medicalCareScore', 'staffResponseScore', 'reason'];
    for (var i = 0; i < requiredFields.length; i++) {
      if (!data[requiredFields[i]]) {
        return jsonResponse_({ result: 'error', message: '必須項目が不足しています。' });
      }
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    ensureHeaders_(sheet);
    sheet.appendRow([
      data.submittedAt ? new Date(data.submittedAt) : new Date(),
      data.visitPurpose,
      Number(data.medicalCareScore),
      Number(data.staffResponseScore),
      Number(data.totalScore),
      Number(data.averageScore),
      data.reason,
      String(data.comments || '').slice(0, 1000),
    ]);

    return jsonResponse_({ result: 'success' });
  } catch (error) {
    return jsonResponse_({ result: 'error', message: String(error) });
  }
}

function doGet() {
  return jsonResponse_({ status: 'ok', message: '三宮胃腸内科 アンケート受信エンドポイント' });
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);
    return;
  }
  var currentHeaders = sheet.getRange(1, 1, 1, SHEET_HEADERS.length).getValues()[0];
  if (currentHeaders.join('\t') !== SHEET_HEADERS.join('\t')) {
    throw new Error('スプレッドシートのヘッダーが想定と一致しません。READMEをご確認ください。');
  }
}

function jsonResponse_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
