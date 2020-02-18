$(function() {
  console.log("start");
  var detail = $.ajax({
    url: "https://storiette-api.azurewebsites.net/detail",
    type: "POST",
    data: {
      id: 1
    }
  });

  detail.done(function(result) {
    console.log(result);
    $("#ok").html(result.synopsis);
  });

  var detail = $.ajax({
    url: "https://storiette-api.azurewebsites.net/story",
    type: "POST",
    data: {
      id: 1
    }
  });

  detail.done(function(result) {
    console.log(result);
    // $('#audio').attr('src', result.audio)
  });

  console.log(JSON.parse('{"id":5, "name":"Joko"}'));

  var data = $.ajax({
    url: "/story",
    type: "POST",
    data: {
      id: 1
    }
  });

  data.done(function(result) {
    // var d = result[0].data
    // var data = JSON.parse(d)

    console.log(JSON.parse(result.data));

    // for(let i=0; i<data.length; i++){
    //     console.log(data[i])
    // }
  });
});
