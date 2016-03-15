<?php
header('Content-Type: application/json');


$mails = json_encode(array(
    'from' => '1',
    'to' => '2'
));

echo $mails;