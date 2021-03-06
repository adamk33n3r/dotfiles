source ~/.bash_colors
function settitle { 
  echo -ne "\e]0;$@\a"; 
}

function set_colorb {
    tput setab $1
}

function set_underline {
    if [ $1 -eq 1 ]; then
        tput smul;
    else
        tput rmul;
    fi
}

function set_blink {
    echo -en "\e[5m"
}

function getclient {
    if [[ $SSH_CLIENT == "" ]]; then
        echo $(hostname -i);
    else
        echo $(echo $SSH_CLIENT | cut -d ' ' -f 1);
    fi
}

function getjobs {
    echo $(jobs | grep [[[:digit:]]] | wc -l)
}

function formatjobs {
    if [[ $(getjobs $1) == 0 ]] ; then
	    echo -n $green;
    else
	if [[ $(getjobs $1) > 2 ]] ; then
        set_blink;
	    echo -n $red;
	else
	    echo -n $red;
	fi
    fi
}

function formatreturn {
    if [[ $1 == 0 ]]; then
        echo $green;
    else
        echo -n $bold;
        echo $red;
    fi
}

function check_git {
    if [[ $(__git_ps1 %s) != "" ]]; then
        echo -e "$(utf "\0342\0224\0200" "\0342\0224\0200")$green[$(__git_ps1 %s)]$reset"
    fi
}

function quota_check {
    quota &> /dev/null
    if [ $? -ne 0 ]; then
        echo \*;
    fi
}

function check_virtualenv {
    if [ -n "$VIRTUAL_ENV" ]; then
        echo -n $bold;
        echo -n $white;
        echo -n ":";
        echo -n $bold;
        echo -n $blue;
        basename $VIRTUAL_ENV;
    fi
}







function workon_cwd {
    # Check that this is a Git repo
    GIT_DIR=`git rev-parse --git-dir 2> /dev/null`
    if [ $? == 0 ]; then
        # Find the repo root and check for virtualenv name override
        GIT_DIR=`\cd $GIT_DIR; pwd`
        PROJECT_ROOT=`dirname "$GIT_DIR"`
        ENV_NAME=`basename "$PROJECT_ROOT"`
        if [ -f "$PROJECT_ROOT/.venv" ]; then
            ENV_NAME=`cat "$PROJECT_ROOT/.venv"`
        fi
        # Activate the environment only if it is not already active
        if [ "$VIRTUAL_ENV" != "$WORKON_HOME/$ENV_NAME" ]; then
            if [ -e "$WORKON_HOME/$ENV_NAME/bin/activate" ]; then
                workon "$ENV_NAME" && export CD_VIRTUAL_ENV="$ENV_NAME"
            fi
        fi
    elif [ $CD_VIRTUAL_ENV ]; then
        # We've just left the repo, deactivate the environment
        # Note: this only happens if the virtualenv was activated automatically
        deactivate && unset CD_VIRTUAL_ENV
    fi
}

# New cd function that does the virtualenv magic
function venv_cd {
    cd "$@" && workon_cwd && ls --color
}


function utf {
    tput sc;
    for i in {1..$#}; do
        echo -en " ";
    done;
    tput rc;
    for var in $@; do
        echo -en $var;
    done;
}
