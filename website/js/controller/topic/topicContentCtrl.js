app.controller('topicContentCtrl', ['$scope', '$state', '$rootScope', '$location', '$stateParams', 'UserService', '$filter', '$sce', '$window', '$interval', function($scope, $state, $rootScope, $location, $stateParams, UserService, $filter, $sce, $window, $interval) {

    $scope.isContent = true;
    /**
     *Content array
     */
    $scope.direct = [];

    /**
     *Get Category Content
     *@param category = contentLinking[] data
     *@param $event = clicked element
     */
    $scope.getCategoryContent = function(category, topicId) {
        var data = {
            categoryId: category._id,
            topicId: topicId
        }

        $scope.subCategoryActive = false;

        $scope.isLoading = true;
        UserService.getCategoryContent(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == 200) {
                    if (category.isFree || category.isPurchased) {
                        $scope.direct = res.data.contentLinking[0].direct;
                        /*Get content*/
                        if ($scope.direct.length > 0) {
                            $scope.getContent($scope.direct[0].content);
                            $scope.isContent = true;
                        } else {
                            $scope.isContent = false;
                            if (res.data.contentLinking[0].subCategory.length > 0) {
                                $scope.getSubCategoryContent(category, res.data.contentLinking[0].subCategory[0]);
                            } else {
                                $scope.direct = [];
                                $scope.content = {
                                    isShow: false
                                };
                            }

                        }

                    } else {
                        $scope.direct = [];
                        $scope.content = {
                            isShow: false
                        };
                        $scope.isContent = false;
                        $scope.contentIcon = res.data.contentLinking[0].direct[0].content.icon;
                    }
                    $scope.subcategories = res.data.contentLinking[0].subCategory;
                    $scope.showSubCategory = category._id;
                }
            });
    }


    /**
     *Get Subcategory Content
     *@param category = contentLinking[] data
     *@param subcategory = subcategories[] data
     *@param $event = clicked element
     */
    $scope.getSubCategoryContent = function(category, subcategory) {
        var data = {
            subCategoryId: subcategory.subCategoryId
        }

        $scope.subCategoryActive = subcategory.subCategoryId;

        $scope.isLoading = true;
        UserService.getSubCategoryContent(data)
            .then(function(res) {
                $scope.isLoading = false;
                if (res.data.statusCode == 200) {
                    if (category.isFree || category.isPurchased) {
                        $scope.direct = res.data.content;
                        /*Get content*/
                        if ($scope.direct.length > 0) {
                            $scope.getContent($scope.direct[0].content);
                            $scope.isContent = true;
                        } else {
                            $scope.isContent = false;
                        }

                    } else {
                        $scope.direct = [];
                        $scope.content = {
                            isShow: false
                        };
                        $scope.isContent = false;
                        $scope.contentIcon = res.data.content[0].content.icon;
                    }
                }
            });
    }

    /**
     *Load content when page load
     *@id = category parent element id
     *@data = content category data
     */
    $scope.loadContent = function(id, data, topicId) {
        $scope.$parent.categoryColors(id);
        var loop = true;
        angular.forEach(data, function(value, key) {
            if (loop) {
                if (key == 'Video' && (value.isFree || value.isPurchased)) {
                    loop = false;
                    $scope.getCategoryContent(value, topicId);
                } else if (value.isFree || value.isPurchased) {
                    loop = false;
                    $scope.getCategoryContent(value, topicId);
                }
            }
        });
        if (loop) {
            $scope.getCategoryContent(data['Video'], topicId);
        }

    }


    /**
     *Object for content
     */
    $scope.content = {
        isShow: false
    };


    /**
    *content navigation
    */
    $scope.contentNavigation = function(type){
        var keepGoing = true;
        angular.forEach($scope.direct, function(value, key) {
            if(value.content._id==$scope.content.id && keepGoing){
                if(type=='NEXT' && (key+1) < $scope.direct.length){
                    $scope.getContent($scope.direct[parseInt(key)+1].content);
                    keepGoing = false;
                }
                if(type=='PREV' && key > 0){
                    $scope.getContent($scope.direct[parseInt(key)-1].content);
                    keepGoing = false;
                }
            }
        })
        
    }

    /**
     *Get topic content
     *@param data = direct[] data
     */
    $scope.getContent = function(data) {
        angular.forEach($scope.direct, function(value, key) {
            if(value.content._id == data._id){
                if(key==0){
                    $scope.isFirst = false;
                    $scope.isLast = true;
                }else if(key==($scope.direct.length-1)){
                    $scope.isFirst = true;
                    $scope.isLast = false;
                }else{
                    $scope.isFirst = true;
                    $scope.isLast = true;
                }
            }
        });


        if ($scope.content.url == data.contentUrl) {
            return false;
        }

        $scope.content.id = data._id;
        $scope.content.title = data.title;
        $scope.content.type = data.typeOfContent;
        $scope.content.description = data.description;
        $scope.content.isShow = true;

        if (data.contentUrl) {
            /**
             * Get video content
             */
            if (data.typeOfContent == 'video') {
                if (data.embeddedLink) {
                    $scope.isEmbeddedLink = true;
                    $scope.embeddedLinkUrl = 'https://' + $location.$$host + '/api/#/v/' + $scope.user.id + '/' + $scope.content.id;
                } else {
                    jwplayer('myplayer').stop();
                    $scope.isEmbeddedLink = false;
                    $scope.embeddedLinkUrl = false;
                }
                $scope.getVideoContent(data);
            } else {
                $scope.isEmbeddedLink = false;
                $scope.embeddedLinkUrl = false;
            }

            /**
             *Get iframe content
             */
            if (data.typeOfContent == 'text' || data.typeOfContent == 'zip') {
                $scope.getIframeContent(data);
            }

            /**
             *Get image content
             */
            if (data.typeOfContent == 'image') {
                $scope.getImageContent(data);
            }

            /**
             *Get pdf content
             */
            if (data.typeOfContent == 'pdf') {
                $scope.getPDFContent(data);
            } else {
                $scope.pdfUrl = false;
                $scope.isPdfLoading = false;
            }

            /**
             *Get epub content
             */
            if (data.typeOfContent == 'epub') {
                $scope.getEPUBContent(data);
            }
        }
    }

    /**
     *Get topic video content
     *@param data = direct[] data
     */
    $scope.getVideoContent = function(data) {
        $scope.isContentLoad = false;
        $scope.content.url = data.contentUrl;
    }

    /**
     *Get topic image content
     *@param data = direct[] data
     */
    $scope.getImageContent = function(data) {
        $scope.isContentLoad = true;
        $scope.content.url = data.contentUrl;
    }

    /**
     *Get topic iframe content
     *@param data = direct[] data
     */
    $scope.getIframeContent = function(data) {
        $scope.isContentLoad = true;
        $scope.content.url = $sce.trustAsResourceUrl(data.contentUrl);
    }

    /**
     *Get topic pdf content
     *@param data = direct[] data
     */
    $scope.getPDFContent = function(data) {
        $scope.isContentLoad = false;
        $scope.content.url = data.contentUrl;
        $scope.loadPDF($sce.trustAsResourceUrl(data.contentUrl));
    }

    /**
     *Get topic pdf content
     *@param data = direct[] data
     */
    $scope.getEPUBContent = function(data) {
        $('#ePubFileViewer').html('');
        $scope.content.url = data.contentUrl;
        $scope.ePubFile = ePub($scope.content.url);
        $scope.ePubFile.renderTo('ePubFileViewer');
        $scope.isContentLoad = true;
        var epubLoader;
        epubLoader = $interval(function() {
            if ($scope.ePubFile.isRendered == true) {
                $scope.isContentLoad = false;
                $scope.epubFileSize('ePubFileViewer');
                $interval.cancel(epubLoader);
            }
        }, 500);
    }



    /**
     *Load iframe, content callback
     */
    $scope.dataLoadCallBack = function() {
        $scope.isContentLoad = false;
        $scope.$apply();
    }



    /**
     *Owl Crausal
     *@param id = owl carousel element id
     */
    $scope.finishContent = function(id) {
        var owl = $('#' + id);
        owl.trigger('destroy.owl.carousel');
        owl.owlCarousel({
            loop: false,
            margin: 5,
            nav: true,
            dots: false,
            mouseDrag: true,
            responsive: {
                0: {
                    items: 2
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 4
                }
            }
        });
        $('.owl-stage-outer').parents('.owl-item').remove();
        owl.trigger('refresh.owl.carousel');
    }



    angular.element($window).bind('resize', function() {
        $scope.epubFileSize('ePubFileViewer');
    });

    $('html').removeClass('full-screen-content');

    $scope.fullScreen = function() {
        $('html').toggleClass('full-screen-content');
        if ($('html').hasClass('full-screen-content')) {
            $scope.isFullScreen = true;
        } else {
            $scope.isFullScreen = false;
        }

        $scope.epubFileSize('ePubFileViewer');

    }

    $scope.$on('$locationChangeStart', function(event, next, current) {
        if ($scope.isFullScreen) {
            event.preventDefault();
            $('html').removeClass('full-screen-content');
            $scope.isFullScreen = false;
        }
    });


    /**************************************************************************

    ###########################     Epub viewer    ############################

    ***************************************************************************/

    /**
     *Epub file resize
     *@param id = element height
     */
    $scope.epubFileSize = function(id) {
        if ($scope.content.type == 'epub') {
            var height = (parseInt($('#' + id).width()) / 3) * 4;
            $('#' + id).css({ 'height': height + 'px' });
        }
    }


    /**
     *Get epub viewer next page
     */
    $scope.getEPubNextPage = function() {
            $scope.ePubFile.nextPage();
        }
        /**
         *Get epub viewer previous page
         */
    $scope.getEPubPrevPage = function() {
        $scope.ePubFile.prevPage()
    }


    /**************************************************************************

    #############################     PDF viewer    ############################

    ***************************************************************************/
    $scope.downloadProgress = 0;
    $scope.pdfZoomLevels = [];
    $scope.pdfViewerAPI = {};
    $scope.pdfScale = 1;
    $scope.pdfFile = null;
    $scope.pdfTotalPages = 0;
    $scope.pdfCurrentPage = 0;
    $scope.onPDFProgress = function(operation, state, value, total, message) {
        if (operation === "render" && value === 1) {
            if (state === "success") {
                if ($scope.pdfZoomLevels.length === 0) {
                    var lastScale = 0.1;
                    do {
                        var curScale = $scope.pdfViewerAPI.getNextZoomInScale(lastScale);
                        if (curScale.value === lastScale) {
                            break;
                        }

                        $scope.pdfZoomLevels.push(curScale);

                        lastScale = curScale.value;
                    } while (true);
                }

                $scope.pdfCurrentPage = 1;
                $scope.pdfTotalPages = $scope.pdfViewerAPI.getNumPages();
                $scope.pdfScale = $scope.pdfViewerAPI.getZoomLevel();
                $scope.isPdfLoading = false;
            } else {
                $scope.isPdfLoading = false;
            }
        } else if (operation === "download" && state === "loading") {
            $scope.downloadProgress = (value / total) * 100.0;
        } else {
            if (state === "failed") {
                $scope.isPdfLoading = false;
            }
        }
    };

    $scope.onPDFZoomLevelChanged = function() {
        $scope.pdfViewerAPI.zoomTo($scope.pdfScale);
    };

    $scope.onPDFPageChanged = function() {
        $scope.pdfViewerAPI.goToPage($scope.pdfCurrentPage);
    };

    $scope.zoomIn = function() {
        var nextScale = $scope.pdfViewerAPI.getNextZoomInScale($scope.pdfScale);
        $scope.pdfViewerAPI.zoomTo(nextScale.value);
        $scope.pdfScale = nextScale.value;
    };

    $scope.zoomOut = function() {
        var nextScale = $scope.pdfViewerAPI.getNextZoomOutScale($scope.pdfScale);
        $scope.pdfViewerAPI.zoomTo(nextScale.value);
        $scope.pdfScale = nextScale.value;
    };

    $scope.loadPDF = function(url) {
        if ($sce.valueOf($scope.pdfURL) === $sce.valueOf(url)) {
            return;
        } else {
            $scope.isPdfLoading = true;
            $scope.downloadProgress = 0;
            $scope.pdfZoomLevels = [];
            $scope.pdfFile = null;
            $scope.pdfURL = url;
        }
    };



    angular.element($window).on('keydown', function(e) {

        var code = e.keyCode || e.which;
        if (code == 27) {
            $('html').removeClass('full-screen-content');
            $scope.isFullScreen = false;
            $scope.epubFileSize('ePubFileViewer');
        }

    });


    $scope.$on('$locationChangeStart', function(event, next, current) {
        $scope.isEmbeddedLink = false;
        jwplayer('myplayer').setup({
            file: '',
        });
        jwplayer('myplayer').stop();
    });


    $scope.copyToClipboard = function(element) {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    }



}]);
