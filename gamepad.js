// https://w3c.github.io/gamepad/

var hasGP = false; // has game pad
var repGP; // report game pad (what game pad is doing)

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

    html += `Forward: ${gp.buttons[7].value.toFixed(3)} <br/>`;

    html += `Brake/Reverse: ${gp.buttons[6].value.toFixed(3)} <br/>`;

    html += `Turn: ${gp.axes[0].toFixed(3)}, ${gp.axes[1].toFixed(3)} <br/>`;

    html += `Rotate Camera: ${gp.axes[2].toFixed(3)}, ${gp.axes[3].toFixed(3)} <br/>`;

    $("#gamepadDisplay").html(html);
}

$(document).ready(function () {

    let forward = 0; // 0.0 for off to 1.0 for on
    let reverse = 0; // 0.0 for off to 1.0 for on
    let turn = 0; // -1 for left to +1 for right
    let cameraRotation = 0; // -1 for left to +1 for right

    function output(key) {
        console.clear();
        console.log(`forward = ${forward}`);
        console.log(`turn = ${turn}`);
        console.log(`reverse = ${reverse}`);
        console.log(`key == ${key}`);
    }

    const keys = [ '', 65, 87, 68, 83, 82 ];

    $(window).keydown(event => {
        const key = event.which;
        // console.log(`key down == ${key}`);
        if (keys.includes(key)) {
            event.preventDefault();
            switch (key) {
                case 87: // w
                    forward = 1;
                    reverse = 0;
                    break;
                case 68: // d
                    turn = 1; // right
                    break;
                case 83: // s
                    forward = 0;
                    reverse = 1;
                    break;
                case 82: // r
                    cameraRotation = 0;
                    break;
                case 65: // a
                    turn = -1; // left
                    break;
            }
        }
        
        output(key);
    });

    $(window).keyup(event => {
        const key = event.which;
        // console.log(`key = ${key}`);
        if (keys.includes(key)) {
            event.preventDefault();
            switch (key) {
                case 87: // w
                    forward = 0;
                    break;
                case 65: // a
                    turn = 0; // left
                    break;
                case 68: // d
                    turn = 0; // right
                    break;
                case 83: // s
                    reverse = 0;
                    break;
            }
        }
        output(key);
    });

    if (canGame()) {

        var prompt = "To begin using your gamepad, connect it and press any button!";
        $("#gamepadPrompt").text(prompt);

        $(window).on("gamepadconnected", function () {
            hasGP = true;
            $("#gamepadPrompt").html("Gamepad connected!");
            console.log("connection event");
            // checking for control input
            repGP = window.setInterval(reportOnGamepad, 100);
        });

        $(window).on("gamepaddisconnected", function () {
            console.log("disconnection event");
            $("#gamepadPrompt").text(prompt);
            hasGP = false;
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome to check if controller connected
        var checkGP = window.setInterval(function () {
            if (navigator.getGamepads()[0]) {
                if (!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }

});