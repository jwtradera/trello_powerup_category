/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var apiKey = t.arg("apiKey");
var token = null;
var categories = [];
var chkListTitle = "Checklist";

t.get("member", "private", "token").then(function(storedToken) {
  token = storedToken;
});

var context = t.getContext();
loadCategories(context.member);

function loadCategories(memberId) {
  $.ajax({
    type: "GET",
    url: "https://api.al-hokail.com/tasks/tasks/task-type/" + memberId,
    dataType: "JSON",
    success: function(resp) {
      categories = resp;

      $.each(categories, function(idx, val) {
        $("#category1").append(
          $("<option/>", {
            value: idx,
            text: val["category"]
          })
        );
      });

      selectCat1(null);
    },
    error: function(err) {
      categories = [];
    }
  });
}

function selectCat1(elem) {
  var idx1 = $("#category1").val();

  $("#category2").html("");
  $.each(categories[idx1]["sub_category"], function(idx, val) {
    $("#category2").append(
      $("<option/>", {
        value: idx,
        text: val
      })
    );
  });
}

function selectCat2(elem) {}

function addChkItem(chkListId, desc) {
  $.ajax({
    type: "POST",
    url: `https://api.trello.com/1/checklists/${chkListId}/checkItems?key=${apiKey}&token=${token}&name=${desc}`,
    dataType: "JSON",
    success: function(resp) {
      t.closePopup();
    },
    error: function(err) {
      alert("Get error while create check item.");
    }
  });
}

document.getElementById("save-btn").addEventListener("click", function() {
  var idx1 = $("#category1").val();
  var cat1 = categories[idx1]["category"];

  var idx2 = $("#category2").val();
  var cat2 = categories[idx1]["sub_category"][idx2];
  var desc = cat1 + " | " + cat2;
  console.log(desc);

  t.card("id").then(function(card) {
    const cardId = card.id;

    $.ajax({
      type: "GET",
      url: `https://api.trello.com/1/cards/${cardId}/checklists?key=${apiKey}&token=${token}`,
      dataType: "JSON",
      success: function(checklists) {
        var chklist = false;
        checklists.forEach(checklist => {
          if (checklist.name == chkListTitle) {
            chklist = checklist;
          }
        });

        if (!chklist) {
          $.ajax({
            type: "POST",
            url: `https://api.trello.com/1/cards/${cardId}/checklists?key=${apiKey}&token=${token}`,
            dataType: "JSON",
            data: {
              name: chkListTitle
            },
            success: function(chkListResp) {
              var chkListId = chkListResp.id;
              addChkItem(chkListId, desc);
            },
            error: function(err) {
              alert("Get error while create checklist.");
            }
          });
        } else {
          var chkListId = chklist.id;
          addChkItem(chkListId, desc);
        }
      },
      error: function(err) {
        alert("Get error while get checklists.");
      }
    });
  });
});

document.getElementById("close-btn").addEventListener("click", function() {
  t.closePopup();
});
