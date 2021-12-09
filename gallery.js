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
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                    <div class="media">
                    <video autoplay loop src="${url}"></video>
                    </div>
                    `;
            
                
                let galleryCont = document.querySelector('.gallery-cont');
                galleryCont.appendChild(mediaEle);
                
                // listeners
                
                let deleteBtn = mediaEle.querySelector('delete');
                let downloadBtn = mediaEle.querySelector('download');     
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
                        <div class="delete action-btn">DELETE</div>
                        <div class="download action-btn">DOWNLOAD</div>
                        <div class="media">
                        <video autoplay loop src="${u}"></video>
                        </div>
                        `;
                    let galleryCont = document.querySelector('.gallery-cont');
                    galleryCont.appendChild(mediaEle);
                });
            }
        }
    }
} , 100);