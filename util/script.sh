#!/usr/bin/env zsh
#shellcheck shell=bash
setHerokuConfigVars() {

    local DRY_RUN=false
    local NO_CHECK=false

    Help() {
        echo "Usage: $0 [-n|-N]"
        echo "  just execute the script in a git repo linked to a heroku app."
        echo "  it will read an .env file in the root of the repo and set the"
        echo "  config vars in the heroku app."
        echo "  -n: dry run, don't actually set the config vars"
        echo "  -N: don't set the config vars, and dont check if the repo is a git repo"
    }

    while getopts ":nNh" opt; do
        case $opt in
        n)
            DRY_RUN=true
            ;;
        N)
            NO_CHECK=true
            ;;
        h)
            Help
            exit 0
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            Help
            exit 1
            ;;
        :)
            echo "Option -$OPTARG requires an argument." >&2
            Help
            exit 1
            ;;
        esac
    done

    echo $DRY_RUN
    echo $NO_CHECK

    local awkscript
    read -r -d '' awkscript <<'AWKSCRIPT'
BEGIN{ FS="=" }
{
    if ( $1 ~ /(^|#[[:print:]]*)$/ ) {
        next
    }
    print $1 " " substr($0, index($0, "=") + 1)
}
AWKSCRIPT
    local bright="\033[1m"
    local Mfg="\033[95m"
    local Yfg="\033[93m"
    local Cfg="\033[36m"
    local reset="\033[0m"
    local herokuapp

    echo "please wait, looking for heroku app..."

    if [ $NO_CHECK ]; then
        {
            echo "$Mfg$bright finding app name from server! $reset"
        }
    else
        {
            echo "herokuapp=$(heroku config | awk '{if (NR==1) {print $2}}')"
        }
    fi
    local herokuapp_wcolour="${bright}${Mfg}${herokuapp}${reset}"

    echo "herokuapp: $herokuapp_wcolour"

    echo "setting vars for app: $herokuapp_wcolour from .env file:"
    local -a configs

    while read -r line; do
        local var="${line%%\ *}"
        local val="${line#*\ }"

        printf "  %b%b%b\n" "${bright}${Yfg}${var}${reset}" "=" "${bright}${Cfg}${val}${reset}"

        configs+=("$var=$val")
    done < <(awk "$awkscript" .env)

    if [[ $DRY_RUN || $NO_CHECK ]]; then
        {
            # echo "$Mfg$bright setting configs! $reset"
            echo 1
        }
    else
        {
            echo 'heroku config:set "${configs[@]}"'
        }
    fi
    unset DRY_RUN
    unset NO_CHECK
}

setHerokuConfigVars "$@"
