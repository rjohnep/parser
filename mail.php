<?php
header('Content-Type: application/json');
$key = strtolower(htmlspecialchars($_POST['tab']));
$result = [
    'item' => ['title' => 'Product title', 'price' => '199'],
    'cart' => [
        [
            'id' => "10",
            'title' =>  "Product title"
        ]
    ]
];

echo json_encode([$key => $result[$key]]);