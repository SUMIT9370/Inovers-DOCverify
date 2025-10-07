#!/usr/bin/env bash
# init-and-push-create-github.sh
# Initialize a git repo, create a GitHub repo via API (optional), add remote, and push to main.
# Usage: run from project root (Git Bash, WSL, or any POSIX shell on Windows)

set -euo pipefail

echo
echo "== Initialize repo and (optionally) create GitHub repo, then push =="
echo

# 0. Basic checks
command -v git >/dev/null 2>&1 || { echo "Error: git not found. Install Git and retry." >&2; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "Error: curl not found. Install curl and retry." >&2; exit 1; }

# Check for json parser utilities
JSON_PARSER=""
if command -v jq >/dev/null 2>&1; then
  JSON_PARSER="jq"
elif command -v python3 >/dev/null 2>&1; then
  JSON_PARSER="python3"
elif command -v python >/dev/null 2>&1; then
  JSON_PARSER="python"
else
  echo "Warning: neither 'jq' nor 'python' found; response parsing will be basic. It's recommended to install 'jq' for better output parsing." >&2
fi

# Detect GitHub CLI
USE_GH_CLI="no"
if command -v gh >/dev/null 2>&1; then
  read -r -p "gh CLI detected. Use 'gh' to create the repo if desired? [Y/n] " USE_GH
  USE_GH=${USE_GH:-Y}
  if [[ $USE_GH =~ ^([Yy])$ ]]; then
    USE_GH_CLI="yes"
  fi
fi

# Confirm working directory
PROJECT_ROOT="$(pwd)"
echo "Working directory: $PROJECT_ROOT"
read -r -p "Continue from this directory? [Y/n] " CONT
CONT=${CONT:-Y}
if [[ ! $CONT =~ ^([Yy])$ ]]; then
  echo "Aborting."; exit 1
fi

# Handle existing .git
if [ -d .git ]; then
  read -r -p "A .git directory already exists. Reinitialize (this will remove local git metadata)? [y/N] " REINIT
  if [[ $REINIT =~ ^([Yy])$ ]]; then
    echo "Removing existing .git and reinitializing..."
    rm -rf .git
  else
    echo "Keeping existing .git. Will not reinitialize.";
  fi
fi

# Initialize repo if needed
if [ ! -d .git ]; then
  echo "Initializing new git repository..."
  git init
else
  echo "Using existing git repository."
fi

# Stage files and commit
echo "Staging files..."
git add --all

COMMIT_MSG="Initial commit - frontend ready"
if git commit -m "$COMMIT_MSG"; then
  echo "Commit created."
else
  echo "Nothing to commit or commit failed; creating an empty initial commit..."
  git commit --allow-empty -m "$COMMIT_MSG"
fi

# Ask whether to create a GitHub repo via API
echo
read -r -p "Create a GitHub repository for this project? [Y/n] " CREATE_GH
CREATE_GH=${CREATE_GH:-Y}

REMOTE_URL=""
HTML_URL=""

