$(document).ready(function () {
  let tblRoutes = $("[name='table-routes']");
  // let btnAddSubjectSave = $("[name='button-add-subject-save']");

  session.init().then(function () {
    console.log("here");
    dbQuery.execute("Select * From routestbl; ").then(function () {
      if (dbQuery.rows() > 0) {
        for (var i = 0; i < dbQuery.rows(); i++) {
          tblRoutes
            .children("tbody")
            .append(
              "<tr>" +
                '<td align="center" valign="middle">' +
                dbQuery.result(i, "dest") +
                "</td>" +
                '<td align="center" valign="middle"> <button class="btn btn-warning me-2"> Book </button><button class="btn btn-secondary"> Map </button</td>' +
                "</tr>"
            );
        }
      }
    });
  });
});

//   txtAddSubjectID.keypress(function (e) {
//     if (e.which == 13) {
//       txtAddSubjectTitle.focus().select();
//     }
//   });
//   txtAddSubjectTitle.keypress(function (e) {
//     if (e.which == 13) {
//       txtAddUnits.focus().select();
//     }
//   });
//   txtAddUnits.keypress(function (e) {
//     if (e.which == 13) {
//       txtAddSections.focus().select();
//     }
//   });
//   txtAddSections.keypress(function (e) {
//     if (e.which == 13) {
//       txtAddFTE.focus().select();
//     }
//   });
//   txtAddFTE.keypress(function (e) {
//     if (e.which == 13) {
//       btnAddSubjectSave.click();
//     }
//   });

//   txtAddUnits.focusout(function (e) {
//     if (isNumeric(txtAddSections.val()) && isNumeric(txtAddUnits.val())) {
//       txtAddFTE.val(
//         parseFloat(txtAddUnits.val()) * parseFloat(txtAddSections.val())
//       );
//     } else {
//       txtAddFTE.val("");
//     }
//   });

//   txtAddSections.focusout(function (e) {
//     if (isNumeric(txtAddSections.val()) && isNumeric(txtAddUnits.val())) {
//       txtAddFTE.val(
//         parseFloat(txtAddUnits.val()) * parseFloat(txtAddSections.val())
//       );
//     } else {
//       txtAddFTE.val("");
//     }
//   });

//   btnAddNew.click(function () {
//     modalAddSubject.modal("show");
//     txtAddSubjectID.focus();
//   });

//   btnAddSubjectSave.click(function () {
//     let notValidNumbers =
//       !isNumeric(txtAddUnits.val()) ||
//       !isNumeric(txtAddSections.val()) ||
//       !isNumeric(txtAddFTE.val());

//     if (notValidNumbers) {
//       notify(
//         "warning",
//         "Incomplete Fields",
//         "Please enter valid numbers on Units, Sections and FTE fields"
//       );
//     } else {
//       if (
//         txtAddSubjectID.val() !== "" &&
//         txtAddSubjectTitle.val() !== "" &&
//         txtAddUnits.val() !== "" &&
//         txtAddSections.val() !== "" &&
//         txtAddFTE.val() !== ""
//       ) {
//         dbQuery
//           .executeNonQuery(
//             "Insert Into subject_tb Values ( Null, '" +
//               sqlEscape(txtAddSubjectID.val()) +
//               "', '" +
//               sqlEscape(txtAddSubjectTitle.val()) +
//               "', '" +
//               sqlEscape(txtAddUnits.val()) +
//               "', '" +
//               sqlEscape(txtAddSections.val()) +
//               "', '" +
//               sqlEscape(txtAddFTE.val()) +
//               "', '" +
//               session.get("user_id") +
//               "', Now() ) ; "
//           )
//           .then(function () {
//             notify(
//               "success",
//               "Add Success",
//               "Successfully added new subject"
//             ).then(function () {
//               reload();
//             });
//           });
//       }
//     }
//   });
// });
//   });

