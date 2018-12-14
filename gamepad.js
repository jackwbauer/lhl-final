// https://w3c.github.io/gamepad/

var hasGP = false;
var repGP;

function canGame() {
    return "getGamepads" in navigator;
}

function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    var html = "";
    html += "id: " + gp.id + "<br/>";

    for (var i = 0; i < gp.buttons.length; i++) {
        if (i == 6 || i == 7) {
            html += "Button " + (i + 1) + ": ";
            html += gp.buttons[i].value.toFixed(3);
            html += "<br/>";
        } else {
            html += "Button " + (i + 1) + ": ";
            if (gp.buttons[i].pressed) html += " pressed";
            html += "<br/>";
        }
    }

    for (var i = 0; i < gp.axes.length; i += 2) {
        html += "Stick " + (Math.ceil(i / 2) + 1) + ": " + gp.axes[i].toFixed(3) + " , " + gp.axes[i + 1].toFixed(3) + "<br/>";
    }

    $("#gamepadDisplay").html(html);
}

$(document).ready(function () {

    if (canGame()) {

        var prompt = "To begin using your gamepad, connect it and press any button!";
        $("#gamepadPrompt").text(prompt);

        $(window).on("gamepadconnected", function () {
            hasGP = true;
            $("#gamepadPrompt").html("Gamepad connected!");
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad, 100);
        });

        $(window).on("gamepaddisconnected", function () {
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            hasGP = false;
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function () {
            if (navigator.getGamepads()[0]) {
                if (!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }

});