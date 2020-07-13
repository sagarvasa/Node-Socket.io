$(document).ready(function () {

    console.log("Document Ready......")

    $('.reset-room').prop('disabled', true);
    $('.create-room').prop('disabled', true);
    $('#room').keyup(function () {
        if ($(this).val() != '') {
            $('.reset-room').prop('disabled', false);
            $('.create-room').prop('disabled', false);
        }
    });

    $(".reset-room").click(function (e) {
        e.preventDefault();
        $("#rooms-form").trigger('reset');
    })

    room_socket_handler();

})

function room_socket_handler() {

    var socket = io('/rooms', { transports: ['websocket'] });
    socket.on("connect", function () {

        $(".create-room").click(function (e) {
            e.preventDefault();
            let element = $("#room");
            let new_room_name = element.val().trim();
            if (new_room_name !== '') {
                socket.emit('create_room', new_room_name);
                element.val('');
            }
        })

        socket.on("create-room-success", function(obj) {
            alert(obj.message)
        }) 

        socket.on("update_rooms_list", function (new_room) {

            let html = `<li class="list">
                <a href="/rooms/${new_room._id}" class="links">
                    <span class="link-text">${new_room.title}</span>
                </a>
            </li>`

            if (html === '') {
                return;
            }

            if ($("#active-rooms-content-id ul li").length > 0) {
                $('#active-rooms-content-id ul').append(html);
            } else {
                $('#active-rooms-content-id ul').html('').html(html);
            }

        })

        socket.on("room_err", function (obj) {
            alert(obj.message);
        })

    })
}