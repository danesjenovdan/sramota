function getWeekRepresentation(date) {
    const start = moment(date).startOf('week')
    const end = moment(date).endOf('week')

    return `Teden ${start.format('D. M. YYYY')} - ${end.format('D. M. YYYY')}`
}

function getWeekId(date) {
    const start = moment(date).startOf('week')
    const end = moment(date).endOf('week')

    return `${moment(date).isoWeekYear()}-${moment(date).isoWeek()}`;
}

function getTimelineWeekIndex(date) {

}

function groupByWeek(items) {
    console.log(items);
    console.log('HERE')
    grouped = items.reduce((acc, item) => {
        const date = item.date_object;
        const yearWeek = `${moment(date).isoWeekYear()}-${moment(date).isoWeek()}`; 

        if (!acc[yearWeek]) {
            acc[yearWeek] = [];
        }

        acc[yearWeek].push(item);

        return acc;
    }, {});

    ordered = Object.keys(grouped).sort(
        (a, b) => {
            [aYear, aWeek] = a.split('-');
            [bYear, bWeek] = b.split('-');

            yearDiff = parseInt(aYear) - parseInt(bYear);
            weekDiff = parseInt(aWeek) - parseInt(bWeek);

            if (yearDiff === 0) {
                return weekDiff;
            }

            if (weekDiff === 50) {
                return -yearDiff
            }
            return yearDiff;
        }
    ).reduce(
        (obj, key) => {
            obj[key] = grouped[key];
            return obj;
        }, {}
    );
    return ordered;
}

