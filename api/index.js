const express = require("express");
const router = express.Router();
const fetch = require('node-fetch')
const cheerio = require('cheerio')
var fs = require('fs')

const port = process.env.PORT || 8080;

function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
    if (!req.query.date) {
        req.query.date = padLeadingZeros(new Date().getDate(), 2) + '' + padLeadingZeros((new Date().getMonth() + 1), 2) + '' + (new Date().getFullYear() + 543)
    }
    if (req.query.date.substring(4, 8) == new Date().getFullYear() + 543) {
        if (req.query.from !== undefined) {
            fetch('http://localhost:' + port + '/index2?date=' + req.query.date + '&from')
                .then(res => res.json())
                .then((body) => {
                    res.send(body)
                })
        } else {
            fetch('http://localhost:' + port + '/index2?date=' + req.query.date)
                .then(res => res.json())
                .then((body) => {
                    res.send(body)
                })
        }
    } else {
        let data = ""
        let monthtext
        switch (req.query.date.substring(2, 4)) {
            case '01': monthtext = "มกราคม"; break;
            case '02': monthtext = "กุมภาพันธ์"; break;
            case '03': monthtext = "มีนาคม"; break;
            case '04': monthtext = "เมษายน"; break;
            case '05': monthtext = "พฤษภาคม"; break;
            case '06': monthtext = "มิถุนายน"; break;
            case '07': monthtext = "กรกฎาคม"; break;
            case '08': monthtext = "สิงหาคม"; break;
            case '09': monthtext = "กันยายน"; break;
            case '10': monthtext = "ตุลาคม"; break;
            case '11': monthtext = "พฤศจิกายน"; break;
            case '12': monthtext = "ธันวาคม"; break;
        }
        try {
            if (req.query.fresh !== undefined) {
                fs.unlinkSync('/tmp/' + req.query.date + '.txt');
            }
        } catch (err) {

        }
        var fileContents = null;
        try {
            fileContents = fs.readFileSync('/tmp/' + req.query.date + '.txt');
        } catch (err) {

        }
        if (fileContents) {
            data = JSON.parse(fileContents)
            if (req.query.from !== undefined) {
                data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
            }
            res.send(data);
        } else {
            fetch('https://www.myhora.com/%E0%B8%AB%E0%B8%A7%E0%B8%A2/%E0%B8%87%E0%B8%A7%E0%B8%94-' + req.query.date.substring(0, 2) + '-' + encodeURI(monthtext) + '-' + req.query.date.substring(4, 8) + '.aspx', { redirect: 'error' })
                .then(res => res.text())
                .then((body) => {
                    data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
                    let $ = cheerio.load(body)

                    let numberpush = []

                    $('.lot-dc').toArray().forEach(element => {
                        try {
                            //console.log(element.firstChild.data)
                            numberpush.push(element.firstChild.data)
                        } catch (error) {

                        }
                    });

                    if ($('div').toArray()[2] == null) {
                        res.send(data)
                        return
                    }

                    //data[0][1] = $('b').toArray()[2].firstChild.data
                    let threefirst = []
                    let threeend = []
                    /*try {
                        threefirst = $('b').toArray()[3].firstChild.data.split(" ")
                        threeend = $('b').toArray()[4].firstChild.data.split(" ")
                    } catch (error) {
                        /*threefirst = $('b').toArray()[4].firstChild.data.split(" ")
                        threeend = $('b').toArray()[5].firstChild.data.split(" ")
                        threeend = $('b').toArray()[4].firstChild.data.split(" ")
                        data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                        data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                        data[2][3] = threeend[2].replace(/\xc2\xa0/, '');
                        data[2][4] = threeend[3].replace(/\xc2\xa0/, '');
                    }
                    /*let threefirst = $('b').toArray()[3].firstChild.data.split(" ")
                    let threeend = $('b').toArray()[4].firstChild.data.split(" ")
                    if (threefirst.length <= 1) {
                        data[1][1] = 0;
                        data[1][2] = 0;
                        /*data[2][3] = threeend[2].replace(/\xc2\xa0/, '');
                        data[2][4] = threeend[3].replace(/\xc2\xa0/, '');
                    } else {
                        data[1][1] = threefirst[0].replace(/\xc2\xa0/, '');
                        data[1][2] = threefirst[1].replace(/\xc2\xa0/, '');
                    }
                    data[2][1] = threeend[0].replace('/\xc2\xa0/', '');
                    data[2][2] = threeend[1].replace('/\xc2\xa0/', '');
                    data[3][1] = $('b').toArray()[5].firstChild.data;
                    data[4][1] = padLeadingZeros(data[0][1] - 1, 6);
                    data[4][2] = padLeadingZeros(data[0][1] + 1, 6);*/

                    /*let wave = 5;
                    let minwave = 0;
                    let maxwave = 5;*/

                    /*for (const type of $('div').toArray()) {
                        if(wave >= 5){
                            if (type.attribs.class == 'lot-dc lotto-fx lot-c20') {
                                if (minwave < maxwave) {
                                    minwave++;
                                    data[wave][minwave] = type.firstChild.data;
                                }
                            }
                        }else{
                            minwave++;
                        }
                        if (minwave == maxwave && wave == 0) {
                            date[0][1] = type.firstChild.data
                            minwave = 0;
                            maxwave = 1;
                            wave = 1;
                        }
                        if (minwave == maxwave && wave == 1) {
                            if(type.firstChild.data.split(" ").length > 2){
                                threeend = type.firstChild.data.split(" ")
                                data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                                data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                                data[2][3] = threeend[2].replace(/\xc2\xa0/, '');
                                data[2][4] = threeend[3].replace(/\xc2\xa0/, '');
                            }else{
                                threefirst = type.firstChild.data.split(" ")
                                data[1][1] = threefirst[0].replace(/\xc2\xa0/, '');
                                data[1][2] = threefirst[1].replace(/\xc2\xa0/, '');
                            }
                            minwave = 0;
                            maxwave = 1;
                            wave = 2;
                        }
                        if (minwave == maxwave && wave == 2) {
                            if(data[2].length == 5){
                                data[3][1] = type.firstChild.data
                            }else{
                                threeend = type.firstChild.data.split(" ")
                                data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                                data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                            }
                            minwave = 0;
                            maxwave = 1;
                            wave = 3;
                        }
                        if (minwave == maxwave && wave == 3) {
                            if(data[2].length != 5){
                                data[3][1] = type.firstChild.data
                            }
                            minwave = 0;
                            maxwave = 1;
                            wave = 4;
                        }
                        if (minwave == maxwave && wave == 4) {
                            data[4][1] = padLeadingZeros(data[0][1] - 1, 6);
                            data[4][2] = padLeadingZeros(data[0][1] + 1, 6);
                            minwave = 0;
                            maxwave = 5;
                            wave = 5;
                        }
                        if (minwave == maxwave && wave == 5) {
                            minwave = 0;
                            maxwave = 10;
                            wave = 6;
                        }
                        if (minwave == maxwave && wave == 6) {
                            minwave = 0;
                            maxwave = 50;
                            wave = 7;
                        }
                        if (minwave == maxwave && wave == 7) {
                            minwave = 0;
                            maxwave = 100;
                            wave = 8;
                        }
                    }*/

                    /*let wave = 0;
                    let minwave = 0;
                    let maxwave = 1;*/

                    data[0][1] = numberpush[0]
                    numberpush.shift()
                    if (numberpush[0].split(" ").length > 2) {
                        threeend = numberpush[0].split(" ")
                        data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                        data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                        data[2][3] = threeend[2].replace(/\xc2\xa0/, '');
                        data[2][4] = threeend[3].replace(/\xc2\xa0/, '');
                    } else {
                        threefirst = numberpush[0].split(" ")
                        data[1][1] = threefirst[0].replace(/\xc2\xa0/, '');
                        data[1][2] = threefirst[1].replace(/\xc2\xa0/, '');
                    }
                    numberpush.shift()
                    if (numberpush[0].length == 2) {
                        data[3][1] = numberpush[0]
                        numberpush.shift()
                    } else {
                        threeend = numberpush[0].split(" ")
                        data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                        data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                        numberpush.shift()
                        data[3][1] = numberpush[0]
                        numberpush.shift()
                    }
                    data[4][1] = padLeadingZeros((data[0][1] - 1), 6);
                    data[4][2] = padLeadingZeros((data[0][1] + 1), 6);

                    let wave = 5;
                    let minwave = 0;
                    let maxwave = 5;

                    for (const type of numberpush) {
                        if (wave >= 5) {
                            if (minwave < maxwave) {
                                minwave++;
                                data[wave][minwave] = type
                            }
                        }/*else{
                            minwave++;
                        }*/
                        /*if (minwave == maxwave && wave == 0) {
                            data[0][1] = type
                            minwave = 0;
                            maxwave = 1;
                            wave = 1;
                        }
                        if (minwave == maxwave && wave == 1) {
                            if(type.split(" ").length > 2){
                                threeend = type.split(" ")
                                data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                                data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                                data[2][3] = threeend[2].replace(/\xc2\xa0/, '');
                                data[2][4] = threeend[3].replace(/\xc2\xa0/, '');
                            }else{
                                threefirst = type.split(" ")
                                data[1][1] = threefirst[0].replace(/\xc2\xa0/, '');
                                data[1][2] = threefirst[1].replace(/\xc2\xa0/, '');
                            }
                            minwave = 0;
                            maxwave = 1;
                            wave = 2;
                        }
                        if (minwave == maxwave && wave == 2) {
                            if(data[2].length == 5){
                                data[3][1] = type
                            }else{
                                threeend = type.split(" ")
                                data[2][1] = threeend[0].replace(/\xc2\xa0/, '');
                                data[2][2] = threeend[1].replace(/\xc2\xa0/, '');
                            }
                            minwave = 0;
                            maxwave = 1;
                            wave = 3;
                        }
                        if (minwave == maxwave && wave == 3) {
                            if(data[2].length != 5){
                                data[3][1] = type
                            }
                            minwave = 0;
                            maxwave = 1;
                            wave = 4;
                        }
                        if (minwave == maxwave && wave == 4) {
                            data[4][1] = padLeadingZeros((data[0][1] - 1), 6);
                            data[4][2] = padLeadingZeros((data[0][1] + 1), 6);
                            minwave = 0;
                            maxwave = 5;
                            wave = 5;
                        }*/
                        if (minwave == maxwave && wave == 5) {
                            minwave = 0;
                            maxwave = 10;
                            wave = 6;
                        }
                        if (minwave == maxwave && wave == 6) {
                            minwave = 0;
                            maxwave = 50;
                            wave = 7;
                        }
                        if (minwave == maxwave && wave == 7) {
                            minwave = 0;
                            maxwave = 100;
                            wave = 8;
                        }
                    }

                    if ($('div').toArray()[2].firstChild.data != null && $('div').toArray()[2].firstChild.data != ' เวลา 14:30-16:00น.') {
                        fs.writeFile('/tmp/' + req.query.date + '.txt', JSON.stringify(data), function (err) {
                            if (err) throw err;
                            //console.log('Saved!');
                            if (req.query.from !== undefined) {
                                data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
                            }
                            res.send(data)
                        });
                    } else {
                        if (req.query.from !== undefined) {
                            data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
                        }
                        res.send(data)
                    }
                });
        }
    }
});

module.exports = router;