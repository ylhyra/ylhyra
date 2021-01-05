#!/bin/bash
php maintenance/fixDoubleRedirects.php
rm -rf images/cache/*
php maintenance/rebuildFileCache.php
php maintenance/runJobs.php --maxtime=3600
# php maintenance/storage/compressOld.php
