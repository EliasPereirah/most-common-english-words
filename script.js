"use strict"
/*
Author: Elias Pereirah
URL: https://www.facebook.com/elias.pereirah
*/

document.querySelector("#initButton").onclick = start;
let log = console.log;

function start() {
    log('init');
    //        echo "<audio preload='none' id='audio' name='{$name}' id='{$id}' src='audios/{$file}'></audio>";
    let hiddenAudios = document.querySelector("#hiddenAudios");
    let audioCount = 1;
    let file;
    let english = Object.keys(translation);
    english.forEach(english_word =>{
        let audioDOM = document.createElement('audio');
        audioDOM.id = 'id'+audioCount;
        audioDOM.setAttribute('preload','none');
        audioDOM.setAttribute('name',english_word.charAt(0).toUpperCase()+english_word.slice(1));
        file = 'audios/'+english_word+'.wav';
        audioDOM.src = file
        hiddenAudios.append(audioDOM);
        audioCount++;
    })

    preLoadAudio(15)

    let hideMe = document.querySelector("#hideMe");
    hideMe.style.display ='none';
    let form = document.querySelector("#myForm");
    form.style.display = 'inherit';
    let audios = document.querySelectorAll('audio');
    let en = document.querySelector('#en');
    let pt = document.querySelector('#pt');
    let btnToggle = document.querySelector(".btnToggle");
    let index = parseInt(localStorage.getItem("index"));
    if(isNaN(index) || index === 0){
        index = 0;
        localStorage.setItem('index','0');
    }
    let lastAudio = false;
    let audioToPlay = false;
    let played = 0;
    let fast = 2000;
    let stoped = false;
    let forcePlayNext = false;
    let velocity = document.querySelector("input#velocity");
    btnToggle.onclick = ()=>{
        if(stoped){
            stoped = false;
            btnToggle.innerText = 'Parar'
            initIntervarls(fast);
        }else{
            stoped = true;
            btnToggle.innerText = 'Voltar'
            clearInterval(timer);
        }

    }

    velocity.onchange = ()=>{
        let myVelocity = parseInt(velocity.value);
        if(myVelocity === 0 || myVelocity < 0){
            if(myVelocity < 0){
                forcePlayNext = true;
                if(myVelocity < -9){
                    myVelocity = 9;
                }
                fast = 1000 - (Math.abs(myVelocity) * 100);

            }else{
                forcePlayNext = false;
                fast = 500;
            }
            clearInterval(timer);
            initIntervarls(fast);
        }else{
            forcePlayNext = false;
            fast = myVelocity * 1000;
            clearInterval(timer);
            initIntervarls(fast)
            log(fast)
        }
    }

    let playNext = () => {
        if (audios[index] !== undefined) {
            let text = audios[index].getAttribute('name');
            let wordTransleted = translation[text.toLocaleLowerCase()];
            en.innerText = text;
            pt.innerText = wordTransleted.charAt(0).toUpperCase() + wordTransleted.slice(1);
            audioToPlay = document.querySelector('[name=' + text + ']');
            if (audioToPlay !== null) {
                audioToPlay.play()
                played++;
                if(played%10 === 0){
                    // each time the has played 10 audios, preload more fifteen
                    preLoadAudio(10);
                }
                lastAudio = audioToPlay;
            }
        } else {
            clearInterval(timer)
            index = -1; // this prevents setInterval from setting localStorage to a value greater than zero
            localStorage.setItem('index','0');
            log('end')
            congratulations();
        }
        index++;
        localStorage.setItem('index', index);
    }

    function congratulations() {
         let block = document.querySelector(".block");
         block.style.backgroundColor = '#2cde3e';
         block.style.fontSize = "4em";
         block.innerHTML ='Parabéns<br>Você chegou ao fim!';
         block.style.transform = "rotate(-10deg)";
    }


    function initIntervarls(fast) {
        window.timer = setInterval(() => {
            if(forcePlayNext){
                playNext();
            }else{
                if (audioToPlay && audioToPlay.ended) {
                    playNext();
                } else if (!audioToPlay) {
                    playNext();
                } else {
                    log('wait!')
                }
            }


        }, fast);
    }
    initIntervarls(fast)

} // end start()

function preLoadAudio(qt) {
    log('preload init')
    for(let i=0; i < qt; i++){
        let pla = document.querySelector("audio[preload=none]");
        if(pla !== null){
            pla.setAttribute("preload","auto");
        }else{
            log('all audio has already been preloaded');
            break;
        }
    }
}

