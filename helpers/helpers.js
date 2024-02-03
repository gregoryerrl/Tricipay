"use strict";

var rootURL = $(".root").html();
var currentURL = window.location.pathname.replace("/Tricipay", "");

function log(msg) {
  try {
    console.log(msg);
  } catch (e) {
    console.log(e.message);
  }
}
function redirect(url) {
  window.location = url;
}
function reload() {
  location.reload(true);
}
function sqlEscape(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
    }
  });
}
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function isValidPassword(password) {
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  } else {
    return true;
  }
}
function isNumeric(e) {
  if (typeof e != "string") return false;
  return !isNaN(e) && !isNaN(parseFloat(e));
}

function notify(
  type,
  title,
  text,
  buttons,
  input,
  inputPlaceholder,
  inputValue,
  progressSteps,
  currentProgressStep
) {
  var html = text.substr(0, 6) !== "<html>" ? "" : text.substr(6);
  text = text || "";
  buttons = buttons || "OkOnly";
  input = input || null;
  inputPlaceholder = inputPlaceholder || "";
  inputValue = inputValue || "";
  progressSteps = progressSteps || [];
  currentProgressStep = currentProgressStep || 0;
  var showCancelButton = false;
  var confirmButtonText = "Ok";
  var cancelButtonText = "No";
  if (buttons == "YesNo") {
    showCancelButton = true;
    confirmButtonText = "Yes";
  }
  if (buttons == "NextCancel") {
    showCancelButton = true;
    confirmButtonText = "Next";
    cancelButtonText = "Cancel";
  }
  return new Promise(function (resolve, reject) {
    swal({
      type: type,
      title: title,
      text: text,
      html: html,
      showCancelButton: showCancelButton,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      input: input,
      inputPlaceholder: inputPlaceholder,
      inputValue: inputValue,
      progressSteps: progressSteps,
      currentProgressStep: currentProgressStep,
      onOpen: function () {
        $(".swal2-input").select();
      },
    }).then(function (result) {
      resolve(result);
    });
  });
}

function uploadFile(control, filename) {
  return new Promise(function (resolve, reject) {
    let fileInfo = control[0].files[0];
    let formData = new FormData();

    formData.append("FileInfo", fileInfo);
    formData.append("FileName", filename);
    formData.append("SaveLocation", "/");
    fetch(rootURL + "plugins/helpers/php/upload-files.php", {
      method: "POST",
      body: formData,
    }).then(function (result) {
      resolve();
    });
  });
}

function removeFile(filename) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: rootURL + "plugins/helpers/php/delete-file.php",
      dataType: "json",
      data: {filename: filename},
      success: function (result) {
        resolve();
      },
      error: function (xhr, status, error) {
        reject(error);
      },
    });
  });
}

function getFileInfo(control) {
  return new Promise(function (resolve, reject) {
    let fileInfo = control[0].files[0];
    let formData = new FormData();

    formData.append("FileInfo", fileInfo);

    fetch(rootURL + "plugins/helpers/php/get-file-info.php", {
      method: "POST",
      body: formData,
    })
      .then(function (result) {
        return result.text();
      })
      .then(function (content) {
        resolve(JSON.parse(content));
      });
  });
}

function getStorage(itemName) {
  return JSON.parse(localStorage.getItem(itemName));
}
function setStorage(itemName, value) {
  return new Promise(function (resolve, reject) {
    localStorage.setItem(itemName, JSON.stringify(value));
    resolve();
  });
}
function removeStorage(itemName) {
  return new Promise(function (resolve, reject) {
    localStorage.removeItem(itemName);
    resolve();
  });
}
function clearAllStorage() {
  return new Promise(function (resolve, reject) {
    localStorage.clear();
    resolve();
  });
}

var query_result = [];

let dbQuery = {
  execute: function (query) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "../../helpers/db_query.php",
        dataType: "json",
        data: {action: "query", query: query},
        success: function (data) {
          query_result = data;
          resolve();
        },
        error: function (xhr, status, error) {
          reject(error);
        },
      });
    });
  },
  result: function (index, field) {
    if (query_result[index][field] == undefined) {
      return "";
    } else {
      return query_result[index][field];
    }
  },
  rows: function () {
    return query_result.length;
  },
  executeNonQuery: function (query) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "../../helpers/db_query.php",
        data: {action: "non-query", query: query},
        success: function (data) {
          resolve(data);
        },
        error: function (xhr, status, error) {
          reject(status);
        },
      });
    });
  },
  clear: function () {
    query_result = [];
  },
};

function MySQLEscape(string) {
  return string
    .replace(/\\/g, "\\\\")
    .replace(/\'/g, "\\'")
    .replace(/\"/g, '\\"')
    .replace(/\n/g, "\\\n")
    .replace(/\r/g, "\\\r")
    .replace(/\x00/g, "\\\x00")
    .replace(/\x1a/g, "\\\x1a");
}

var session_data = [];

let session = {
  init: function () {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "../../helpers/session.php",
        cache: false,
        method: "post",
        data: {action: "get"},
        dataType: "json",
        success: function (data) {
          session_data = data;
          resolve(data);
        },
        error: function (xhr, status, error) {
          reject(error);
        },
      });
    });
  },
  get: function (name) {
    if (session_data[name] === null || session_data[name] === "") {
      return undefined;
    } else {
      return session_data[name];
    }
  },
  set: function (name, value) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "../../helpers/session.php",
        cache: false,
        method: "post",
        data: {action: "set", name: name, value: value},
        dataType: "json",
        success: function (data) {
          session_data = data;
          resolve();
        },
        error: function (xhr, status, error) {
          reject(error);
        },
      });
    });
  },
  destroy: function () {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: "../../helpers/session.php",
        cache: false,
        method: "post",
        data: {action: "destroy"},
        success: function (data) {
          resolve();
        },
        error: function (xhr, status, error) {
          reject(error);
        },
      });
    });
  },
};

function convertFileSize(byte) {
  if (byte == "-") {
    return "-";
  }
  if (byte >= Math.pow(1024, 3)) {
    return (byte / Math.pow(1024, 3)).toFixed(2) + " GB";
  } else if (byte >= Math.pow(1024, 2)) {
    return (byte / Math.pow(1024, 2)).toFixed(2) + " MB";
  } else if (byte >= 1024) {
    return (byte / 1024).toFixed(2) + " KB";
  } else {
    return byte + " Bytes";
  }
}

function getFileType(ext) {
  let filetype = {
    xlsx: "Spreadsheet",
    xls: "Spreadsheet",
  };

  return filetype[ext];
}
