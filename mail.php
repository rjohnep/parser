<?php
header('Content-Type: application/json');
$key = trim(strtolower(htmlspecialchars($_POST['tab'])));
$result = [
    'item' => [
        'title' => 'AGENT BLACK GLOVE',
        'price' => '199',
        'size' => '37',
        'color' => 'Gold',
        'qty' => '2',
        'src' => 'http://www.sandler.com.au/media/catalog/product/cache/1/image/1800x/966f5e480dc04e44279dd569854e5263/s/a/sandler_agent_blackglove_1.jpg'
    ],
    'cart' => [
        [
            'id' => "10",
            'title' =>  "Product title"
        ],
        [
            'id' => "11",
            'title' =>  "Product title2"
        ],
    ]
];

echo json_encode([$key => $result[$key]]);