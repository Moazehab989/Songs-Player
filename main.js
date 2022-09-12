let songsWrapper = document.querySelector(".songs-wrapper");
let searchWrapper = document.getElementById("search-wrapper");
let musicNames = new XMLHttpRequest();
let songsData;

musicNames.open("GET", "./songs.json");
musicNames.onreadystatechange = function () {
    if (this.status == 200 && this.readyState == 4) {
        let names = JSON.parse(musicNames.responseText);
        songsData = names;
        searchWrapper.innerHTML = `<input
            type="text"
            class="search-bar"
            style="font-family: Arial, FontAwesome"
            placeholder="&#xF002;&nbsp; search song"
        />`;
        names.map((ele, idx) => {
            songsWrapper.innerHTML += `
                <div class="song-wrapper d-flex flex-column song-${ele.id}">
                    <audio id="${ele.id}" ontimeupdate="currTime(${ele.id}, ${idx})">
                        <source src="${ele.url}" type="audio/mpeg"></source>
                    </audio>
                    <div class="card">
                        <img class="card-img-top" src="${ele.img}" />
                        <div class="card-body">
                            <h4 class="card-title text-center">${ele.name}</h4>
                            <p class="card-text text-center">${ele.artist}</p>
                            <div class="prog">
                                <input class="range" type="range" onchange="changeCurrTime(${ele.id}, ${idx})" id="range-${idx}" min="0" value="0" step="1">
                            </div>
                            <div class="time mt-1 mb-3 d-flex justify-content-between">
                                <span id="currTime-${idx}">00:00</span>
                                <span id="duration-${idx}">00:00</span>
                            </div>
                            <div class="buttons d-flex justify-content-between">
                                <button class="btn-replay" onclick="replay(${ele.id}, ${idx})" id="replay-${idx}"><i class="fa-solid fa-rotate-right"></i></button>
                                <button class="btn-start d-flex justify-content-center align-items-center" onclick="PlayPause(${ele.id}, ${idx})" id="PlayPauseBTN-${idx}"><i class="fa-solid fa-play"></i></button>
                                <button class="btn-repeat repeat-off" onclick="repeatSong(${ele.id}, ${idx})" id="repeat-${idx}"><i class="fa-solid fa-repeat"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
};
musicNames.send();
let count = 0;

function PlayPause(audio, idx) {
    if (count == 0) {
        count = 1;
        audio.play();
        document.getElementById(
            "PlayPauseBTN-" + idx
        ).innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
        count = 0;
        audio.pause();
        document.getElementById(
            "PlayPauseBTN-" + idx
        ).innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
}

function replay(audio, idx) {
    PlayPause(audio, idx);
    audio.pause();
    audio.currentTime = 0;
    document.getElementById(
        "PlayPauseBTN-" + idx
    ).innerHTML = `<i class="fa-solid fa-play"></i>`;
    PlayPause(audio, idx);
}

let repeat = "off";
function repeatSong(audio, idx) {
    let repBtn = document.getElementById("repeat-" + idx);
    if (repBtn.classList.contains("repeat-off")) {
        repeat = "on";
        repBtn.classList.remove("repeat-off");
        repBtn.classList.add("repeat-on");
    } else {
        repeat = "off";
        repBtn.classList.add("repeat-off");
        repBtn.classList.remove("repeat-on");
    }
}

function currTime(audio, idx) {
    let barWidth = audio.currentTime;
    document.getElementById(`range-${idx}`).max = parseInt(audio.duration);
    document.getElementById(`range-${idx}`).value = barWidth;
    if (repeat == "on") {
        if (audio.currentTime == audio.duration) {
            audio.currentTime = 0;
            PlayPause(audio, idx);
            PlayPause(audio, idx);
        }
    } else {
        if (audio.currentTime == audio.duration) {
            audio.currentTime = 0;
            PlayPause(audio, idx);
        }
    }
    if (audio.duration) {
        let durationHtml = document.getElementById("duration-" + idx);
        let currTimeHtml = document.getElementById("currTime-" + idx);

        let durmin = Math.floor(audio.duration / 60);
        let dursec = Math.floor(audio.duration - durmin * 60);
        let curmin = Math.floor(audio.currentTime / 60);
        let cursec = Math.floor(audio.currentTime - curmin * 60);
        if (durmin < 10) durmin = "0" + durmin;
        if (dursec < 10) dursec = "0" + dursec;
        if (curmin < 10) curmin = "0" + curmin;
        if (cursec < 10) cursec = "0" + cursec;
        let duration = durmin + ":" + dursec;
        let curTime = curmin + ":" + cursec;

        durationHtml.innerText = duration;
        currTimeHtml.innerText = curTime;
    }
}

function changeCurrTime(audio, idx) {
    let progressValue = parseInt(document.getElementById(`range-${idx}`).value);
    audio.currentTime = progressValue;
}

function search() {
    let names = JSON.parse(musicNames.responseText);
    names.map((ele, idx) => {
        console.log(ele.name);
    });
}