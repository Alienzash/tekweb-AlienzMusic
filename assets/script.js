//buat playlist
fetch('assets/data.json')
    .then(res => {
        return res.json();
    })
    .then(data => {
        // Membuat array dari promise untuk setiap elemen audio
        const audioPromises = data.map(music => {
            return new Promise((resolve) => {
                const audioElement = new Audio(music.song);
                audioElement.addEventListener('loadedmetadata', () => {
                    const durationMinutes = Math.floor(audioElement.duration / 60);
                    const durationSeconds = Math.floor(audioElement.duration % 60);
                    const playlist = `
                        <div class="musicListInfo">
                            <div class="infoMiniLogo"><img src="${music.picture}" alt="logo"></div>
                            <div class="infoSongAndArtist">
                                <div id="musicTitle" style="font-size: 1rem;">${music.title}</div>
                                <div id="artistName" style="font-size: 0.75rem;">${music.artist}</div>
                            </div>
                            <div class="duration">${durationMinutes}:${durationSeconds}</div>
                        </div>
                    `;
                    resolve(playlist);
                });
                audioElement.load();
            });
        });

        // Menunggu hingga semua promise selesai, kemudian menambahkannya ke DOM
        Promise.all(audioPromises)
            .then(playlists => {
                document.querySelector(".musicListInfoContainer").innerHTML = playlists.join('');
            });
    })
    .catch(error => console.log(error));


//buat currentMusic
let repeat = document.querySelector('.repeat');
let isRepeated = false;
let shouldAutoplay = false;
let musicProgress = document.getElementById("musicProgress");
let controlIcon = document.getElementById("playOrStop");
let audioElement = new Audio();
let alreadyClicked = false;
let currentMusicIndex = 0;
let fetchData;
let playMusic;

audioElement.addEventListener('loadedmetadata', () => {
    musicProgress.max = audioElement.duration;
    musicProgress.value = audioElement.currentTime;
    if (shouldAutoplay) {
        audioElement.play().catch(error => {
            console.error('Autoplay error:', error);
        });
    }
});

audioElement.addEventListener('timeupdate', () => {
    musicProgress.value = audioElement.currentTime;
});

musicProgress.addEventListener('input', () => {
    audioElement.currentTime = musicProgress.value;
});
function playOrPause() {
    if (controlIcon.classList.contains("fa-pause")) {
        audioElement.pause();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    } else {
        shouldAutoplay = true;
        audioElement.play().catch(error => {
            console.error('Autoplay error:', error);
        });
        controlIcon.classList.add("fa-pause");
        controlIcon.classList.remove("fa-play");
    }
};
// function ulangMusic() {
//     isRepeated = !isRepeated;
//     if (isRepeated) {
//         repeat.style.color = "#525CEB";
//         const nextIndex = currentMusicIndex;
//     } else {
//         repeat.style.color = "#BFCFE7";
//     }
// };
function keatas() {
    let playlistSection = document.querySelector(".musicList");
    let width = window.innerWidth;
    if (width < 900 && alreadyClicked === false) {
        playlistSection.style.overflow = "scroll";
        playlistSection.style.position = "absolute";
        playlistSection.style.width = "350px";
        playlistSection.style.height = "650px";
        console.log(alreadyClicked);
    } else if (width <= 900 && alreadyClicked === true) {
        playlistSection.style.overflow = "hidden";
        playlistSection.style.marginTop = "-45px";
        playlistSection.style.width = "300px";
        playlistSection.style.height = "40px";
    }
    alreadyClicked = !alreadyClicked;
    playlistSection.style.transition = "all 0.5s ease";
};
function nextMusic() {
    const nextIndex = (currentMusicIndex + 1) % fetchData.length;
    playMusic(nextIndex);
};
function previousMusic() {
    const nextIndex = (currentMusicIndex - 1) % fetchData.length;
    if (nextIndex <= 0) {
        playMusic(0);
    } else {
        playMusic(nextIndex);
    }
};


// Fetch your music data and update the DOM
fetch('assets/data.json')
    .then(res => res.json())
    .then(data => {
        function updateMusicInfo(index) {
            currentMusicIndex = index;
            const currentMusic = data[currentMusicIndex];
            // Update DOM elements with music information
            document.querySelector(".musicImage").innerHTML = `<img class="musicPicture" src="${currentMusic.picture}" alt="music album cover">`;
            document.querySelector(".musicInfo").innerHTML = `<h1 class="musicTitle" style="margin: 0;">${currentMusic.title}</h1><p class="artistName" style="margin: 0;">${currentMusic.artist}</p>`;
            audioElement.src = currentMusic.song;
            audioElement.load();
        }
        playMusic = function(index) {
            updateMusicInfo(index);
            // Set up event listeners
            audioElement.addEventListener('ended', () => {
                // const nextIndex = currentMusicIndex;
                // console.log("nextIndex=",nextIndex);
                // if (isRepeated) {
                //     const nextIndex = currentMusicIndex;
                //     isRepeated = !isRepeated;
                //     repeat.style.color = "#BFCFE7";
                //     console.log("nextIndex=",nextIndex);
                //     playMusic(nextIndex);
                // } else {
                    const nextIndex = (currentMusicIndex + 1) % data.length;
                    playMusic(nextIndex);
                // };
            });            
        }
        // Start playing the first music
        playMusic(0);
        fetchData = data;
    })
    .catch(error => console.error(error));