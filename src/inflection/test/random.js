"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// npm run test_random
const get_1 = require("inflection/test/get");
const lodash_1 = __importDefault(require("lodash"));
if (!("npm_package_devDependencies_mocha" in process.env)) {
    let done = 0;
    const next = () => {
        const id = ids[done];
        if (!id) {
            console.log({ done, id });
            process.exit();
        }
        // console.log(id)
        (0, get_1.get)(id, (e) => {
            console.log("Failed on " + id);
            throw new Error(e);
        }, (word) => {
            const w = word.getFirstValue();
            if (!w) {
                throw new Error("Failed on " + id);
            }
            process.stdout.write(`\x1Bc\r${"" + done++} ${w}`);
            // console.log(w)
            // console.log(id)
            // console.log(done++ )
            next();
        });
    };
    let ids = lodash_1.default.shuffle([
        "100721",
        "10161",
        "10162",
        "10163",
        "10164",
        "10165",
        "10190",
        "10211",
        "10222",
        "10227",
        "10345",
        "10348",
        "10353",
        "10358",
        "10360",
        "10372",
        "10379",
        "10380",
        "10386",
        "10392",
        "10394",
        "10397",
        "10419",
        "10433",
        "10434",
        "10439",
        "1044",
        "10441",
        "10448",
        "104590",
        "104593",
        "10460",
        "104664",
        "104667",
        "104672",
        "104680",
        "104731",
        "10475",
        "10477",
        "10478",
        "10491",
        "10495",
        "104967",
        "1050",
        "10516",
        "10519",
        "10524",
        "10528",
        "10534",
        "10547",
        "105532",
        "10567",
        "10568",
        "10573",
        "10577",
        "10581",
        "10614",
        "10618",
        "10640",
        "10655",
        "10657",
        "10672",
        "106844",
        "10691",
        "10722",
        "10756",
        "107588",
        "10770",
        "107935",
        "10798",
        "108072",
        "10869",
        "10887",
        "109181",
        "10938",
        "10953",
        "10997",
        "1102",
        "110364",
        "11090",
        "11096",
        "11100",
        "11103",
        "11107",
        "111127",
        "11119",
        "11121",
        "111242",
        "111616",
        "111651",
        "111654",
        "111686",
        "111697",
        "111815",
        "112355",
        "112387",
        "112389",
        "112416",
        "112490",
        "112496",
        "112557",
        "11285",
        "113063",
        "113110",
        "113187",
        "113934",
        "113970",
        "114107",
        "114115",
        "11415",
        "114193",
        "1142",
        "11485",
        "115038",
        "1151",
        "1157",
        "115737",
        "115823",
        "116046",
        "11606",
        "1161",
        "116251",
        "116263",
        "116299",
        "116348",
        "116450",
        "11679",
        "11690",
        "117455",
        "117619",
        "117662",
        "117874",
        "117875",
        "11788",
        "11793",
        "117935",
        "11888",
        "119043",
        "119163",
        "11920",
        "119214",
        "119536",
        "1201",
        "12020",
        "12036",
        "120531",
        "12083",
        "12085",
        "12106",
        "12120",
        "121767",
        "121881",
        "1221",
        "122227",
        "122327",
        "12258",
        "12259",
        "12260",
        "12266",
        "12269",
        "12276",
        "12300",
        "12301",
        "1233",
        "123496",
        "123551",
        "123581",
        "12414",
        "124311",
        "124728",
        "125102",
        "1252",
        "125515",
        "125626",
        "12618",
        "126235",
        "126443",
        "12645",
        "126622",
        "126925",
        "127078",
        "12742",
        "12775",
        "129253",
        "129321",
        "129385",
        "129514",
        "130001",
        "130015",
        "130311",
        "130312",
        "130404",
        "130438",
        "130453",
        "130564",
        "1306",
        "1312",
        "131419",
        "132404",
        "132823",
        "133609",
        "133926",
        "134605",
        "135662",
        "135908",
        "135926",
        "136255",
        "136345",
        "13678",
        "137091",
        "1371",
        "13738",
        "1378",
        "13788",
        "138727",
        "138786",
        "1389",
        "13901",
        "139288",
        "139359",
        "13953",
        "1397",
        "1399",
        "140261",
        "1403",
        "14042",
        "140493",
        "14079",
        "14130",
        "14177",
        "142051",
        "14215",
        "14231",
        "1431",
        "14315",
        "14333",
        "143406",
        "14370",
        "14389",
        "14395",
        "14400",
        "14413",
        "14414",
        "14439",
        "1444",
        "144526",
        "144575",
        "144645",
        "14488",
        "145135",
        "14525",
        "14612",
        "1462",
        "146417",
        "14644",
        "14716",
        "147246",
        "14768",
        "14786",
        "147957",
        "14847",
        "14867",
        "14880",
        "1491",
        "14933",
        "1494",
        "1494",
        "1494",
        "14957",
        "14992",
        "149926",
        "14996",
        "149980",
        "15003",
        "15011",
        "15024",
        "1503",
        "150359",
        "150747",
        "15091",
        "15106",
        "15110",
        "151318",
        "15174",
        "1520",
        "152554",
        "152851",
        "15327",
        "154009",
        "15402",
        "154369",
        "15448",
        "15449",
        "154977",
        "15520",
        "155702",
        "155748",
        "1558",
        "1560",
        "156697",
        "156896",
        "15694",
        "15728",
        "1573",
        "1574",
        "157406",
        "157408",
        "157414",
        "157439",
        "1575",
        "15761",
        "157740",
        "157929",
        "15817",
        "15831",
        "158398",
        "158495",
        "158526",
        "158567",
        "158647",
        "158819",
        "15887",
        "158938",
        "158952",
        "158958",
        "1591",
        "15931",
        "15937",
        "159421",
        "15969",
        "16009",
        "16087",
        "16090",
        "16197",
        "16217",
        "16225",
        "16231",
        "1631",
        "16310",
        "16322",
        "16348",
        "16359",
        "16400",
        "16436",
        "16459",
        "16461",
        "164647",
        "164746",
        "164905",
        "165008",
        "165011",
        "165018",
        "165043",
        "165051",
        "165084",
        "165090",
        "165098",
        "165111",
        "165122",
        "165141",
        "165143",
        "16516",
        "165187",
        "165192",
        "16520",
        "165200",
        "165290",
        "16532",
        "165330",
        "16535",
        "16559",
        "165608",
        "165609",
        "165610",
        "165612",
        "165614",
        "165618",
        "165632",
        "165646",
        "165653",
        "165660",
        "165697",
        "16571",
        "165736",
        "165764",
        "1660",
        "16603",
        "16606",
        "166087",
        "166091",
        "166094",
        "166136",
        "166139",
        "166149",
        "166153",
        "166155",
        "166157",
        "16616",
        "166161",
        "166162",
        "166164",
        "166168",
        "16617",
        "16631",
        "166427",
        "166434",
        "166493",
        "166535",
        "16658",
        "166606",
        "16664",
        "16665",
        "166655",
        "16667",
        "16668",
        "16682",
        "166833",
        "16689",
        "16690",
        "168136",
        "168179",
        "168243",
        "168348",
        "168350",
        "170602",
        "170634",
        "170640",
        "170658",
        "170666",
        "1710",
        "1720",
        "172158",
        "172234",
        "172395",
        "172531",
        "172646",
        "172708",
        "172710",
        "172725",
        "173154",
        "173155",
        "174460",
        "174480",
        "174512",
        "174885",
        "175066",
        "175119",
        "175186",
        "175673",
        "175800",
        "1764",
        "176960",
        "176998",
        "177039",
        "177044",
        "177183",
        "178271",
        "178828",
        "179684",
        "179689",
        "179697",
        "179717",
        "179753",
        "180192",
        "180514",
        "180672",
        "180763",
        "180888",
        "180912",
        "180949",
        "181005",
        "181034",
        "181091",
        "181250",
        "181316",
        "181340",
        "181379",
        "181464",
        "181651",
        "181655",
        "181664",
        "18169",
        "1818",
        "18190",
        "1829",
        "18336",
        "18396",
        "18415",
        "184558",
        "1854",
        "18842",
        "189688",
        "189726",
        "190251",
        "190530",
        "190755",
        "190861",
        "191157",
        "191166",
        "1931",
        "1936",
        "1970",
        "20009",
        "2011",
        "20297",
        "2059",
        "2062",
        "20691",
        "20749",
        "20797",
        "2091",
        "2172",
        "21817",
        "21825",
        "21896",
        "2191",
        "2208",
        "2212",
        "2215",
        "2223",
        "2225",
        "2227",
        "2233",
        "2250",
        "2253",
        "2259",
        "2271",
        "2285",
        "2286",
        "2287",
        "2290",
        "2294",
        "2317",
        "2328",
        "2330",
        "2332",
        "2338",
        "23473",
        "2381",
        "2403",
        "24163",
        "24172",
        "24259",
        "2451",
        "24932",
        "25077",
        "2520",
        "2544",
        "2545",
        "2559",
        "2582",
        "2603",
        "26137",
        "2635",
        "26477",
        "2675",
        "2681",
        "2727",
        "2733",
        "2747",
        "2751",
        "2755",
        "2807",
        "28486",
        "2885",
        "2889",
        "2928",
        "293535",
        "293836",
        "2950",
        "2966",
        "29672",
        "29678",
        "296893",
        "2992",
        "300989",
        "300990",
        "3010",
        "301028",
        "302054",
        "30261",
        "30342",
        "3043",
        "3048",
        "30544",
        "30557",
        "30580",
        "30956",
        "311805",
        "3181",
        "3198",
        "31988",
        "3205",
        "320765",
        "3210",
        "3220",
        "3242",
        "32847",
        "3315",
        "3320",
        "33268",
        "3376",
        "3377",
        "3407",
        "34578",
        "34635",
        "3494",
        "34966",
        "3500",
        "3539",
        "3546",
        "3562",
        "3574",
        "3596",
        "3603",
        "3616",
        "3618",
        "3630",
        "3634",
        "3639",
        "3643",
        "3646",
        "3653",
        "3669",
        "36704",
        "368",
        "3683",
        "3696",
        "3699",
        "3706",
        "37207",
        "37241",
        "37376",
        "3771",
        "377563",
        "3786",
        "3840",
        "384843",
        "3861",
        "386474",
        "386667",
        "388025",
        "388080",
        "388178",
        "388318",
        "388363",
        "388371",
        "388461",
        "388479",
        "388582",
        "388617",
        "388648",
        "388688",
        "388754",
        "388825",
        "388841",
        "388884",
        "388948",
        "389034",
        "389130",
        "389173",
        "389183",
        "389253",
        "389290",
        "3894",
        "389404",
        "389519",
        "38959",
        "389717",
        "389854",
        "389876",
        "389898",
        "389924",
        "390179",
        "390267",
        "390298",
        "390321",
        "390454",
        "390521",
        "390548",
        "390611",
        "390622",
        "390705",
        "390769",
        "390785",
        "390789",
        "390816",
        "390824",
        "390881",
        "390994",
        "391018",
        "391023",
        "391187",
        "391198",
        "391217",
        "391232",
        "391484",
        "391490",
        "3915",
        "391506",
        "391556",
        "391608",
        "391685",
        "391711",
        "391792",
        "391798",
        "391815",
        "391871",
        "391893",
        "3919",
        "391988",
        "392016",
        "392113",
        "392120",
        "392130",
        "392150",
        "392172",
        "392199",
        "392233",
        "392237",
        "392310",
        "392312",
        "392325",
        "392618",
        "393363",
        "393384",
        "393399",
        "393434",
        "393690",
        "393710",
        "393717",
        "393827",
        "3943",
        "3957",
        "395840",
        "396578",
        "396697",
        "396755",
        "39711",
        "3976",
        "3982",
        "3984",
        "3995",
        "4002",
        "400704",
        "400710",
        "400719",
        "400730",
        "400731",
        "400732",
        "400738",
        "401553",
        "401854",
        "402469",
        "402475",
        "402476",
        "402477",
        "402487",
        "402517",
        "402525",
        "402526",
        "402539",
        "402546",
        "402607",
        "402615",
        "402648",
        "402656",
        "403833",
        "403906",
        "403908",
        "404291",
        "404353",
        "404386",
        "4052",
        "4054",
        "40647",
        "406746",
        "406747",
        "406896",
        "406896",
        "406901",
        "406903",
        "406904",
        "406905",
        "406908",
        "406909",
        "406911",
        "406912",
        "406915",
        "406923",
        "4070",
        "4071",
        "408186",
        "408187",
        "408188",
        "408189",
        "408191",
        "408238",
        "408456",
        "408593",
        "408593",
        "408593",
        "408635",
        "408687",
        "408705",
        "408742",
        "408869",
        "408887",
        "408959",
        "409008",
        "409012",
        "409016",
        "409017",
        "409032",
        "409035",
        "409045",
        "409049",
        "409052",
        "409059",
        "409061",
        "409077",
        "409082",
        "409094",
        "409097",
        "409102",
        "409106",
        "409108",
        "409119",
        "409136",
        "409139",
        "409151",
        "409177",
        "409195",
        "409949",
        "4100",
        "411307",
        "411812",
        "411817",
        "411964",
        "411968",
        "412150",
        "412151",
        "412188",
        "412190",
        "412191",
        "412194",
        "412735",
        "4129",
        "413016",
        "413133",
        "413278",
        "413361",
        "413443",
        "413522",
        "413666",
        "413805",
        "41418",
        "4147",
        "415076",
        "415151",
        "41585",
        "416350",
        "416423",
        "416508",
        "416509",
        "416528",
        "416530",
        "416532",
        "416734",
        "416784",
        "416789",
        "416955",
        "417900",
        "417903",
        "417908",
        "417909",
        "417912",
        "417915",
        "417916",
        "41792",
        "419349",
        "419415",
        "419473",
        "419492",
        "419493",
        "419552",
        "419632",
        "419633",
        "419701",
        "419705",
        "419738",
        "419784",
        "419892",
        "419900",
        "419928",
        "419978",
        "419996",
        "420020",
        "420040",
        "420116",
        "420145",
        "420199",
        "420278",
        "420365",
        "420546",
        "420683",
        "420788",
        "420789",
        "420823",
        "420840",
        "420894",
        "420914",
        "420944",
        "421142",
        "421353",
        "421360",
        "421369",
        "421599",
        "421663",
        "421667",
        "421710",
        "421760",
        "421768",
        "421823",
        "421884",
        "421930",
        "4220",
        "422101",
        "422130",
        "422138",
        "422235",
        "422241",
        "422288",
        "422297",
        "422321",
        "422327",
        "422373",
        "422523",
        "422634",
        "422636",
        "422688",
        "422703",
        "422716",
        "422881",
        "422916",
        "422940",
        "422941",
        "422990",
        "423036",
        "423144",
        "423355",
        "423357",
        "423381",
        "423396",
        "423527",
        "423553",
        "423607",
        "423612",
        "423677",
        "423697",
        "423747",
        "42375",
        "423766",
        "423900",
        "424101",
        "424294",
        "424403",
        "424445",
        "424458",
        "424463",
        "424486",
        "424570",
        "424586",
        "424604",
        "424615",
        "424624",
        "424648",
        "424678",
        "424683",
        "424689",
        "424712",
        "424774",
        "424804",
        "424820",
        "424876",
        "424931",
        "425102",
        "425130",
        "425151",
        "425749",
        "425896",
        "425900",
        "426041",
        "426041",
        "426053",
        "427",
        "427364",
        "42738",
        "427488",
        "427489",
        "427491",
        "427492",
        "427494",
        "427545",
        "427553",
        "427554",
        "427568",
        "427568",
        "427615",
        "427622",
        "427641",
        "427651",
        "428154",
        "428157",
        "428180",
        "428183",
        "428341",
        "428351",
        "428388",
        "428504",
        "428529",
        "428721",
        "428970",
        "4290",
        "429197",
        "429251",
        "429271",
        "429310",
        "429400",
        "430949",
        "4312",
        "4315",
        "4317",
        "4320",
        "433022",
        "433097",
        "4331",
        "433181",
        "433250",
        "433446",
        "433541",
        "433541",
        "433568",
        "433569",
        "433587",
        "433588",
        "433622",
        "433642",
        "433652",
        "433653",
        "433661",
        "433662",
        "434060",
        "434147",
        "434168",
        "434170",
        "434182",
        "434186",
        "434190",
        "434196",
        "434197",
        "434208",
        "434211",
        "434224",
        "434231",
        "434248",
        "434258",
        "434272",
        "434272",
        "434280",
        "434314",
        "434323",
        "434329",
        "434341",
        "434348",
        "434349",
        "434360",
        "434370",
        "434413",
        "434416",
        "434509",
        "434539",
        "434543",
        "434551",
        "434556",
        "434567",
        "434582",
        "434591",
        "434602",
        "434646",
        "434665",
        "434727",
        "434739",
        "434742",
        "434755",
        "434762",
        "434778",
        "434798",
        "434836",
        "434872",
        "434885",
        "4349",
        "434951",
        "434952",
        "434956",
        "434991",
        "435001",
        "435001",
        "435004",
        "435019",
        "435021",
        "435024",
        "435026",
        "435046",
        "435047",
        "435061",
        "435090",
        "435100",
        "435178",
        "435199",
        "435228",
        "435230",
        "435266",
        "435302",
        "435385",
        "435386",
        "435392",
        "435438",
        "435442",
        "435442",
        "435459",
        "435495",
        "435527",
        "435548",
        "435577",
        "435590",
        "4356",
        "435622",
        "435622",
        "435664",
        "435693",
        "435697",
        "435698",
        "435701",
        "435706",
        "435712",
        "4358",
        "4359",
        "436219",
        "4366",
        "4370",
        "4381",
        "4385",
        "4386",
        "43981",
        "44024",
        "4413",
        "4470",
        "448386",
        "448400",
        "448401",
        "448403",
        "448427",
        "448476",
        "448767",
        "449015",
        "449360",
        "449444",
        "449561",
        "449772",
        "450141",
        "450438",
        "454",
        "45639",
        "45642",
        "457",
        "45838",
        "459828",
        "461138",
        "461175",
        "463902",
        "463918",
        "464090",
        "464090",
        "464164",
        "464849",
        "464913",
        "465445",
        "465496",
        "46562",
        "466",
        "466197",
        "466361",
        "466469",
        "466488",
        "466512",
        "466523",
        "466609",
        "466611",
        "466614",
        "466618",
        "466619",
        "466637",
        "466690",
        "466691",
        "466695",
        "466766",
        "466771",
        "466772",
        "466775",
        "467132",
        "467531",
        "467565",
        "467730",
        "467751",
        "467758",
        "467760",
        "467763",
        "467768",
        "467769",
        "468400",
        "46845",
        "468575",
        "469213",
        "469284",
        "470284",
        "470399",
        "470894",
        "470980",
        "471177",
        "471203",
        "471453",
        "472",
        "472167",
        "472567",
        "472689",
        "472827",
        "473057",
        "473235",
        "47329",
        "473381",
        "473533",
        "473562",
        "473614",
        "473639",
        "474819",
        "474882",
        "474900",
        "474944",
        "475",
        "475058",
        "475149",
        "475209",
        "4753",
        "475333",
        "4754",
        "475514",
        "475669",
        "475751",
        "4758",
        "475925",
        "475966",
        "476008",
        "476282",
        "476554",
        "476622",
        "476695",
        "476695",
        "476777",
        "476818",
        "476993",
        "477",
        "4770",
        "477307",
        "477358",
        "477359",
        "477380",
        "478090",
        "478219",
        "478510",
        "478540",
        "478545",
        "478739",
        "478745",
        "478757",
        "478780",
        "478781",
        "478783",
        "478791",
        "478792",
        "478795",
        "478796",
        "478799",
        "478801",
        "478802",
        "478806",
        "478807",
        "478807",
        "478813",
        "479125",
        "479125",
        "479304",
        "480240",
        "480351",
        "480352",
        "481242",
        "4819",
        "481979",
        "482",
        "482281",
        "482484",
        "484919",
        "484931",
        "484970",
        "484974",
        "485",
        "485150",
        "485737",
        "485737",
        "485738",
        "486671",
        "487564",
        "487975",
        "48817",
        "488183",
        "488188",
        "488196",
        "488197",
        "48842",
        "488444",
        "488598",
        "488604",
        "488626",
        "49249",
        "492644",
        "495065",
        "495077",
        "495091",
        "495092",
        "495101",
        "495104",
        "495165",
        "495209",
        "495215",
        "495242",
        "495253",
        "495276",
        "495278",
        "495283",
        "495289",
        "495291",
        "495293",
        "495299",
        "495300",
        "495301",
        "495304",
        "495307",
        "495308",
        "495309",
        "495312",
        "495341",
        "495352",
        "495355",
        "495359",
        "495361",
        "495364",
        "495366",
        "495367",
        "495372",
        "495373",
        "495374",
        "495386",
        "495390",
        "495395",
        "495403",
        "495405",
        "495406",
        "495407",
        "495408",
        "495462",
        "495463",
        "495464",
        "495465",
        "495466",
        "495474",
        "495475",
        "495483",
        "495498",
        "495505",
        "495526",
        "495528",
        "495531",
        "495539",
        "495543",
        "495554",
        "495560",
        "495583",
        "495594",
        "495602",
        "495603",
        "495606",
        "495618",
        "495619",
        "495621",
        "495622",
        "495623",
        "495634",
        "495648",
        "495670",
        "495673",
        "495703",
        "495706",
        "495708",
        "495715",
        "495728",
        "495734",
        "495736",
        "495754",
        "495759",
        "495776",
        "495777",
        "495781",
        "495786",
        "495841",
        "495855",
        "495856",
        "495896",
        "495897",
        "495939",
        "496057",
        "496220",
        "496231",
        "496271",
        "496274",
        "496369",
        "496370",
        "496735",
        "496738",
        "496770",
        "496781",
        "496783",
        "496825",
        "496850",
        "496872",
        "496958",
        "496984",
        "497053",
        "497138",
        "497163",
        "497237",
        "497251",
        "497289",
        "497344",
        "497522",
        "497537",
        "497550",
        "497553",
        "497561",
        "497579",
        "497600",
        "497629",
        "497648",
        "497689",
        "497701",
        "497708",
        "497719",
        "497741",
        "497768",
        "497940",
        "497964",
        "498385",
        "498482",
        "498489",
        "498496",
        "498565",
        "4999",
        "5047",
        "506540",
        "50759",
        "50894",
        "5135",
        "515",
        "5158",
        "516",
        "5185",
        "5187",
        "5190",
        "5196",
        "5208",
        "5222",
        "5223",
        "523",
        "5253",
        "527",
        "52914",
        "53035",
        "5322",
        "5333",
        "5341",
        "5342",
        "5349",
        "5358",
        "5364",
        "5377",
        "5409",
        "5413",
        "5417",
        "54223",
        "54259",
        "54288",
        "5432",
        "5478",
        "5483",
        "5496",
        "551",
        "552",
        "5541",
        "55899",
        "5591",
        "5599",
        "5607",
        "5608",
        "5628",
        "5630",
        "5639",
        "5644",
        "5645",
        "5651",
        "5653",
        "5656",
        "5659",
        "566",
        "5661",
        "5664",
        "5668",
        "5685",
        "5690",
        "5692",
        "5719",
        "5736",
        "5744",
        "5747",
        "5749",
        "575",
        "5752",
        "5753",
        "5754",
        "5755",
        "5756",
        "5763",
        "577",
        "582",
        "5824",
        "5827",
        "5835",
        "5839",
        "5846",
        "5851",
        "5859",
        "589",
        "590",
        "5900",
        "5916",
        "5977",
        "6000",
        "602",
        "6048",
        "6052",
        "6069",
        "6087",
        "6089",
        "6106",
        "613",
        "6134",
        "6137",
        "6142",
        "6143",
        "6144",
        "6149",
        "6162",
        "6165",
        "617",
        "6182",
        "6183",
        "6184",
        "6189",
        "622",
        "6316",
        "63313",
        "634",
        "6348",
        "6349",
        "6358",
        "63642",
        "6391",
        "6412",
        "6415",
        "6429",
        "6437",
        "6439",
        "646",
        "6535",
        "6542",
        "6547",
        "6551",
        "6560",
        "6565",
        "65780",
        "65801",
        "661",
        "6623",
        "66370",
        "66444",
        "66446",
        "66470",
        "6656",
        "6710",
        "6721",
        "6729",
        "6730",
        "6742",
        "6760",
        "6783",
        "6785",
        "6794",
        "68229",
        "6844",
        "6846",
        "6851",
        "6858",
        "6872",
        "6884",
        "6911",
        "6913",
        "6931",
        "6950",
        "69508",
        "6953",
        "696",
        "7037",
        "70413",
        "7046",
        "70660",
        "7109",
        "7148",
        "7158",
        "7167",
        "71874",
        "71896",
        "7217",
        "7256",
        "7275",
        "7308",
        "7333",
        "7341",
        "7368",
        "7383",
        "73885",
        "7395",
        "7445",
        "74486",
        "7462",
        "74656",
        "74741",
        "74775",
        "7479",
        "74856",
        "75004",
        "75051",
        "7510",
        "75625",
        "7571",
        "7578",
        "7609",
        "7631",
        "7665",
        "7670",
        "7692",
        "7718",
        "7719",
        "7741",
        "7776",
        "78064",
        "78069",
        "7808",
        "78080",
        "781",
        "78110",
        "7841",
        "78861",
        "78956",
        "79432",
        "79488",
        "79585",
        "8054",
        "806",
        "8061",
        "80792",
        "80856",
        "80873",
        "8111",
        "8134",
        "81496",
        "8158",
        "816",
        "8204",
        "82159",
        "8224",
        "82457",
        "82464",
        "82537",
        "8272",
        "83327",
        "8485",
        "8494",
        "85117",
        "85499",
        "8596",
        "8649",
        "868",
        "8725",
        "87504",
        "876",
        "8764",
        "87643",
        "87780",
        "87824",
        "87875",
        "87973",
        "88181",
        "882",
        "88206",
        "8827",
        "88356",
        "88383",
        "884",
        "8841",
        "8842",
        "8848",
        "8860",
        "88710",
        "88782",
        "88821",
        "88832",
        "88889",
        "88931",
        "89157",
        "894",
        "8969",
        "8991",
        "9000",
        "9016",
        "90170",
        "90241",
        "9030",
        "90703",
        "90728",
        "9075",
        "9082",
        "9083",
        "9099",
        "9105",
        "9106",
        "91313",
        "9184",
        "9197",
        "9228",
        "92423",
        "925",
        "9253",
        "9262",
        "92864",
        "9297",
        "93972",
        "94874",
        "95013",
        "95069",
        "96476",
        "9698",
        "9735",
        "97666",
        "977",
        "9793",
        "98106",
        "983",
        "99264",
        "99348",
        "99419",
        "99420",
        "99426",
        "99427",
        "99434",
        "99440",
        "9954",
    ]);
    next();
}
