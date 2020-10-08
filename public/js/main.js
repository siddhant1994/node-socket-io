let userName = window.localStorage.userName;
let socket

function setuserName() {
    let name = window.prompt("please provide user name for session");
    if (!name) {
        setuserName();
    } else {
        return name;
    }
}

if (!userName) {
    userName = setuserName();
    window.localStorage.userName = userName;
}

socket = io();

socket.on("user:connected", (obj) => {
    let control = `<p class = "text-center" > User "${obj.userName}" Connected </p>`
    $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
});

socket.on("user:disconnect", (userName) => {
    let control = `<p class = "text-center" > User "${userName}" Disconnected</p>`
    $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
});

socket.emit("user:join", {
    userName
})

socket.on("user:message", (obj) => {
    insertChat("", obj);
})

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//-- No use time. It is a javaScript effect.
function insertChat(who, obj) {
    var control = "";
    var date = formatAMPM(new Date());
    let {
        text,
        userName
    } = obj;
    if (who == "me") {
        control = `
            <li style="width:100%">
                <div class="msj macro">
                    <div class="text text-l">
                        <p>${text}</p>
                        <p>
                            <small> <b> ${userName} </b> :</small >
                            <small>${date}</small>
                        </p>
                    </div>
                </div>
            </li>
        `
    } else {
        control = `
            <li style="width:100%;">
                <div class="msj-rta macro">
                <div class="text text-r">
                    <p>${text}</p>
                    <p>
                        <small>
                        <b>
                            ${userName}
                        </b> :</small>
                        <small>${date}</small>
                    </p>
                </div>
            </li>
        `;
    }

    $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
}

function resetChat() {
    $("ul").empty();
}

$(".mytext").on("keydown", function (e) {
    if (e.which == 13) {
        var text = $(this).val();
        if (text !== "") {
            insertChat("me", {
                userName,
                text
            });
            socket.emit("user:message", {
                userName,
                text
            })
            $(this).val('');
        }
    }
});

$("#to-send").on("click", function (e) {
    var text = $(".mytext").val();
    if (text !== "") {
        insertChat("me", {
            userName,
            text
        });
        socket.emit("user:message", {
            userName,
            text
        })
        $(".mytext").val('');
    }
})

function renderMyText(obj) {
    return (`
            <li style="width:100%">
                <div class="msj macro">
                    <div class="text text-l">
                        <p>${text}</p>
                        <p>
                            <small><b>User1</b> :</small>
                            <small>${date}</small>
                        </p>
                    </div>
                </div>
            </li>
        `);
}

function renderSentText(obj) {
    return (`<li style="width:100%;">
        <div class="msj-rta macro">
        <div class="text text-r">
            <p>${text}</p>
            <p>
                <small><b>User2</b> :</small>
                <small>${date}</small>
            </p>
        </div>
    </li>`);
}