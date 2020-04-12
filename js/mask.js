// Use promise
// Default place 22.998348, 120.212721
var maskUrl = "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";
loadData(maskUrl).then(function(response){
    var data = JSON.parse(response);
    var featureData = data.features;
    //console.log(featureData);
    // Update time
    var updateTime = featureData[0].properties.updated;
    setUpdateTime(updateTime);
    // Create map
    var map = L.map('mapid', {
        center: [22.998348, 120.212721],
        zoom: 16,
        preferCanvas: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // Create layerGroup
    var layGroup = L.layerGroup().addTo(map);
    var markers = data.features.map(function(feature){
        return L.marker(feature.geometry.coordinates.reverse());
    });
    layGroup.clearLayers();
    markers.forEach(function(marker){
        return layGroup.addLayer(marker);
    });
    //var latlongList = [22.999887, 120.219456];
    //var testArray = [[1,2], [2, 3], [3, 4]];
    //console.log(testArray);
    //featureData.forEach(function(oneData){
        //latlongList.push(oneData.geometry.coordinates);
        //var marks = L.marker(oneData.geometry.coordinates).addTo(map);
    //});
    //console.log(latlongList.slice(0,10));
    //var marker = L.circleMarker(latlongList).addTo(map);

    // Information of clients
    var testData = featureData.slice(200,210);
    console.log(testData);
    setStoreInfoCard(testData);
}, function(error){
    console.log(Error);
});
// function
// Promise reference :https://github.com/mdn/js-examples/blob/master/promises-test/index.html
function loadData(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(console.error("The data didn't load successfully."));
            }
        };
        xhr.onerror = function () {
            // xhr fails to begin with
            reject(console.error('There was a network error.'));
        };
        xhr.send();
    });
}
// View function
// Set update time
function setUpdateTime(updatedTime){
    var timelist = updatedTime.split(" ");
    var updateText = document.getElementById('update-time');
    updateText.textContent = timelist[1] + " 已更新";
}
// Set cards of client or store <- use this way will lag 1~3 sec. QQ
function setStoreInfoCard(storeData){
    var contentNode = document.querySelector('.content');
    // Before setting new info-card, delete all old info-cards.
    clearNode(contentNode);
    for (var j = 0; j < storeData.length; j++){
        var oneData = storeData[j];
        setContentCard(oneData, contentNode);
    }
}
function setContentCard(oneData, fatherNode){
    // one card
    var cardNode = document.createElement('DIV');
    cardNode.setAttribute('class', 'store-card');
    // masks of adult and child
    var numberNode = document.createElement('DIV');
    numberNode.setAttribute('class', 'number');
    var adultImg = document.createElement('IMG');
    var adultMask = document.createElement('P');
    var childImg = document.createElement('IMG');
    var childMask = document.createElement('P');
    adultMask.textContent = oneData.properties.mask_adult;
    childMask.textContent = oneData.properties.mask_child;
    // amount of mask (adult)
    if (oneData.properties.mask_adult > 1000){
        adultImg.setAttribute('src', 'images/adult_enough.png');
        adultMask.setAttribute('class', 'number-adult enough');
    } else if (oneData.properties.mask_adult <= 1000 && oneData.properties.mask_adult > 300){
        adultImg.setAttribute('src', 'images/adult_some.png');
        adultMask.setAttribute('class', 'number-adult some');
    } else if (oneData.properties.mask_adult <= 300 && oneData.properties.mask_adult > 0){
        adultImg.setAttribute('src', 'images/adult_less.png');
        adultMask.setAttribute('class', 'number-adult less');
    } else if (oneData.properties.mask_adult === 0){
        adultImg.setAttribute('src', 'images/adult_none.png');
        adultMask.setAttribute('class', 'number-adult none');
        adultMask.textContent = '售完';
    }
    // amount of mask (child)
    if (oneData.properties.mask_child > 1000) {
        childImg.setAttribute('src', 'images/child_enough.png');
        childMask.setAttribute('class', 'number-child enough');
    } else if (oneData.properties.mask_child <= 1000 && oneData.properties.mask_child > 300) {
        childImg.setAttribute('src', 'images/child_some.png');
        childMask.setAttribute('class', 'number-child some');
    } else if (oneData.properties.mask_child <= 300 && oneData.properties.mask_child > 0) {
        childImg.setAttribute('src', 'images/child_less.png');
        childMask.setAttribute('class', 'number-child less');
    } else if (oneData.properties.mask_child === 0){
        childImg.setAttribute('src', 'images/child_none.png');
        childMask.setAttribute('class', 'number-child none');
        childMask.textContent = '售完';
    }
    // This is not a good way to write the view. QQ
    var itemAdult = document.createElement('DIV');
    var itemChild = document.createElement('DIV');
    itemAdult.setAttribute('class', 'item');
    itemChild.setAttribute('class', 'item');
    itemAdult.appendChild(adultImg);
    itemAdult.appendChild(adultMask);
    itemChild.appendChild(childImg);
    itemChild.appendChild(childMask);
    numberNode.appendChild(itemAdult);
    numberNode.appendChild(itemChild);
    // split line
    var lineNode = document.createElement('DIV');
    lineNode.setAttribute('class', 'split-line');
    // information of store
    var infoNode = document.createElement('DIV');
    infoNode.setAttribute('class', 'store-info');
    var nameNode = document.createElement('H2');
    nameNode.textContent = oneData.properties.name;
    infoNode.appendChild(nameNode);
    aListText = ['藥局詳細', '撥打電話', '打開地圖'];
    for (var i = 0 ; i<3; i++){
        var aNode = document.createElement('A');
        aNode.textContent = aListText[i];
        aNode.setAttribute('href', '#');
        infoNode.appendChild(aNode);
    }
    // distance
    var distanceNode = document.createElement('DIV');
    distanceNode.setAttribute('class', 'distance');
    distanceNode.textContent = 'pass';
    // Combine all nodes
    cardNode.appendChild(numberNode);
    cardNode.appendChild(lineNode);
    cardNode.appendChild(infoNode);
    cardNode.appendChild(distanceNode);
    fatherNode. appendChild(cardNode);
}
// clear all children nodes
function clearNode(fatherNode) {
    while (fatherNode.firstChild) {
        fatherNode.removeChild(fatherNode.firstChild);
    }
}