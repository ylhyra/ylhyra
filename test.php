<?php
/*
$opts = array('http' =>
array(
  'method'  => 'POST',
  'header'  => 'Content-Type: application/x-www-form-urlencoded',
  'content' => http_build_query(
    array(
      'html' => '<mw:editsection page="Ylhýra" section="1">Beginners course</mw:editsection></h2> <div class="grid"> <ul><li><a href="/Introduction" title="Introduction"><div class="frontpage-box"><div class="frontpage-box-title">Introduction </div><span class="frontpage-box-description">How to use this book • New letters </span></div></a></li> <li><a href="/Chapter_1" title="Chapter 1"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 1 </div><span class="frontpage-box-description">Is • The • Cases • Yes </span></div></a></li> <li><a href="/Chapter_2" title="Chapter 2"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 2 </div><span class="frontpage-box-description">Thanks • Good day • What? </span></div></a></li> <li><a href="/Chapter_3" title="Chapter 3"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 3 </div><span class="frontpage-box-description">Ha? • Að • ll • sæll • ég • ordering food • sko </span></div></a></li> <li><a href="/Chapter_4" title="Chapter 4"><div class="frontpage-box"><div class="frontpage-box-title">Chapter 4 </div><span class="frontpage-box-description">Want • time • go • know • hérna </span></div></a></li></ul> </div> <ul><li><a href="/Vocabulary" title="Vocabulary">List of 2000 basic vocabulary words</a></li> <li><a href="/Category:Content" title="Category:Content">List of all pages</a></li></ul> <h2><span class="mw-headline" id="Read">Read</span><mw:editsection page="Ylhýra" section="2">Read</mw:editsection></h2> <p><code data-document-start="Magnús Jochum Pálsson/Pípulækningar" style="display:none"></code><span style="float:right" class="hidden user-show"><a rel="nofollow" class="external text" href="https://ylhyra.is/index.php?title=Magn%C3%BAs_Jochum_P%C3%A1lsson/P%C3%ADpul%C3%A6kningar&action=edit">Edit</a></span> </p> <div class="book" data-translate="true"> <p><b>Pípulækningar</b> </p><p>Ég hef misst allra trú á því að leita til lækna þegar eitthvað kemur fyrir mig. Ég fæ aldrei neinar útskýringar eða lækningu við þeim kvillum sem hrjá mig. Læknarnir yppa bara öxlum og segja mér að fara heim, sjá hvort ég lagist ekki. Síðan borga ég þeim svívirðilegar upphæðir fyrir ekkert. </p><p>Nýlega hef ég tekið upp á því að hringja í iðnaðarmenn í staðinn. Þannig get ég bæði látið gera við húsið og fengið læknisfræðilegt álit. Ég fékk til mín pípara í síðustu viku sem lagaði vaskinn og gaf mér helvíti góð ráð við bakverk sem var að plaga mig. </p> </div> <div style="float:right;max-width:400px;border:1px solid #BBB;background:#EEE;padding:10px;"> <p>This short story was published in the 2018 book "Óbreytt ástand" by Magnús Jóchum Pálsson. </p> </div> <div data-document-end="yes"></div> <p><code data-document-start="Magnús Jochum Pálsson/Ánamaðkar" style="display:none"></code><span style="float:right" class="hidden user-show"><a rel="nofollow" class="external text" href="https://ylhyra.is/index.php?title=Magn%C3%BAs_Jochum_P%C3%A1lsson/%C3%81nama%C3%B0kar&action=edit">Edit</a></span> </p> <div class="book" data-translate="true"> <p><b>Ánamaðkar</b> </p><p>Í dag hefur rignt klukkustundum saman. Stórir pollar þekja göturnar og moldin gegnsósa af vatni. Hamfaranna vegna neyðast ánamaðkarnir til að flýja heimili sín. Við tekur langt og strangt ferðalag. Felstir drukkna á leiðinni en einhverjir komast alla leið upp á yfirborðið. Þar bíða þeirra mun hræðilegri örlög en drukknun. </p><p>Á yfirborðinu taka á móti þeim litlir barnaputtar. Börnin hafa enga samúð með slepjulegum félögum sínum og hrifsa þá til sín. Síðan slíta þau maðkana í sundu eða kremja þá undir sólum kuldaskónna. </p> </div> <div data-document-end="yes"></div> <p><br /> </p> <div data-document-end="yes"></div>',
    )
  )
)
);

$result = file_get_contents('http://localhost:9123/api/render', false, stream_context_create($opts));

if($result) {
$text = $result;
} else {
$text = 'didnt work!';
}
echo $result;

*/


$url = 'http://localhost:9123/api/render2';
$timeout=5;
$payload = json_encode(array(
  'html'=>'lol!'
));
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLINFO_HEADER_OUT, false);
curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_FAILONERROR, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($payload))
);
$result = curl_exec($ch);
echo $result;
curl_close($ch);







//
//
// $url='http://localhost:9123/api/render';
// $ch=curl_init();
// $timeout=5;
//
// curl_setopt($ch, CURLOPT_URL, $url);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
// curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
// curl_setopt($ch, CURLOPT_POST, true);
// curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
//
// $result=curl_exec($ch);
// curl_close($ch);
// echo $result;
