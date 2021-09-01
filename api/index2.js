const express = require("express");
const router = express.Router();
const fetch = require('node-fetch')
const cheerio = require('cheerio')
var fs = require('fs')

const PORT = process.env.PORT || 8080;

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
    try {
        if (req.query.fresh !== undefined) {
            fs.unlinkSync('/tmp/' + req.query.date + '.txt');
        }
    } catch (err) {

    }
    let monthtext
    var fileContents = null;
    try {
        fileContents = fs.readFileSync('/tmp/' + req.query.date + '.txt');
    } catch (err) {

    }
    if (fileContents) {
        data = JSON.parse(fileContents)
        if (req.query.from !== undefined) {
            switch (req.query.date.substr(2, 2)) {
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

            data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
        }
        res.send(data);
    } else {
        fetch('https://news.sanook.com/lotto/check/' + req.query.date + '/', { redirect: 'error' })
            .then(res => res.text())
            .then((body) => {
                let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
                let $ = cheerio.load(body)

                data[0][1] = $('strong').toArray()[0].firstChild.data
                data[1][1] = $('strong').toArray()[1].firstChild.data
                data[1][2] = $('strong').toArray()[2].firstChild.data
                data[2][1] = $('strong').toArray()[3].firstChild.data
                data[2][2] = $('strong').toArray()[4].firstChild.data
                data[3][1] = $('strong').toArray()[5].firstChild.data
                data[4][1] = $('strong').toArray()[6].firstChild.data
                data[4][2] = $('strong').toArray()[7].firstChild.data

                let k = 5
                let i = 1
                for (const type of $('span').toArray()) {
                    var arrit = type.attribs.class + ''
                    if (!arrit.search('lotto__number')) {
                        if (k == 5 && i <= 5) {
                            data[k][i] = type.firstChild.data
                            i++
                        } else if (k == 5 && i > 5) {
                            k++
                            i = 1
                        }
                        if (k == 6 && i <= 10) {
                            data[k][i] = type.firstChild.data
                            i++
                        } else if (k == 6 && i > 10) {
                            k++
                            i = 1
                        }
                        if (k == 7 && i <= 50) {
                            data[k][i] = type.firstChild.data
                            i++
                        } else if (k == 7 && i > 50) {
                            k++
                            i = 1
                        }
                        if (k == 8 && i <= 100) {
                            data[k][i] = type.firstChild.data
                            i++
                        }
                    }
                }
                if ($('div').toArray()[2].firstChild.data.match('~[0-9]+~')) {
                    fs.writeFile('/tmp/' + req.query.date + '.txt', JSON.stringify(data), function (err) {
                        if (err) throw err;
                        //console.log('Saved!');
                        if (req.query.from !== undefined) {
                            switch (req.query.date.substr(2, 2)) {
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

                            data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
                        }
                        res.send(data)
                    });
                } else {
                    if (req.query.from !== undefined) {
                        switch (req.query.date.substr(2, 2)) {
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

                        data[0][0] = req.query.date.substring(0, 2) + monthtext + req.query.date.substring(4, 8)
                    }
                    res.send(data)
                }
            })
            .catch((err) => {
                let data = [["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0], ["\u0e40\u0e25\u0e02\u0e2b\u0e19\u0e49\u0e323\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e223\u0e15\u0e31\u0e27", 0, 0], ["\u0e40\u0e25\u0e02\u0e17\u0e49\u0e32\u0e222\u0e15\u0e31\u0e27", 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e02\u0e49\u0e32\u0e07\u0e40\u0e04\u0e35\u0e22\u0e07\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e481", 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e482", 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e483", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e484", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ["\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e17\u0e35\u0e485", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
                res.send(data)
                console.log(err)
            });
    }
});

module.exports = router;