// https://w3c.github.io/gamepad/

var hasGP = false; // has game pad
var repGP; // report game pad (what game pad is doing)

function canGame() {
    return "getGamepads" in navigator;
}

function checkGamepad() {
    return navigator.getGamepads()[0];
}

$(document).ready(function () {

    let forward = 0; // 0.0 for off to 1.0 for on
    let reverse = 0; // 0.0 for off to 1.0 for on
    let turn = 0; // -1 for left to +1 for right
    let cameraRotation = 0; // -1 for left to +1 for right

    function output(key) {
        $("#forward").text(`forward = ${forward}`);
        $("#reverse").text(`reverse = ${reverse}`);
        $("#turn").text(`turn = ${turn}`);
        $("#cameraRotation").text(`camera rotation = ${cameraRotation}`);
    }

    const keys = [ 65, 87, 68, 83, 82 ];

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

        function reportOnGamepad() {
            const { buttons, axes } = navigator.getGamepads()[0];
            const r2 = buttons[7];
            const l2 = buttons[6];
            const leftStick = axes[0];
            const rightStick = axes[2];

            if (r2.value > 0.1 && l2.value > 0.1) {
                forward = 0;
                reverse = 0;
            } else {
                if (r2.value > 0.1) {
                    forward = r2.value;
                    reverse = 0;
                } 
                if (l2.value > 0.1) {
                    reverse = l2.value;
                    forward = 0;
                }
            }
            if (leftStick > 0.1 || leftStick < -0.1) {
                turn = leftStick;
            } else {
                turn = 0;
            }
            if (rightStick > 0.1 || rightStick < -0.1) {
                cameraRotation = rightStick;
            } else {
                cameraRotation = 0;
            }
            const key = 'gamepad';
            output(key);
        }

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