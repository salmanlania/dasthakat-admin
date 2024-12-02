<?php

return [

   'default' => env('DB_CONNECTION', 'mysql'),

   'connections' => [
        'mysql' => [
            'driver'    => 'mysql',
            'host'      => env('DB_HOST'),
            'port'      => env('DB_PORT'),
            'database'  => env('DB_DATABASE'),
            'username'  => env('DB_USERNAME'),
            'password'  => env('DB_PASSWORD'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
         ],

        'detail' => [
            'driver'    => 'mysql',
            'host'      => env('DB2_HOST'),
            'port'      => env('DB_PORT'),
            'database'  => env('DB2_DATABASE','forge'),
            'username'  => env('DB2_USERNAME','forge'),
            'password'  => env('DB2_PASSWORD','forge'),
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'strict'    => false,
        ],
    ],
];