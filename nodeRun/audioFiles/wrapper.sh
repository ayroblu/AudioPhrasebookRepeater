#! /bin/bash
function join { local IFS="$1"; shift; echo 'join'; OUTPUT="$*"; }
#FILES=*.mp3
#SPACER="silence/quartersec.mp3"
##SPACER="untitled.mp3"
#for f in $FILES
#do
#  echo "Processing $f file..."
#  # take action on each file. $f store current file name
#  #cat $f
#  Playlist=("$f");
#  for i in {1..160}
#  do
#    #Playlist=("${Playlist[@]}" "$SPACER" "$f")
#    Playlist=("${Playlist[@]}" "$f")
#  done
#
#  mp3wrap output.mp3 ${Playlist[@]}
#  #join '|' ${Playlist[@]}
#  #ffmpeg -i "concat:$OUTPUT" -acodec copy output.mp3
#
#  #Playlist=("output_MP3WRAP.mp3" "$SPACER" "output_MP3WRAP.mp3")
#  #mp3wrap output2.mp3 ${Playlist[@]}
#  break
#done
files="*.mp3"
regex="([0-9]+)_en_(.*).mp3"
for f in $files
do
  if [[ $f =~ $regex ]]
  then
    french="${BASH_REMATCH[1]}_fr_*.mp3"

    echo "Processing $f file..."
    Playlist=("$french");
    for i in {0..159}
    do
      if [[ $(( i % 10 )) == 0 ]]
      then
        Playlist=("${Playlist[@]}" "$f")
      fi
      Playlist=("${Playlist[@]}" "$french")
    done

    #mp3wrap "${BASH_REMATCH[1]}_long_${BASH_REMATCH[2]}.mp3" ${Playlist[@]}
    join '|' ${Playlist[@]}
    ffmpeg -i "concat:$OUTPUT" -acodec copy "${BASH_REMATCH[1]}_long_${BASH_REMATCH[2]}.mp3"
  else
    echo "$f doesn't match" >&2 # this could get noisy if there are a lot of non-matching files
  fi
done
