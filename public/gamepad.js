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

    const webSocket = new WebSocket('ws://localhost:24145');
    console.log(webSocket);

    function sendInput() {
        const input = {
            direction,
            turn,
            cameraRotation
        };
        webSocket.send(JSON.stringify(input));
    }

    let direction = 0; // -1 for reverse to +1 for forward
    let turn = 0; // -1 for left to +1 for right
    let cameraRotation = 0; // -1 for left to +1 for right

    function output(key) {
        $("#direction").text(`direction = ${direction}`);
        $("#turn").text(`turn = ${turn}`);
        $("#cameraRotation").text(`camera rotation = ${cameraRotation}`);
        sendInput();
    }

    const keys = [ 65, 87, 68, 83, 82 ];

    $(window).keydown(event => {
        const key = event.which;
        // console.log(`key down == ${key}`);
        if (keys.includes(key)) {
            event.preventDefault();
            switch (key) {
                case 87: // w
                    direction = 1;
                    break;
                case 68: // d
                    turn = 1; // right
                    break;
                case 83: // s
                    direction = -1;
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
                    direction = 0;
                    break;
                case 65: // a
                    turn = 0; // left
                    break;
                case 68: // d
                    turn = 0; // right
                    break;
                case 83: // s
                    direction = 0;
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

            direction = (r2.value - l2.value).toFixed(1);
            
            if (leftStick > 0.1 || leftStick < -0.1) {
                turn = leftStick.toFixed(1);
            } else {
                turn = 0;
            }
            if (rightStick > 0.1 || rightStick < -0.1) {
                cameraRotation = rightStick.toFixed(1);
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