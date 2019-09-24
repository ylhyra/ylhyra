# AIFF to MP3

ffmpeg -i track1.aiff -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 track1.mp3