//   function editSubject(id) {
//     let txtEditSubjectID = $("[name='subject_edit_subjectid']");
//     let txtEditSubjectTitle = $("[name='subject_edit_subjecttitle']");
//     let txtEditUnits = $("[name='subject_edit_units']");
//     let txteditSections = $("[name='subject_edit_sections']");
//     let txtEditFTE = $("[name='subject_edit_fte']");

//     let modalEditSubject = $("[name='modal-edit-subject']");
//     let btnEditSubjectSave = $("[name='button-edit-subject-save']");

//     txtEditUnits.focusout(function (e) {
//       if (isNumeric(txteditSections.val()) && isNumeric(txtEditUnits.val())) {
//         txtEditFTE.val(
//           parseFloat(txtEditUnits.val()) * parseFloat(txteditSections.val())
//         );
//       } else {
//         txtEditFTE.val("");
//       }
//     });

//     txteditSections.focusout(function (e) {
//       if (isNumeric(txteditSections.val()) && isNumeric(txtEditUnits.val())) {
//         txtEditFTE.val(
//           parseFloat(txtEditUnits.val()) * parseFloat(txteditSections.val())
//         );
//       } else {
//         txtEditFTE.val("");
//       }
//     });

//     dbQuery
//       .execute("Select * from subject_tb Where id = '" + id + "'; ")
//       .then(function () {
//         txtEditSubjectID.val(dbQuery.result(0, "subject_code"));
//         txtEditSubjectTitle.val(dbQuery.result(0, "subject_title"));
//         txtEditUnits.val(dbQuery.result(0, "units"));
//         txteditSections.val(dbQuery.result(0, "sections"));
//         txtEditFTE.val(dbQuery.result(0, "fte"));

//         btnEditSubjectSave.off("click").click(function () {
//           let notValidNumbers =
//             !isNumeric(txtEditUnits.val()) ||
//             !isNumeric(txteditSections.val()) ||
//             !isNumeric(txtEditFTE.val());

//           if (notValidNumbers) {
//             notify(
//               "warning",
//               "Invalid Numbers",
//               "Please enter valid numbers on Units, Sections and FTE fields"
//             );
//           } else if (
//             txtEditSubjectID.val() !== "" &&
//             txtEditSubjectTitle.val() !== "" &&
//             txtEditUnits.val() !== "" &&
//             txteditSections.val() !== "" &&
//             txtEditFTE.val() !== ""
//           ) {
//             notify(
//               "warning",
//               "Incomplete Fields",
//               "Please please fill all the required fields"
//             );
//           } else {
//             dbQuery
//               .executeNonQuery(
//                 "Update subject_tb Set subject_code = '" +
//                   sqlEscape(txtEditSubjectID.val()) +
//                   "', subject_title = '" +
//                   sqlEscape(txtEditSubjectTitle.val()) +
//                   "', units = '" +
//                   sqlEscape(txtEditUnits.val()) +
//                   "', sections = '" +
//                   sqlEscape(txteditSections.val()) +
//                   "', fte = '" +
//                   sqlEscape(txtEditFTE.val()) +
//                   "' Where id = '" +
//                   id +
//                   "'; "
//               )
//               .then(function () {
//                 notify(
//                   "success",
//                   "Edit Success",
//                   "Successfully edited subject"
//                 ).then(function () {
//                   reload();
//                 });
//               });
//           }
//         });

//         modalEditSubject.modal("show");
//         txtEditSubjectID.focus();
//       });
//   }

//   function deleteSubject(id) {
//     notify(
//       "warning",
//       "Confirm Delete",
//       "Do you really want to delete this subject?",
//       "YesNo"
//     ).then(function (e) {
//       if (e.value) {
//         dbQuery
//           .executeNonQuery("Delete From subject_tb Where id = '" + id + "'; ")
//           .then(function () {
//             notify(
//               "success",
//               "Delete Success",
//               "Successfully deleted subject"
//             ).then(function () {
//               reload();
//             });
//           });
//       }
//     });
//   }
