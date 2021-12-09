// console.log('hello');
setTimeout(() => {     //As code take time to load the content settimeout is used to fool the code
    if (db) {
        let dbtransaction = db.transaction('video', 'readonly');
        let vedioStore = dbtransaction.objectStore('video');
        let videoRequest = vedioStore.getAll();
        //event driven
        videoRequest.onsuccess = (e) => {

            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) => {

                let mediaEle = document.createElement('div');
                mediaEle.setAttribute('class', 'media-cont');
                mediaEle.setAttribute('id', videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaEle.innerHTML = `
                <div class="media">
                <video autoplay loop src="${url}"></video>
                </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                    `;


                let galleryCont = document.querySelector('.gallery-cont');
                galleryCont.appendChild(mediaEle);

                // listeners

                let deleteBtn = mediaEle.querySelector('.delete');
                deleteBtn.addEventListener('click', deleteListener);
                let downloadBtn = mediaEle.querySelector('.download');
                downloadBtn.addEventListener('click', downloadListener);
            });


            // for image
            let imagetransaction = db.transaction('image', 'readonly');
            let imageStore = imagetransaction.objectStore('image');
            let imageRequest = imageStore.getAll();
            //event driven
            imageRequest.onsuccess = (e) => {

                let imageResult = imageRequest.result;
                imageResult.forEach((imageObj) => {

                    let mediaEle = document.createElement('div');
                    mediaEle.setAttribute('class', 'media-cont');
                    mediaEle.setAttribute('id', imageObj.id);

                    let u = imageObj.url;

                    mediaEle.innerHTML = `
                    <div class="media">
                    <image src="${u}"/>
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                        `;
                    let galleryCont = document.querySelector('.gallery-cont');
                    galleryCont.appendChild(mediaEle);

                    //event listeners
                    let deleteBtn = mediaEle.querySelector('.delete');
                    deleteBtn.addEventListener('click', deleteListener);
                    let downloadBtn = mediaEle.querySelector('.download');
                    downloadBtn.addEventListener('click', downloadListener);
                });
            }
        }
    }
}, 100);

function deleteListener(e) {
    let id=e.target.parentElement.getAttribute('id');
    let type=id.slice(0,3);

    // removing from db
    if(type === 'img')
    {
        let imageTransaction = db.transaction('image', 'readwrite');
        let imageStore = imageTransaction.objectStore('image');
        imageStore.delete(id);

    }
    else
    {
        let videoTransaction = db.transaction('video', 'readwrite');
        let videoStore = videoTransaction.objectStore('video');
        videoStore.delete(id);
    }

    // removing from ui
    e.target.parentElement.remove();
}

function downloadListener(e){

    let id=e.target.parentElement.getAttribute('id');
    let type=id.slice(0,3);

    if(type === 'img')
    {
        let imageTransaction = db.transaction('image', 'readwrite');
        let imageStore = imageTransaction.objectStore('image');
        imageRequest = imageStore.get(id);

        imageRequest.onsuccess=(e)=>{
            let imageResult = imageRequest.result;

            let a=document.createElement('a');
            a.href=imageResult.url;
            a.download='image.jpg';
            a.click();
        };
    }
    else
    {
        let videoTransaction = db.transaction('video', 'readwrite');
        let videoStore = videoTransaction.objectStore('video');
        videoRequest = videoStore.get(id);

        videoRequest.onsuccess=(e)=>{
            let videoResult = videoRequest.result;

            let videourl=URL.createObjectURL(videoResult.blobData);
            let a=document.createElement('a');
            a.href=videourl;
            a.download='stream.mp4';
            a.click();
        };
    }

}