app.controller('MainCtrl', function ($scope, $http, $q, $timeout, $sce, $location, $anchorScroll) {
    const cs = d3.scale.category20();
    const cs2 = d3.scale.linear().range(["#aaa", "#000", ]);
    const cs3 = d3.scale.linear().range(["#ffffff", "#0000ff"]);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    Wade.config.punctuationRE = /[.!?,;:"']/g;
    $scope.searchQuery = "";
    $scope.isFiltered = false;
    $scope.langs = {
        "de": "nemščina",
        "en": "angleščina",
        "it": "italijanščina",
        "pt": "portugalščina",
        "fr": "francoščina",
        "hr": "hrvaščina",
        "es": "španščina",
        "da": "danščina",
        "cs": "češčina",
        "hu": "madžarščina",
        "nl": "nizozemščina",
        "ro": "romunščina",
        "sh": "albanščina",
        "sv": "slovaščina",
        "pl": "poljščina",
        "ja": "japonščina",
        "sr": "srbščina",
        "fi": "finščina",
        "bs": "bosanščina",
        "id": "indonezijščina",
        "zh": "kitajščina",
        "sk": "slovaščina",
        "ru": "ruščina",
        "sl": "slovenščina",
        "sq": "albanščina",
        "no": "norveščina"
    }
    $scope.lang_array = [{
            lang: "de",
            name: "nemščina"
        },
        {
            lang: "en",
            name: "angleščina"
        },
        {
            lang: "it",
            name: "italijanščina"
        },
        {
            lang: "pt",
            name: "portugalščina"
        },
        {
            lang: "fr",
            name: "francoščina"
        },
        {
            lang: "hr",
            name: "hrvaščina"
        },
        {
            lang: "es",
            name: "španščina"
        },
        {
            lang: "da",
            name: "danščina"
        },
        {
            lang: "cs",
            name: "češčina"
        },
        {
            lang: "hu",
            name: "madžarščina"
        },
        {
            lang: "nl",
            name: "nizozemščina"
        },
        {
            lang: "ro",
            name: "romunščina"
        },
        {
            lang: "sh",
            name: "albanščina"
        },
        {
            lang: "sv",
            name: "slovaščina"
        },
        {
            lang: "pl",
            name: "poljščina"
        },
        {
            lang: "ja",
            name: "japonščina"
        },
        {
            lang: "sr",
            name: "srbščina"
        },
        {
            lang: "fi",
            name: "finščina"
        },
        {
            lang: "bs",
            name: "bosanščina"
        },
        {
            lang: "id",
            name: "indonezijščina"
        },
        {
            lang: "zh",
            name: "kitajščina"
        },
        {
            lang: "sk",
            name: "slovaščina"
        },
        {
            lang: "ru",
            name: "ruščina"
        },
        {
            lang: "sl",
            name: "slovenščina"
        },
        {
            lang: "sq",
            name: "albanščina"
        },
        {
            lang: "no",
            name: "norveščina"
        }
    ]
    $scope.eras = {
        1: {
            name: "čestitke Trumpu",
            start: new Date("Nov 1 2020"),
            end: new Date("Nov 11 2020")
        },
        2: {
            name: "vladavina prava",
            start: new Date("Nov 1 2020"),
            end: new Date("Nov 11 2020")
        },
        3: {
            name: "non-paper",
            start: new Date("Nov 1 2020"),
            end: new Date("Nov 11 2020")
        },
        4: {
            name: "pregon tiska in STA",
            start: new Date("Nov 1 2020"),
            end: new Date("Nov 11 2020")
        }
    }
    $scope.lang = {
        name: "jeziku"
    };
    $scope.era = {
        name: "obdobju"
    };

    $scope.domainMap = {
        'de': 'Nemčija',
        'fr': 'Francija',
        'org': 'Mednarodno',
        'com': 'Mednarodno',
        'tr': 'Turčija',
        'hu': 'Madžarska',
        'fi': 'Finska',
        'ba': 'Bosna in Hercegovina',
        'al': 'Albanija',
        'rs': 'Srbija',
        'net': 'Mednarodno',
        'mk': 'Makedonija',
        'es': 'Španija',
        'eu': 'Evropska unija',
        'news': 'Mednarodno',
        'bg': 'Bolgarija',
        'it': 'Italija',
        'sk': 'Slovaška',
        'at': 'Avstrija',
        'ch': 'Češka',
        'hr': 'Hrvaška',
        'pl': 'Poljska',
        'nl': 'Nizozemska',
        'si': 'Slovenija',
        'edu': 'Mednarodno',
        'pt': 'Portugalska',
        'ca': 'Kanada',
        'br': 'Brazilija',
        'gt': 'Guatemala',
        'mx': 'Mehika',
        'be': 'Belgija',
        'ru': 'Rusija',
        'dk': 'Danska',
        'jp': 'Japonska',
        'za': 'Republika Južna Afrika'
    };

    $scope.load_source = function (e) {
        let r0 = $http.get("data/news_twito_edited.json");
        let r1 = $http.get("data/timeline.json");

        $q.all([r0, r1])
            .then(function (res) {
                $scope.timeline = res[1].data;
                $scope.timeline.forEach(d => {
                    date_object = new Date(d.date);
                    d.weekId = getWeekId(date_object);
                });
                $scope.filteredTimeline = {}
                Object.assign($scope.filteredTimeline, $scope.timeline);
                $scope.all_news = res[0].data
                    .filter((d) => {
                        return (d !== null) && (!d.slo) && (!d.date.includes('2019'));
                    });
                $scope.all_news
                    .forEach(d => {
                        //let k = d.date.split(" ")
                        if (d.title_parsed === undefined) d.title_parsed = d.title
                        d.date_object = new Date(d.date)

                        d.date = d.date_object.getDate() + ". " + (d.date_object.getMonth() + 1) + ". " + d.date_object.getFullYear()
                        d.desc = d.desc
                            .replace("Janez Janša", "<b>Janez Janša</b>")
                            .replace("Janez Jansa", "<b>Janez Jansa</b>")
                            .replace("Janša", "<b>Janša</b>")
                            .replace("Jansa", "<b>Jansa</b>")

                        // ADD DOMAIN INFO
                        // currentDomain = d.link.split('://')[1].split('/')[0].split('.').pop()
                        currentDomain = d.domain.split('.').pop()
                        d.domainBasedCountry = Object.keys($scope.domainMap).includes(currentDomain) ? $scope.domainMap[currentDomain] : currentDomain;
                        d.favicon = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + d.domain;
                        d.week = getWeekRepresentation(d.date_object);
                        d.weekId = getWeekId(d.date_object);
                        d.translateLink = `https://translate.google.com/translate?sl=auto&tl=sl&u=${encodeURIComponent(d.link)}`;
                    })
                $scope.all_news = $scope.all_news.filter(d => d.lang !== "sl")
                $scope.all_news = $scope.all_news.sort((a, b) => b.date_object - a.date_object)
                $scope.news = $.extend(true, [], $scope.all_news)
                $scope.searchIndex = Wade($scope.news.map(d => {
                    return d.title + " " + d.desc + " "
                })); // + d.content

                $scope.groupedNews = groupByWeek($scope.all_news);
                $scope.groupKeys = Object.keys($scope.groupedNews);
            })
    };
    $timeout($scope.load_source(), 2000);
    $scope.load_source()

    $scope.filter_lang = function (lang) {
        $scope.era.name = "obdobju"
        if (lang === "all") {
            $scope.lang.name = "jeziku"
            $scope.news = $.extend(true, [], $scope.all_news)
                .sort((a, b) => b.date_object - a.date_object);
        } else {
            $scope.lang.name = $scope.langs[lang]
            $scope.news = $.extend(true, [], $scope.all_news)
                .filter(d => d.lang === lang)
                .sort((a, b) => b.date_object - a.date_object);
        }
        $scope.groupedNews = groupByWeek($scope.news);
        $scope.groupKeys = Object.keys($scope.groupedNews);
    }

    $scope.filter_era = function (era) {
        $scope.lang.name = "jeziku"
        if (era === 0) {
            $scope.era.name = "obdobju"
            $scope.news = $.extend(true, [], $scope.all_news)
                .sort((a, b) => b.date_object - a.date_object);
        } else {
            switch (era) {
                case 1:
                    console.log('THERE')
                    $scope.era.name = $scope.eras[era].name
                    $scope.news = $.extend(true, [], $scope.all_news)
                        .filter(d => d.date_object > new Date("Nov 1 2020") && d.date_object < new Date("Nov 10 2020"))
                        .sort((a, b) => b.date_object - a.date_object);

                    d1 = new Date("Nov 1 2020");
                    d2 = new Date("Nov 10 2020")
                    ids = [];
                    for (var d = d1; d <= d2; d.setDate(d.getDate() + 1)) {
                        weekNumber = moment(d).week()
                        if (!ids.includes(weekNumber + 2)) {
                            ids.push(weekNumber + 2);
                        }
                    }

                    // $scope.timeline[0].values.forEach((week, i) => {
                    //     if (!ids.includes(i)) {
                    //         // console.log($scope.filteredTimeline[0].values[i]);
                    //         $scope.filteredTimeline[0].values[i].y = 0;
                    //     }
                    // });
                    // $scope.filteredTimeline[0].values = $scope.timeline[0].values.filter((e, i) => {
                    //     // d1 = new Date("Nov 1 2020");
                    //     // d2 = new Date("Nov 10 2020")
                    //     // ids = [];
                    //     // for (var d = d1; d <= d2; d.setDate(d.getDate() + 1)) {
                    //     //     weekNumber = moment(d).week() //.numberOf('week');
                    //     //     if (!ids.includes(weekNumber + 2)) {
                    //     //         ids.push(weekNumber + 2);
                    //     //     }
                    //     // }
                    //     // console.log(ids, i);
                    //     // console.log(ids.includes(i));
                    //     return ids.includes(i);

                    //     // weekNumber = i + 2;
                    //     // yearNumber = 2020
                    //     // if (weekNumber > 52) {
                    //     //     weekNumber = weekNumber - 52;
                    //     //     yearNumber = 2021
                    //     // }
                    //     // weekId = `${yearNumber}-${weekNumber}`
                    //     // $location.hash(weekId);
                    //     // $anchorScroll.yOffset = 240;
                    //     // $anchorScroll();
                    // })
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }

        }
        $scope.groupedNews = groupByWeek($scope.news);
        $scope.groupKeys = Object.keys($scope.groupedNews);
    }


    $scope.filterResults = function () {
        if ($scope.searchQuery.length > 0) {
            let results = $scope.searchIndex($scope.searchQuery);
            let searchHits = [];
            results
                .forEach(d => {
                    searchHits.push($scope.news[d.index])
                });
            $scope.news = $.extend(true, [], searchHits).sort((a, b) => b.date_object - a.date_object);
        } else {
            $scope.news = $.extend(true, [], $scope.all_news).sort((a, b) => b.date_object - a.date_object);
        }

    }

    $scope.reset = function () {
        $scope.news = $.extend(true, [], $scope.all_news).sort((a, b) => b.date_object - a.date_object);
        $scope.isFiltered = false;


        //setTimeout(() => {$anchorScroll();}, 400)

    }

    $scope.muloptions = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 200,
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value
            },
            showControls: false,
            showLegend: true,
            showValues: true,
            valueFormat: (d) => d, //d3.format(',.1f')(d),
            keyFormat: (d) => d.slice(0, 20),
            //yDomain: [-0.9, 0.9],
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            showYAxis: false,
            yAxis: {
                axisLabel: 'Število',
                tickFormat: function (d) {
                    return d;
                }
            },
            margin: {
                top: 20,
                right: 20,
                bottom: 45,
                left: 180
            },
        }
    };

    $scope.multibar_options_date = {
        chart: {
            type: 'multiBarChart',
            height: 150,
            showControls: false,
            showLegend: false,
            margin: {
                top: 20,
                right: 20,
                bottom: 45,
                left: 25
            },
            tooltip: {
                contentGenerator: function (d) {
                    console.log(d);
                    _date = new Date(d.data.x);
                    return `
                        <p>${getWeekRepresentation(_date)}</p>
                        <p>Število člankov <b>${d.data.y}</b></p>
                    `;
                },
            },
            reduceXTicks: true,
            clipEdge: true,
            duration: 500,
            stacked: false,
            callback: function (chart) {
                chart.multibar.dispatch.on('elementClick', function (e) {
                    d3.selectAll(".nv-bar").style("fill", function (d, i) {
                        d.spike = false;
                    });
                    // $scope.interval = [new Date(e.data.x), new Date(e.data.x + 604800000)]
                    // $scope.interval_d = [
                    //     $scope.interval[0].getDate() + ". " + ($scope.interval[0].getMonth() + 1) + ". " + $scope.interval[0].getFullYear(),
                    //     $scope.interval[1].getDate() + ". " + ($scope.interval[1].getMonth() + 1) + ". " + $scope.interval[1].getFullYear(),
                    // ]
                    // $scope.news = $.extend(true, [], $scope.all_news)
                    //     .filter(d => {
                    //         return d.date_object >= $scope.interval[0] && d.date_object <= $scope.interval[1]
                    //     })
                    // $scope.isFiltered = true;
                    // $scope.$apply()

                    e.data.spike = true

                    d3.selectAll(".nv-bar").style("fill", function (d, i) {
                        return d.spike ? '#b3043a' : '#666666'; //"#b54748":"#666666";
                    });

                    console.log(e);
                    _date = new Date(e.data.x);
                    weekNumber = e.index;
                    // yearNumber = 2020
                    // if (weekNumber > 52) {
                    //     weekNumber = weekNumber - 52;
                    //     yearNumber = 2021
                    // }
                    weekId = getWeekId(_date);//`${yearNumber}-${weekNumber}`
                    $location.hash(weekId);
                    $anchorScroll.yOffset = 240;
                    $anchorScroll();
                });
            },
            xAxis: {
                axisLabel: '',
                showMaxMin: false,
                tickFormat: function (d) {
                    //console.log(d, new Date(d))
                    return d3.time.format('%d. %m. %Y')(new Date(d));
                }
            },
            yAxis: {
                axisLabel: '',
                axisLabelDistance: -20,
                tickFormat: function (d) {
                    return d; //d3.format(',.1f')(d);
                }
            }
        },
        title: {
            enable: true,
            text: "Število prispevkov po tednih",
            className: "h4"
        },
    };

    $scope.renderHtml = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };
});
/*
https://docs.mapbox.com/help/tutorials/mapbox-gl-js-expressions/
https://joeyklee.github.io/geosandbox/hello-turf.html#section9
 */


