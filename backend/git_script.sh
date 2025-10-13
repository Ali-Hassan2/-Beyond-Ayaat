#!/bin/bash

echo "Hello this is the first script"

readonly bannerTitle="****GIT SCRIPT****"
echo "$bannerTitle"

git add .

count=0
limit=5

while [ "$count" -le "$limit" ]; do
  read -p "Enter commit message: " commitMessage
  read -p "Do you want to proceed with '$commitMessage'? (y/n): " ops

  if [ "$ops" = "y" ]; then
      git commit -m "$commitMessage"
      break
  else
      echo "Commit skipped. Try again."
      count=$((count + 1))
  fi
done

readarray -t branchesArray <<< "$(git branch -r)"
length="${#branchesArray[@]}"
echo "There are total: $length branches."

for ((i=0; i<length; i++)); do
  echo "${branchesArray[$i]}"
done
