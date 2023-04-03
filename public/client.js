var socket = io.connect('http://localhost:8000/');
socket.on('connect', function(data) {
    socket.emit('join', 'Hello world');
});

//thread event

socket.on('thread', function(data) {
    $('#thread').append('<li>' + data + '</li>');
});

$('form').submit(function(){
    var message = $('#message').val();
    socket.emit('message', message);
    this.reset();
    return false;
});
