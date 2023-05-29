var peer = new Peer();
var conn;
var i_finish = 0;
var friend_finish = 0;
var myfriend = 0;
var end = "";
var friend_replay = 0;
var i_replay = 0;
var i_html = document.getElementById("hand");
var i_win = 0;
var friend_win = 0;
var url = location.href;
var myid = "";
if(url.indexOf('?')!=-1)
{
    var ary1 = url.split('?');
    var ary2 = ary1[1].split('&');
    var ary3 = ary2[0].split('=');
    var idd = ary3[1];
    idd = idd.replace("#","");
    Swal.fire({
        title: "連結中包含ID",
        text: "是否進行連接",
        showCancelButton: true
    }).then(function(result) {
        if (result.value) {
            conn = peer.connect(idd);
            conn.on('open', function () {
                getmsg()
            })
        }
        else {
        
       }
    }); 
};

peer.on('open', function (id) {
    console.log('Connected to Signaling Server ID : ' + id);
    myid = id
});

peer.on('connection', function(c) {
    conn = c
    getmsg()
});

peer.on('error', function(err){
    swal.fire({
        title: '錯誤',
        text: err ,
        showCancelButton: false
    }).then(function(result) {
    })
})

function getmsg() {
    document.getElementById("hand").style.display = ("block")
    document.getElementById("next").style.display = ("block")
    document.getElementById("check").style.display = ("block")
    document.getElementById("i_wins").style.display = ("block")
    document.getElementById("friend_wins").style.display = ("block")
    conn.on('data', function (data) {
        console.log(data);
        if (data == "replay") {
            friend_replay = 1;
            if (i_replay == 1) {
                i_finish = 0;
                friend_finish = 0;
                reshow()
            }
            else {
                swal.fire({
                    title: '提示',
                    text: "您的對手已按下重玩，正在等待您點擊" ,
                    showCancelButton: false
                }).then(function(result) {
                })
            }
        }
        else {
            friend_finish = 1
            myfriend = data
            if (i_finish == 1) {
                document.getElementById("friend").innerHTML = (data)
                i_replay = 0;
                friend_replay = 0;
                i_finish = 0;
                friend_finish = 0;
                winorlose()
            }
            else {
                swal.fire({
                    title: '提示',
                    text: "對手已出拳，正在等待您出拳" ,
                    showCancelButton: false
                }).then(function(result) {
                })
            }
            
            
        }
    }
)};

function winorlose() {
    document.getElementById("replay").style.display = ("block")
    if (myfriend == i_html.innerHTML) {
        even()
    }
    else{
        if (i_html.innerHTML == "剪刀") {
            if (myfriend == "石頭") {
                lose()
            }
            else {
                win()
            }
        }
        else {
            if (i_html.innerHTML == "石頭") {
                if (myfriend == "布") {
                    lose()
                }
                else {
                    win()
                }
            }
            else {
                if (i_html.innerHTML == "布") {
                    if (myfriend == "剪刀") {
                        lose()
                    }
                    else {
                        win()
                    }
                }
            }
        }
    }
}

function even() {
    end = "even"
    document.getElementById("end").innerHTML = (end)
}

function win() {
    end = "win"
    document.getElementById("end").innerHTML = (end)
    i_win = i_win+1;
    document.getElementById("i_wins").innerHTML = ("你贏了" + i_win + "次")
}

function lose() {
    end = "lose"
    document.getElementById("end").innerHTML = (end)
    friend_win = friend_win+1;
    document.getElementById("friend_wins").innerHTML = ("對手贏了" + friend_win + "次")
}

function reshow() {
    document.getElementById("next").style.display = "block"
    document.getElementById("check").style.display = "block"
    document.getElementById("replay").style.display = "none"
    document.getElementById("friend").innerHTML = ""
    document.getElementById("end").innerHTML = ""
}

document.getElementById("replay").addEventListener("click", function () {
    document.getElementById("replay").style.display = "none" 
    conn.send("replay")
    i_replay = 1;
    if (friend_replay == 1) {
        i_finish = 0;
        friend_finish = 0;
        reshow()
    }
    else{
        swal.fire({
            title: '提示',
            text: "您已按下重玩，正在等待對手點擊" ,
            showCancelButton: false
        }).then(function(result) {
        })
    }
})

document.getElementById("next").addEventListener("click", function(){
    if (i_html.innerHTML == "石頭") {
        i_html.innerHTML = ("剪刀")
    }
    else {
        if (i_html.innerHTML == "剪刀") {
            i_html.innerHTML = ("布")
        }
        else {
            i_html.innerHTML = ("石頭")
        }
    }
});

document.getElementById("check").addEventListener("click", function(){
    document.getElementById("check").style.display = "none"
    document.getElementById("next").style.display = "none"
    conn.send(i_html.innerHTML);
    i_finish = 1;
    if (friend_finish == 1) {
        document.getElementById("friend").innerHTML = (myfriend)
        i_replay = 0;
        friend_replay = 0;
        i_finish = 0;
        friend_finish = 0;
        winorlose()
    }
    else {
        swal.fire({
            title: '提示',
            text: "您已出拳，正在等待對手出拳" ,
            showCancelButton: false
        }).then(function(result) {
        })
    }
});

document.getElementById("getpeerid").addEventListener("click", function () {
        swal.fire({
            title: '提示',
            text:  (window.location.protocol + "//" + window.location.host + location.pathname + "?id=" +myid+ "<br>" + "<img src='https://chart.googleapis.com/chart?cht=qr&chl=" + window.location.protocol + "//" + window.location.host + location.pathname + "?id=" +myid + "&chs=200x200'>"),
        ),
            showCancelButton: false
        }).then(function(result) {
        })
    })
