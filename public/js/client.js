/* global TrelloPowerUp */
var Promise = TrelloPowerUp.Promise;
var apiKey = "d83766484739ea75bee88a3e2d26df82";

TrelloPowerUp.initialize({
  "card-buttons": function(t, opts) {
    // check that viewing member has write permissions on this board
    if (opts.context.permissions.board !== "write") {
      return [];
    }

    return t.get("member", "private", "token").then(function(token) {
      return [
        {
          icon:
            "https://cdn.glitch.com/5dd382e8-c73c-4108-a1ae-f63f2022ce37%2Ficon-category-32.png?v=1628487631614",
          text: "Select Category",
          callback: function(context) {
            if (!token) {
              context.popup({
                title: "Authorize Your Account",
                url: "./authorize.html",
                args: {
                  apiKey: apiKey
                },
                height: 150
              });
            } else {
              return context.popup({
                title: "Set category",
                url: "./modal.html",
                args: {
                  apiKey: apiKey
                },
                height: 200
              });
            }
          }
        }
      ];
    });
  }
});
