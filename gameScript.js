var em = ["📱","📖","📷","🎧","👓","⏰","🔒","💡","☎","🎮","☕","⚽","🪴","🧸","🗝","🎈","👒","👟","🌂","❤","🌍","🍷","🪑","🎄","🍴","🎅","💵","🎁","🛏","🕯","🪣","🪜","🐀","🐒"];

var tmp, c, p = em.length;
if (p) while (--p) {
   c = Math.floor(Math.random() * (p + 1));
   tmp = em[c];
   em[c] = em[p];
   em[p] = tmp;
}

// Sound effects
var matchSound = new Audio('sounds/match.mp3'); // Match sound
var mismatchSound = new Audio('sounds/mismatch.mp3'); // Mismatch sound


var pre = "", pID, ppID = 0, turn = 0, t = "transform", flip = "rotateY(180deg)", flipBack = "rotateY(0deg)", time, mode;
var moves = 0, rem = 0, min = 0, sec = 0;


window.onresize = init;
function init() {
   W = innerWidth;
   H = innerHeight;
   $('body').height(H + "px");
   $('#ol').height(H + "px");
}

// Starting the game
window.onload = function() {
    $("#ol").html(`<center><div id="inst">
        <h3>Welcome to the Memory Hunt Game!</h3>
        Instructions <br/><br/>
        <li>Flip the blocks by clicking on them.</li>
        <li>Match pairs of identical blocks to score points.</li>
        <li>If the blocks don’t match, they’ll flip back—so remember their positions!</li>
        <p style="font-size:18px;">Choose Your Game Mode and let the fun begin!</p>
        </div>
        <button onclick="start(3, 4)">3 x 4</button> 
        <button onclick="start(4, 4)" style="w">4 x 4</button>
        <button onclick="start(4, 5)">4 x 5</button>
        <button onclick="start(5, 6)">5 x 6</button>
        <button onclick="start(6, 6)">6 x 6</button></center>`);
}

// Function to start the game with selected grid size
function start(r, l) {
   
    min = 0, sec = 0, moves = 0;
    $("#time").html("Time: 00:00");
    $("#moves").html("Moves: 0");
    time = setInterval(function () {
        sec++;
        if (sec == 60) {
            min++; sec = 0;
        }
        if (sec < 10)
            $("#time").html("Time: 0" + min + ":0" + sec);
        else
            $("#time").html("Time: 0" + min + ":" + sec);
    }, 1000);

    rem = r * l / 2;
    mode = r + "x" + l;


    var items = [];
    for (var i = 0; i < rem; i++) items.push(em[i]);
    for (var i = 0; i < rem; i++) items.push(em[i]);

    
    var tmp, c, p = items.length;
    if (p) while (--p) {
        c = Math.floor(Math.random() * (p + 1));
        tmp = items[c];
        items[c] = items[p];
        items[p] = tmp;
    }

    
    $("table").html("");
    var n = 1;
    for (var i = 1; i <= r; i++) {
        $("table").append("<tr>");
        for (var j = 1; j <= l; j++) {
            $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'>
                                    <div class='front'></div>
                                    <div class='back'><p>${items[n - 1]}</p></div>
                                </div></td>`);
            n++;
        }
        $("table").append("</tr>");
    }

   
    $("#ol").fadeOut(500);
}


function change(x) {
 
    let i = "#" + x + " .inner";
    let f = "#" + x + " .inner .front";
    let b = "#" + x + " .inner .back";

    if (turn == 2 || $(i).attr("flip") == "block" || ppID == x) {}

    //
    else {
        $(i).css(t, flip);
        if (turn == 1) {
            
            turn = 2;

            if (pre != $(b).text()) {
                mismatchSound.play();  
                setTimeout(function () {
                    $(pID).css(t, flipBack);
                    $(i).css(t, flipBack);
                    ppID = 0;
                }, 1000);
            }
            
            else {
                matchSound.play();  
                rem--;
                $(i).attr("flip", "block");
                $(pID).attr("flip", "block");
            }

            setTimeout(function () {
                turn = 0;
                moves++;
                $("#moves").html("Moves: " + moves);
            }, 1150);
        }
        else {
            pre = $(b).text();
            ppID = x;
            pID = "#" + x + " .inner";
            turn = 1;
        }

        if (rem == 0) {
            clearInterval(time);
            if (min == 0) {
                time = `${sec} seconds`;
            } else {
                time = `${min} minute(s) and ${sec} second(s)`;
            }
            setTimeout(function () {
                $("#ol").html(`<center>
                    <div id="iol">
                        <h2>🥳 Congrats! 🥳</h2>
                        <p style="font-size:23px;padding:10px;">🎉 You’ve completed the ${mode} mode in only ${moves} moves! Total time: ${time}. Incredible!</p>
                        <p style="font-size:18px">Share your score and challenge your friends!<br/>Play Again?</p>
                        <button onclick="start(3, 4)">3 x 4</button> 
                        <button onclick="start(4, 4)" style="w">4 x 4</button>
                        <button onclick="start(4, 5)">4 x 5</button>
                        <button onclick="start(5, 6)">5 x 6</button>
                        <button onclick="start(6, 6)">6 x 6</button>
                    </div>
                </center>`);
                $("#ol").fadeIn(750);
            }, 1500);
        }
    }
}
