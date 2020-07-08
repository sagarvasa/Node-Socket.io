function chat_room_socket_handler(room_id, username) {

    var socket = io('/rooms/id', { transports: ['websocket'] });
    socket.on("connect", function () {
        console.log("Chat Room Joined for id:: " + room_id + " by User:: " + username);

        socket.emit('join_room', room_id, username);

        $(".send_btn").on('click', function (e) {
            e.preventDefault();
            let element = $("#type_msg_id");
            let msg = element.val().trim();
            if (msg !== '') {
                let msg_obj = {
                    message: msg,
                    username: username,
                    date: Date.now()
                };
                socket.emit('message', room_id, msg_obj);
                element.val('');
                handle_msg_text(msg_obj, 1);
            }
        });

        /*$(".logout_btn").on('click', function (e) {
            socket.emit("logout", room_id);
        });*/

        socket.on("update_users_list", function (users) {
            $(".chat-room-users").text("No of users: " + users.length);
            handle_users_list(users, 0);
        })

        socket.on('add_msg', function (message) {
            handle_msg_text(message, 0);
        });

        /*socket.on("remove_user", function () {

        })*/

        socket.on("chat_err", function (obj) {
            alert(obj.message);
        })

    })
}

function handle_msg_text(msg_obj, is_sender) {
    let html = '';
    if (is_sender === 1) {
        html = `
        <div class="d-flex justify-content-start mb-4">
            <div class="img_cont_msg">
                <img src="/images/user-icon.jpeg" class="rounded-circle user_img_msg">
            </div>
            <div class="msg_cotainer">
            ${msg_obj.message}
                <span class="msg_time">Me: ${new Date(msg_obj.date).getHours() + ":" + new Date(msg_obj.date).getMinutes() }</span>
            </div>
        </div>`
        $(".msg_card_body").append(html).slideDown(200);
    } else {
        html = `
        <div class="d-flex justify-content-end mb-4">
            <div class="msg_cotainer_send">
            ${msg_obj.message}
                <span class="msg_time_send">${msg_obj.username}: ${new Date(msg_obj.date).getHours() + ":" + new Date(msg_obj.date).getMinutes()}</span>
            </div>
            <div class="img_cont_msg">
                <img src="/images/user-icon.jpeg" class="rounded-circle user_img_msg">
            </div>
        </div>`

        $(".msg_card_body").append(html).slideDown(200);
    }

}

function handle_users_list(users, is_search) {
    let html = '';
    users.forEach((user, index) => {
        let user_image = user.image || "/images/user-icon.jpeg"
        let status_class = "online";

        // adding offline class randomly
        if (index % 3 === 0 && index != 0) {
            status_class = "offline";
        }
        html += `
        <li class="${index === 0 ? "active" : ""}">
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="${user_image}" class="rounded-circle user_img">
                    <span class="online_icon ${status_class}"></span>
                </div>
                <div class="user_info">
                    <span>${user.username}</span>
                    <p>Mobile: ${user.mobile}</p>
                </div>
            </div>
        </li>`
    })

    if (html === '') {
        $(".users_card .users_body ul").html('')
        return;
    }

    if(is_search === 0) {
        if ($(".users_card .users_body ul li").length > 0) {
            $(".users_card .users_body ul").append(html);
        } else {
            $(".users_card .users_body ul").html('').html(html);
        }
    } else {
        $(".users_card .users_body ul").html('').html(html);
    }
    
}

function search_users(value, room_id) {
    let url_path = `/users/search?room_id=${room_id}&search_text=${value}`;
    $.ajax({
        contentType: "application/json; charset=utf-8",
        method: "GET",
        url: url_path,
        success: function(result){
            handle_users_list(result.users, 1)
        },
        error: function(err) {
            alert(err.message);
        }
    });
}