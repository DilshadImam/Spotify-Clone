console.log("lets write javascript");
let currentsong = new Audio();
let songs;
let currFolder;
let musicPlayer = document.querySelector(".playA");
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`); //yaha per pura songs directory access ho rha hai
  let response = await a.text(); //song directory ka html docs string response me save ho rha hai
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a"); //html docs jo uper response me tha usko anchor tag ke hisab se select kara gya hai
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //show all the songs in the playlist
  console.log(songs);
  let songUl = document
    .querySelector(".songslist")
    .getElementsByTagName("ul")[0];
    songUl.innerHTML="";
  console.log(songUl)
  for (const song of songs) {
    let songName = song
      .replace(/%20/g, " ")
      .replace(/%9C/g, "")
      .replace(/%BD/g, "")
      .replace(/%EF/g, "")
      .replace(/%2B/g, "")
      .replace(/%40/g, "");
    songUl.innerHTML =
      songUl.innerHTML +
      ` <li dillu-song ="${song}"><img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${songName}</div>
                  <div>dillu</div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <img  class="invert" src="play.svg" alt="">
                </div></li>`;
  }
  Array.from(
    document.querySelector(".songslist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      const originalFilename = e.getAttribute("dillu-song");
      playMusic(originalFilename);
    });
  });
  return songs
}


const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentsong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentsong.play();
    musicPlayer.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
}


async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`); //yaha per pura songs directory access ho rha hai
  let response = await a.text(); //song directory ka html docs string response me save ho rha hai
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardcontainer =document.querySelector(".cardcontainer")
   let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
    
    if(e.href.includes("/songs/")){
     let folder = e.href.split("/").slice(-2)[1]
     //get the metadata of the folder
     let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`); //yaha per pura songs directory access ho rha hai
     console.log(a)
     let response = await a.json();
     console.log("res "+response)
     cardcontainer.innerHTML = cardcontainer.innerHTML +`<div  data-folder="${folder}"  class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="#000000"
                  fill="none">
                  <path
                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                    fill="#000"
                  ></path>
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.discriptions}</p>
            </div>`
    }
  }
  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async  item=>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
      musicPlayer.src = "img/pause.svg";
    })
  }) 
}

    async function main() {
     await getSongs("songs/ncs/");
      playMusic(songs[0], true);
     
    //display all the albums on the songs
    displayAlbums()
      
    
      //Attach an event listner to play,next and previous
      musicPlayer.addEventListener("click", () => {
        if (currentsong.paused) {
          currentsong.play();
          musicPlayer.src = "img/pause.svg";
        } else {
          currentsong.pause();
          musicPlayer.src = "img/play.svg";
        }
      });
      currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
          currentsong.currentTime
        )} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left =
          (currentsong.currentTime / currentsong.duration) * 100 + "%";
      });
    
      //add eventlistner to the seekbar
      document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
      });
    
      //add eventlistner to hamburger
      document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
      });
      //add eventlistner to close button
      document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
      });
      //add eventlistner to previous
      document.querySelector(".previous").addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index-1)>= 0) {
          playMusic(songs[index-1]);
        }
      })
      //add eventlistner to next
      document.querySelector(".next").addEventListener("click", () => {
        currentsong.pause()
        console.log("click next")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index+1) < songs.length) {
          playMusic(songs[index+1]);
        }
      })
      //Adding an event listner to volume
      document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to", e.target.value,"/ 100")
        currentsong.volume = parseInt(e.target.value)/100;
        if(currentsong.volume>0){
          document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
      })
      //add eventlistner to mute the track
      document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        console.log("changing",e.target.src)
        if(e.target.src.includes("volume.svg")){
          e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
          currentsong.volume = 0;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }else{
          e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
          currentsong.volume = .10;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }
      })
  
     
}
main();
