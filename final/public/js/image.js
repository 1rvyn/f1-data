function b64(e){
    var t="";
    var n=new Uint8Array(e);
    var r=n.byteLength;
  
    for(var i=0;i<r;i++){
      t+=String.fromCharCode(n[i])
    }
  return window.btoa(t)
  }
  
  $(document).ready(function() {
    socket.on('imageToClient', function(data) {
      $("#socket-response").append('<img id="img-socket"/>');
      $("#img-socket").attr("src","data:image/png;base64,"+b64(data.buffer));
    });
  
    socket.on('recieveError', function(){
      $("#error-message").append("There is no data for that session & or an error occured");
      // console.log('printing error')
    })
  });
  