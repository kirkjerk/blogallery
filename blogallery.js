document.addEventListener("DOMContentLoaded", function(event) { 
    const parserByTagType = {
            'IMG': (node, urlFullsize,caption) => {
                const imgSrc = node.getAttribute('src');                    
                return {
                    preview: imgSrc,
                    full: urlFullsize ? urlFullsize : imgSrc,
                    caption
                };
            },
            'A': (node, oldUrlFullsize,caption) => {
                const imgsInA = node.querySelectorAll("img");
                if(imgsInA.length > 0) {
                    const urlFullsize = node.getAttribute('href');
                    return attemptParse(imgsInA[0],urlFullsize,caption);
                }
                return null;
            },
            'FIGURE': (node) => {
               //assuming one figcaption
               const figcaptionNode = node.querySelector("figcaption");
               
               //we are assuming the first a href or img in there is the thing...               
               const children = node.querySelectorAll("a,img");
               return attemptParse(children[0],null,figcaptionNode?figcaptionNode.innerHTML:null);
               
            }
        };
    
    function attemptParse(node, urlFullsize, caption) {
        if(parserByTagType[node.nodeName]) {
            return parserByTagType[node.nodeName](node, urlFullsize, caption);   
        }
        return null;
    }
    
    
    const createBigGallery = (gallery, startingA) => {
        // should probably be factored to using a single array of 3 items each rather than parallel arrays....        
        const imgURLs = [];
        const previewImgURLs = [];
        const captions = [];
        let currentImgPtr = 0;
        
        const mainImageForNode = {};
        
        const updateImage = () => {
            const captionHTML = captions[currentImgPtr] ? `<div class="caption">${captions[currentImgPtr]}</div>` : ''
            document.getElementById('mini-gallery-image-wrap').innerHTML = `${captionHTML}<img onload="this.style.backgroundImage=null;" style="background-image: url(${previewImgURLs[currentImgPtr]})" src="${imgURLs[currentImgPtr]}">`;
        }
        
        const clickLeft = () => {
            currentImgPtr = currentImgPtr > 0 ? currentImgPtr - 1: imgURLs.length - 1;
            updateImage();
        }
        
        const clickRight = () => {
            currentImgPtr = currentImgPtr < imgURLs.length - 1 ? currentImgPtr + 1 : 0;   
            updateImage();
        }
        
        const clickClose = () => {
            document.getElementById('mini-gallery-viewer').remove();
        }
        
        const handleKey = (event) => {
            switch(event.code){
                case 'ArrowLeft': clickLeft(); break;
                case 'ArrowRight': clickLeft(); break;
                case 'Escape': clickClose(); break;
            }
        }
     
        
        const kidTags = gallery.children;
        const parseResults = Array.from(kidTags).map((node) => attemptParse(node)).filter(Boolean).forEach((info)=>{
                imgURLs.push(info.full);
                previewImgURLs.push(info.preview);
                captions.push(info.caption);
        });
                
        gallery.insertAdjacentHTML( 'beforeend', `
            <div id="mini-gallery-viewer" tabindex="1" class="blogallery-viewer">
                <div class='blogallery-sidebutton'>
                    <div class="topper"></div> 
                    <div class="action" id='mini-gallery-image-left'>&lt;</div>
                </div>
                <div class='img' id='mini-gallery-image-wrap'></div>
                <div class='blogallery-sidebutton'>
                    <div class="actiontopper topper" id='mini-gallery-close'>&#10006;</div> 
                    <div class="action"  id='mini-gallery-image-right'>&gt;</div>
                </div>
            </div>
        ` );
        
        document.getElementById('mini-gallery-image-left').addEventListener("click",clickLeft);
        document.getElementById('mini-gallery-image-right').addEventListener("click",clickRight);
        document.getElementById('mini-gallery-close').addEventListener("click",clickClose);
        document.getElementById('mini-gallery-viewer').addEventListener("keydown",handleKey);
        document.getElementById('mini-gallery-viewer').focus();
        
        currentImgPtr = imgURLs.findIndex((x) => x === startingA);
        updateImage();     
    };
    

    var galleries = document.querySelectorAll(".blogallery");
    Array.prototype.forEach.call(galleries, function(gallery, i){
        gallery.addEventListener("click", function(event) {
            if(gallery.classList.contains('blogallery')) { 
                gallery.classList.remove('blogallery'); 
            }   
        });    

        var kidNodes = gallery.children;  
        Array.prototype.forEach.call(kidNodes, function(node, i){
            if(node.nodeName === 'IMG'){
                node.style.cursor = 'pointer';    
            }
            if(node.nodeName === 'A' || node.nodeName === 'IMG' || node.nodeName === 'FIGURE'){
          
                const lookupFullsize = attemptParse(node);
                // if it's a link that doesn't have an image, just let it be...
                if(!   (node.nodeName === 'A' && (!lookupFullsize) )){
                    node.addEventListener("click", function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                        if(gallery.classList.contains('blogallery')){
                            gallery.classList.remove('blogallery'); 
                            node.scrollIntoView({behavior:'smooth'});
                        } else {
                            createBigGallery(gallery, lookupFullsize ? lookupFullsize.full:null);
                        }                   
                    });
                }      
            }
            
        });
    });            
});