if [[ $CREATE_GH =~ ^([Yy])$ ]]; then
  echo
  # If gh CLI is preferred and available, use it
  if [ "$USE_GH_CLI" = "yes" ]; then
    echo "Using gh CLI to create the repository."
    DEFAULT_NAME=$(basename "$PROJECT_ROOT")
    read -r -p "Repository name [$DEFAULT_NAME]: " REPO_NAME
    REPO_NAME=${REPO_NAME:-$DEFAULT_NAME}
    read -r -p "Description (optional): " REPO_DESC
    read -r -p "Private repo? [y/N] " IS_PRIVATE
    IS_PRIVATE=${IS_PRIVATE:-N}
    if [[ $IS_PRIVATE =~ ^([Yy])$ ]]; then
      VIS="--private"
    else
      VIS="--public"
    fi
    read -r -p "Create under an organization? Leave empty for your user account. Org slug: " ORG
    if [ -n "$ORG" ]; then
      # gh create in org: gh repo create ORG/REPO --confirm --$VIS
      if gh repo create "$ORG/$REPO_NAME" $VIS --description "$REPO_DESC" --source=. --remote=origin --push; then
        HTML_URL="https://github.com/$ORG/$REPO_NAME"
        REMOTE_URL="git@github.com:$ORG/$REPO_NAME.git"
      else
        echo "gh CLI failed to create repo. Falling back to manual remote prompt." >&2
      fi
    else
      if gh repo create "$REPO_NAME" $VIS --description "$REPO_DESC" --source=. --remote=origin --push; then
        # get GH repo url
        HTML_URL=$(gh repo view "$REPO_NAME" --json url -q .url 2>/dev/null || true)
        REMOTE_URL=$(git remote get-url origin 2>/dev/null || "")
        if [ -z "$REMOTE_URL" ]; then
          REMOTE_URL="git@github.com:$(gh api user --jq .login)/$REPO_NAME.git"
        fi
      else
        echo "gh CLI failed to create repo. Falling back to manual remote prompt." >&2
      fi
    fi
  else
    echo "To create a repository via the GitHub API you need a Personal Access Token (PAT) with 'repo' scope." >&2
    # prefer env var when available
    if [ -n "${GITHUB_TOKEN:-}" ]; then
      GHTOKEN="$GITHUB_TOKEN"
      echo "Using GITHUB_TOKEN from environment."
    else
      read -r -s -p "Enter your GitHub Personal Access Token (PAT): " GHTOKEN
      echo
    fi

    if [ -z "$GHTOKEN" ]; then
      echo "No token provided. Aborting GitHub repo creation." >&2
    else
      # Repo name default is current dir name
      DEFAULT_NAME=$(basename "$PROJECT_ROOT")
      read -r -p "Repository name [$DEFAULT_NAME]: " REPO_NAME
      REPO_NAME=${REPO_NAME:-$DEFAULT_NAME}
      read -r -p "Description (optional): " REPO_DESC
      read -r -p "Private repo? [y/N] " IS_PRIVATE
      IS_PRIVATE=${IS_PRIVATE:-N}
      PRIVATE_FLAG=false
      if [[ $IS_PRIVATE =~ ^([Yy])$ ]]; then
        PRIVATE_FLAG=true
      fi
      read -r -p "Create under an organization? Leave empty for your user account. Org slug: " ORG

      # Create payload
      PAYLOAD=$(cat <<EOF
{ "name": "${REPO_NAME}", "description": "${REPO_DESC}", "private": ${PRIVATE_FLAG} }
EOF
)

      # Determine API endpoint depending on org/user
      if [ -n "$ORG" ]; then
        API_URL="https://api.github.com/orgs/${ORG}/repos"
      else
        API_URL="https://api.github.com/user/repos"
      fi

      # Call GitHub API to create repo
      RESP_FILE=$(mktemp)
      HTTP_CODE=$(curl -s -o "$RESP_FILE" -w "%{http_code}" \
        -H "Authorization: token ${GHTOKEN}" \
        -H "Accept: application/vnd.github+json" \
        -d "$PAYLOAD" \
        "$API_URL")

      if [ "$HTTP_CODE" -ne 201 ]; then
        echo "Failed to create GitHub repository. HTTP status: $HTTP_CODE" >&2
        echo "Response:" >&2
        cat "$RESP_FILE" >&2
        rm -f "$RESP_FILE"
        read -r -p "Would you like to enter an existing remote URL instead? [y/N] " ENTER_REMOTE
        ENTER_REMOTE=${ENTER_REMOTE:-N}
        if [[ $ENTER_REMOTE =~ ^([Yy])$ ]]; then
          read -r -p "Enter Git remote URL (e.g. https://github.com/USER/REPO.git or git@github.com:USER/REPO.git): " REMOTE_URL
        else
          echo "Aborting remote setup."; rm -f "$RESP_FILE"; exit 1
        fi
      else
        # Parse clone_url and html_url
        if [ "$JSON_PARSER" = "jq" ]; then
          REMOTE_URL=$(jq -r '.clone_url' < "$RESP_FILE")
          HTML_URL=$(jq -r '.html_url' < "$RESP_FILE")
        elif [ "$JSON_PARSER" = "python3" ] || [ "$JSON_PARSER" = "python" ]; then
          REMOTE_URL=$(python3 -c "import sys,json;print(json.load(sys.stdin).get('clone_url',''))" < "$RESP_FILE" 2>/dev/null || python -c "import sys,json;print(json.load(sys.stdin).get('clone_url',''))" < "$RESP_FILE")
          HTML_URL=$(python3 -c "import sys,json;print(json.load(sys.stdin).get('html_url',''))" < "$RESP_FILE" 2>/dev/null || python -c "import sys,json;print(json.load(sys.stdin).get('html_url',''))" < "$RESP_FILE")
        else
          # Fallback: try to grep the values (fragile)
          REMOTE_URL=$(grep -o '"clone_url": *"[^"]*"' "$RESP_FILE" | head -n1 | sed 's/"clone_url": *"\(.*\)"/\1/')
          HTML_URL=$(grep -o '"html_url": *"[^"]*"' "$RESP_FILE" | head -n1 | sed 's/"html_url": *"\(.*\)"/\1/')
        fi
        rm -f "$RESP_FILE"
        echo "Created repo: $HTML_URL"
        echo "Using clone URL: $REMOTE_URL"
      fi
    fi
  fi
fi

# If we still don't have a remote URL, ask the user
if [ -z "$REMOTE_URL" ]; then
  read -r -p "Enter the Git remote URL to use (or press Enter to abort): " REMOTE_URL
  if [ -z "$REMOTE_URL" ]; then
    echo "No remote specified. Aborting."; exit 1
  fi
fi

# Add or update remote 'origin'
if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' already exists. Updating to: $REMOTE_URL"
  git remote set-url origin "$REMOTE_URL"
else
  echo "Adding remote origin -> $REMOTE_URL"
  git remote add origin "$REMOTE_URL"
fi

# Ensure branch main exists and push
echo "Setting branch to 'main'..."
git branch -M main || true

echo "Pushing to origin main (this may prompt for credentials)..."
if git push -u origin main; then
  echo
  echo "✅ Push successful!"
  if [ -n "$HTML_URL" ]; then
    echo "Repository page: $HTML_URL"
  else
    echo "Remote URL: $REMOTE_URL"
  fi
  exit 0
else
  echo
  echo "❌ Push failed. Check remote, authentication, and that the repository exists." >&2
  echo "You can try these commands manually:" >&2
  echo "  git remote -v" >&2
  echo "  git branch -M main" >&2
  echo "  git push -u origin main" >&2
  exit 2
fi
