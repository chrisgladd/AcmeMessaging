/**
 * Controller for Photo
 */
function PhotoCtrl($scope) {
    var streaming = false,
    video        = $('.profile-video'),
    canvas       = $('.profile-canvas'),
    photo        = $('.profile-photo'),
    width = 200,
    height = 0;

    navigator.getMedia = ( navigator.getUserMedia || 
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

    navigator.getMedia(
        { 
            video: true, 
            audio: false 
        },
        function(stream) {
            if (navigator.mozGetUserMedia) { 
                video[0].mozSrcObject = stream;
            } else {
                var vendorURL = window.URL || window.webkitURL;
                video[0].src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
            }
            video[0].play();
        },
        function(err) {
            console.log("An error occured! " + err);
        });

    video.bind('canplay', function(ev){
        if (!streaming) {
            height = video[0].videoHeight / (video[0].videoWidth/width);
            video.css('width', width);
            video.css('height', height);
            canvas.css('width', width);
            canvas.css('height', height);
            streaming = true;
        }
    });

    $scope.takePhoto = function(event){
        event.preventDefault();
        event.stopPropagation();

        canvas[0].width = width;
        canvas[0].height = height;
        canvas[0].getContext('2d').drawImage(video[0], 0, 0, width, height);
        var data = canvas[0].toDataURL('image/png');
        $scope.profileSrc = data;
        //photo.setAttribute('src', data);
    };
}
PhotoCtrl.$inject = ['$scope'];

