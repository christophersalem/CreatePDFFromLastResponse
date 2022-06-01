function generatePDFFromFormSubmit()
{
  
  var TEMPLATE_DOC_ID = "1b-ydMpkYMSMgE18JxdbAmu4IGEYr8inHRtW4s94_5L8";
  var OUTPUT_FOLDER_ID = "1095fgEva5oXroDkmSBo3Ij5OX0c2G2CS";
  var ptName = "";
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  //create new doc from template
  var docid = DriveApp.getFileById(TEMPLATE_DOC_ID).makeCopy().getId();
  var doc = DocumentApp.openById(docid);
  var body = doc.getActiveSection();
  
  //get data from last row
  var data = sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn()).getValues();
  var lastRow = data[0];
  
  for (var i = 0; i < lastRow.length; ++i)
  {
    
    //array format
    //0 timestamp
    //1 first and last name
    //2 val1
    //3 val2
    //4 val3
    //5 val4
    //6 val5
    //7 val6
    //8 val7
    //9 val8
    //10 val9
    
    var cur = lastRow[i];
    if (i == 0)
    {
      var formattedDate = Utilities.formatDate(cur, "EDT", "MM/dd/yyyy");
      body.replaceText("%DATE%", formattedDate);
    }
    else if (i == 1)
    {
      body.replaceText("%NAME%", cur);
      ptName = cur;
    }
    else
    {
      var valx = "%val" + (i - 1) + "%";
      if (cur == "Yes")
        insertYes(body, valx);
      else
        insertNo(body, valx);
    } 
  }
  
  //rename
  doc.setName("Filled Template");
  doc.saveAndClose();
  
  //create PDF
  var pdf = DriveApp.getFileById(docid).getAs('application/pdf');
  var pdfFile = DriveApp.getFolderById(OUTPUT_FOLDER_ID).createFile(pdf);
  pdfFile.setName(ptName);
  
  DriveApp.getFileById(docid).setTrashed(true);
}

function insertYes(body, valx)
{
  var elmt = body.findText(valx).getElement();
  body.replaceText(valx, "");
  var parent = elmt.getParent();
  
  var checkedBox = parent.appendText(" \u2611");
  checkedBox.setFontSize(Number(16));
  
  var yes = parent.appendText(" Yes  ");
  yes.setFontSize(Number(12));
  
  var emptyBox = parent.appendText("\ud836\udd3f");
  emptyBox.setFontSize(Number(18));
  emptyBox.setForegroundColor("#434343");
  
  var no = parent.appendText(" No");
  no.setFontSize(Number(12));
  no.setForegroundColor("#000000");
}

function insertNo(body, valx)
{
  var elmt = body.findText(valx).getElement();
  body.replaceText(valx, "");
  var parent = elmt.getParent();
  
  var emptyBox = parent.appendText(" \ud836\udd3f");
  emptyBox.setFontSize(Number(18));
  emptyBox.setForegroundColor("#434343");
  
  var yes = parent.appendText(" Yes  ");
  yes.setFontSize(Number(12));
  yes.setForegroundColor("#000000");
  
  var checkedBox = parent.appendText("\u2611");
  checkedBox.setFontSize(Number(16));
  
  var no = parent.appendText(" No");
  no.setFontSize(Number(12));
}