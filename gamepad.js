// https://w3c.github.io/gamepad/

var hasGP = false;
var repGP;

function canGame() {
    return "getGamepads" in navigator;
}

function reportOnGamepad() {
    var gp = navigator.getGamepads()[0];
    var html = "";
    html += `id: ${gp.id} <br/>`;
    html += "Camera reset: ";
    if (gp.buttons[0].pressed) html += " pressed";
    html += "<br/>";

    html += `Forward: ${gp.buttons[6].value.toFixed(3)} <br/>`;

    html += `Brake/Reverse: ${gp.buttons[7].value.toFixed(3)} <br/>`;

    html += `Turn: ${gp.axes[0].toFixed(3)}, ${gp.axes[1].toFixed(3)} <br/>`;

    html += `Rotate Camera: ${gp.axes[2].toFixed(3)}, ${gp.axes[3].toFixed(3)} <br/>`;

    $("#gamepadDisplay").html(html);
}

$(document).ready(function () {

    $(window).keypress(event => {
        event.preventDefault();
        const key = event.which;
        console.log(key);
        if(key == 119) {
            
        }
    })

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