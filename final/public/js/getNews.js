$(function () {
  // doing this in a seperate function so that it can be changed easily from feed to feed
  createTheUrl();
});

function createTheUrl() {
  var newsFeedUrl =
    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.formula1.com%2Fcontent%2Ffom-website%2Fen%2Flatest%2Fall.xml&api_key=pwxpr4y6062kip7rucoq13i1fhomhgxwdihxrobs";

  $.getJSON(newsFeedUrl, function (jsondata) {
    // handle the results
    getAllNewsData(jsondata);
    // this will get all the jsondata required
    // for both the news page and home page
  });

  function getAllNewsData(jsondata) {
    // get all the json data objects needed
    var listHomeDiv = "";
    var listNewsDiv = "";
    var arrArticle = [],
      lenArticleLen;
    var storeContent = [];
    var storeLink = [];
    var storeTitle = [];
    var storeIteration = [];

    for (key in jsondata.items) {
      arrArticle.push(key);
    }

    lenArticleLen = arrArticle.length;

    // will push all the articles items from the jsondata object to these lists
    // we will make a different loop for the home page so it doesnt use all the items
    for (i = 0; i < lenArticleLen; i++) {
      var content = jsondata.items[i].content;
      var link = jsondata.items[i].link;
      var title = jsondata.items[i].title;
      // store them in their arrays
      storeContent.push(content);
      storeLink.push(link);
      storeTitle.push(title);
      storeIteration.push(i);
    }

    // only get 5 for the home page
    for (i = 0; i < lenArticleLen / 2; i++) {
      listHomeDiv +=
        "<div id=" +
        "newsDiv" +
        i +
        ">" +
        "<li id=" +
        "newslist" +
        i +
        ">" +
        storeTitle[i] +
        "</li> " +
        "</div>";
    }
    // get all the article content for the news page
    for (i = 0; i < lenArticleLen; i++) {
      listNewsDiv +=
        "<div id=" +
        "newsDiv" +
        i +
        ">" +
        "<li id=" +
        "newslist" +
        i +
        ">" +
        storeTitle[i] +
        "</li> " +
        "</div>";
    }
    // inject both into the dom
    $("#news").append(listHomeDiv);
    $("#newsPageContent").append(listNewsDiv);

    // add the link to allow users to read the full article from the F1 site
    // this is done after the new DIVS are injected into the DOM
    for (j = 0; j < i; j++) {
      var linkItem = "";
      linkItem +=
        "<p id=" +
        "newsLinks" +
        ">" +
        "<a href=" +
        "'" +
        storeLink[j] +
        "'" +
        ">" +
        "Full Article" +
        "</a>" +
        "</p>";
      //$(".linkItem" +j).attr('target', '_blank');
      $("#newslist" + j).append(linkItem);
      // all the new hyper links injected will open in a new tab
      // ( this too way to long to figure out how to do - 4-5 hours)
      $("#newsLinks a").attr("target", "_blank");
    }
  }
}
