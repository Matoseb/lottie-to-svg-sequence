const input = document.querySelector('input'),
    btn = document.querySelector('button'),
    container = document.querySelector('#lottie');

input.oninput = function(e) {
    this.disabled = btn.disabled = true;

    const reader = new FileReader(),
        name = this.files[0].name;

    reader.onload = function(e) {
        play(e.target.result, name);
    }

    reader.readAsText(this.files[0]);
}

function download(filename, text) {
    let blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
}

function play(jsonString, name) {

    let currFrame = 0,
        result = { frameRate: 0, data: [] };


    const anim = bodymovin.loadAnimation({
        wrapper: container,
        animType: "svg",
        loop: false,
        animationData: JSON.parse(jsonString),
        autoplay: false,
        rendererSettings: {
            progressiveLoad: true,
            scaleMode: 'noScale',
        }
    });

    anim.onEnterFrame = _ => {

        if (currFrame < anim.totalFrames - 1) {

            requestAnimationFrame(() => {
                console.log('nani');
                result.data.push(container.innerHTML);
                goToFrame(++currFrame);
            });

        } else {

            btn.disabled = false;

            result = JSON.stringify(result);

            btn.onclick = () => download('exported_' + name, result);
            anim.onEnterFrame = null;
            // anim.destroy();
            console.log('done');
        }
    };

    goToFrame(currFrame);

    result.frameRate = anim.frameRate;

    function goToFrame(frame) {
        anim.goToAndStop(frame, true);
    }
}