/* SOCIAL */
var link = document.location.href;
$.ajax({
    method: 'POST',
    url: 'https://djnd.si/yomamasofat/',
    data: {
        fatmama: document.location.href,
    },
    success: function (resp) {
        link = resp;
    }
});

// TODO
var title = 'Mednarodna sramota';
var text = 'Odstopi sramota!';
var hashtags = '#sramota';
//social
$('.js-facebook').on('click', function () {
    var url = 'https://www.facebook.com/dialog/feed?app_id=301375193309601&redirect_uri=' + encodeURIComponent(document.location.href) + '&link=' + encodeURIComponent(document.location.href) + '&ref=responsive&name=' + encodeURIComponent(title);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'facebook');
    return false;
});
$('.js-twitter').on('click', function () {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + hashtags + ' ' + link);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'twitter');
    return false;
});
// $('.js-gplus').on('click', function () {
//     var url = 'https://plus.google.com/share?url=' + encodeURIComponent(document.location.href);
//     window.open(url, '_blank');
//     // ga('send', 'event', 'social', 'gplus');
//     return false;
// });
$('.js-email').on('click', function () {
    var url = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + text + ' ' + encodeURIComponent(document.location.href);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'email');
    return false;
});
$('.doniraj').on('click', function() {
    var url = 'https://danesjenovdan.si/doniraj/placaj/mesecno';
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'email');
    return false;
});
/* END SOCIAL */