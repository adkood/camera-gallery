// open dp
// create obectstore
// make transaction
let db;
let openRequest = indexedDB.open('myDataBase');
openRequest.addEventListener('success',(e)=>{
    console.log('success');
    db=openRequest.result;
});
openRequest.addEventListener('error',(e)=>{
    console.log('error');
});
openRequest.addEventListener('upgradeneeded',(e)=>{
    console.log('updated or initialized');
    db=openRequest.result;

    // object can be stored/modified inside upgredeneeded
    db.createObjectStore('video',{keyPath: 'id'});
    db.createObjectStore('image',{keyPath: 'id'}); 
});




