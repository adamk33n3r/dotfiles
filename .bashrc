#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

if [[ -z "$TMUX" ]]; then
    tmux has
    if [ $? -eq 0 ]; then
        #exec tmux attach
        tmux new-session -t 0
    else
        tmux new-session
    fi
fi

alias ls='ls --color=auto'
PS1='\u@\h \w\$ '

export MF_DIR=$HOME/myfarms
export PATH=$HOME/bin:$HOME/mfbin:$PATH

source ~/mfbin/load_env.sh


TERM=xterm-256color
source ~/.bashrc_default
# To the extent possible under law, the author(s) have dedicated all 
# copyright and related and neighboring rights to this software to the 
# public domain worldwide. This software is distributed without any warranty. 

#LANG="en_US.utf8"
#LANGUAGE="en_US.utf8"
#LC_ALL="en_US.utf8"

rm() {
    mkdir -p ~/.trash/`dirname $@`
    mv --backup=numbered "$@" ~/.trash/`dirname $@`
}

del() {
    /bin/rm "$@"
}

source ~/.lscolorsrc
if [ "$COLORTERM" == "gnome-terminal" ]; then
    export TERM=xterm-256color
fi

alias rcssserver='cd ~/temp; rcssserver'
alias rcsoccersim='cd ~/temp; rcsoccersim'

alias ls='ls -h --color --group-directories-first'
alias cls='clear'
alias cl='cls'
alias sshh='ssh akeenan@matt'
alias sshserver='ssh adamk33n3r@mediaserver.adam-keenan.net'
alias sshvbox='ssh adam@webserver.adam-keenan.net'
alias open='xdg-open &> /dev/null'
alias vb='vim $HOME/.bashrc'

alias df='df -h'
alias du='du -h'
alias ll='ls -al'
alias la='ls -a'

export LANG=en_US.utf8
source ~/.bash_colors
source ~/.bash_functions
source ~/.bash_themes
source ~/.bash_git
case $- in *i*) my_theme; esac
#. /usr/lib/python3.4/site-packages/powerline/bindings/bash/powerline.sh

source ~/.git-completion.bash

shopt -s dotglob
set -o ignoreeof
shopt -s cdspell

export EDITOR=vim
