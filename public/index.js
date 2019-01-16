var hasGP = false; // has game pad
var useGP = false; // false uses keyboard input, true uses controller input
var useTouch = false; // true uses virtual joystick touch input
var repGP; // report game pad (what game pad is doing)

function canGame() {
    return "getGamepads" in navigator;
}

function checkGamepad() {
    return navigator.getGamepads()[0];
}

$(document).ready(function () {

    const host = location.origin.replace(/^http/, 'ws');
    const socket = io(host);

    const $keyboardButton = $('#keyboardButton');
    const $gamepadButton = $('#gamepadButton');
    const $virtualJoystickButton = $('#virtualJoystickButton');
    const $img = $('#videoStream');
    const $recordButton = $('#recordControls');
    const $playbackButton = $('#playbackControls');
    const $carId = $('#carId');
    const $gamepadPrompt = $("#gamepadPrompt");
    const $carInfo = $('carInfo');
    const $userInfo = $('#userInfo');
    const $userId = $('#userId');
    const $obstruction = $('#obstruction');
    const $connectedUsers = $('#connectedUsers');
    const $spectating = $('#spectating');

    let currentlyRecording = false;
    let currentlyPlayingback = false;
    let canControl = false;
    let fullScreen = false;
    let userId;
    let controllingUser;
    const urlCreator = window.URL || window.webkitURL;
    let direction = 0; // -1 for reverse to +1 for forward
    let turn = 0; // -1 for left to +1 for right
    let cameraRotation = 0; // -1 for left to +1 for right
    const keys = [65, 87, 68, 83, 37, 39];

    // default image source
    $img.attr('src', 'https://dummyimage.com/640x480/000/ffffff?text=%20');

    $keyboardButton.addClass('active');
    

    function sendInput() {
        const input = {
            direction: parseFloat(direction),
            turn,
            cameraRotation
        };
        socket.emit('controlsInput', input);
    }
    
    function updateSelectDropdown(data) {
        $connectedUsers.empty();
        data.forEach((user) => {
            $connectedUsers.append(`<option>${user}</option>`);
        });
    }

    $recordButton.on('click', () => {
        currentlyRecording = !currentlyRecording;
        const buttonText = currentlyRecording ? 'Stop Recording' : 'Start Recording';
        $recordButton.text(buttonText);
        socket.emit('controlRecording', { currentlyRecording });
    });

    $playbackButton.on('click', () => {
        currentlyPlayingback = !currentlyPlayingback;
        const buttonText = currentlyPlayingback ? 'Stop Playback' : 'Start Playback';
        $playbackButton.text(buttonText);
        socket.emit('playbackControls', { currentlyPlayingback });
    });

    socket.on('canControl', (data) => {
        canControl = data;
        console.log('canControl has fired', data);
    });

    socket.on('connect', () => {
        socket.emit('identifier', 'client');
    });

    socket.on('carConnected', (data) => {
        console.log('car connected');
        $("#carId").text(`Connected to car #${data.carId}`);
    });

    socket.on('newDistance', (data) => {
        if (data.obstructed) {
            $obstruction.removeClass('hidden');
        } else {
            $obstruction.addClass('hidden');
        }
    });

    socket.on('playbackComplete', () => {
        $playbackButton.text('Start Playback');
    });

    socket.on('controllingUser', (data) => {
        controllingUser = data.userId;
        console.log(`controllingUser data == ${data}`);
        if (controllingUser === userId) {
            if(!fullScreen) {
                $connectedUsers.removeClass('hidden');
            } else {
                $connectedUsers.addClass('hidden');
            }
            $spectating.addClass('hidden');
        } else {
            $connectedUsers.addClass('hidden');
            $spectating.text(`Spectating`);
            $spectating.removeClass('hidden');
        }
        $connectedUsers.val(data);
    });

    $connectedUsers.change(() => {
        console.log($connectedUsers.val());
        socket.emit('transferControl', $connectedUsers.val());
    });

    socket.on('connectedUsers', (data) => {
        updateSelectDropdown(data);
    });

    socket.on('userId', (data) => {
        userId = data;
        $userId.text(`Your user id is ${userId}`);
        updateSelectDropdown([data]);
    })

    socket.on('frame', (frame) => {
        const arrayBufferView = new Uint8Array(frame);
        const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
        const imageUrl = urlCreator.createObjectURL(blob);
        $img.attr('src', imageUrl);
    });

    $img.on('dblclick', () => {
        fullScreen = !fullScreen;
        $img.toggleClass('fullScreen');
        $obstruction.toggleClass('large-font').toggleClass('extra-large-font');
        $keyboardButton.toggleClass('hidden');
        $gamepadButton.toggleClass('hidden');
        $recordButton.toggleClass('hidden');
        $playbackButton.toggleClass('hidden');
        $carId.toggleClass('hidden');
        $gamepadPrompt .toggleClass('hidden');
        $carInfo.toggleClass('hidden');
        $userInfo.toggleClass('hidden');
    })

    function resetInput() {
        direction = 0;
        turn = 0;
        cameraRotation = 0;
        sendInput();
    }

    let keydown = {
        '87': false, // w
        '83': false, // s
        '65': false, // a
        '68': false, // d
        '37': false, // left arrow
        '39': false, // right arrow
    }

    $keyboardButton.click(event => {
        resetInput();
        $keyboardButton.addClass('active');
        $gamepadButton.removeClass('active');
        $virtualJoystickButton.removeClass('active');
        useGP = false;
        useTouch = false;
    });

    $gamepadButton.click(event => {
        resetInput();
        $keyboardButton.removeClass('active');
        $gamepadButton.addClass('active');
        $virtualJoystickButton.removeClass('active');
        useGP = true;
        useTouch = false;
    });

    $virtualJoystickButton.click(event => {
        resetInput();
        $keyboardButton.removeClass('active');
        $gamepadButton.removeClass('active');
        $virtualJoystickButton.addClass('active');
        useGP = false;
        useTouch = true;
    });

    $(window).keydown(event => {
        if (!useGP) {
            const key = event.which;
            if (keys.includes(key)) {
                event.preventDefault();
                if (!keydown[key]) {
                    keydown[key] = true;
                    switch (key) {
                        case 87: // w
                            direction += 1;
                            break;
                        case 68: // d
                            turn += 1; // right
                            break;
                        case 83: // s
                            direction += -1;
                            break;
                        case 65: // a
                            turn += -1; // left
                            break;
                        case 37: // left arrow
                            cameraRotation += -1;
                            break;
                        case 39: // right arrow
                            cameraRotation += 1;
                            break;
                    }
                }
                sendInput();
            }
        }
    });

    $(window).keyup(event => {
        if (!useGP) {
            const key = event.which;
            if (keys.includes(key)) {
                event.preventDefault();
                keydown[key] = false;
                switch (key) {
                    case 87: // w
                        direction += -1;
                        break;
                    case 65: // a
                        turn += 1; // left
                        break;
                    case 68: // d
                        turn += -1; // right
                        break;
                    case 83: // s
                        direction += 1;
                        break;
                    case 37: // left arrow
                        cameraRotation += 1;
                        break;
                    case 39: // right arrow
                        cameraRotation += -1;
                        break;
                }
                sendInput();
            }
        }
    });

    if (canGame()) {

        function reportOnGamepad() {
            if (useGP) {
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
                sendInput();
            }
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
                if (!hasGP) {
                    $(window).trigger("gamepadconnected");
                }
                window.clearInterval(checkGP);
            }
        }, 500);
    }

});
