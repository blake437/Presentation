var str = window.location.href.split('?')[1]
if (JSON != null){
  var obj = json.parse(str)
  document.getElementById("title").text = obj.content.title
  document.getElementById("subtitle").text = obj.content.subtitle
}
