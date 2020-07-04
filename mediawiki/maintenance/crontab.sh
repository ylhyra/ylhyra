php maintenance/fixDoubleRedirects.php
php maintenance/rebuildFileCache.php --overwrite
php maintenance/runJobs.php --maxtime=3600
# php maintenance/storage/compressOld.php
