<?php

namespace App\Enums;

enum Motor: int
{
    case rotation = 1;
    case feeder = 2;
    case topspin = 3;
    case backspin = 4;
}
