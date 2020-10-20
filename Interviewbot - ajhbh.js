const request = require('request');

const urlroot = 'https://api.noopschallenge.com';
var urlcurrent = '/interviewbot/start';

// wrap a request in an promise so can run synchronously in order cos' javascript
function getRequest(url) {
    return new Promise((resolve, reject) => {
        request.get(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            var jsonRespnse = JSON.parse(body);
            resolve(jsonRespnse);
        });
    });
}

function postRequest(url, answer) {
    return new Promise((resolve, reject) => {
        var string = {
            "answer": answer
        };
        request.post(url, {
            json: string
        }, function (error, response, body) {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            //var jsonRespnse = JSON.parse(body);
            resolve(body);
        });
    });
}
function postLoginRequest(url, answer) {
    return new Promise((resolve, reject) => {
        var string = {
            "login": answer
        };
        request.post(url, {
            json: string
        }, function (error, response, body) {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            //var jsonRespnse = JSON.parse(body);
            resolve(body);
        });
    });
}

function processResponse(response) {
    return new Promise((resolve, reject) => {
        if (response.nextQuestion != undefined) {
            urlcurrent = response.nextQuestion;
            resolve(null);
        } else if (response.exampleResponse != undefined && response.exampleResponse.login != undefined) {
            resolve("ajhbh-login");
        } else if (response.result != undefined && response.result == "finished") {
            resolve("interview complete");
        }
        var output;
        if (response.message.includes("prime factors")) {
            output = findPrimeFactors(response.question);
        }
        else if (response.message.includes("roman numeral")) {
            output = convertRomanNumeral(response.question);
        } 
        else if (response.message.includes("compute the numeric value")) {
            output = computeNumericValue(response.question);
        }
        else {
            output = "Error: Unknown Question";
        }
        resolve(output);
    });
}

function findPrimeFactors(question) { 
        var output = [];

        var remainder = question;
        var currentprimefactor = 2;
        var previousprimefactors = [];

        while (remainder > 1) {
            console.log(remainder);
            while (remainder % currentprimefactor === 0) {
                output.push(currentprimefactor);
                //console.log("currentprime:",currentprimefactor);
                remainder = remainder / currentprimefactor;
            }
            previousprimefactors.push(currentprimefactor);
            var foundnextprimefactor = false;
            var nextprimefactor = currentprimefactor + 1;
            //console.log("nextprime:",nextprimefactor)
            while (foundnextprimefactor === false) {
                foundnextprimefactor = true;
                for (var prime of previousprimefactors) { 
                    //console.log("previousprime:",prime)
                    if (nextprimefactor % prime === 0) {
                        foundnextprimefactor = false;
                        nextprimefactor += 1;
                        break;
                    }
                }
            }
            currentprimefactor = nextprimefactor;
        }
        console.log("findPrimeFactors Answer:", output);
        return output;
}

function convertRomanNumeral(question) {
    var hadM = false, hadD = false, hadC = false, hadL = false, hadX = false, hadV = false, hadI = false;
    var output = 0;

    for (i = question.length; i > 0; i--) {
        var letter = question[i-1];
        if (letter == "I" && !hadV && !hadX && !hadL && !hadC && !hadD && !hadM) {
            output += 1;
            hadI = true;
        } else if (letter == "I") {
            output -= 1;
        } else if (letter == "V" && !hadX && !hadL && !hadC && !hadD && !hadM) {
            output += 5;
            hadV = true;
        } else if (letter == "V") {
            output -= 5;
        } else if (letter == "X" && !hadL && !hadC && !hadD && !hadM) {
            output += 10;
            hadX = true;
        } else if (letter == "X") {
            output -= 10;
        } else if (letter == "L" && !hadC && !hadD && !hadM) {
            output += 50;
            hadL = true;
        } else if (letter == "L") {
            output -= 50;
        } else if (letter == "C" && !hadD && !hadM) {
            output += 100;
            hadC = true;
        } else if (letter == "C") {
            output -= 100;
        } else if (letter == "D" && !hadM) {
            output += 500;
            hadD = true;
        } else if (letter == "D") {
            output -= 500;
        } else if (letter == "M") {
            output += 1000;
            hadM = true;
        }
    }
    console.log("Roman Numerals Answer:", output);
    return output;
}

function computeNumericValue(question) {
    var output;
    var convertString = question +" ";
    convertString = convertString.replace(/zero/g, "0");
    convertString = convertString.replace(/one /g, "1");
    convertString = convertString.replace(/two /g, "2");
    convertString = convertString.replace(/three /g, "3");
    convertString = convertString.replace(/four /g, "4");
    convertString = convertString.replace(/five /g, "5");
    convertString = convertString.replace(/six /g, "6");
    convertString = convertString.replace(/seven /g, "7");
    convertString = convertString.replace(/eight /g, "8");
    convertString = convertString.replace(/nine /g, "9");
    convertString = convertString.replace(/ten /g, "10");
    convertString = convertString.replace(/eleven /g, "11");
    convertString = convertString.replace(/twelve /g, "12");
    convertString = convertString.replace(/thirteen /g, "13");
    convertString = convertString.replace(/fourteen /g, "14");
    convertString = convertString.replace(/fifteen /g, "15");
    convertString = convertString.replace(/sixteen /g, "16");
    convertString = convertString.replace(/seventeen /g, "17");
    convertString = convertString.replace(/eighteen /g, "18");
    convertString = convertString.replace(/nineteen /g, "19");

    convertString = convertString.replace(/twenty-/g, "2");
    convertString = convertString.replace(/thirty-/g, "3");
    convertString = convertString.replace(/forty-/g, "4");
    convertString = convertString.replace(/fifty-/g, "5");
    convertString = convertString.replace(/sixty-/g, "6");
    convertString = convertString.replace(/seventy-/g, "7");
    convertString = convertString.replace(/eighty-/g, "8");
    convertString = convertString.replace(/ninety-/g, "9");
    convertString = convertString.replace(/twenty /g, "20");
    convertString = convertString.replace(/thirty /g, "30");
    convertString = convertString.replace(/fourty /g, "40");
    convertString = convertString.replace(/fifty /g, "50");
    convertString = convertString.replace(/sixty /g, "60");
    convertString = convertString.replace(/seventy /g, "70");
    convertString = convertString.replace(/eighty /g, "80");
    convertString = convertString.replace(/ninety /g, "90");

    convertString = convertString.replace(/minus/g, "-");
    convertString = convertString.replace(/plus/g, "+");
    convertString = convertString.replace(/divided by/g, "/");
    convertString = convertString.replace(/times/g, "*");
    console.log("convertString", convertString);
    output = eval(convertString);

    console.log("computeNumericValue Answer:", output);
    return output;
}

// all you need to do is use async functions and await for functions returning promises
async function main() {
    while (true) {
        var urlrequest = urlroot + urlcurrent;
        console.log(urlrequest);

        try {
            var response = await getRequest(urlrequest)
            console.log(JSON.stringify(response));

            var answerString = await processResponse(response);
            if (answerString == null) {
                continue
            } 
            console.log(JSON.stringify(answerString));
            if (answerString == "ajhbh-login"){
                response = await postLoginRequest(urlrequest, "ajhbh");
            } else {
                response = await postRequest(urlrequest, answerString);
            }
            console.log(JSON.stringify(response));
            var finalanswerString = await processResponse(response)
            if (finalanswerString == "interview complete" || finalanswerString == "Error: Unknown Question") {
                break;
            }

        } catch (error) {
            console.error('ERROR:');
            console.error(error);
            break;
        }
    }
}

main();
