#!/bin/bash
echo 
echo "**** GIT PUSH SCRIPT ****"
git add .
count=0
limit=5
while [ "$count" -le "$limit" ]; do
    read -p "Enter commit message: " commitMessage
    read -p "Do you want to proceed with '$commitMessage'? (y/n): " ops
    if [ "$ops" == "y" ] || [ "$ops" == "Y" ]; then
        git commit -m "$commitMessage"
        break
    else
        ((count++))
        echo "Let's try again..."
    fi
done

readarray -t branchesArray <<< "$(git branch | sed 's/^[* ]*//')"  # remove * from current branch
length="${#branchesArray[@]}"
if [ $length -eq 0 ]; then
    echo "No branches found. Please create/select a branch."
    exit 1
fi
echo "Available branches:"
for ((i=0; i<length; i++)); do
    echo "$i - ${branchesArray[$i]}"
done
read -p "Enter the number of the branch you want to push to: " branchIndex
if [ "$branchIndex" -ge 0 ] 2>/dev/null && [ "$branchIndex" -lt "$length" ]; then
    selectedBranch="${branchesArray[$branchIndex]}"
    echo "Checking out branch '$selectedBranch'..."
    git checkout "$selectedBranch"
    echo "Pushing commits to '$selectedBranch'..."
    git push origin "$selectedBranch"
    echo "Done!"
else
    echo "Invalid selection. Exiting."
fi
