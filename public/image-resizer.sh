#!/bin/bash

BASEDIR=$(dirname $0)
mogrify -path $BASEDIR/images -resize 350x350\> -quality 75 -format jpg $BASEDIR/images_raw/*.jpg