let video = document.querySelector('video');

let recordBtnCont = document.querySelector('.record-btn-cont');
let recordBtn = document.querySelector('.record-btn');
let captureBtnCont = document.querySelector('.capture-btn-cont');
let captureBtn = document.querySelector('.capture-btn');

let recorder;
let flag=false;

let constraints={
    video: true,
    audio: false
};

let chunks=[]; //media data

let timer=document.querySelector('.timer');
let hour=0;
let min=0;
let sec=0;

let its_time;
let color='transparent';

// navigator is a global object which stores the info of browser
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {

    video.srcObject=stream;
    recorder=new MediaRecorder(stream);

    recorder.addEventListener('start',()=>{
        chunks=[];
        its_time=setInterval(start_timer,1000);
        timer.style.visibility='visible';
    });

    recorder.addEventListener('dataavailable',(e)=>{
        chunks.push(e.data);
    });

    recorder.addEventListener('stop',()=>{

        // conversion of media chunks to vedio

        
        stop_timer();
        //reset the timer
        timer.innerHTML='00:00:00';
        hour=0;
        sec=0;
        min=0;
        timer.style.visibility='hidden';

        // blob is used to have the obj in file format
        let blob=new Blob(chunks, {type: 'vedio.mp4'});
        let vediourl=URL.createObjectURL(blob);

        //transaction
        if(db)
        {
            let videoId = shortid();
            let dbTransaction = db.transaction('video','readwrite');
            let videostore = dbTransaction.objectStore('video');
            videoEntry={
                id: `vid-${videoId}`,
                blobData: blob
            }
            videostore.add(videoEntry);
        }


    });

})

recordBtnCont.addEventListener('click', (e)=>{

    //this check is for the case when you click btn without the variable recorder being initiated because it is in a callback function  
    if(!recorder)
    return;

    flag=!flag;

    if(flag)
    {
        recorder.start();
        recordBtn.classList.add('scale-record');
    }
    else
    {
        recorder.stop();
        recordBtn.classList.remove('scale-record');
    }
});



function start_timer(){
    sec++;
    if(sec==60)
    {
        sec=0;
        min++;
        if(min==60)
        {
            min=0;
            hour++;
        }
    }

    hour=parseInt(hour);
    min=parseInt(min);
    sec=parseInt(sec);

    hour = (hour<10)? `0${hour}`:hour;
    min = (min<10)? `0${min}`:min;
    sec = (sec<10)? `0${sec}`:sec;

    timer.innerHTML=hour+':'+min+':'+sec;
};

function stop_timer(){
    clearInterval(its_time);
};

// for camera-----------------------------------------------------------------------------------------

captureBtnCont.addEventListener('click',(e)=>{

    captureBtn.classList.add('scale-capture');
    let canvas=document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool=canvas.getContext('2d');
    tool.drawImage(video,0,0,video.videoWidth,video.videoHeight);

    //to set filter
    tool.fillStyle=color;
    tool.fillRect(0,0,canvas.width,canvas.height);

    // to get url
    let imageurl= canvas.toDataURL();

    // transaction
    if(db)
    {
        let imageId=shortid();
        let dbtransaction = db.transaction('image','readwrite');
        let imageObject = dbtransaction.objectStore('image');
        imageEntry={
            id: `img-${imageId}`,
            url: imageurl
        }
        imageObject.add(imageEntry);
    }

    // let a=document.createElement('a');
    // a.href=imageurl;
    // a.download= 'image.jpeg';
    // a.click(); 
});

// for implementing filter

let filter1=document.querySelector('.filter1');
let filter2=document.querySelector('.filter2');
let filter3=document.querySelector('.filter3');
let filter4=document.querySelector('.filter4');
let filterlayer=document.querySelector('.filter-layer');


filter1.addEventListener('click',(e)=>{
    color='transparent';
    filterlayer.style.backgroundColor=color;
}); 

filter2.addEventListener('click',(e)=>{
    color=getComputedStyle(filter2,null).getPropertyValue('background-color');
    filterlayer.style.backgroundColor=color;
}); 

filter3.addEventListener('click',(e)=>{
    color=getComputedStyle(filter3,null).getPropertyValue('background-color');
    filterlayer.style.backgroundColor=color;
}); 

filter4.addEventListener('click',(e)=>{
    color=getComputedStyle(filter4,null).getPropertyValue('background-color');
    filterlayer.style.backgroundColor=color;
}); 

